import React from 'react';
import { useEventContext } from '../../context/EventContext';
import { AlertTriangle, RotateCcw, Cpu, UserX } from 'lucide-react';

export const DisruptionSelector: React.FC = () => {
  const { simulationState, simulateDisruption, resetSimulation } = useEventContext();

  return (
    <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between space-y-3">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            1. Operational Disruption Injection
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            Scenario Demo
          </span>
        </div>
        <h4 className="text-sm font-bold text-white mb-1">
          Evaluator Unavailable During Round 1
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          Simulates <strong className="text-slate-200">Judge 3 (Marcus Vance)</strong> suddenly dropping out 
          with 5 assigned teams queued for evaluation.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
        {simulationState === 'healthy' ? (
          <button
            onClick={simulateDisruption}
            aria-label="Simulate Judge 3 dropout disruption scenario"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-950/50 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <UserX className="w-4 h-4" />
            <span>Trigger Judge 3 Dropout (Simulate)</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Disruption Active</span>
            </div>

            <button
              onClick={resetSimulation}
              aria-label="Reset simulation to healthy baseline state"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
