import React, { useEffect, useState } from 'react';
import { Users, ShieldCheck, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { subscribeToVisitorCount } from '../lib/visitorTracker';

interface VisitorCountProps {
  className?: string;
}

const OWNER_EMAIL = 'saivinodkotipalli2003@gmail.com';

export const VisitorCount: React.FC<VisitorCountProps> = ({ className = '' }) => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [hasIncremented, setHasIncremented] = useState(false);

  // Check if current authenticated user is the portfolio owner
  const isOwner = user?.email?.toLowerCase() === OWNER_EMAIL.toLowerCase();

  useEffect(() => {
    // Only subscribe to real-time visitor stats if the authenticated user is the owner
    if (!isOwner) return;

    const unsubscribe = subscribeToVisitorCount((count) => {
      setVisitorCount((prev) => {
        if (prev !== null && count > prev) {
          setHasIncremented(true);
          setTimeout(() => setHasIncremented(false), 2000);
        }
        return count;
      });
    });

    return () => {
      unsubscribe();
    };
  }, [isOwner]);

  // If not the owner, do not display the visitor count
  if (!isOwner) {
    return null;
  }

  const isDark = theme === 'dark';

  return (
    <div
      id="portfolio-owner-visitor-counter"
      className={`inline-flex items-center gap-3 px-4 py-1.5 rounded-full border text-[10px] md:text-[11px] font-mono transition-all duration-300 backdrop-blur-md select-none shadow-sm ${
        isDark
          ? 'bg-cyan-950/30 border-cyan-500/30 text-white/90 hover:border-cyan-400/50'
          : 'bg-cyan-50/90 border-cyan-300 text-slate-900 hover:border-cyan-400'
      } ${className}`}
      title="Private metric: Only visible to you as portfolio owner"
    >
      {/* Live Activity Pulse Indicator */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>

      {/* Metric Label & Counter */}
      <div className="flex items-center gap-1.5">
        <Users className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
        <span className={`uppercase tracking-wider font-semibold ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
          Unique Views:
        </span>
        <span
          className={`font-bold transition-transform duration-300 ${
            hasIncremented ? 'scale-110 text-emerald-400' : isDark ? 'text-cyan-300' : 'text-cyan-700'
          }`}
        >
          {visitorCount !== null ? (
            visitorCount.toLocaleString()
          ) : (
            <span className="animate-pulse tracking-widest text-xs">...</span>
          )}
        </span>
      </div>

      {/* Owner Badge */}
      <div
        className={`flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-sans font-semibold ${
          isDark
            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
            : 'bg-cyan-100 text-cyan-800 border border-cyan-200'
        }`}
      >
        <ShieldCheck className="w-3 h-3 text-cyan-400" />
        <span>Owner Only</span>
      </div>

      {/* Switch to Guest View (Logout) */}
      <button
        onClick={() => logout()}
        className={`flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
          isDark
            ? 'text-white/40 hover:text-red-300 hover:bg-white/5'
            : 'text-slate-400 hover:text-red-600 hover:bg-slate-200'
        }`}
        title="Sign out to preview as guest visitor"
      >
        <LogOut className="w-2.5 h-2.5" />
        <span className="hidden sm:inline">Guest Preview</span>
      </button>
    </div>
  );
};
