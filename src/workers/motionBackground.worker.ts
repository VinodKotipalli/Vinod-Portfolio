// Web Worker for offloading particle physics, proximity searches, and line calculation
// Ensures the main UI thread stays at 60/120 FPS without layout or script contention.

export interface InitMessage {
  type: 'init';
  canvas?: OffscreenCanvas;
  width: number;
  height: number;
  dpr: number;
  theme: 'dark' | 'light';
  isLowEnd: boolean;
  prefersReducedMotion: boolean;
}

export interface ResizeMessage {
  type: 'resize';
  width: number;
  height: number;
  dpr: number;
}

export interface MouseMessage {
  type: 'mouse';
  targetX: number;
  targetY: number;
  active: boolean;
}

export interface ThemeMessage {
  type: 'theme';
  theme: 'dark' | 'light';
}

export interface VisibilityMessage {
  type: 'visibility';
  visible: boolean;
}

export interface ComputeFrameMessage {
  type: 'computeFrame';
  timestamp: number;
}

export type WorkerInMessage =
  | InitMessage
  | ResizeMessage
  | MouseMessage
  | ThemeMessage
  | VisibilityMessage
  | ComputeFrameMessage;

interface WorkerGlobalScopeLike {
  postMessage(message: unknown, transfer?: Transferable[]): void;
  onmessage: ((this: WorkerGlobalScopeLike, ev: MessageEvent<WorkerInMessage>) => unknown) | null;
  setTimeout(handler: TimerHandler, timeout?: number, ...args: unknown[]): number;
  clearTimeout(id: number | undefined): void;
}

// Cast self for standard Web Worker typing
const workerScope = self as unknown as WorkerGlobalScopeLike;

// Fallback requestAnimationFrame for worker environments
const workerRaf =
  typeof self.requestAnimationFrame === 'function'
    ? self.requestAnimationFrame.bind(self)
    : (cb: FrameRequestCallback) => workerScope.setTimeout(() => cb(performance.now()), 16);

const workerCaf =
  typeof self.cancelAnimationFrame === 'function'
    ? self.cancelAnimationFrame.bind(self)
    : (id: number) => workerScope.clearTimeout(id);

// Worker-scope state
let offscreenCanvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;

let displayWidth = 1920;
let displayHeight = 1080;
let dpr = 1.0;
let currentTheme: 'dark' | 'light' = 'dark';
let isLowEnd = false;
let prefersReducedMotion = false;
let isTabVisible = true;

const mouse = {
  targetX: -9999,
  targetY: -9999,
  currentX: -9999,
  currentY: -9999,
  active: false,
};

const MAX_NODES = 48;
let activeNodeCount = 28;

const posX = new Float32Array(MAX_NODES);
const posY = new Float32Array(MAX_NODES);
const velX = new Float32Array(MAX_NODES);
const velY = new Float32Array(MAX_NODES);
const radius = new Float32Array(MAX_NODES);
const phase = new Float32Array(MAX_NODES);

let MAX_PULSES = 4;
let pulseFrom = new Int32Array(MAX_PULSES);
let pulseTo = new Int32Array(MAX_PULSES);
let pulseProgress = new Float32Array(MAX_PULSES);
let pulseSpeed = new Float32Array(MAX_PULSES);

// Pre-allocated buffers for calculation-only mode (when OffscreenCanvas is not transferred)
const MAX_LINES = MAX_NODES * 4;
const lineBuffer = new Float32Array(MAX_LINES * 4); // [x1, y1, x2, y2, ...]
const tetherBuffer = new Float32Array(MAX_NODES * 4); // [x1, y1, x2, y2, ...]
const pulseBuffer = new Float32Array(MAX_PULSES * 2); // [px, py, ...]
const particleBuffer = new Float32Array(MAX_NODES * 3); // [x, y, radius, ...]

let lastTimestamp = performance.now();
let animationFrameId: number | null = null;
let slowFrameCounter = 0;
let hasAdaptedDown = false;

// Color caches based on theme
let linkStrokeStyle = 'rgba(148, 163, 184, 0.075)';
let mouseTetherStrokeStyle = 'rgba(34, 211, 238, 0.22)';
let nodeFillStyle = 'rgba(34, 211, 238, 0.38)';
let pulseFillStyle = 'rgba(56, 189, 248, 0.55)';

