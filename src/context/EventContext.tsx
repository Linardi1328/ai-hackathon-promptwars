import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  Role,
  SimulationState,
  Team,
  Judge,
  Announcement,
  EventHealthMetrics,
  EventContextType,
} from '../types';
import {
  INITIAL_JUDGES,
  INITIAL_TEAMS,
  INITIAL_ANNOUNCEMENTS,
} from '../data/mockData';

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<Role>('organizer');
  const [activeJudgeId, setActiveJudgeId] = useState<string>('judge-1');
  const [activeTeamId, setActiveTeamId] = useState<string>('team-1');

  const [simulationState, setSimulationState] = useState<SimulationState>('healthy');
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [judges, setJudges] = useState<Judge[]>(INITIAL_JUDGES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);

  // Dynamic Event Health Metrics based on simulation state and scoring
  const eventHealth = useMemo<EventHealthMetrics>(() => {
    const scoredCount = teams.filter((t) => t.status === 'scored').length;
    const total = teams.length;

    if (simulationState === 'disrupted') {
      return {
        score: 62,
        status: 'warning',
        predictedDelayMin: 28,
        recoveredMin: 0,
        affectedTeamsCount: 5,
        totalTeams: total,
        scoredTeams: scoredCount,
        attendanceRate: 96,
        totalAttendees: 120,
        checkedInAttendees: 115,
      };
    }

    if (simulationState === 'recovered') {
      return {
        score: 94,
        status: 'optimal',
        predictedDelayMin: 4,
        recoveredMin: 24,
        affectedTeamsCount: 0,
        totalTeams: total,
        scoredTeams: scoredCount,
        attendanceRate: 96,
        totalAttendees: 120,
        checkedInAttendees: 115,
      };
    }

    // Default: Healthy Baseline
    return {
      score: 96,
      status: 'optimal',
      predictedDelayMin: 0,
      recoveredMin: 0,
      affectedTeamsCount: 0,
      totalTeams: total,
      scoredTeams: scoredCount,
      attendanceRate: 96,
      totalAttendees: 120,
      checkedInAttendees: 115,
    };
  }, [simulationState, teams]);

  // Simulation: Trigger Judge 3 unavailable
  const simulateDisruption = () => {
    setSimulationState('disrupted');

    // Mark Judge 3 unavailable and others overloaded
    setJudges((prev) =>
      prev.map((judge) => {
        if (judge.id === 'judge-3') {
          return { ...judge, status: 'unavailable' };
        }
        return { ...judge, status: 'overloaded' };
      })
    );

    // Mark 5 teams assigned to Judge 3 as affected
    setTeams((prev) =>
      prev.map((team) => {
        if (team.assignedJudgeId === 'judge-3') {
          return { ...team, isAffected: true };
        }
        return team;
      })
    );

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const alertAnn: Announcement = {
      id: `ann-disrupt-${Date.now()}`,
      title: 'Disruption Detected: Judge Marcus Vance Unavailable',
      content: '5 teams are currently unassigned (+28m delay projected). Event Twin recovery plan is recommended.',
      timestamp: timeStr,
      priority: 'urgent',
      targetAudience: 'all',
    };
    setAnnouncements((prev) => [alertAnn, ...prev]);
  };

  // Simulation: Apply Recovery Plan
  const applyRecoveryPlan = () => {
    setSimulationState('recovered');

    // Reallocate teams:
    // Judge 1 gets team-2, team-4 (Total: team-1, team-2, team-4 = 3 teams)
    // Judge 2 gets team-5 (Total: team-3, team-5 = 2 teams)
    // Judge 3 gets [] (0 teams)
    // Judge 4 gets team-6, team-7 (Total: team-8, team-6, team-7 = 3 teams)
    setJudges((prev) =>
      prev.map((judge) => {
        if (judge.id === 'judge-1') {
          return {
            ...judge,
            status: 'available',
            assignedTeamIds: ['team-1', 'team-2', 'team-4'],
            targetCount: 3,
          };
        }
        if (judge.id === 'judge-2') {
          return {
            ...judge,
            status: 'available',
            assignedTeamIds: ['team-3', 'team-5'],
            targetCount: 2,
          };
        }
        if (judge.id === 'judge-3') {
          return {
            ...judge,
            status: 'unavailable',
            assignedTeamIds: [],
            targetCount: 0,
          };
        }
        if (judge.id === 'judge-4') {
          return {
            ...judge,
            status: 'available',
            assignedTeamIds: ['team-8', 'team-6', 'team-7'],
            targetCount: 3,
          };
        }
        return judge;
      })
    );

    // Update team assignments
    setTeams((prev) =>
      prev.map((team) => {
        let newJudgeId = team.assignedJudgeId;
        if (team.id === 'team-2' || team.id === 'team-4') newJudgeId = 'judge-1';
        if (team.id === 'team-5') newJudgeId = 'judge-2';
        if (team.id === 'team-6' || team.id === 'team-7') newJudgeId = 'judge-4';

        return {
          ...team,
          assignedJudgeId: newJudgeId,
          isAffected: false,
        };
      })
    );

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const recoveryAnn: Announcement = {
      id: `ann-recover-${Date.now()}`,
      title: 'Recovery Plan Applied: Teams Rebalanced',
      content: '5 affected teams redistributed across Judges 1, 2, and 4. Predicted delay reduced to 4 mins (24 mins recovered).',
      timestamp: timeStr,
      priority: 'normal',
      targetAudience: 'all',
    };
    setAnnouncements((prev) => [recoveryAnn, ...prev]);
  };

  // Simulation: Reset (Restores only disruption state; preserves judge scores & manual announcements)
  const resetSimulation = () => {
    setSimulationState('healthy');

    // Restore judge availability and original assignments while preserving completed score counts
    setJudges((prev) =>
      prev.map((judge) => {
        const initial = INITIAL_JUDGES.find((j) => j.id === judge.id);
        return {
          ...judge,
          status: 'available',
          assignedTeamIds: initial ? initial.assignedTeamIds : judge.assignedTeamIds,
          targetCount: initial ? initial.targetCount : judge.targetCount,
        };
      })
    );

    // Restore team assignedJudgeId to originalJudgeId, clear isAffected, while PRESERVING existing scores & status
    setTeams((prev) =>
      prev.map((team) => ({
        ...team,
        assignedJudgeId: team.originalJudgeId,
        isAffected: false,
      }))
    );

    // Remove only auto-generated disruption/recovery announcements; keep initial and manually posted announcements
    setAnnouncements((prev) =>
      prev.filter((ann) => !ann.id.startsWith('ann-disrupt-') && !ann.id.startsWith('ann-recover-'))
    );
  };

  // Judge scoring
  const submitJudgeScore = (
    teamId: string,
    judgeId: string,
    rubric: { innovation: number; technical: number; polish: number; impact: number },
    feedback: string
  ) => {
    const totalScore = rubric.innovation + rubric.technical + rubric.polish + rubric.impact;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setTeams((prev) =>
      prev.map((team) => {
        if (team.id !== teamId) return team;
        const updatedScores = {
          ...team.scores,
          [judgeId]: {
            ...rubric,
            total: totalScore,
            feedback,
            timestamp: timeStr,
          },
        };
        const scoreValues = Object.values(updatedScores);
        const avg = scoreValues.reduce((acc, curr) => acc + curr.total, 0) / scoreValues.length;

        return {
          ...team,
          scores: updatedScores,
          averageScore: Math.round(avg * 10) / 10,
          status: 'scored',
        };
      })
    );

    setJudges((prev) =>
      prev.map((judge) => {
        if (judge.id !== judgeId) return judge;
        return {
          ...judge,
          completedCount: judge.completedCount + 1,
        };
      })
    );
  };

  const addAnnouncement = (
    title: string,
    content: string,
    priority: 'urgent' | 'normal' | 'info',
    targetAudience: 'all' | 'judges' | 'participants'
  ) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      timestamp: timeStr,
      priority,
      targetAudience,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  return (
    <EventContext.Provider
      value={{
        activeRole,
        setActiveRole,
        activeJudgeId,
        setActiveJudgeId,
        activeTeamId,
        setActiveTeamId,
        simulationState,
        simulateDisruption,
        applyRecoveryPlan,
        resetSimulation,
        teams,
        judges,
        announcements,
        eventHealth,
        submitJudgeScore,
        addAnnouncement,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};
