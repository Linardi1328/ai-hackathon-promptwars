import React from 'react';
import { RoleSwitcher } from './RoleSwitcher';
import { Activity, Clock, Layers, Sparkles, Radio } from 'lucide-react';
import { useEventContext } from '../../context/EventContext';

export const Header: React.FC = () => {
  const { eventHealth } = useEventContext();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
              <Layers className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  EVENT TWIN
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    PROTOTYPE
                  </span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                AI Nexus Hackathon 2026 • Live Ops Console
              </p>
            </div>
          </div>

          {/* Operational Status Ticker (Desktop) */}
          <div className="hidden lg:flex items-center gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-slate-300">Phase:</span>
              <span className="text-emerald-400 font-semibold">Judging Round 1</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Schedule:</span>
              <span className="text-white font-mono font-medium">16:30 (On Time)</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Health:</span>
              <span className="text-emerald-400 font-semibold font-mono">{eventHealth.score}%</span>
            </div>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center">
            <RoleSwitcher />
          </div>

        </div>
      </div>
    </header>
  );
};