function updateThemeStyles(theme: 'dark' | 'light') {
  currentTheme = theme;
  const isDark = theme === 'dark';
  linkStrokeStyle = isDark
    ? 'rgba(148, 163, 184, 0.075)'
    : 'rgba(100, 116, 139, 0.055)';
  mouseTetherStrokeStyle = isDark
    ? 'rgba(34, 211, 238, 0.22)'
    : 'rgba(2, 132, 199, 0.16)';
  nodeFillStyle = isDark
    ? 'rgba(34, 211, 238, 0.38)'
    : 'rgba(2, 132, 199, 0.28)';
  pulseFillStyle = isDark
    ? 'rgba(56, 189, 248, 0.55)'
    : 'rgba(14, 165, 233, 0.45)';
}

function initParticles(count: number) {
  for (let i = 0; i < count; i++) {
    posX[i] = Math.random() * displayWidth;
    posY[i] = Math.random() * displayHeight;
    velX[i] = (Math.random() - 0.5) * (prefersReducedMotion ? 0.08 : 0.2);
    velY[i] = (Math.random() - 0.5) * (prefersReducedMotion ? 0.08 : 0.2);
    radius[i] = Math.random() * 1.2 + 0.8;
    phase[i] = Math.random() * Math.PI * 2;
  }
}

function initPulses(count: number) {
  MAX_PULSES = count;
  pulseFrom = new Int32Array(MAX_PULSES);
  pulseTo = new Int32Array(MAX_PULSES);
  pulseProgress = new Float32Array(MAX_PULSES);
  pulseSpeed = new Float32Array(MAX_PULSES);

  for (let p = 0; p < MAX_PULSES; p++) {
    pulseFrom[p] = Math.floor(Math.random() * activeNodeCount);
    pulseTo[p] = Math.floor(Math.random() * activeNodeCount);
    pulseProgress[p] = Math.random();
    pulseSpeed[p] = 0.003 + Math.random() * 0.004;
  }
}

