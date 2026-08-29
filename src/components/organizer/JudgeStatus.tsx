import React from 'react';
import { useEventContext } from '../../context/EventContext';
import { UserCheck } from 'lucide-react';

export const JudgeStatus: React.FC = () => {
  const { judges } = useEventContext();

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          Evaluator Room Status (4 Judges)
        </h3>
        <span className="text-[11px] font-mono text-slate-400">
          {judges.filter((j) => j.status !== 'unavailable').length} Online / {judges.length} Total
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {judges.map((judge) => {
          const isUnavailable = judge.status === 'unavailable';
          const isOverloaded = judge.status === 'overloaded';

          return (
            <div
              key={judge.id}
              className={`p-3 rounded-xl border transition-all ${
                isUnavailable
                  ? 'bg-rose-950/20 border-rose-500/30'
                  : isOverloaded
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <img
                  src={judge.avatar}
                  alt={judge.name}
                  className={`w-9 h-9 rounded-lg object-cover border ${
                    isUnavailable ? 'border-rose-500 opacity-60' : 'border-slate-700'
                  }`}
                />
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-white truncate">{judge.name}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{judge.company}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80">
                <span className="text-slate-400">{judge.roomNumber}</span>
                {isUnavailable ? (
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-500/20 px-1.5 py-0.5 rounded">
                    UNAVAILABLE
                  </span>
                ) : isOverloaded ? (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">
                    OVERLOADED
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {judge.assignedTeamIds.length} Teams
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
