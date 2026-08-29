import React, { useState } from 'react';
import { Applicant, FormedTeam } from '../../types';
import { INITIAL_APPLICANTS } from '../../data/mockData';
import { formBalancedTeams } from '../../utils/teamFormation';
import { Users, Sparkles, CheckCircle2, XCircle, Info, ChevronDown, ChevronUp, Layers, Award } from 'lucide-react';

export const TeamFormationLab: React.FC = () => {
  const [applicants, setApplicants] = useState<Applicant[]>(INITIAL_APPLICANTS);
  const [formedTeams, setFormedTeams] = useState<FormedTeam[] | null>(null);
  const [showLogic, setShowLogic] = useState<boolean>(false);

  const availableCount = applicants.filter((a) => a.available).length;
  const unavailableCount = applicants.length - availableCount;

  // Toggle applicant availability
  const toggleAvailability = (applicantId: string) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === applicantId ? { ...a, available: !a.available } : a))
    );
    // If teams were already formed, clear them so user explicitly regenerates
    if (formedTeams) {
      setFormedTeams(null);
    }
  };

  const handleGenerate = () => {
    const teams = formBalancedTeams(applicants, 3);
    setFormedTeams(teams);
  };

  // Calculate skill distribution in current available pool
  const skillCounts = applicants.filter((a) => a.available).reduce((acc, a) => {
    acc[a.primarySkill] = (acc[a.primarySkill] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600/30 to-indigo-500/20 border border-purple-500/30 text-purple-400 shadow-inner">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Smart Team Formation Lab
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                <Sparkles className="w-2.5 h-2.5" />
                Pre-Event Planning Prototype
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Deterministic skill & interest matching prototype for unteamed applicant cohorts
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-mono self-start sm:self-auto">
          Pool: <span className="text-purple-400 font-bold">{availableCount} Eligible</span> / {applicants.length} Total
        </div>
      </div>

      {/* Scope Disclaimer Banner */}
      <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">Pre-Event Simulation Notice:</strong> This laboratory models automated applicant cohort grouping prior to project kickoff. Formed teams operate independently from the 8 live-event finalist teams evaluated during live judging operations.
        </p>
      </div>

      {/* Applicant Pool Controls & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Pool Summary & Generation CTA */}
        <div className="lg:col-span-5 bg-slate-950/80 p-4 rounded-xl border border-slate-800/90 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Applicant Pool Parameters
            </span>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Available</div>
                <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">{availableCount}</div>
              </div>
              <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Unavailable</div>
                <div className={`text-sm font-bold font-mono mt-0.5 ${unavailableCount > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                  {unavailableCount}
                </div>
              </div>
              <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Target</div>
                <div className="text-sm font-bold font-mono text-purple-400 mt-0.5">3 Teams</div>
              </div>
            </div>

            {/* Skill Distribution Pill List */}
            <div className="pt-2 border-t border-slate-900 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Discipline Breakdown</span>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(skillCounts).map(([skill, count]) => (
                  <span key={skill} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    {skill}: <strong className="text-white">{count}</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            aria-label="Generate Balanced Teams using deterministic matching heuristic"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-950/50 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Balanced Teams</span>
          </button>
        </div>

        {/* Applicant Pool List & Availability Toggles */}
        <div className="lg:col-span-7 bg-slate-950/80 p-4 rounded-xl border border-slate-800/90 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Cohort Applicants (12 Candidates)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Click status to toggle</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {applicants.map((applicant) => (
              <div
                key={applicant.id}
                className={`p-2 rounded-lg border text-xs flex items-center justify-between gap-1.5 transition-all ${
                  applicant.available
                    ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                    : 'bg-slate-950 border-slate-800/60 opacity-60 text-slate-400'
                }`}
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>{applicant.name}</span>
                    <span className="text-[9px] font-mono text-slate-400 font-normal">({applicant.experienceLevel})</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    <span className="text-purple-300 font-semibold">{applicant.primarySkill}</span> • {applicant.trackPreference}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleAvailability(applicant.id)}
                  aria-label={`Toggle availability for ${applicant.name}, currently ${applicant.available ? 'Available' : 'Unavailable'}`}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer shrink-0 ${
                    applicant.available
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                      : 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
                  }`}
                >
                  {applicant.available ? 'Available' : 'Unavailable'}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Generated Teams Output */}
      {formedTeams && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              Generated Formations (3 Balanced Cohorts)
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Deterministic Matching Complete
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {formedTeams.map((team, idx) => (
              <div
                key={team.id}
                className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-1 border-b border-slate-800 pb-2 mb-2.5">
                    <div>
                      <h4 className="text-sm font-bold text-white">{team.name}</h4>
                      <span className="text-[10px] font-mono text-purple-400">Track: {team.dominantTrack}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 shrink-0">
                      {team.skillsCovered.length}/4 Disciplines
                    </span>
                  </div>

                  {/* Member Roster */}
                  <div className="space-y-1.5">
                    {team.members.map((member) => (
                      <div key={member.id} className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold text-slate-200">{member.name}</div>
                          <div className="text-[10px] text-slate-400">{member.trackPreference} ({member.experienceLevel})</div>
                        </div>
                        <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
                          {member.primarySkill}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deterministic Rationale Box */}
                <div className="p-2.5 bg-slate-900/90 rounded-lg border border-purple-500/20 text-[11px] text-slate-300 italic leading-relaxed">
                  "{team.rationale}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expandable Matching Logic Section */}
      <div className="border-t border-slate-800/80 pt-3">
        <button
          type="button"
          onClick={() => setShowLogic(!showLogic)}
          aria-expanded={showLogic}
          aria-label="Toggle explanation of deterministic matching logic"
          className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer py-1"
        >
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            Matching Logic & Heuristic Criteria
          </span>
          {showLogic ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showLogic && (
          <div className="mt-2.5 p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
            <p className="font-bold text-white text-[11px] uppercase tracking-wider">
              Deterministic 5-Step Matching Process:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
              <li><strong className="text-white">Filter Availability:</strong> Exclude any candidates marked unavailable to avoid forming incomplete teams.</li>
              <li><strong className="text-white">Core Discipline Seeding:</strong> Seed initial team slots with diverse primary capabilities (Frontend, Backend, AI/Data, Product/UX).</li>
              <li><strong className="text-white">Greedy Skill Diversity Optimization:</strong> Assign subsequent candidates by awarding maximum heuristic score (+10) to missing discipline coverage.</li>
              <li><strong className="text-white">Track Affinity Resolution:</strong> When skill coverage is equivalent, prioritize placing applicants into their preferred track (+4 bonus).</li>
              <li><strong className="text-white">Team Size Balancing:</strong> Enforce hard capacities so all generated cohorts remain balanced within &plusmn;1 member.</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};