function updateDimensions(w: number, h: number, newDpr: number) {
  displayWidth = w;
  displayHeight = h;
  dpr = newDpr;

  if (offscreenCanvas) {
    offscreenCanvas.width = Math.floor(w * dpr);
    offscreenCanvas.height = Math.floor(h * dpr);
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  // Softly re-clamp particle positions
  for (let i = 0; i < activeNodeCount; i++) {
    if (posX[i] > w) posX[i] = Math.random() * w;
    if (posY[i] > h) posY[i] = Math.random() * h;
  }
}

// Core calculation engine: updates particle physics, proximity lines, and telemetry pulses
function computeSimulation(dt: number) {
  const maxDistance = isLowEnd ? 120 : 140;
  const maxDistanceSq = maxDistance * maxDistance;
  const mouseDistance = 140;
  const mouseDistanceSq = mouseDistance * mouseDistance;
  const maxConnectionsPerNode = isLowEnd ? 2 : 3;

  // 1. Smooth mouse lerp
  if (mouse.active) {
    mouse.currentX += (mouse.targetX - mouse.currentX) * 0.14;
    mouse.currentY += (mouse.targetY - mouse.currentY) * 0.14;
  }

  // 2. Update particle kinematics & wrap-around
  const count = activeNodeCount;
  const mActive = mouse.active;
  const mx = mouse.currentX;
  const my = mouse.currentY;

  for (let i = 0; i < count; i++) {
    let x = posX[i] + velX[i] * dt;
    let y = posY[i] + velY[i] * dt;
    phase[i] += 0.015 * dt;

    if (x < -8) x = displayWidth + 8;
    else if (x > displayWidth + 8) x = -8;

    if (y < -8) y = displayHeight + 8;
    else if (y > displayHeight + 8) y = -8;

    if (mActive) {
      const dx = mx - x;
      const dy = my - y;
      const dSq = dx * dx + dy * dy;

      if (dSq < mouseDistanceSq && dSq > 1) {
        const dist = Math.sqrt(dSq);
        const force = ((mouseDistance - dist) / mouseDistance) * 0.16 * dt;
        x += (dx / dist) * force;
        y += (dy / dist) * force;
      }
    }

    posX[i] = x;
    posY[i] = y;
  }

  // 3. Compute network connection lines (spatial checks)
  let lineIndex = 0;
  for (let i = 0; i < count; i++) {
    const x1 = posX[i];
    const y1 = posY[i];
    let conn = 0;

    for (let j = i + 1; j < count; j++) {
      const dx = posX[j] - x1;
      if (dx > maxDistance || dx < -maxDistance) continue;

      const dy = posY[j] - y1;
      if (dy > maxDistance || dy < -maxDistance) continue;

      const dSq = dx * dx + dy * dy;
      if (dSq < maxDistanceSq) {
        if (lineIndex + 4 <= lineBuffer.length) {
          lineBuffer[lineIndex] = x1;
          lineBuffer[lineIndex + 1] = y1;
          lineBuffer[lineIndex + 2] = posX[j];
          lineBuffer[lineIndex + 3] = posY[j];
          lineIndex += 4;
        }
        conn++;
        if (conn >= maxConnectionsPerNode) break;
      }
    }
  }
  const totalLineSegments = lineIndex / 4;

  // 4. Compute mouse tethers
  let tetherIndex = 0;
  if (mActive) {
    for (let i = 0; i < count; i++) {
      const dx = mx - posX[i];
      const dy = my - posY[i];
      const dSq = dx * dx + dy * dy;
      if (dSq < mouseDistanceSq) {
        if (tetherIndex + 4 <= tetherBuffer.length) {
          tetherBuffer[tetherIndex] = posX[i];
          tetherBuffer[tetherIndex + 1] = posY[i];
          tetherBuffer[tetherIndex + 2] = mx;
          tetherBuffer[tetherIndex + 3] = my;
          tetherIndex += 4;
        }
      }
    }
  }
  const totalTetherSegments = tetherIndex / 4;

  // 5. Compute telemetry pulses
  let pulseIndex = 0;
  for (let p = 0; p < MAX_PULSES; p++) {
    pulseProgress[p] += pulseSpeed[p] * dt;

    if (pulseProgress[p] >= 1.0) {
      pulseProgress[p] = 0;
      pulseFrom[p] = Math.floor(Math.random() * count);
      pulseTo[p] = Math.floor(Math.random() * count);
    }

    const idxA = pulseFrom[p];
    const idxB = pulseTo[p];
    if (idxA < count && idxB < count) {
      const xA = posX[idxA];
      const yA = posY[idxA];
      const dx = posX[idxB] - xA;
      const dy = posY[idxB] - yA;
      const dSq = dx * dx + dy * dy;

      if (dSq < maxDistanceSq) {
        const prog = pulseProgress[p];
        const px = xA + dx * prog;
        const py = yA + dy * prog;
        if (pulseIndex + 2 <= pulseBuffer.length) {
          pulseBuffer[pulseIndex] = px;
          pulseBuffer[pulseIndex + 1] = py;
          pulseIndex += 2;
        }
      }
    }
  }
  const totalPulses = pulseIndex / 2;

  // 6. Pack particle positions & radiuses
  for (let i = 0; i < count; i++) {
    const idx = i * 3;
    particleBuffer[idx] = posX[i];
    particleBuffer[idx + 1] = posY[i];
    particleBuffer[idx + 2] = radius[i] + Math.sin(phase[i]) * 0.2;
  }

  return {
    totalLineSegments,
    totalTetherSegments,
    totalPulses,
    count,
  };
}

// Complete render loop when OffscreenCanvas is transferred directly to worker
function loop(timestamp: number) {
  if (!isTabVisible) return;

  const elapsed = timestamp - lastTimestamp;
  lastTimestamp = timestamp;
  const dt = Math.min(elapsed / 16.67, 2.0);

  // Performance throttling if frame rate drops
  if (elapsed > 25 && !hasAdaptedDown && !prefersReducedMotion) {
    slowFrameCounter++;
    if (slowFrameCounter > 20) {
      activeNodeCount = Math.max(16, Math.floor(activeNodeCount * 0.75));
      hasAdaptedDown = true;
    }
  } else if (slowFrameCounter > 0) {
    slowFrameCounter--;
  }

  const { totalLineSegments, totalTetherSegments, totalPulses, count } = computeSimulation(dt);

  // If we have an OffscreenCanvas context, render directly in worker thread!
  if (ctx) {
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    // Render connection lines
    if (totalLineSegments > 0) {
      ctx.lineWidth = 0.65;
      ctx.beginPath();
      for (let i = 0; i < totalLineSegments * 4; i += 4) {
        ctx.moveTo(lineBuffer[i], lineBuffer[i + 1]);
        ctx.lineTo(lineBuffer[i + 2], lineBuffer[i + 3]);
      }
      ctx.strokeStyle = linkStrokeStyle;
      ctx.stroke();
    }

    // Render mouse tethers
    if (totalTetherSegments > 0) {
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      for (let i = 0; i < totalTetherSegments * 4; i += 4) {
        ctx.moveTo(tetherBuffer[i], tetherBuffer[i + 1]);
        ctx.lineTo(tetherBuffer[i + 2], tetherBuffer[i + 3]);
      }
      ctx.strokeStyle = mouseTetherStrokeStyle;
      ctx.stroke();
    }

    // Render telemetry pulses
    if (totalPulses > 0) {
      for (let p = 0; p < totalPulses * 2; p += 2) {
        ctx.beginPath();
        ctx.arc(pulseBuffer[p], pulseBuffer[p + 1], 1.25, 0, Math.PI * 2);
        ctx.fillStyle = pulseFillStyle;
        ctx.fill();
      }
    }

    // Render particle dots
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const x = particleBuffer[idx];
      const y = particleBuffer[idx + 1];
      const r = particleBuffer[idx + 2];
      ctx.moveTo(x + r, y);
      ctx.arc(x, y, r, 0, Math.PI * 2);
    }
    ctx.fillStyle = nodeFillStyle;
    ctx.fill();

    animationFrameId = workerRaf(loop);
  } else {
    // Mode B: Stream calculated geometry buffers to main UI thread (Zero-copy transfer)
    const lineData = lineBuffer.slice(0, totalLineSegments * 4);
    const tetherData = tetherBuffer.slice(0, totalTetherSegments * 4);
    const pulseData = pulseBuffer.slice(0, totalPulses * 2);
    const particleData = particleBuffer.slice(0, count * 3);

    workerScope.postMessage(
      {
        type: 'frameCalculated',
        particleData,
        particleCount: count,
        lineData,
        lineCount: totalLineSegments,
        tetherData,
        tetherCount: totalTetherSegments,
        pulseData,
        pulseCount: totalPulses,
      },
      [lineData.buffer, tetherData.buffer, pulseData.buffer, particleData.buffer]
    );

    animationFrameId = workerRaf(loop);
  }
}

