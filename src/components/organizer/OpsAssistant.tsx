import React, { useState } from 'react';
import { useEventContext } from '../../context/EventContext';
import { Bot, AlertTriangle, HelpCircle, FileText, Send, CheckCircle2, Sparkles } from 'lucide-react';

type AssistantQuery = 'risk' | 'recovery' | 'announcement';

export const OpsAssistant: React.FC = () => {
  const { simulationState, eventHealth, judges, teams, addAnnouncement } = useEventContext();
  const [activeQuery, setActiveQuery] = useState<AssistantQuery>('risk');
  const [announcementPosted, setAnnouncementPosted] = useState<boolean>(false);

  // Derive dynamic state metrics from EventContext
  const availableJudgesCount = judges.filter((j) => j.status === 'available').length;
  const totalJudgesCount = judges.length;
  const affectedTeamsCount = eventHealth.affectedTeamsCount || teams.filter((t) => t.isAffected).length;
  const healthScore = eventHealth.score;
  const delayMin = eventHealth.predictedDelayMin;
  const recoveredMin = eventHealth.recoveredMin;
  const judge3 = judges.find((j) => j.id === 'judge-3');

  // Derive responses deterministically based on EventContext state
  const getAssistantResponse = () => {
    switch (simulationState) {
      case 'disrupted': {
        return {
          risk: {
            title: 'Current Risk',
            tag: `Critical • ${healthScore}% Health`,
            tagColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
            content: `Judge 3 is unavailable, affecting ${affectedTeamsCount} teams and creating a projected ${delayMin}-minute delay.`,
            metrics: [
              { label: 'Affected Teams', value: `${affectedTeamsCount} Teams`, color: 'text-rose-400' },
              { label: 'Projected Delay', value: `+${delayMin} Mins`, color: 'text-amber-400' },
              { label: 'Event Health', value: `${healthScore}%`, color: 'text-rose-400' },
            ],
          },
          recovery: {
            title: 'Why This Recovery?',
            tag: 'Queue Redistribution',
            tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
            content: `The recovery plan spreads the ${affectedTeamsCount} stranded teams across Judges 1, 2, and 4 to remove the bottleneck and recover schedule delay.`,
            metrics: [
              { label: 'Judge 1 (Chen)', value: '+2 Teams', color: 'text-emerald-400' },
              { label: 'Judge 2 (Kim)', value: '+1 Team', color: 'text-emerald-400' },
              { label: 'Judge 4 (Rostova)', value: '+2 Teams', color: 'text-emerald-400' },
            ],
          },
          announcement: {
            title: 'Participant Update',
            tag: 'Schedule Notice',
            tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
            subject: 'Schedule Adjustment: Evaluator Reassignments',
            content: 'Evaluator room assignments are currently being adjusted for Round 1. Affected teams will receive updated assignments on their dashboard.',
            priority: 'urgent' as const,
          },
        };
      }
      case 'recovered':
        return {
          risk: {
            title: 'Current Risk',
            tag: `Mitigated • ${healthScore}% Health`,
            tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
            content: `All 5 affected teams have been reassigned. Only ${delayMin} minutes of projected delay remains.`,
            metrics: [
              { label: 'Projected Delay', value: `${delayMin} Mins`, color: 'text-emerald-400' },
              { label: 'Event Health', value: `${healthScore}% (Restored)`, color: 'text-emerald-400' },
              { label: 'Reassigned Teams', value: '5 / 5 Covered', color: 'text-emerald-400' },
            ],
          },
          recovery: {
            title: 'Why This Recovery?',
            tag: 'Payoff Summary',
            tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
            content: `Redistributing the 5 teams reduced delay from 28 to ${delayMin} minutes (${recoveredMin} minutes recovered) and restored event health to ${healthScore}%.`,
            metrics: [
              { label: 'Delay Reduction', value: `28m → ${delayMin}m`, color: 'text-emerald-400' },
              { label: 'Time Recovered', value: `⚡ ${recoveredMin} Mins`, color: 'text-emerald-400' },
              { label: 'Health Delta', value: '+32% Gain', color: 'text-emerald-400' },
            ],
          },
          announcement: {
            title: 'Participant Update',
            tag: 'Resumed Notice',
            tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
            subject: 'Judging Resumed: Evaluator Assignments Updated',
            content: `Evaluator assignments have been updated and affected teams have been reassigned. Projected delay is now approximately ${delayMin} minutes.`,
            priority: 'normal' as const,
          },
        };
      case 'healthy':
      default: {
        const j3Count = judge3?.assignedTeamIds.length ?? 5;
        return {
          risk: {
            title: 'Current Risk',
            tag: `Nominal • ${healthScore}% Health`,
            tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
            content: `Operations are healthy. Judge 3 currently holds the largest queue with ${j3Count} teams, making evaluator availability the main operational risk.`,
            metrics: [
              { label: 'Projected Delay', value: `${delayMin} Mins`, color: 'text-emerald-400' },
              { label: 'Available Judges', value: `${availableJudgesCount} / ${totalJudgesCount} Online`, color: 'text-emerald-400' },
              { label: 'Queue Exposure', value: `Judge 3 (${j3Count} Teams)`, color: 'text-amber-400' },
            ],
          },
          recovery: {
            title: 'Why This Recovery?',
            tag: 'Standby',
            tagColor: 'bg-slate-800 text-slate-300 border-slate-700',
            content: 'No recovery action is required while event operations are healthy.',
            metrics: [
              { label: 'Recovery Status', value: 'Standby', color: 'text-slate-400' },
              { label: 'Schedule Pace', value: 'On Time', color: 'text-emerald-400' },
              { label: 'Action Required', value: 'None', color: 'text-slate-400' },
            ],
          },
          announcement: {
            title: 'Participant Update',
            tag: 'Routine Notice',
            tagColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
            subject: 'Judging Schedule On Track',
            content: 'Judging is operating normally across all evaluation rooms. Please monitor announcements for any schedule updates.',
            priority: 'normal' as const,
          },
        };
      }
    }
  };

  const responseData = getAssistantResponse();

  const handlePostAnnouncement = (subject: string, content: string, priority: 'normal' | 'urgent') => {
    addAnnouncement(subject, content, priority, 'all');
    setAnnouncementPosted(true);
    setTimeout(() => setAnnouncementPosted(false), 3000);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600/30 to-teal-500/20 border border-emerald-500/30 text-emerald-400 shadow-inner">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Event Twin Ops Assistant
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                <Sparkles className="w-2.5 h-2.5" />
                Ops Assistant
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Context-aware operational analysis derived from current Event Twin state
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-mono self-start sm:self-auto">
          State: <span className="text-emerald-400 font-bold uppercase">{simulationState}</span>
        </div>
      </div>

      {/* 3 Compact Quick Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="group" aria-label="Ops Assistant Queries">
        <button
          onClick={() => setActiveQuery('risk')}
          aria-pressed={activeQuery === 'risk'}
          aria-label="What is the biggest risk?"
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
            activeQuery === 'risk'
              ? 'bg-slate-800 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-950/40'
              : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-slate-800'
          }`}
        >
          <AlertTriangle className={`w-3.5 h-3.5 ${activeQuery === 'risk' ? 'text-amber-400' : 'text-slate-400'}`} />
          <span>What is the biggest risk?</span>
        </button>

        <button
          onClick={() => setActiveQuery('recovery')}
          aria-pressed={activeQuery === 'recovery'}
          aria-label="Why this recovery plan?"
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
            activeQuery === 'recovery'
              ? 'bg-slate-800 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-950/40'
              : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-slate-800'
          }`}
        >
          <HelpCircle className={`w-3.5 h-3.5 ${activeQuery === 'recovery' ? 'text-emerald-400' : 'text-slate-400'}`} />
          <span>Why this recovery plan?</span>
        </button>

        <button
          onClick={() => setActiveQuery('announcement')}
          aria-pressed={activeQuery === 'announcement'}
          aria-label="Draft participant update"
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
            activeQuery === 'announcement'
              ? 'bg-slate-800 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-950/40'
              : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-slate-800'
          }`}
        >
          <FileText className={`w-3.5 h-3.5 ${activeQuery === 'announcement' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <span>Draft participant update</span>
        </button>
      </div>

      {/* Query Response Content Card */}
      <div 
        className="bg-slate-950/90 rounded-xl p-4 border border-slate-800/80 space-y-3"
        aria-live="polite"
      >
        {activeQuery === 'risk' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                {responseData.risk.title}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${responseData.risk.tagColor}`}>
                {responseData.risk.tag}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {responseData.risk.content}
            </p>

            {responseData.risk.metrics && (
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-900">
                {responseData.risk.metrics.map((m, idx) => (
                  <div key={idx} className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/60 text-center">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{m.label}</div>
                    <div className={`text-xs font-bold font-mono mt-0.5 ${m.color}`}>{m.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeQuery === 'recovery' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                {responseData.recovery.title}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${responseData.recovery.tagColor}`}>
                {responseData.recovery.tag}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {responseData.recovery.content}
            </p>

            {responseData.recovery.metrics && (
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-900">
                {responseData.recovery.metrics.map((m, idx) => (
                  <div key={idx} className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/60 text-center">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{m.label}</div>
                    <div className={`text-xs font-bold font-mono mt-0.5 ${m.color}`}>{m.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeQuery === 'announcement' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                {responseData.announcement.title}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${responseData.announcement.tagColor}`}>
                {responseData.announcement.tag}
              </span>
            </div>

            {/* Formatted Draft Box */}
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5">
              <div className="text-xs font-bold text-slate-200">
                Subject: <span className="text-emerald-400">{responseData.announcement.subject}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                "{responseData.announcement.content}"
              </p>
            </div>

            {/* Post Announcement Action */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-slate-500">
                Target: <span className="text-slate-300">All Participants & Judges</span>
              </span>

              <button
                onClick={() => handlePostAnnouncement(
                  responseData.announcement.subject,
                  responseData.announcement.content,
                  responseData.announcement.priority
                )}
                disabled={announcementPosted}
                aria-label="Post Announcement to all event participants"
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  announcementPosted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/50'
                }`}
              >
                {announcementPosted ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Announcement Posted</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Announcement</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
