import React, { useState, useMemo, useRef } from 'react';
import { VirtualFileSystem } from '../../lib/linux-lab/vfs';
import { LinuxCommandEngine, CommandOutput } from '../../lib/linux-lab/commandEngine';
import { TerminalView } from './TerminalView';
import {
  Terminal,
  ArrowLeft,
  RotateCcw,
  Layers,
  X,
  Container,
  GitBranch,
  Cloud,
  Activity,
} from 'lucide-react';

interface LinuxLabPageProps {
  onBackToPortfolio?: () => void;
}

export const LinuxLabPage: React.FC<LinuxLabPageProps> = ({ onBackToPortfolio }) => {
  const [vfs, setVfs] = useState<VirtualFileSystem>(() => new VirtualFileSystem());
  const [commandsRunCount, setCommandsRunCount] = useState<number>(0);
  const [showRoadmapModal, setShowRoadmapModal] = useState<boolean>(false);

  // Engine instance bound to current VFS
  const engine = useMemo(() => new LinuxCommandEngine(vfs), [vfs]);

  // Ref to trigger command execution on the live terminal view
  const runCommandRef = useRef<((cmd: string) => void) | null>(null);

  const handleCommandExecuted = () => {
    setCommandsRunCount((prev) => prev + 1);
  };

  const handleResetEnvironment = () => {
    const fresh = new VirtualFileSystem();
    setVfs(fresh);
    setCommandsRunCount(0);
  };

  const handleReturn = () => {
    if (onBackToPortfolio) {
      onBackToPortfolio();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div
      id="linux-practice-lab-page"
      className="flex flex-col h-screen w-screen bg-[#0d1117] text-neutral-200 overflow-hidden font-sans select-none"
    >
      {/* Top Header Bar */}
      <header className="h-14 border-b border-neutral-800 bg-[#161b22] px-3 sm:px-4 flex items-center justify-between shrink-0 z-20">
        {/* Left: Branding & Back Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleReturn}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/60 transition-colors"
            title="Return to Saivinod Kotipalli's DevOps Portfolio"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Portfolio</span>
          </button>

          <div className="h-5 w-px bg-neutral-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  Linux Practice Lab
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    UNLIMITED
                  </span>
                </h1>
              </div>
              <p className="text-[10px] text-neutral-400 hidden md:block">
                Interactive DevOps Sandbox & Shell
              </p>
            </div>
          </div>
        </div>

        {/* Center: Quick Stats Banner */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0d1117] border border-neutral-800 text-neutral-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Commands Executed:</span>
            <span className="font-bold text-emerald-400">{commandsRunCount}</span>
          </div>
        </div>

        {/* Right: Tools & Sandbox Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Roadmap Trigger */}
          <button
            onClick={() => setShowRoadmapModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 rounded-lg border border-neutral-700/60 transition-colors"
            title="View upcoming DevOps modules (Docker, Kubernetes, CI/CD)"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Roadmap</span>
          </button>

          {/* Reset Sandbox */}
          <button
            onClick={handleResetEnvironment}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-300 hover:text-amber-400 bg-neutral-800/80 hover:bg-neutral-800 rounded-lg border border-neutral-700/60 transition-colors"
            title="Reset sandbox virtual filesystem & processes"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Reset Sandbox</span>
          </button>
        </div>
      </header>

      {/* Main Workstation Layout - Full Width Terminal */}
      <main className="flex-1 flex overflow-hidden relative p-2 md:p-3 bg-[#0a0e14]">
        <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
          <TerminalView
            engine={engine}
            onCommandExecuted={handleCommandExecuted}
            onResetEnvironment={handleResetEnvironment}
            runCommandRef={runCommandRef}
          />
        </div>
      </main>

      {/* DevOps Labs Roadmap Modal */}
      {showRoadmapModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowRoadmapModal(false)}
              className="absolute right-4 top-4 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>DevOps Learning Track & Roadmap</span>
              </div>
              <h3 className="text-xl font-bold text-white">Interactive DevOps Practice Labs</h3>
              <p className="text-xs text-neutral-400">
                The Linux Practice Lab provides unlimited hands-on command execution across system administration, cloud networking, and log filtering.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>Linux Practice Lab</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    ACTIVE LAB
                  </span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  Unlimited practice commands: VFS, bash scripting, file permissions, process inspection, sockets, and network diagnostics.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-neutral-800 bg-[#0d1117] space-y-1.5 opacity-90">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-300 font-semibold">
                    <Container className="w-4 h-4 text-blue-400" />
                    <span>Docker Practice Lab</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">
                    NEXT MODULE
                  </span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  Container lifecycle, Dockerfiles, multi-stage builds, port mappings, volume mounts, and compose.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-neutral-800 bg-[#0d1117] space-y-1.5 opacity-90">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                    <Cloud className="w-4 h-4 text-indigo-400" />
                    <span>Kubernetes Lab</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">
                    IN QUEUE
                  </span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  kubectl mastery, Pods, Deployments, Services, ConfigMaps, Ingress, and Rolling updates.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-neutral-800 bg-[#0d1117] space-y-1.5 opacity-90">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-orange-300 font-semibold">
                    <GitBranch className="w-4 h-4 text-orange-400" />
                    <span>Git & CI/CD Pipelines</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">
                    IN QUEUE
                  </span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  Git rebasing, cherry-picks, merge conflict resolution, GitHub Actions, and Jenkins automation.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowRoadmapModal(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Continue Linux Practice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

