import React from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Terminal,
  ExternalLink,
  Sparkles,
  Command,
} from 'lucide-react';

interface LinuxLabCardProps {
  onLaunch?: () => void;
}

export const LinuxLabCard: React.FC<LinuxLabCardProps> = ({ onLaunch }) => {
  const { theme } = useTheme();

  const handleLaunchLab = () => {
    if (onLaunch) {
      onLaunch();
    } else {
      window.open('/linux-lab', '_blank');
    }
  };

  return (
    <section
      id="linux-practice-lab"
      className={`py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#0a0d12]' : 'bg-slate-100'
      }`}
    >
      {/* Background Tech Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Terminal className="w-3.5 h-3.5" />
            <span>INTERACTIVE DEVOPS WORKSTATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Unlimited Linux Practice Lab
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            A real-world, sandboxed Linux terminal emulator and command workstation embedded directly in this portfolio.
            Practice unlimited Linux commands with an interactive terminal shell and real-time execution.
          </p>
        </div>

        {/* Lab Overview Dashboard Card */}
        <div
          className={`rounded-2xl border p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-all ${
            theme === 'dark'
              ? 'bg-[#11161d]/90 border-neutral-800 shadow-emerald-950/20'
              : 'bg-white/90 border-slate-200 shadow-slate-200'
          }`}
        >
          {/* Metrics & Quick Launch */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left summary */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Unlimited Practice
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono font-semibold">
                  100+ Curated DevOps Commands
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-semibold">
                  xterm.js Full Shell
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Real Shell Commands. Sandboxed Execution. Free-form Practice.
              </h3>

              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Enjoy unlimited practice across networking, file operations, permissions, process triage, and log filtering directly inside a responsive, sandboxed terminal shell.
              </p>
            </div>

            {/* Right Launch CTA Widget */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-[#0d1117] border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">Environment:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Ubuntu 24.04 LTS Noble
                </span>
              </div>

              <div className="p-3 bg-black/60 rounded-lg border border-neutral-800/80 font-mono text-xs text-neutral-300 space-y-1">
                <div className="text-emerald-400 font-bold">$ ss -tulpn | grep 80</div>
                <div className="text-neutral-400 text-[11px]">tcp  0  0 0.0.0.0:80  0.0.0.0:*  LISTEN  340/nginx</div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-1.5 text-neutral-300">
                  <Command className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">Interactive Command Runner</span>
                </div>
                <div className="text-neutral-400 font-mono text-[11px]">Zero Lockouts</div>
              </div>

              <button
                id="launch-linux-lab-button"
                onClick={handleLaunchLab}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 group transition-all transform hover:-translate-y-0.5"
              >
                <Terminal className="w-4 h-4" />
                <span>Launch Linux Practice Lab</span>
                <ExternalLink className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
