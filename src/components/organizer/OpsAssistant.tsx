import React, { useState } from 'react';
import { useEventContext } from '../../context/EventContext';
import { Bot, AlertTriangle, HelpCircle, FileText, Send, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

type AssistantQuery = 'risk' | 'recovery' | 'announcement';

export const OpsAssistant: React.FC = () => {
  const { simulationState, addAnnouncement } = useEventContext();
  const [activeQuery, setActiveQuery] = useState<AssistantQuery>('risk');
  const [broadcastSent, setBroadcastSent] = useState<boolean>(false);

  // Derive responses deterministically from current simulationState
  const getAssistantResponse = () => {
    switch (simulationState) {
      case 'disrupted':
        return {
          risk: {
            title: 'Critical Disruption Risk Analysis',
            tag: 'High Risk • Immediate Action Needed',
            tagColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
            content: 'Judge 3 (Marcus Vance) is unavailable, stranding 5 finalist teams. This introduces a projected +28 minute schedule overrun, threatening the 17:15 deliberation cutoff and leaderboard finalization.',
            metrics: [
              { label: 'Stranded Teams', value: '5 Teams', color: 'text-rose-400' },
              { label: 'Projected Delay', value: '+28 Mins', color: 'text-amber-400' },
              { label: 'Cutoff Impact', value: 'Overrun Risk', color: 'text-rose-400' },
            ]
          },
          recovery: {
            title: 'Rebalancing Recommendation Rationale',
            tag: 'Optimization Heuristic',
            tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
            content: 'To clear the 5 stranded teams without bottlenecking any single judge, the system recommends redistributing teams across available evaluators by track match: Dr. Sarah Chen (+2 teams), David Kim (+1 team), and Dr. Elena Rostova (+2 teams).',
            metrics: [
              { label: 'Redistributed', value: '5 Teams', color: 'text-emerald-400' },
              { label: 'Remaining Delay', value: '4 Mins', color: 'text-emerald-400' },
              { label: 'Time Saved', value: '24 Mins', color: 'text-emerald-400' },
            ]
          },
          announcement: {
            title: 'Draft: Evaluator Adjustment Notice',
            tag: 'Participant Broadcast Draft',
            tagColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
            subject: 'Schedule Update: Evaluator Assignments Adjusting',
            content: 'Attention teams: Evaluator room assignments are currently being adjusted for Round 1 judging. Please check your dashboard for updated studio assignments. Presentations will resume promptly.',
            priority: 'urgent' as const,
          }
        };
      case 'recovered':
        return {
          risk: {
            title: 'Post-Recovery Operational Assessment',
            tag: 'Stabilized • Low Risk',
            tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
            content: 'The major disruption is resolved. Schedule overrun has been mitigated to only 4 minutes, and event health is restored to 94%. Evaluator workloads are balanced at 2–3 teams per judge.',
            metrics: [
              { label: 'Residual Delay', value: '+4 Mins', color: 'text-emerald-400' },
              { label: 'Event Health', value: '94%', color: 'text-emerald-400' },
              { label: 'Workload Balance', value: 'Optimal (2-3/judge)', color: 'text-emerald-400' },
            ]
          },
          recovery: {
            title: 'Applied Recovery Impact Breakdown',
            tag: 'Recovery Analysis',
            tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
            content: 'By redistributing 5 teams across Judges 1, 2, and 4, the recovery plan recovered 24 minutes of delay, improved event health from 62% to 94%, and protected leaderboard finalization.',
            metrics: [
              { label: 'Delay Reduction', value: '28m → 4m', color: 'text-emerald-400' },
              { label: 'Recovered Time', value: '⚡ 24 Mins', color: 'text-emerald-400' },
              { label: 'Health Restoration', value: '+32% Gain', color: 'text-emerald-400' },
            ]
          },
          announcement: {
            title: 'Draft: Schedule Normalization Update',
            tag: 'Participant Broadcast Draft',
            tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
            subject: 'Notice: Evaluator Assignments Updated',
            content: 'Evaluator room assignments have been updated. Round 1 presentations are underway with minimal schedule delay (~4 min). Please proceed to your assigned evaluation studios.',
            priority: 'normal' as const,
          }
        };
      case 'healthy':
      default:
        return {
          risk: {
            title: 'Nominal Operations Risk Assessment',
            tag: 'Baseline Nominal',
            tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
            content: 'Operations are healthy (96% index, +0 min delay). However, Judge 3 (Marcus Vance) holds the largest queue concentration with 5 of 8 finalist teams assigned to Studio C, representing a single point of failure if availability changes.',
            metrics: [
              { label: 'Current Delay', value: '+0 Mins', color: 'text-emerald-400' },
              { label: 'Evaluators Online', value: '4 / 4', color: 'text-emerald-400' },
              { label: 'Queue Hotspot', value: 'Judge 3 (5 Teams)', color: 'text-amber-400' },
            ]
          },
          recovery: {
            title: 'Recovery Strategy Status',
            tag: 'Standby',
            tagColor: 'bg-slate-800 text-slate-300 border-slate-700',
            content: 'No recovery action is currently required. The judging schedule is running on time (16:30) with all 4 evaluators available and evaluating assigned teams at nominal pace.',
            metrics: [
              { label: 'Recovery Status', value: 'Standby', color: 'text-slate-400' },
              { label: 'Schedule Pace', value: 'On Time', color: 'text-emerald-400' },
              { label: 'Action Required', value: 'None', color: 'text-slate-400' },
            ]
          },
          announcement: {
            title: 'Draft: Nominal Operations Notice',
            tag: 'Participant Broadcast Draft',
            tagColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
            subject: 'Judging Round 1 On Track',
            content: 'Round 1 project judging is operating normally across all studios. Please remain near your assigned tables and monitor the live board for announcements.',
            priority: 'normal' as const,
          }
        };
    }
  };

  const responseData = getAssistantResponse();

  const handleBroadcast = (subject: string, content: string, priority: 'normal' | 'urgent') => {
    addAnnouncement(subject, content, priority, 'all');
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3000);
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
                Context-Aware Assistant
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live situational intelligence & operational drafting derived from Event Twin state
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
          aria-label="Ask assistant: What is the biggest operational risk?"
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
          aria-label="Ask assistant: Why this recovery plan?"
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
          aria-label="Ask assistant: Draft participant update"
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
      <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-800/80 space-y-3">
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

            {/* 1-Click Broadcast Action */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-slate-500">
                Target: <span className="text-slate-300">All Participants & Judges</span>
              </span>

              <button
                onClick={() => handleBroadcast(
                  responseData.announcement.subject,
                  responseData.announcement.content,
                  responseData.announcement.priority
                )}
                disabled={broadcastSent}
                aria-label="Broadcast this generated update to all event participants"
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  broadcastSent
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/50'
                }`}
              >
                {broadcastSent ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Broadcasted to Feed</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Broadcast to Event</span>
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
