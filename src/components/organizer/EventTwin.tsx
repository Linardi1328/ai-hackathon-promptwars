import React from 'react';
import { DisruptionSelector } from './DisruptionSelector';
import { ImpactPreview } from './ImpactPreview';
import { JudgeWorkloadComparison } from './JudgeWorkloadComparison';
import { RecoveryPlan } from './RecoveryPlan';
import { Cpu } from 'lucide-react';

export const EventTwin: React.FC = () => {
  return (
    <section className="relative rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5 shadow-2xl overflow-hidden">
      {/* Visual accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Centerpiece Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/90 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 font-black">
            <Cpu className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-tight">
                Event Twin • Operational Disruption Simulator
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Core Differentiator
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate operational failures in advance, forecast downstream delays, and apply automated recovery plans.
            </p>
          </div>
        </div>
      </div>

      {/* 2x2 Grid of Simulator Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DisruptionSelector />
        <ImpactPreview />
        <JudgeWorkloadComparison />
        <RecoveryPlan />
      </div>
    </section>
  );
};