// Handle incoming messages from the main thread
workerScope.onmessage = (event: MessageEvent<WorkerInMessage>) => {
  const msg = event.data;

  switch (msg.type) {
    case 'init': {
      displayWidth = msg.width;
      displayHeight = msg.height;
      dpr = msg.dpr;
      isLowEnd = msg.isLowEnd;
      prefersReducedMotion = msg.prefersReducedMotion;
      updateThemeStyles(msg.theme);

      const area = displayWidth * displayHeight;
      activeNodeCount = prefersReducedMotion
        ? 12
        : isLowEnd
        ? Math.min(Math.max(Math.floor(area / 45000), 16), 26)
        : Math.min(Math.max(Math.floor(area / 32000), 24), 42);

      initParticles(activeNodeCount);
      initPulses(isLowEnd ? 2 : 4);

      if (msg.canvas) {
        offscreenCanvas = msg.canvas;
        ctx = offscreenCanvas.getContext('2d', {
          alpha: true,
          desynchronized: true,
        });
        if (ctx) {
          offscreenCanvas.width = Math.floor(displayWidth * dpr);
          offscreenCanvas.height = Math.floor(displayHeight * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
      }

      lastTimestamp = performance.now();
      if (animationFrameId !== null) {
        workerCaf(animationFrameId);
      }
      animationFrameId = workerRaf(loop);
      break;
    }

    case 'resize': {
      updateDimensions(msg.width, msg.height, msg.dpr);
      break;
    }

    case 'mouse': {
      mouse.targetX = msg.targetX;
      mouse.targetY = msg.targetY;
      mouse.active = msg.active;
      if (!mouse.active) {
        mouse.targetX = -9999;
        mouse.targetY = -9999;
        mouse.currentX = -9999;
        mouse.currentY = -9999;
      }
      break;
    }

    case 'theme': {
      updateThemeStyles(msg.theme);
      break;
    }

    case 'visibility': {
      isTabVisible = msg.visible;
      if (isTabVisible) {
        lastTimestamp = performance.now();
        if (animationFrameId === null) {
          animationFrameId = workerRaf(loop);
        }
      } else if (animationFrameId !== null) {
        workerCaf(animationFrameId);
        animationFrameId = null;
      }
      break;
    }

    case 'computeFrame': {
      // Manual tick trigger if needed
      break;
    }
  }
};
