import React from 'react';
import { useEventContext } from '../../context/EventContext';
import { Activity, Clock, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

export const EventHealth: React.FC = () => {
  const { eventHealth, simulationState } = useEventContext();

  const getStatusDisplay = () => {
    if (simulationState === 'disrupted') {
      return {
        label: 'OPERATIONS AT RISK',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/30',
        icon: AlertTriangle,
        scoreColor: 'text-amber-400',
      };
    }
    if (simulationState === 'recovered') {
      return {
        label: 'RECOVERY PLAN ACTIVE',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/15 border-emerald-500/40',
        icon: Sparkles,
        scoreColor: 'text-emerald-400',
      };
    }
    return {
      label: 'OPTIMAL OPERATIONS',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      icon: ShieldCheck,
      scoreColor: 'text-emerald-400',
    };
  };

  const statusInfo = getStatusDisplay();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800/90 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left: Overall Health & Status */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center justify-center w-14 h-14 rounded-2xl ${statusInfo.bg} border shadow-inner`}>
            <Activity className={`w-7 h-7 ${statusInfo.color} ${simulationState === 'disrupted' ? 'animate-bounce' : 'animate-pulse'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-black text-white tracking-tight">Event Health Index</h2>
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.bg} ${statusInfo.color}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {statusInfo.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {simulationState === 'disrupted'
                ? 'CRITICAL BOTTLENECK: Evaluator unavailable. 5 presentations stalled.'
                : simulationState === 'recovered'
                ? 'OPTIMIZED: Workload successfully balanced across 3 available rooms.'
                : 'All 4 evaluators online. Nominal pace across 8 finalist teams.'}
            </p>
          </div>
        </div>

        {/* Right: Big Telemetry Gauges */}
        <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
          
          {/* Health Score */}
          <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 text-center min-w-[110px]">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Health Index</div>
            <div className={`text-3xl font-black font-mono tracking-tight ${statusInfo.scoreColor}`}>
              {eventHealth.score}%
            </div>
          </div>

          {/* Predicted Delay Gauge */}
          <div className={`px-4 py-2.5 rounded-xl border text-center min-w-[120px] transition-all ${
            simulationState === 'disrupted'
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              : simulationState === 'recovered'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-950/80 border-slate-800 text-slate-200'
          }`}>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" />
              Forecast Delay
            </div>
            <div className="text-2xl font-black font-mono">
              +{eventHealth.predictedDelayMin} <span className="text-xs font-sans font-semibold">min</span>
            </div>
          </div>

          {/* Recovered Time Badge (Only in recovered state) */}
          {simulationState === 'recovered' && (
            <div className="bg-emerald-500/20 border border-emerald-400/50 px-4 py-2.5 rounded-xl text-center min-w-[130px] animate-in fade-in zoom-in-95">
              <div className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Time Saved
              </div>
              <div className="text-2xl font-black font-mono text-emerald-300">
                24 <span className="text-xs font-sans font-semibold">min recovered</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
