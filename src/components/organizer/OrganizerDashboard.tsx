import React from 'react';
import { EventHealth } from './EventHealth';
import { EventTwin } from './EventTwin';
import { OpsAssistant } from './OpsAssistant';
import { CheckInConsole } from './CheckInConsole';
import { TeamFormationLab } from './TeamFormationLab';
import { QuickMetrics } from './QuickMetrics';
import { JudgeStatus } from './JudgeStatus';
import { Announcements } from './Announcements';
import { CompactLeaderboard } from '../shared/CompactLeaderboard';

export const OrganizerDashboard: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* 1. Overall Event Health Index Gauge & Predicted Delay */}
      <EventHealth />

      {/* 2. Centerpiece: Event Twin Disruption Simulator Hub */}
      <EventTwin />

      {/* 3. Event Twin Context-Aware Ops Assistant */}
      <OpsAssistant />

      {/* 4. Registration & Check-In Console */}
      <CheckInConsole />

      {/* 5. Pre-Event Smart Team Formation Lab */}
      <TeamFormationLab />

      {/* 6. Quick Metrics Bar */}
      <QuickMetrics />

      {/* 7. Judge Status Grid */}
      <JudgeStatus />

      {/* 8. Announcements & Live Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4">
          <Announcements />
        </div>
        <div className="lg:col-span-8">
          <CompactLeaderboard />
        </div>
      </div>
    </div>
  );
};
