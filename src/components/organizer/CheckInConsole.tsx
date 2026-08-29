import React, { useState } from 'react';
import { useEventContext } from '../../context/EventContext';
import { QrCode, CheckCircle2, AlertTriangle, XCircle, Sparkles } from 'lucide-react';

export const CheckInConsole: React.FC = () => {
  const { teams, checkInTeam } = useEventContext();
  const [passInput, setPassInput] = useState('');
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'warning' | 'error';
    text: string;
  } | null>(null);

  const checkedInCount = teams.filter((t) => t.checkedIn).length;
  const totalCount = teams.length;
  const remainingCount = totalCount - checkedInCount;
  const attendanceRate = totalCount > 0 ? Math.round((checkedInCount / totalCount) * 100) : 0;

  // Find first unchecked team for the quick demo helper
  const firstUncheckedTeam = teams.find((t) => !t.checkedIn);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passInput.trim()) {
      setFeedback({ type: 'error', text: 'Please enter a pass code.' });
      return;
    }

    const result = checkInTeam(passInput);
    if (result.success) {
      setFeedback({ type: 'success', text: result.message });
      setPassInput('');
    } else {
      if (result.team?.checkedIn) {
        setFeedback({ type: 'warning', text: result.message });
      } else {
        setFeedback({ type: 'error', text: result.message });
      }
    }
  };

  const handleQuickFill = (code: string) => {
    setPassInput(code);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600/30 to-teal-500/20 border border-emerald-500/30 text-emerald-400 shadow-inner">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Registration & Check-In Console
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                <Sparkles className="w-2.5 h-2.5" />
                QR / Pass Verification Prototype
              </span>
            </div>
            <p className="text-xs text-slate-400">
              In-session registration pass validation and team attendance tracking
            </p>
          </div>
        </div>

        {/* Quick Attendance Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
            {checkedInCount} / {totalCount} Checked In ({attendanceRate}%)
          </span>
        </div>
      </div>

      {/* Check-In Input Form & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Form Panel */}
        <div className="lg:col-span-6 bg-slate-950/80 p-4 rounded-xl border border-slate-800/90 space-y-3">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="pass-code-input" className="text-xs font-bold text-slate-300">
                  Enter Pass Code
                </label>
                {firstUncheckedTeam && (
                  <button
                    type="button"
                    onClick={() => handleQuickFill(firstUncheckedTeam.passCode)}
                    aria-label={`Fill demo pass ${firstUncheckedTeam.passCode} for ${firstUncheckedTeam.name}`}
                    className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    Demo Pass: <span className="font-bold underline">{firstUncheckedTeam.passCode}</span>
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  id="pass-code-input"
                  type="text"
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  placeholder="e.g. TEAM-007"
                  aria-label="Enter Pass Code"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
                <button
                  type="submit"
                  aria-label="Check In pass code"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-emerald-950/50 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 shrink-0"
                >
                  Check In
                </button>
              </div>
            </div>
          </form>

          {/* Feedback Display */}
          <div aria-live="polite" className="min-h-[28px]">
            {feedback && (
              <div
                className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : feedback.type === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />}
                {feedback.type === 'warning' && <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />}
                {feedback.type === 'error' && <XCircle className="w-4 h-4 shrink-0 text-rose-400" />}
                <span>{feedback.text}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Attendance Summary Cards */}
        <div className="lg:col-span-6 grid grid-cols-3 gap-2">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 flex flex-col justify-center text-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Checked In</span>
            <span className="text-lg font-bold font-mono text-emerald-400 mt-0.5">{checkedInCount}</span>
            <span className="text-[10px] text-slate-400">of {totalCount} Expected</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 flex flex-col justify-center text-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Attendance</span>
            <span className="text-lg font-bold font-mono text-white mt-0.5">{attendanceRate}%</span>
            <span className="text-[10px] text-emerald-400">On Target</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 flex flex-col justify-center text-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Remaining</span>
            <span className={`text-lg font-bold font-mono mt-0.5 ${remainingCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {remainingCount}
            </span>
            <span className="text-[10px] text-slate-400">{remainingCount === 0 ? 'All Arrived' : 'Awaiting Check-in'}</span>
          </div>
        </div>

      </div>

      {/* Compact Team Attendance Table / List */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between px-1">
          <span>Finalist Team Check-In Status</span>
          <span className="font-mono text-[10px] text-slate-500">8 Teams Configured</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {teams.map((team) => (
            <div
              key={team.id}
              className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between space-y-1.5 ${
                team.checkedIn
                  ? 'bg-slate-950/60 border-slate-800/80'
                  : 'bg-amber-950/15 border-amber-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-1.5">
                <div>
                  <h4 className="text-xs font-bold text-white truncate max-w-[130px]">{team.name}</h4>
                  <p className="text-[10px] text-slate-400">Table #{team.tableNumber} • {team.track}</p>
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  {team.passCode}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                {team.checkedIn ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Checked In {team.checkedInAt ? `(${team.checkedInAt})` : ''}
                  </span>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Not Arrived
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const res = checkInTeam(team.passCode);
                        setFeedback({ type: 'success', text: res.message });
                      }}
                      aria-label={`Quick Check In for ${team.name}`}
                      className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors cursor-pointer"
                    >
                      Check In
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
