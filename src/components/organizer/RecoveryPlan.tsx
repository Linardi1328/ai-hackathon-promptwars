import React from 'react';
import { useEventContext } from '../../context/EventContext';
import { Sparkles, CheckCircle2, Zap, RefreshCw, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

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
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
            simulationState === 'healthy'
              ? 'bg-slate-800 text-slate-400 border-slate-700'
              : simulationState === 'disrupted'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          }`}>
            {simulationState === 'healthy' ? 'Engine Ready' : simulationState === 'disrupted' ? 'Recommendation Available' : 'Plan Active'}
          </span>
        </div>

        {/* Healthy State: Neutral Standby (Do NOT reveal redistribution) */}
        {simulationState === 'healthy' && (
          <div className="space-y-2 py-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Recovery Engine Ready
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No recovery action required while event operations are healthy.
            </p>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center text-xs text-slate-500 font-mono">
              Standing by for operational disruption telemetry...
            </div>
          </div>
        )}

        {/* Disrupted State: Immediately Visible Recommended Redistribution & CTA */}
        {simulationState === 'disrupted' && (
          <div className="space-y-2.5">
            <h4 className="text-sm font-bold text-white">
              Recommended Redistribution
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Redistribute 5 affected teams across Judges 1, 2, and 4 to prevent schedule overrun.
            </p>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
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
        )}

        {/* Recovered State: Strong Payoff with 24 MIN RECOVERED & 28m -> 4m comparison */}
        {simulationState === 'recovered' && (
          <div className="space-y-2.5">
            <h4 className="text-sm font-bold text-white">
              Optimized Schedule Applied
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              5 teams redistributed across Dr. Sarah Chen (2), David Kim (1), and Dr. Elena Rostova (2).
            </p>

            {/* Prominent Success Metric Callout */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-300">Schedule Impact:</span>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="text-rose-400 line-through">28 min</span>
                  <ArrowRight className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">4 min delay</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-emerald-900/50">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Efficiency Gain:</span>
                <span className="text-xs font-extrabold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-md border border-emerald-500/40 tracking-wider">
                  ⚡ 24 MIN RECOVERED
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
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
              <span>Recovery Applied</span>
            </div>

            <button
              onClick={resetSimulation}
              aria-label="Reset simulation to healthy baseline"
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        )}

        {simulationState === 'healthy' && (
          <div className="text-center text-xs text-slate-500 py-1 font-mono">
            Trigger disruption on Panel 1 to test simulation.
          </div>
        )}
      </div>
    </div>
  );
};
