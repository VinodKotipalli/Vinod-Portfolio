import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface FrameCalculatedEvent {
  type: 'frameCalculated';
  particleData: Float32Array;
  particleCount: number;
  lineData: Float32Array;
  lineCount: number;
  tetherData: Float32Array;
  tetherCount: number;
  pulseData: Float32Array;
  pulseCount: number;
}

export const MotionBackground: React.FC = () => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const workerRef = useRef<Worker | null>(null);

  // Synchronize theme changes with the active Web Worker
  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'theme', theme });
    }
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Detect user accessibility preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Hardware & screen heuristics
    const nav = typeof navigator !== 'undefined' ? navigator : null;
    const isMobileOrTablet =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        nav?.userAgent || ''
      ) || window.innerWidth < 768;
    const isLowConcurrency =
      nav && 'hardwareConcurrency' in nav && typeof nav.hardwareConcurrency === 'number'
        ? nav.hardwareConcurrency <= 4
        : false;
    const isLowEnd = isMobileOrTablet || isLowConcurrency;

    const getTargetDPR = () => {
      if (isLowEnd) return 1.0;
      return Math.min(window.devicePixelRatio || 1, 1.5);
    };

    let dpr = getTargetDPR();
    let displayWidth = container.clientWidth || window.innerWidth;
    let displayHeight = container.clientHeight || window.innerHeight;

    let worker: Worker | null = null;
    let isOffscreenTransferred = false;
    let fallbackCtx: CanvasRenderingContext2D | null = null;
    let fallbackAnimationFrameId: number | null = null;

    // Attempt to initialize the Web Worker to offload all physics and distance calculations
    try {
      worker = new Worker(
        new URL('../workers/motionBackground.worker.ts', import.meta.url),
        { type: 'module' }
      );
      workerRef.current = worker;

      // Strategy 1: Check if canvas can be transferred to worker for 100% off-main-thread processing
      if ('transferControlToOffscreen' in canvas && typeof canvas.transferControlToOffscreen === 'function') {
        try {
          const offscreen = canvas.transferControlToOffscreen();
          worker.postMessage(
            {
              type: 'init',
              canvas: offscreen,
              width: displayWidth,
              height: displayHeight,
              dpr,
              theme,
              isLowEnd,
              prefersReducedMotion,
            },
            [offscreen]
          );
          isOffscreenTransferred = true;
        } catch (transferError) {
          // Canvas might have already been transferred or unsupported in this container context
          isOffscreenTransferred = false;
        }
      }

      // Strategy 2: If canvas wasn't transferred, worker still computes all particle & line geometry
      // and posts pre-calculated float buffers to main thread for pure draw calls (no physics or $O(N^2)$ checks on main UI)
      if (!isOffscreenTransferred) {
        canvas.width = Math.floor(displayWidth * dpr);
        canvas.height = Math.floor(displayHeight * dpr);
        fallbackCtx = canvas.getContext('2d', { alpha: true, desynchronized: true });
        if (fallbackCtx) {
          fallbackCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        worker.postMessage({
          type: 'init',
          width: displayWidth,
          height: displayHeight,
          dpr,
          theme,
          isLowEnd,
          prefersReducedMotion,
        });

        // Theme colors for main-thread drawing in Strategy 2
        const getColors = (currentTheme: 'dark' | 'light') => {
          const isDark = currentTheme === 'dark';
          return {
            linkStroke: isDark ? 'rgba(148, 163, 184, 0.075)' : 'rgba(100, 116, 139, 0.055)',
            mouseTetherStroke: isDark ? 'rgba(34, 211, 238, 0.22)' : 'rgba(2, 132, 199, 0.16)',
            nodeFill: isDark ? 'rgba(34, 211, 238, 0.38)' : 'rgba(2, 132, 199, 0.28)',
            pulseFill: isDark ? 'rgba(56, 189, 248, 0.55)' : 'rgba(14, 165, 233, 0.45)',
          };
        };

        let currentColors = getColors(theme);

        worker.onmessage = (e: MessageEvent<FrameCalculatedEvent>) => {
          if (!fallbackCtx || e.data.type !== 'frameCalculated') return;
          const { particleData, particleCount, lineData, lineCount, tetherData, tetherCount, pulseData, pulseCount } = e.data;

          fallbackCtx.clearRect(0, 0, displayWidth, displayHeight);

          // 1. Draw pre-calculated network connection lines
          if (lineCount > 0) {
            fallbackCtx.lineWidth = 0.65;
            fallbackCtx.beginPath();
            for (let i = 0; i < lineCount * 4; i += 4) {
              fallbackCtx.moveTo(lineData[i], lineData[i + 1]);
              fallbackCtx.lineTo(lineData[i + 2], lineData[i + 3]);
            }
            fallbackCtx.strokeStyle = currentColors.linkStroke;
            fallbackCtx.stroke();
          }

          // 2. Draw pre-calculated mouse tether lines
          if (tetherCount > 0) {
            fallbackCtx.lineWidth = 0.8;
            fallbackCtx.beginPath();
            for (let i = 0; i < tetherCount * 4; i += 4) {
              fallbackCtx.moveTo(tetherData[i], tetherData[i + 1]);
              fallbackCtx.lineTo(tetherData[i + 2], tetherData[i + 3]);
            }
            fallbackCtx.strokeStyle = currentColors.mouseTetherStroke;
            fallbackCtx.stroke();
          }

          // 3. Draw pre-calculated telemetry pulses
          if (pulseCount > 0) {
            for (let p = 0; p < pulseCount * 2; p += 2) {
              fallbackCtx.beginPath();
              fallbackCtx.arc(pulseData[p], pulseData[p + 1], 1.25, 0, Math.PI * 2);
              fallbackCtx.fillStyle = currentColors.pulseFill;
              fallbackCtx.fill();
            }
          }

          // 4. Draw particle circles
          fallbackCtx.beginPath();
          for (let i = 0; i < particleCount; i++) {
            const idx = i * 3;
            const x = particleData[idx];
            const y = particleData[idx + 1];
            const r = particleData[idx + 2];
            fallbackCtx.moveTo(x + r, y);
            fallbackCtx.arc(x, y, r, 0, Math.PI * 2);
          }
          fallbackCtx.fillStyle = currentColors.nodeFill;
          fallbackCtx.fill();
        };
      }
    } catch (workerError) {
      // Graceful fallback in environments where Web Workers are blocked
      console.warn('MotionBackground: Web Worker could not be instantiated, utilizing main thread fallback', workerError);
    }

    // Passive mouse event listener throttled by requestAnimationFrame to eliminate event backlog
    let mouseFrameId: number | null = null;
    let targetMouseX = -9999;
    let targetMouseY = -9999;
    let isMouseActive = false;

    const dispatchMouseState = () => {
      mouseFrameId = null;
      if (worker) {
        worker.postMessage({
          type: 'mouse',
          targetX: targetMouseX,
          targetY: targetMouseY,
          active: isMouseActive,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      isMouseActive = true;
      if (mouseFrameId === null) {
        mouseFrameId = requestAnimationFrame(dispatchMouseState);
      }
    };

    const handleMouseLeave = () => {
      targetMouseX = -9999;
      targetMouseY = -9999;
      isMouseActive = false;
      if (mouseFrameId === null) {
        mouseFrameId = requestAnimationFrame(dispatchMouseState);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Battery / CPU Saver: Notify worker to pause when the tab is hidden
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      if (worker) {
        worker.postMessage({
          type: 'visibility',
          visible: isVisible,
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // ResizeObserver: Send updated dimensions to worker
    let resizeTimeout: number | undefined;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          window.clearTimeout(resizeTimeout);
          resizeTimeout = window.setTimeout(() => {
            dpr = getTargetDPR();
            displayWidth = width;
            displayHeight = height;

            if (!isOffscreenTransferred && canvas && fallbackCtx) {
              canvas.width = Math.floor(width * dpr);
              canvas.height = Math.floor(height * dpr);
              fallbackCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }

            if (worker) {
              worker.postMessage({
                type: 'resize',
                width,
                height,
                dpr,
              });
            }
          }, 150);
        }
      }
    });

    resizeObserver.observe(container);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      resizeObserver.disconnect();
      window.clearTimeout(resizeTimeout);

      if (mouseFrameId !== null) {
        cancelAnimationFrame(mouseFrameId);
      }
      if (fallbackAnimationFrameId !== null) {
        cancelAnimationFrame(fallbackAnimationFrameId);
      }
      if (worker) {
        worker.terminate();
        workerRef.current = null;
      }
    };
  }, []); // Mounts once and handles theme via the specialized theme effect

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Subtle ambient atmospheric gradient zones */}
      <div
        className={`absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-30 transition-colors duration-700 ${
          theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-500/6'
        }`}
      />
      <div
        className={`absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-20 transition-colors duration-700 ${
          theme === 'dark' ? 'bg-blue-600/10' : 'bg-blue-600/6'
        }`}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
};

export default MotionBackground;
