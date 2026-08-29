import React from 'react';
import { useEventContext } from '../../context/EventContext';
import { BarChart3, UserX, UserCheck, AlertCircle } from 'lucide-react';

export const JudgeWorkloadComparison: React.FC = () => {
  const { judges, simulationState, teams } = useEventContext();

  return (
    <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
          3. Evaluator Workload & Queue Distribution
        </span>
        <span className="text-[10px] text-slate-500 font-mono">
          Capacity: ~3 teams/evaluator
        </span>
      </div>

      <div className="space-y-2.5">
        {judges.map((judge) => {
          const isJudge3 = judge.id === 'judge-3';
          const assignedCount = judge.assignedTeamIds.length;
          
          // Progress bar percentage (max baseline 5)
          const pct = isJudge3 && simulationState !== 'healthy' ? 0 : Math.min(100, (assignedCount / 4) * 100);

          return (
            <div key={judge.id} className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{judge.name}</span>
                  <span className="text-[10px] text-slate-400">({judge.roomNumber})</span>
                </div>

                <div className="flex items-center gap-2">
                  {judge.status === 'unavailable' ? (
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 flex items-center gap-1">
                      <UserX className="w-3 h-3" /> Unavailable
                    </span>
                  ) : judge.status === 'overloaded' ? (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Bottleneck Risk
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> Balanced
                    </span>
                  )}

                  <span className="font-mono font-bold text-white text-xs w-12 text-right">
                    {assignedCount} {assignedCount === 1 ? 'team' : 'teams'}
                  </span>
                </div>
              </div>

              {/* Workload Bar */}
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    judge.status === 'unavailable'
                      ? 'bg-slate-800'
                      : judge.status === 'overloaded'
                      ? 'bg-amber-400'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.max(5, pct)}%` }}
                />
              </div>

              {/* Show which teams are assigned */}
              <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 truncate">
                <span className="text-slate-500">Assigned:</span>
                {assignedCount === 0 ? (
                  <span className="italic text-slate-600">None (0 teams)</span>
                ) : (
                  judge.assignedTeamIds.map((tId) => {
                    const team = teams.find((t) => t.id === tId);
                    return (
                      <span key={tId} className="bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800 text-slate-300">
                        {team ? team.name : tId}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
