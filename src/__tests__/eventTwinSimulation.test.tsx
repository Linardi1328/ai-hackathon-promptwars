import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, renderHook, act, fireEvent } from '@testing-library/react';
import { EventProvider, useEventContext } from '../context/EventContext';
import { OpsAssistant } from '../components/organizer/OpsAssistant';
import { CheckInConsole } from '../components/organizer/CheckInConsole';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <EventProvider>{children}</EventProvider>
);

// Test harness that includes simulator controls alongside OpsAssistant
const OpsAssistantTestHarness: React.FC = () => {
  const { simulateDisruption, applyRecoveryPlan } = useEventContext();
  return (
    <div>
      <button onClick={simulateDisruption}>Trigger Disruption</button>
      <button onClick={applyRecoveryPlan}>Apply Recovery</button>
      <OpsAssistant />
    </div>
  );
};

describe('Event Twin Simulation State Transitions, Ops Assistant & Check-In', () => {
  it('1. Initializes in Healthy state with 96% health, 0 min delay, and 6/8 initial check-ins', () => {
    const { result } = renderHook(() => useEventContext(), { wrapper });

    expect(result.current.simulationState).toBe('healthy');
    expect(result.current.eventHealth.score).toBe(96);
    expect(result.current.eventHealth.predictedDelayMin).toBe(0);
    expect(result.current.eventHealth.recoveredMin).toBe(0);
    expect(result.current.eventHealth.affectedTeamsCount).toBe(0);
    expect(result.current.eventHealth.checkedInAttendees).toBe(6);
    expect(result.current.eventHealth.totalAttendees).toBe(8);
    expect(result.current.eventHealth.attendanceRate).toBe(75);

    // Initial judge assignments (J1: 1, J2: 1, J3: 5, J4: 1)
    const judge1 = result.current.judges.find((j) => j.id === 'judge-1');
    const judge2 = result.current.judges.find((j) => j.id === 'judge-2');
    const judge3 = result.current.judges.find((j) => j.id === 'judge-3');
    const judge4 = result.current.judges.find((j) => j.id === 'judge-4');

    expect(judge1?.assignedTeamIds).toEqual(['team-1']);
    expect(judge2?.assignedTeamIds).toEqual(['team-3']);
    expect(judge3?.assignedTeamIds).toEqual(['team-2', 'team-4', 'team-5', 'team-6', 'team-7']);
    expect(judge4?.assignedTeamIds).toEqual(['team-8']);
  });

  it('2. Transitions to Disrupted state: 62% health, 28 min delay, 5 affected teams', () => {
    const { result } = renderHook(() => useEventContext(), { wrapper });

    act(() => {
      result.current.simulateDisruption();
    });

    expect(result.current.simulationState).toBe('disrupted');
    expect(result.current.eventHealth.score).toBe(62);
    expect(result.current.eventHealth.predictedDelayMin).toBe(28);
    expect(result.current.eventHealth.affectedTeamsCount).toBe(5);

    // Judge 3 is marked unavailable, others overloaded
    const judge3 = result.current.judges.find((j) => j.id === 'judge-3');
    expect(judge3?.status).toBe('unavailable');

    const affectedTeams = result.current.teams.filter((t) => t.isAffected);
    expect(affectedTeams).toHaveLength(5);
    expect(affectedTeams.map((t) => t.id)).toEqual(['team-2', 'team-4', 'team-5', 'team-6', 'team-7']);
  });

  it('3. Transitions to Recovered state: 94% health, 4 min delay, 24 min recovered, rebalanced teams', () => {
    const { result } = renderHook(() => useEventContext(), { wrapper });

    act(() => {
      result.current.simulateDisruption();
    });

    act(() => {
      result.current.applyRecoveryPlan();
    });

    expect(result.current.simulationState).toBe('recovered');
    expect(result.current.eventHealth.score).toBe(94);
    expect(result.current.eventHealth.predictedDelayMin).toBe(4);
    expect(result.current.eventHealth.recoveredMin).toBe(24);
    expect(result.current.eventHealth.affectedTeamsCount).toBe(0);

    const judge1 = result.current.judges.find((j) => j.id === 'judge-1');
    const judge2 = result.current.judges.find((j) => j.id === 'judge-2');
    const judge3 = result.current.judges.find((j) => j.id === 'judge-3');
    const judge4 = result.current.judges.find((j) => j.id === 'judge-4');

    expect(judge1?.assignedTeamIds).toEqual(['team-1', 'team-2', 'team-4']);
    expect(judge2?.assignedTeamIds).toEqual(['team-3', 'team-5']);
    expect(judge3?.assignedTeamIds).toEqual([]);
    expect(judge4?.assignedTeamIds).toEqual(['team-8', 'team-6', 'team-7']);

    const affectedTeams = result.current.teams.filter((t) => t.isAffected);
    expect(affectedTeams).toHaveLength(0);
  });

  it('4. Reset restores baseline assignments while PRESERVING judge scores, manual announcements, and check-in state', () => {
    const { result } = renderHook(() => useEventContext(), { wrapper });

    // Score a submission as Judge 1
    act(() => {
      result.current.submitJudgeScore(
        'team-1',
        'judge-1',
        { innovation: 9, technical: 9, polish: 8, impact: 9 },
        'Outstanding real-time demo!'
      );
    });

    // Check in Team 7 (ShieldOps)
    act(() => {
      result.current.checkInTeam('TEAM-007');
    });

    // Add a manual organizer announcement
    act(() => {
      result.current.addAnnouncement(
        'Main Stage Lighting Check',
        'Audio-visual crew conducting 5-min test on stage.',
        'normal',
        'all'
      );
    });

    // Cycle through simulation disruption & recovery
    act(() => {
      result.current.simulateDisruption();
    });
    act(() => {
      result.current.applyRecoveryPlan();
    });

    // Now reset simulation
    act(() => {
      result.current.resetSimulation();
    });

    // State returns to healthy baseline
    expect(result.current.simulationState).toBe('healthy');
    expect(result.current.eventHealth.score).toBe(96);
    expect(result.current.eventHealth.predictedDelayMin).toBe(0);

    // Initial assignments restored
    const judge3 = result.current.judges.find((j) => j.id === 'judge-3');
    expect(judge3?.status).toBe('available');
    expect(judge3?.assignedTeamIds).toEqual(['team-2', 'team-4', 'team-5', 'team-6', 'team-7']);

    // Preserved score for team-1
    const scoredTeam = result.current.teams.find((t) => t.id === 'team-1');
    expect(scoredTeam?.status).toBe('scored');
    expect(scoredTeam?.averageScore).toBe(35);

    // Preserved check-in state for team-7
    const team7 = result.current.teams.find((t) => t.id === 'team-7');
    expect(team7?.checkedIn).toBe(true);
    expect(result.current.eventHealth.checkedInAttendees).toBe(7);

    // Preserved manual announcement
    const manualAnnouncement = result.current.announcements.find(
      (a) => a.title === 'Main Stage Lighting Check'
    );
    expect(manualAnnouncement).toBeDefined();
  });

  it('5. Interactive Check-In: valid pass, duplicate prevention, and invalid pass handling', () => {
    const { result } = renderHook(() => useEventContext(), { wrapper });

    // Initial check-in count is 6
    expect(result.current.eventHealth.checkedInAttendees).toBe(6);

    // 1. Valid Check-In: Check in Team 7 (TEAM-007)
    let res1: any;
    act(() => {
      res1 = result.current.checkInTeam('  team-007  ');
    });
    expect(res1.success).toBe(true);
    expect(res1.message).toContain('ShieldOps');
    expect(result.current.eventHealth.checkedInAttendees).toBe(7);
    expect(result.current.eventHealth.attendanceRate).toBe(88);

    const team7 = result.current.teams.find((t) => t.id === 'team-7');
    expect(team7?.checkedIn).toBe(true);
    expect(team7?.checkedInAt).toBeDefined();

    // 2. Duplicate Check-In Prevention: Try checking in TEAM-007 again
    let res2: any;
    act(() => {
      res2 = result.current.checkInTeam('TEAM-007');
    });
    expect(res2.success).toBe(false);
    expect(res2.message).toContain('already checked in');
    expect(result.current.eventHealth.checkedInAttendees).toBe(7); // Unchanged

    // 3. Invalid Pass Code Handling: Try non-existent code
    let res3: any;
    act(() => {
      res3 = result.current.checkInTeam('INVALID-999');
    });
    expect(res3.success).toBe(false);
    expect(res3.message).toContain('Invalid pass code');
    expect(result.current.eventHealth.checkedInAttendees).toBe(7); // Unchanged
  });

  it('6. OpsAssistant dynamically reflects state across Healthy -> Disrupted -> Recovered lifecycle', () => {
    const { container } = render(
      <EventProvider>
        <OpsAssistantTestHarness />
      </EventProvider>
    );

    // 1. Healthy State
    expect(container.textContent).toContain('96% Health');
    expect(container.textContent).toContain('0 Mins');
    expect(container.textContent).toContain('Judge 3 (Marcus Vance) currently carries the largest queue concentration with 5 teams');

    // 2. Trigger Disruption
    const triggerBtn = screen.getByText('Trigger Disruption');
    act(() => {
      fireEvent.click(triggerBtn);
    });

    expect(container.textContent).toContain('62% Health');
    expect(container.textContent).toContain('+28 Mins');
    expect(container.textContent).toContain('5 affected teams stranded');

    // 3. Apply Recovery
    const recoveryBtn = screen.getByText('Apply Recovery');
    act(() => {
      fireEvent.click(recoveryBtn);
    });

    expect(container.textContent).toContain('94% Health');
    expect(container.textContent).toContain('4 Mins');
    expect(container.textContent).toContain('The primary disruption has been resolved');

    // Switch query tab to "Why this recovery plan?"
    const whyRecoveryBtn = screen.getByLabelText('Why this recovery plan?');
    act(() => {
      fireEvent.click(whyRecoveryBtn);
    });

    expect(container.textContent).toContain('24 minutes recovered');
  });
});
