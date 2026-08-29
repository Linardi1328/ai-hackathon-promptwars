import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { EventProvider, useEventContext } from '../context/EventContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <EventProvider>{children}</EventProvider>
);

describe('Event Twin Simulation State Transitions', () => {
  it('1. Initializes in Healthy state with 96% health and 0 min delay', () => {
    const { result } = renderHook(() => useEventContext(), { wrapper });

    expect(result.current.simulationState).toBe('healthy');
    expect(result.current.eventHealth.score).toBe(96);
    expect(result.current.eventHealth.predictedDelayMin).toBe(0);
    expect(result.current.eventHealth.recoveredMin).toBe(0);
    expect(result.current.eventHealth.affectedTeamsCount).toBe(0);

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

    // Verify team redistribution:
    // J1 gets team-1, team-2, team-4 (3 teams)
    // J2 gets team-3, team-5 (2 teams)
    // J3 gets 0 teams
    // J4 gets team-8, team-6, team-7 (3 teams)
    const judge1 = result.current.judges.find((j) => j.id === 'judge-1');
    const judge2 = result.current.judges.find((j) => j.id === 'judge-2');
    const judge3 = result.current.judges.find((j) => j.id === 'judge-3');
    const judge4 = result.current.judges.find((j) => j.id === 'judge-4');

    expect(judge1?.assignedTeamIds).toEqual(['team-1', 'team-2', 'team-4']);
    expect(judge2?.assignedTeamIds).toEqual(['team-3', 'team-5']);
    expect(judge3?.assignedTeamIds).toEqual([]);
    expect(judge4?.assignedTeamIds).toEqual(['team-8', 'team-6', 'team-7']);

    // Check all 8 teams have isAffected = false
    const affectedTeams = result.current.teams.filter((t) => t.isAffected);
    expect(affectedTeams).toHaveLength(0);
  });

  it('4. Reset restores baseline assignments while PRESERVING judge scores and manual announcements', () => {
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
    expect(scoredTeam?.scores['judge-1']?.feedback).toBe('Outstanding real-time demo!');

    // Preserved manual announcement
    const manualAnnouncement = result.current.announcements.find(
      (a) => a.title === 'Main Stage Lighting Check'
    );
    expect(manualAnnouncement).toBeDefined();
    expect(manualAnnouncement?.content).toBe('Audio-visual crew conducting 5-min test on stage.');
  });
});
