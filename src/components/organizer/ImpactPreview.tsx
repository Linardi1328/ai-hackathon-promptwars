import React from 'react';
import { useEventContext } from '../../context/EventContext';
import { AlertOctagon, Clock, Users, Trophy, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ImpactPreview: React.FC = () => {
  const { simulationState, teams, eventHealth } = useEventContext();

  const affectedTeams = teams.filter((t) => t.isAffected || (simulationState === 'disrupted' && t.assignedJudgeId === 'judge-3'));

  return (
    <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between space-y-3">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
            2. Real-Time Impact Forecast
          </span>
          {simulationState === 'disrupted' && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
              DELAY DETECTED
            </span>
          )}
        </div>

        {simulationState === 'healthy' ? (
          <div className="py-4 text-center text-xs text-slate-500">
            <ShieldCheck className="w-8 h-8 mx-auto text-emerald-500/40 mb-1.5" />
            No operational bottlenecks detected. Event on track for 17:15 deliberation.
          </div>
        ) : (
          <div className="space-y-2.5">
            {/* Impact summary cards */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Affected Teams</div>
                <div className="text-lg font-bold font-mono text-amber-400 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {simulationState === 'disrupted' ? '5 Teams' : '0 (Resolved)'}
                </div>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Forecast Delay</div>
                <div className={`text-lg font-bold font-mono ${simulationState === 'disrupted' ? 'text-rose-400' : 'text-emerald-400'} flex items-center gap-1`}>
                  <Clock className="w-4 h-4" />
                  +{eventHealth.predictedDelayMin} min
                </div>
              </div>
            </div>

            {/* List of affected team names */}
            {simulationState === 'disrupted' && (
              <div className="bg-rose-950/30 p-2.5 rounded-lg border border-rose-500/30 text-xs">
                <div className="text-[11px] font-bold text-rose-300 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> 5 Stranded Submissions:
                </div>
                <div className="flex flex-wrap gap-1">
                  {['Synthetix', 'HelixGuard', 'AgentForge', 'AutoRefactor', 'ShieldOps'].map((name) => (
                    <span key={name} className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-200 text-[10px] font-mono">
                      {name}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">
                  Consequence: Leaderboard finalization delayed past 17:15 cutoff.
                </p>
              </div>
            )}

            {simulationState === 'recovered' && (
              <div className="bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-500/30 text-xs text-emerald-300">
                All 5 teams re-queued with available evaluators. Delay minimized to 4m.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
