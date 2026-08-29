import React, { useState } from 'react';
import { useEventContext } from '../../context/EventContext';
import { Team } from '../../types';
import { UserCheck, CheckCircle2, Clock, Send, AlertCircle } from 'lucide-react';

export const JudgeView: React.FC = () => {
  const {
    judges,
    teams,
    activeJudgeId,
    setActiveJudgeId,
    submitJudgeScore,
  } = useEventContext();

  const currentJudge = judges.find((j) => j.id === activeJudgeId) || judges[0];
  const assignedTeams = teams.filter((t) => currentJudge.assignedTeamIds.includes(t.id));

  // Local state for inline rubric form per team
  const [rubricState, setRubricState] = useState<Record<string, { innovation: number; technical: number; polish: number; impact: number; feedback: string }>>({});

  const getTeamRubric = (teamId: string) => {
    return rubricState[teamId] || {
      innovation: 8,
      technical: 8,
      polish: 8,
      impact: 8,
      feedback: 'Great presentation and clear technical implementation.',
    };
  };

  const updateRubricField = (teamId: string, field: string, value: any) => {
    setRubricState((prev) => ({
      ...prev,
      [teamId]: {
        ...getTeamRubric(teamId),
        [field]: value,
      },
    }));
  };

  const handleScoreSubmit = (team: Team) => {
    const rubric = getTeamRubric(team.id);
    submitJudgeScore(
      team.id,
      currentJudge.id,
      {
        innovation: rubric.innovation,
        technical: rubric.technical,
        polish: rubric.polish,
        impact: rubric.impact,
      },
      rubric.feedback
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            Judge Evaluation Portal
          </h1>
          <p className="text-xs text-slate-400">
            Inline rubric evaluation for assigned finalist teams
          </p>
        </div>

        {/* Persona Selector */}
        <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400">Current Evaluator:</span>
          <select
            value={currentJudge.id}
            onChange={(e) => setActiveJudgeId(e.target.value)}
            className="bg-transparent text-xs font-bold text-emerald-400 focus:outline-none cursor-pointer"
          >
            {judges.map((j) => (
              <option key={j.id} value={j.id} className="bg-slate-900 text-white">
                {j.name} ({j.trackSpecialty})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Evaluator Status Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={currentJudge.avatar}
            alt={currentJudge.name}
            className="w-12 h-12 rounded-xl object-cover border border-slate-700"
          />
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              {currentJudge.name}
              <span className="text-xs text-slate-400 font-normal">({currentJudge.company})</span>
            </h3>
            <p className="text-xs text-emerald-400">
              Room: {currentJudge.roomNumber} • Specialty: {currentJudge.trackSpecialty}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentJudge.status === 'unavailable' ? (
            <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold">
              Marked Unavailable
            </span>
          ) : (
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-lg text-xs font-bold">
              {assignedTeams.length} Assigned Submissions
            </span>
          )}
        </div>
      </div>

      {/* Assigned Submissions with Direct Inline Rubric Scoring */}
      <div className="space-y-4">
        {assignedTeams.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-500 mb-2" />
            No teams assigned to this evaluator currently.
          </div>
        ) : (
          assignedTeams.map((team) => {
            const isScored = team.status === 'scored' && !!team.scores[currentJudge.id];
            const rubric = getTeamRubric(team.id);
            const total = rubric.innovation + rubric.technical + rubric.polish + rubric.impact;

            return (
              <div
                key={team.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4"
              >
                {/* Team Info Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
                        Table #{team.tableNumber}
                      </span>
                      <h3 className="text-base font-bold text-white">{team.name}</h3>
                      <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {team.track}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{team.projectTitle} — {team.tagline}</p>
                  </div>

                  <div>
                    {isScored ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Scored ({team.averageScore?.toFixed(1)}/40)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
                        <Clock className="w-3.5 h-3.5" /> Awaiting Score
                      </span>
                    )}
                  </div>
                </div>

                {/* Direct Inline Rubric Sliders */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400 font-medium">Innovation</span>
                      <span className="font-mono font-bold text-emerald-400">{rubric.innovation}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={rubric.innovation}
                      onChange={(e) => updateRubricField(team.id, 'innovation', Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400 font-medium">Technical</span>
                      <span className="font-mono font-bold text-emerald-400">{rubric.technical}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={rubric.technical}
                      onChange={(e) => updateRubricField(team.id, 'technical', Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400 font-medium">Polish & UX</span>
                      <span className="font-mono font-bold text-emerald-400">{rubric.polish}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={rubric.polish}
                      onChange={(e) => updateRubricField(team.id, 'polish', Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400 font-medium">Impact</span>
                      <span className="font-mono font-bold text-emerald-400">{rubric.impact}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={rubric.impact}
                      onChange={(e) => updateRubricField(team.id, 'impact', Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>

                {/* Feedback Input & Direct Submit */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="text"
                    placeholder="Optional feedback comment for the team..."
                    value={rubric.feedback}
                    onChange={(e) => updateRubricField(team.id, 'feedback', e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 mr-1">Total:</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">{total} / 40</span>
                    </div>

                    <button
                      onClick={() => handleScoreSubmit(team)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isScored ? 'Update Score' : 'Submit Score'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
