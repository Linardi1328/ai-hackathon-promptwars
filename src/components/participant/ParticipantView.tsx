import React from 'react';
import { useEventContext } from '../../context/EventContext';
import { Users, CheckCircle2, Hourglass, MapPin } from 'lucide-react';
import { CompactLeaderboard } from '../shared/CompactLeaderboard';

export const ParticipantView: React.FC = () => {
  const { teams, judges, activeTeamId, setActiveTeamId, announcements } = useEventContext();

  const currentTeam = teams.find((t) => t.id === activeTeamId) || teams[0];
  const assignedJudge = judges.find((j) => j.id === currentTeam?.assignedJudgeId);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Persona Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            Participant Live Hub
          </h1>
          <p className="text-xs text-slate-400">
            Event credentials, assigned evaluation room, and real-time announcements
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400">Viewing Team:</span>
          <select
            value={currentTeam.id}
            onChange={(e) => setActiveTeamId(e.target.value)}
            className="bg-transparent text-xs font-bold text-emerald-400 focus:outline-none cursor-pointer"
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                {t.name} (Table #{t.tableNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid: QR Pass + Team Assignment Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Digital QR Pass */}
        <div className="md:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-bold text-white">Digital Hackathon Pass</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> Valid
              </span>
            </div>

            {/* Static QR Code Representation */}
            <div className="flex justify-center my-2">
              <div className="p-3 bg-white rounded-xl shadow-md border border-emerald-500/40">
                <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="5" width="28" height="28" rx="4" fill="#0f172a" />
                  <rect x="9" y="9" width="20" height="20" rx="2" fill="#ffffff" />
                  <rect x="13" y="13" width="12" height="12" rx="1" fill="#0f172a" />
                  <rect x="67" y="5" width="28" height="28" rx="4" fill="#0f172a" />
                  <rect x="71" y="9" width="20" height="20" rx="2" fill="#ffffff" />
                  <rect x="75" y="13" width="12" height="12" rx="1" fill="#0f172a" />
                  <rect x="5" y="67" width="28" height="28" rx="4" fill="#0f172a" />
                  <rect x="9" y="71" width="20" height="20" rx="2" fill="#ffffff" />
                  <rect x="13" y="75" width="12" height="12" rx="1" fill="#0f172a" />
                  <rect x="38" y="10" width="8" height="8" fill="#0f172a" />
                  <rect x="50" y="10" width="8" height="8" fill="#0f172a" />
                  <rect x="38" y="24" width="16" height="8" fill="#0f172a" />
                  <rect x="10" y="38" width="8" height="16" fill="#0f172a" />
                  <rect x="24" y="44" width="16" height="8" fill="#0f172a" />
                  <rect x="46" y="38" width="8" height="8" fill="#0f172a" />
                  <rect x="60" y="38" width="16" height="8" fill="#0f172a" />
                  <rect x="80" y="38" width="10" height="8" fill="#0f172a" />
                  <rect x="38" y="52" width="24" height="8" fill="#0f172a" />
                  <rect x="70" y="52" width="18" height="8" fill="#0f172a" />
                  <rect x="38" y="66" width="8" height="18" fill="#0f172a" />
                  <rect x="52" y="66" width="16" height="8" fill="#0f172a" />
                  <rect x="74" y="66" width="14" height="8" fill="#0f172a" />
                  <circle cx="50" cy="50" r="7" fill="#10b981" />
                </svg>
              </div>
            </div>

            <div className="space-y-1 text-center mt-3">
              <h4 className="text-sm font-bold text-white">{currentTeam.name}</h4>
              <p className="text-xs text-emerald-400 font-mono">Table #{currentTeam.tableNumber}</p>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono text-center pt-3 border-t border-slate-800">
            Pass ID: HACK-{currentTeam.id.toUpperCase()}
          </div>
        </div>

        {/* Team Assignment & Status */}
        <div className="md:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold">Project Details</span>
              <h2 className="text-lg font-bold text-white">{currentTeam.projectTitle}</h2>
              <p className="text-xs text-slate-400">{currentTeam.tagline}</p>
            </div>

            <div>
              {currentTeam.status === 'scored' ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Evaluated ({currentTeam.averageScore?.toFixed(1)}/40)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                  <Hourglass className="w-3.5 h-3.5 text-slate-400" /> Queued for Judging
                </span>
              )}
            </div>
          </div>

          {/* Assigned Evaluator Details */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs font-bold text-slate-300 uppercase mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Assigned Evaluator Room
            </div>

            {assignedJudge ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={assignedJudge.avatar}
                    alt={assignedJudge.name}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{assignedJudge.name}</h4>
                    <p className="text-[11px] text-slate-400">{assignedJudge.company} • {assignedJudge.trackSpecialty}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">
                    {assignedJudge.roomNumber}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-amber-400">Rebalancing assignment in progress...</p>
            )}
          </div>

          {/* Announcements Ticker */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Live Broadcasts</span>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                  <div className="flex justify-between font-bold text-white mb-0.5">
                    <span>{ann.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{ann.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Shared Live Leaderboard */}
      <CompactLeaderboard highlightTeamId={currentTeam.id} />
    </div>
  );
};
