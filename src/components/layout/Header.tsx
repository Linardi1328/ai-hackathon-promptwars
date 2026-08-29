import React from 'react';
import { RoleSwitcher } from './RoleSwitcher';
import { Activity, Clock, Layers, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useEventContext } from '../../context/EventContext';

export const Header: React.FC = () => {
  const { eventHealth, simulationState } = useEventContext();

  const getScheduleDisplay = () => {
    switch (simulationState) {
      case 'disrupted':
        return {
          text: '16:30 (At Risk +28m)',
          color: 'text-amber-400',
          icon: AlertCircle,
          iconColor: 'text-amber-400',
        };
      case 'recovered':
        return {
          text: '16:30 (Recovered +4m)',
          color: 'text-emerald-400',
          icon: CheckCircle2,
          iconColor: 'text-emerald-400',
        };
      case 'healthy':
      default:
        return {
          text: '16:30 (On Time)',
          color: 'text-white',
          icon: Clock,
          iconColor: 'text-slate-400',
        };
    }
  };

  const scheduleInfo = getScheduleDisplay();
  const ScheduleIcon = scheduleInfo.icon;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Row 1: Main Brand + Desktop Navigation */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  EVENT TWIN
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    PROTOTYPE
                  </span>
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate max-w-[190px] sm:max-w-none">
                PromptWars x AbhiyantriX • Live Ops Console
              </p>
            </div>
          </div>

          {/* Operational Status Ticker (Desktop) */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-slate-300">Phase:</span>
              <span className="text-emerald-400 font-semibold">Judging Round 1</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <ScheduleIcon className={`w-3.5 h-3.5 ${scheduleInfo.iconColor}`} />
              <span className="text-slate-400">Schedule:</span>
              <span className={`font-mono font-medium ${scheduleInfo.color}`}>{scheduleInfo.text}</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Health:</span>
              <span className={`font-semibold font-mono ${
                eventHealth.score < 75 ? 'text-amber-400' : 'text-emerald-400'
              }`}>{eventHealth.score}%</span>
            </div>
          </div>

          {/* Desktop Role Switcher */}
          <div className="hidden sm:flex items-center">
            <RoleSwitcher />
          </div>

        </div>

        {/* Row 2: Mobile Compact Role Switcher */}
        <div className="sm:hidden pb-2.5 pt-0.5">
          <RoleSwitcher />
        </div>

      </div>
    </header>
  );
};
