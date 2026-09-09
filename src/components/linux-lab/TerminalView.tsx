import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { LinuxCommandEngine, CommandOutput } from '../../lib/linux-lab/commandEngine';
import {
  Terminal as TerminalIcon,
  RotateCcw,
  Copy,
  Maximize2,
  Minimize2,
  Play,
  Sparkles,
  Command,
  ChevronRight,
  Check,
  Palette,
  ChevronDown,
  Cloud,
} from 'lucide-react';
import {
  TerminalThemeId,
  TERMINAL_THEMES,
  TERMINAL_THEME_LIST,
} from '../../lib/linux-lab/terminalThemes';

interface TerminalViewProps {
  engine: LinuxCommandEngine;
  onCommandExecuted: (cmd: string, output: CommandOutput) => void;
  onResetEnvironment: () => void;
  runCommandRef?: React.MutableRefObject<((cmd: string) => void) | null>;
  activeCommandTitle?: string;
  labMode?: 'linux' | 'k8s';
  onToggleLabMode?: (mode: 'linux' | 'k8s') => void;
}

const LINUX_QUICK_COMMANDS = [
  { label: 'ls -lah', cmd: 'ls -lah', desc: 'Detailed file list' },
  { label: 'pwd', cmd: 'pwd', desc: 'Working directory' },
  { label: 'df -h', cmd: 'df -h', desc: 'Disk capacity' },
  { label: 'free -m', cmd: 'free -m', desc: 'Memory status' },
  { label: 'ps aux', cmd: 'ps aux', desc: 'All processes' },
  { label: 'ss -tulpn', cmd: 'ss -tulpn', desc: 'Open network ports' },
  { label: 'uptime', cmd: 'uptime', desc: 'System load' },
  { label: 'tree', cmd: 'tree', desc: 'Directory hierarchy' },
  { label: 'curl -I health', cmd: 'curl -I https://api.saivinod.dev/health', desc: 'HTTP HEAD' },
  { label: 'grep 500 logs', cmd: 'grep "500" /var/log/nginx/access.log', desc: 'Filter errors' },
  { label: 'cat os-release', cmd: 'cat /etc/os-release', desc: 'Ubuntu version' },
  { label: 'whoami', cmd: 'whoami', desc: 'Active user' },
  { label: 'clear', cmd: 'clear', desc: 'Clear screen' },
];

const K8S_QUICK_COMMANDS = [
  { label: 'kubectl get nodes -o wide', cmd: 'kubectl get nodes -o wide', desc: 'Cluster nodes' },
  { label: 'kubectl get pods -A', cmd: 'kubectl get pods -A', desc: 'All pods across namespaces' },
  { label: 'kubectl get svc', cmd: 'kubectl get svc', desc: 'Active services' },
  { label: 'kubectl get deploy', cmd: 'kubectl get deploy', desc: 'Deployments status' },
  { label: 'kubectl describe pod frontend', cmd: 'kubectl describe pod frontend-75466bc679-2wqk1', desc: 'Pod details' },
  { label: 'kubectl logs api-gateway', cmd: 'kubectl logs api-gateway-5f78b84d9f-k2l9p', desc: 'Container logs' },
  { label: 'kubectl scale deploy frontend --replicas=4', cmd: 'kubectl scale deployment frontend --replicas=4', desc: 'Scale replicas' },
  { label: 'kubectl top pods', cmd: 'kubectl top pods', desc: 'Pod resource metrics' },
  { label: 'kubectl cluster-info', cmd: 'kubectl cluster-info', desc: 'Control plane info' },
  { label: 'cat k8s/nginx-deployment.yaml', cmd: 'cat k8s/nginx-deployment.yaml', desc: 'View deployment YAML' },
  { label: 'kubectl apply -f k8s/nginx-deployment.yaml', cmd: 'kubectl apply -f k8s/nginx-deployment.yaml', desc: 'Apply manifest' },
  { label: 'minikube status', cmd: 'minikube status', desc: 'Minikube status' },
  { label: 'clear', cmd: 'clear', desc: 'Clear screen' },
];

