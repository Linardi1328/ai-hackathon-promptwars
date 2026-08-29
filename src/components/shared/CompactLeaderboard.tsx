import React from 'react';
import { useEventContext } from '../../context/EventContext';
import { Trophy } from 'lucide-react';

export const CompactLeaderboard: React.FC<{ highlightTeamId?: string }> = ({ highlightTeamId }) => {
  const { teams, judges } = useEventContext();

  const sortedTeams = [...teams].sort((a, b) => {
    const scoreA = a.averageScore || 0;
    const scoreB = b.averageScore || 0;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return a.name.localeCompare(b.name);
  });

  const getJudgeName = (judgeId: string) => {
    const judge = judges.find((j) => j.id === judgeId);
    return judge ? judge.name : 'Unassigned';
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Live Leaderboard & Submissions</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">{teams.length} Teams</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 text-[10px] uppercase font-semibold">
            <tr>
              <th className="py-2.5 px-3 w-10 text-center">Rank</th>
              <th className="py-2.5 px-3">Team & Project</th>
              <th className="py-2.5 px-3">Track</th>
              <th className="py-2.5 px-3">Assigned Judge</th>
              <th className="py-2.5 px-3 text-right">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {sortedTeams.map((team, idx) => {
              const rank = idx + 1;
              const isHighlighted = highlightTeamId === team.id;
              const hasScore = team.averageScore !== undefined;

              return (
                <tr
                  key={team.id}
                  className={`transition-colors ${
                    isHighlighted
                      ? 'bg-emerald-950/40 text-white font-medium'
                      : 'hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-400">
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-white mr-1.5">{team.name}</span>
                    <span className="text-slate-400 truncate max-w-xs block sm:inline">
                      ({team.projectTitle})
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-300">
                      {team.track}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {getJudgeName(team.assignedJudgeId)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">
                    {hasScore ? (
                      <span className="text-emerald-400">{team.averageScore?.toFixed(1)} / 40</span>
                    ) : (
                      <span className="text-slate-500 italic">Pending</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
