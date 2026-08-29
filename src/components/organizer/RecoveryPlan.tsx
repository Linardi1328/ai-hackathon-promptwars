import React from 'react';
import { useEventContext } from '../../context/EventContext';
import { Sparkles, CheckCircle2, Zap, RefreshCw } from 'lucide-react';

export const RecoveryPlan: React.FC = () => {
  const { simulationState, applyRecoveryPlan, resetSimulation } = useEventContext();

  return (
    <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between space-y-3">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            4. Automated Recovery Plan
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Predefined Rebalancing
          </span>
        </div>

        <h4 className="text-sm font-bold text-white mb-1">
          {simulationState === 'recovered'
            ? 'Optimized Schedule Applied'
            : 'Recommended Redistribution'}
        </h4>

        <p className="text-xs text-slate-400 leading-relaxed">
          {simulationState === 'recovered'
            ? '5 teams redistributed across Dr. Sarah Chen (2), David Kim (1), and Dr. Elena Rostova (2).'
            : 'Redistribute 5 affected teams across Judges 1, 2, and 4 to prevent schedule overrun.'}
        </p>

        {/* Action Recommendation Box */}
        <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Dr. Sarah Chen (AI Track):</span>
            <span className="font-mono font-bold text-emerald-400">+2 Teams (Synthetix, HelixGuard)</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">David Kim (DevTools):</span>
            <span className="font-mono font-bold text-emerald-400">+1 Team (AgentForge)</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Dr. Elena Rostova (Systems):</span>
            <span className="font-mono font-bold text-emerald-400">+2 Teams (AutoRefactor, ShieldOps)</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/80">
        {simulationState === 'disrupted' && (
          <button
            onClick={applyRecoveryPlan}
            aria-label="Apply predefined recovery plan to recover 24 minutes"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/60 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <Zap className="w-4 h-4" />
            <span>Apply Recovery Plan (Recover 24 Mins)</span>
          </button>
        )}

        {simulationState === 'recovered' && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Recovery Active • 24m Saved</span>
            </div>

            <button
              onClick={resetSimulation}
              aria-label="Reset simulation to healthy baseline"
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        )}

        {simulationState === 'healthy' && (
          <div className="text-center text-xs text-slate-500 py-1 font-mono">
            System standing by. Trigger disruption above to test recovery.
          </div>
        )}
      </div>
    </div>
  );
};