export const TerminalView: React.FC<TerminalViewProps> = ({
  engine,
  onCommandExecuted,
  onResetEnvironment,
  runCommandRef,
  activeCommandTitle,
  labMode = 'k8s',
  onToggleLabMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const currentLineRef = useRef<string>('');
  const historyIndexRef = useRef<number>(-1);
  const isFullscreenRef = useRef<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Theme state with localStorage persistence
  const [themeId, setThemeId] = useState<TerminalThemeId>(() => {
    const saved = localStorage.getItem('linux_lab_terminal_theme');
    if (saved === 'solarized' || saved === 'gruvbox' || saved === 'classic-dark') {
      return saved as TerminalThemeId;
    }
    return 'classic-dark';
  });
  const [showThemeMenu, setShowThemeMenu] = useState<boolean>(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  const currentTheme = TERMINAL_THEMES[themeId] || TERMINAL_THEMES['classic-dark'];

  // Handle outside click to close theme menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    };
    if (showThemeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showThemeMenu]);

  const isInitialMount = useRef(true);

  // Helper to format prompt
  const getPrompt = () => {
    const curPath = engine.vfs.currentPath;
    const displayPath =
      curPath === '/home/sai' ? '~' : curPath.startsWith('/home/sai/') ? '~' + curPath.slice(9) : curPath;
    if (labMode === 'k8s') {
      return `\x1b[1;36m(k8s:default)\x1b[0m \x1b[1;32msai@cluster\x1b[0m:\x1b[1;34m${displayPath}\x1b[0m$ `;
    }
    return `\x1b[1;32msai@linux-lab\x1b[0m:\x1b[1;34m${displayPath}\x1b[0m$ `;
  };

  const writePrompt = (term: Terminal) => {
    term.write('\r\n' + getPrompt());
  };

  // Switch lab mode effect in terminal output
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!termRef.current) return;
    const term = termRef.current;
    if (labMode === 'k8s') {
      term.writeln('\r\n\x1b[1;36m==> ☸️  Kubernetes Practice Lab Activated!\x1b[0m');
      term.writeln('\x1b[90mCluster: devops-cluster-01 (v1.30.2) | Context: kubernetes-admin | Nodes: 3 Ready\x1b[0m');
      term.writeln('\x1b[33mTip: Run "kubectl get nodes -o wide" or "kubectl get pods -A" to inspect your cluster.\x1b[0m');
    } else {
      term.writeln('\r\n\x1b[1;32m==> 🐧 Linux Workstation Mode Activated.\x1b[0m \x1b[90m[Host: linux-lab | User: sai]\x1b[0m');
    }
    writePrompt(term);
  }, [labMode]);

  // Programmatic command runner
  const executeAndPrint = (cmd: string) => {
    if (!termRef.current) return;
    const term = termRef.current;

    // Clear any partially typed command from line
    while (currentLineRef.current.length > 0) {
      term.write('\b \b');
      currentLineRef.current = currentLineRef.current.slice(0, -1);
    }

    // Write command to screen
    term.write(cmd);
    currentLineRef.current = '';
    historyIndexRef.current = -1;

    if (cmd.trim() === 'clear') {
      term.clear();
      term.write(getPrompt());
      onCommandExecuted(cmd, { stdout: '', stderr: '', exitCode: 0 });
      return;
    }

    const output = engine.executeCommandLine(cmd);

    if (output.stdout) {
      term.write('\r\n' + output.stdout.replace(/\n/g, '\r\n'));
    }
    if (output.stderr) {
      term.write('\r\n\x1b[31m' + output.stderr.replace(/\n/g, '\r\n') + '\x1b[0m');
    }

    writePrompt(term);
    onCommandExecuted(cmd, output);
  };

  const handleSelectTheme = (newThemeId: TerminalThemeId) => {
    setThemeId(newThemeId);
    setShowThemeMenu(false);
    localStorage.setItem('linux_lab_terminal_theme', newThemeId);
    if (termRef.current) {
      termRef.current.options.theme = TERMINAL_THEMES[newThemeId].terminalTheme;
      termRef.current.writeln(`\r\n\x1b[90m[Theme switched to ${TERMINAL_THEMES[newThemeId].name}]\x1b[0m`);
      writePrompt(termRef.current);
    }
  };

  // Expose executeAndPrint to parent via ref
  useEffect(() => {
    if (runCommandRef) {
      runCommandRef.current = executeAndPrint;
    }
    return () => {
      if (runCommandRef) {
        runCommandRef.current = null;
      }
    };
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const initialTheme = TERMINAL_THEMES[themeId] || TERMINAL_THEMES['classic-dark'];

    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: 'block',
      fontFamily: '"Fira Code", "JetBrains Mono", "SFMono-Regular", Consolas, Menlo, monospace',
      fontSize: 14,
      lineHeight: 1.25,
      theme: initialTheme.terminalTheme,
      convertEol: true,
      allowTransparency: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(containerRef.current);
    fitAddon.fit();

    termRef.current = term;
    fitAddonRef.current = fitAddon;

    // Welcome Banner
    if (labMode === 'k8s') {
      term.writeln('\x1b[1;36m┌────────────────────────────────────────────────────────────────┐\x1b[0m');
      term.writeln('\x1b[1;36m│\x1b[0m  \x1b[1;37m☸️  Kubernetes v1.30.2 Sandbox Lab Active                     \x1b[0m\x1b[1;36m│\x1b[0m');
      term.writeln('\x1b[1;36m│\x1b[0m  \x1b[90mCluster: devops-cluster-01 | Nodes: 3 Ready | CRI: containerd \x1b[0m\x1b[1;36m│\x1b[0m');
      term.writeln('\x1b[1;36m│\x1b[0m  \x1b[90mContext: kubernetes-admin@devops-cluster-01 | NS: default     \x1b[0m\x1b[1;36m│\x1b[0m');
      term.writeln('\x1b[1;36m│\x1b[0m  \x1b[33mTry: kubectl get nodes -o wide, kubectl get pods -A, k get svc\x1b[0m\x1b[1;36m│\x1b[0m');
      term.writeln('\x1b[1;36m└────────────────────────────────────────────────────────────────┘\x1b[0m');
    } else {
      term.writeln('\x1b[1;36m┌────────────────────────────────────────────────────────────────┐\x1b[0m');
      term.writeln('\x1b[1;36m│\x1b[0m  \x1b[1;37mLinux Practice Lab Workstation (Ubuntu 24.04 LTS Noble)\x1b[0m       \x1b[1;36m│\x1b[0m');
      term.writeln('\x1b[1;36m│\x1b[0m  \x1b[90mKernel: 6.8.0-40-generic | Arch: x86_64 | Bash: 5.2.21\x1b[0m        \x1b[1;36m│\x1b[0m');
      term.writeln('\x1b[1;36m│\x1b[0m  \x1b[90mEnvironment: Sandboxed DevOps virtual workstation (full access)\x1b[0m\x1b[1;36m│\x1b[0m');
      term.writeln('\x1b[1;36m│\x1b[0m  \x1b[33mUnlimited practice enabled. Run commands or pick from catalog!\x1b[0m \x1b[1;36m│\x1b[0m');
      term.writeln('\x1b[1;36m└────────────────────────────────────────────────────────────────┘\x1b[0m');
    }
    term.write(getPrompt());

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      try {
        fitAddon.fit();
      } catch (err) {
        // ignore during unmount
      }
    });
    resizeObserver.observe(containerRef.current);

    // Keystroke handler
    term.onData((data) => {
      // Enter
      if (data === '\r' || data === '\n') {
        const cmd = currentLineRef.current;
        currentLineRef.current = '';
        historyIndexRef.current = -1;

        if (!cmd.trim()) {
          writePrompt(term);
          return;
        }

        if (cmd.trim() === 'clear') {
          term.clear();
          term.write(getPrompt());
          onCommandExecuted(cmd, { stdout: '', stderr: '', exitCode: 0 });
          return;
        }

        const output = engine.executeCommandLine(cmd);

        if (output.stdout) {
          term.write('\r\n' + output.stdout.replace(/\n/g, '\r\n'));
        }
        if (output.stderr) {
          term.write('\r\n\x1b[31m' + output.stderr.replace(/\n/g, '\r\n') + '\x1b[0m');
        }

        writePrompt(term);
        onCommandExecuted(cmd, output);
        return;
      }

      // Backspace
      if (data === '\x7F' || data === '\b') {
        if (currentLineRef.current.length > 0) {
          currentLineRef.current = currentLineRef.current.slice(0, -1);
          term.write('\b \b');
        }
        return;
      }

      // Ctrl+C
      if (data === '\x03') {
        currentLineRef.current = '';
        historyIndexRef.current = -1;
        term.write('^C');
        writePrompt(term);
        return;
      }

      // Ctrl+L
      if (data === '\x0C') {
        term.clear();
        term.write(getPrompt() + currentLineRef.current);
        return;
      }

      // Tab Completion
      if (data === '\t') {
        const currentInput = currentLineRef.current;
        const parts = currentInput.split(' ');
        const lastPart = parts[parts.length - 1];

        const availableCommands = [
          'pwd', 'ls', 'cd', 'mkdir', 'touch', 'cp', 'mv', 'rm',
          'cat', 'head', 'tail', 'grep', 'find', 'tree', 'chmod', 'chown',
          'ps', 'kill', 'top', 'uptime', 'df', 'du', 'free', 'ip', 'ping', 'curl',
          'ss', 'netstat', 'systemctl', 'tar', 'gzip', 'echo', 'printf', 'sort', 'uniq',
          'cut', 'wc', 'sed', 'awk', 'clear', 'history', 'whoami', 'uname',
          'date', 'export', 'env', 'which', 'stat', 'man', 'help'
        ];

        if (parts.length === 1 && lastPart) {
          const matches = availableCommands.filter((c) => c.startsWith(lastPart));
          if (matches.length === 1) {
            const completion = matches[0].slice(lastPart.length) + ' ';
            currentLineRef.current += completion;
            term.write(completion);
          } else if (matches.length > 1) {
            term.write('\r\n' + matches.join('  '));
            writePrompt(term);
            term.write(currentLineRef.current);
          }
          return;
        }

        // Match files in current directory
        const currentNode = engine.vfs.resolvePathNode(engine.vfs.currentPath);
        if (currentNode && currentNode.children && lastPart) {
          const entries = Array.from(currentNode.children.keys()) as string[];
          const matches = entries.filter((e) => e.startsWith(lastPart));
          if (matches.length === 1) {
            const childNode = currentNode.children.get(matches[0]);
            const isDir = childNode?.type === 'directory';
            const suffix = isDir ? '/' : ' ';
            const completion = matches[0].slice(lastPart.length) + suffix;
            currentLineRef.current += completion;
            term.write(completion);
          } else if (matches.length > 1) {
            term.write('\r\n' + matches.join('  '));
            writePrompt(term);
            term.write(currentLineRef.current);
          }
        }
        return;
      }

      // Up Arrow
      if (data === '\x1b[A') {
        const history = engine.history;
        if (history.length === 0) return;

        if (historyIndexRef.current === -1) {
          historyIndexRef.current = history.length - 1;
        } else if (historyIndexRef.current > 0) {
          historyIndexRef.current--;
        }

        while (currentLineRef.current.length > 0) {
          term.write('\b \b');
          currentLineRef.current = currentLineRef.current.slice(0, -1);
        }

        const prevCmd = history[historyIndexRef.current] || '';
        currentLineRef.current = prevCmd;
        term.write(prevCmd);
        return;
      }

      // Down Arrow
      if (data === '\x1b[B') {
        const history = engine.history;
        if (historyIndexRef.current === -1) return;

        while (currentLineRef.current.length > 0) {
          term.write('\b \b');
          currentLineRef.current = currentLineRef.current.slice(0, -1);
        }

        if (historyIndexRef.current < history.length - 1) {
          historyIndexRef.current++;
          const nextCmd = history[historyIndexRef.current];
          currentLineRef.current = nextCmd;
          term.write(nextCmd);
        } else {
          historyIndexRef.current = -1;
          currentLineRef.current = '';
        }
        return;
      }

      // Regular character printing
      if (data.length === 1 && data.charCodeAt(0) >= 32) {
        currentLineRef.current += data;
        term.write(data);
      }
    });

    return () => {
      resizeObserver.disconnect();
      term.dispose();
    };
  }, [engine]);

  const handleCopyClipboard = () => {
    if (termRef.current) {
      const selection = termRef.current.getSelection();
      if (selection) {
        navigator.clipboard.writeText(selection);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleResetLab = () => {
    onResetEnvironment();
    engine.k8s.resetToDefaultState();
    if (termRef.current) {
      termRef.current.clear();
      if (labMode === 'k8s') {
        termRef.current.writeln('\x1b[1;33m==> Environment reloaded. Virtual filesystem and Kubernetes cluster reset to default state.\x1b[0m');
      } else {
        termRef.current.writeln('\x1b[1;33m==> Environment reloaded. Virtual filesystem initialized to default state.\x1b[0m');
      }
      termRef.current.write(getPrompt());
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    isFullscreenRef.current = !isFullscreen;
    setTimeout(() => {
      fitAddonRef.current?.fit();
    }, 100);
  };

  const currentQuickCommands = labMode === 'k8s' ? K8S_QUICK_COMMANDS : LINUX_QUICK_COMMANDS;

  return (
    <div
      id="linux-terminal-container"
      className={`flex flex-col ${currentTheme.containerBg} border ${currentTheme.borderColor} rounded-xl overflow-hidden shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-2 z-50 rounded-lg' : 'h-full w-full'
      }`}
    >
      {/* Terminal Title Bar */}
      <div className={`flex items-center justify-between px-3 py-2 ${currentTheme.titleBarBg} border-b ${currentTheme.borderColor} select-none`}>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-1.5">
            <div
              className="w-3 h-3 rounded-full bg-red-500/80 hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => termRef.current?.clear()}
              title="Clear terminal screen"
            />
            <div
              className="w-3 h-3 rounded-full bg-yellow-500/80 hover:opacity-100 transition-opacity cursor-pointer"
              onClick={handleResetLab}
              title="Reset sandbox state"
            />
            <div
              className="w-3 h-3 rounded-full bg-green-500/80 hover:opacity-100 transition-opacity cursor-pointer"
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
            {labMode === 'k8s' ? (
              <div className="flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-semibold text-neutral-200">k8s-cluster:</span>
                <span className="text-cyan-400">devops-cluster-01</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v1.30.2
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-neutral-200">sai@linux-lab:</span>
                <span className="text-blue-400">~/workspace</span>
              </div>
            )}
            {activeCommandTitle && (
              <span className="hidden sm:inline-block text-neutral-400 border-l border-neutral-700 pl-2 ml-1 truncate max-w-[240px]">
                {activeCommandTitle}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Lab Mode Toggle Switcher */}
          {onToggleLabMode && (
            <div className="flex items-center bg-neutral-900/90 border border-neutral-700/60 p-0.5 rounded-lg text-xs font-mono mr-1">
              <button
                id="lab-mode-linux-btn"
                onClick={() => onToggleLabMode('linux')}
                className={`px-2 py-0.5 rounded transition-all text-[11px] flex items-center gap-1 ${
                  labMode === 'linux'
                    ? 'bg-neutral-800 text-white font-medium border border-neutral-600/50 shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Switch to Linux Workstation"
              >
                <TerminalIcon className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">Linux</span>
              </button>
              <button
                id="lab-mode-k8s-btn"
                onClick={() => onToggleLabMode('k8s')}
                className={`px-2 py-0.5 rounded transition-all text-[11px] flex items-center gap-1 ${
                  labMode === 'k8s'
                    ? 'bg-indigo-600/40 text-indigo-200 font-medium border border-indigo-500/50 shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Switch to Kubernetes Cluster Sandbox"
              >
                <Cloud className="w-3 h-3 text-indigo-400" />
                <span className="hidden sm:inline">K8s</span>
              </button>
            </div>
          )}

          {/* Terminal Theme Toggle Dropdown */}
          <div className="relative" ref={themeMenuRef}>
            <button
              id="terminal-theme-toggle"
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-all font-mono ${
                showThemeMenu
                  ? 'bg-neutral-700/80 text-white border-neutral-500 shadow-sm'
                  : 'bg-neutral-800/60 text-neutral-300 hover:text-white hover:bg-neutral-800 border-neutral-700/60'
              }`}
              title="Change terminal color scheme"
            >
              <Palette className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline text-[11px] font-medium">{currentTheme.name}</span>
              <div className="flex items-center -space-x-1">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/40 shadow-xs"
                  style={{ backgroundColor: currentTheme.previewColors.bg }}
                />
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/40 shadow-xs"
                  style={{ backgroundColor: currentTheme.previewColors.accent }}
                />
              </div>
              <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${showThemeMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Popover */}
            {showThemeMenu && (
              <div
                id="terminal-theme-dropdown"
                className="absolute right-0 mt-1.5 w-64 rounded-xl bg-[#161b22] border border-neutral-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-2 py-1.5 mb-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold border-b border-neutral-800 flex items-center justify-between">
                  <span>Terminal Theme</span>
                  <span className="text-emerald-400 text-[10px]">3 Schemes</span>
                </div>

                <div className="space-y-1">
                  {TERMINAL_THEME_LIST.map((themeOption) => {
                    const isSelected = themeOption.id === themeId;
                    return (
                      <button
                        key={themeOption.id}
                        id={`theme-option-${themeOption.id}`}
                        onClick={() => handleSelectTheme(themeOption.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all text-xs font-mono ${
                          isSelected
                            ? 'bg-neutral-800 text-white border border-emerald-500/40 shadow-sm'
                            : 'hover:bg-neutral-800/60 text-neutral-300 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* 3-color palette preview */}
                          <div className="flex items-center -space-x-1 p-1 rounded-md bg-black/40 border border-neutral-700/60 shrink-0">
                            <div
                              className="w-3 h-3 rounded-full border border-black/60 shadow-xs"
                              style={{ backgroundColor: themeOption.previewColors.bg }}
                            />
                            <div
                              className="w-3 h-3 rounded-full border border-black/60 shadow-xs"
                              style={{ backgroundColor: themeOption.previewColors.accent }}
                            />
                            <div
                              className="w-3 h-3 rounded-full border border-black/60 shadow-xs"
                              style={{ backgroundColor: themeOption.previewColors.fg }}
                            />
                          </div>

                          <div className="truncate">
                            <div className="font-semibold text-neutral-100 flex items-center gap-1.5">
                              {themeOption.name}
                              {isSelected && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-normal">
                                  Active
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-neutral-400 truncate">
                              {themeOption.tagline}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleCopyClipboard}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/80 rounded transition-colors"
            title="Copy terminal selection"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleResetLab}
            className="p-1.5 text-neutral-400 hover:text-amber-400 hover:bg-neutral-800/80 rounded transition-colors"
            title="Reset sandbox environment"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/80 rounded transition-colors"
            title={isFullscreen ? 'Exit full screen' : 'Expand terminal'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Quick Action Chips Bar */}
      <div className={`px-3 py-1.5 ${currentTheme.quickBarBg} border-b ${currentTheme.borderColor} flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs shrink-0`}>
        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
          <Command className="w-3 h-3 text-emerald-400" />
          {labMode === 'k8s' ? 'K8s:' : 'Quick:'}
        </span>
        {currentQuickCommands.map((qc) => (
          <button
            key={qc.cmd}
            onClick={() => executeAndPrint(qc.cmd)}
            className="px-2 py-0.5 rounded-md bg-neutral-800/80 hover:bg-neutral-700/90 text-neutral-300 hover:text-white font-mono text-[11px] shrink-0 border border-neutral-700/50 hover:border-emerald-500/50 transition-all flex items-center gap-1 active:scale-95"
            title={qc.desc}
          >
            <Play className="w-2 h-2 text-emerald-400 fill-current" />
            <span>{qc.label}</span>
          </button>
        ))}
      </div>

      {/* Terminal Screen Body */}
      <div
        ref={containerRef}
        className="flex-1 w-full h-full p-2.5 overflow-hidden"
        style={{
          minHeight: '380px',
          backgroundColor: currentTheme.terminalTheme.background,
        }}
      />

      {/* Status Bar */}
      <div className={`flex items-center justify-between px-3 py-1 ${currentTheme.statusBarBg} border-t ${currentTheme.borderColor} text-[11px] font-mono text-neutral-400 shrink-0`}>
        <div className="flex items-center gap-3">
          {labMode === 'k8s' ? (
            <>
              <span className="flex items-center gap-1 text-indigo-300">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                Cluster: 3/3 Nodes Ready
              </span>
              <span className="hidden sm:inline text-neutral-400">Namespace: default</span>
              <span className="hidden md:inline text-cyan-400">CRI: containerd 1.7</span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                BASH 5.2 (Noble)
              </span>
              <span className="hidden sm:inline text-neutral-400">PID: 512</span>
              <span className="hidden md:inline text-neutral-400">Tab: Auto-complete</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-neutral-400 hidden sm:inline">Theme: {currentTheme.name}</span>
          <span className="text-neutral-400 hidden sm:inline">Ctrl+L clear • Ctrl+C abort</span>
          <span className="text-neutral-300 font-medium">
            {labMode === 'k8s' ? 'k8s v1.30.2 Sandbox' : 'Ubuntu 24.04 LTS'}
          </span>
        </div>
      </div>
    </div>
  );
};
