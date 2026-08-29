import React from 'react';
import { useEventContext } from '../../context/EventContext';
import { Users, Award, CheckCircle2, Clock } from 'lucide-react';

export const QuickMetrics: React.FC = () => {
  const { eventHealth, teams } = useEventContext();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Attendance</div>
          <div className="text-xl font-bold font-mono text-white mt-0.5">
            {eventHealth.checkedInAttendees} / {eventHealth.totalAttendees}
          </div>
          <div className="text-[10px] text-emerald-400 font-medium">{eventHealth.attendanceRate}% checked in</div>
        </div>
        <div className="p-2 rounded-lg bg-slate-800 text-blue-400">
          <Users className="w-4 h-4" />
        </div>
      </div>

      <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Active Teams</div>
          <div className="text-xl font-bold font-mono text-white mt-0.5">
            {teams.length} Teams
          </div>
          <div className="text-[10px] text-slate-400">Tables 1 - 8 occupied</div>
        </div>
        <div className="p-2 rounded-lg bg-slate-800 text-purple-400">
          <Award className="w-4 h-4" />
        </div>
      </div>

      <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Evaluated</div>
          <div className="text-xl font-bold font-mono text-white mt-0.5">
            {eventHealth.scoredTeams} / {eventHealth.totalTeams}
          </div>
          <div className="text-[10px] text-emerald-400 font-medium">
            {Math.round((eventHealth.scoredTeams / eventHealth.totalTeams) * 100)}% complete
          </div>
        </div>
        <div className="p-2 rounded-lg bg-slate-800 text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      </div>

      <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Session Pace</div>
          <div className="text-xl font-bold font-mono text-white mt-0.5">
            ~8 min
          </div>
          <div className="text-[10px] text-slate-400">Target per presentation</div>
        </div>
        <div className="p-2 rounded-lg bg-slate-800 text-amber-400">
          <Clock className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
