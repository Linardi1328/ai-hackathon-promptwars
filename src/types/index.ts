export type Role = 'organizer' | 'judge' | 'participant';

export type SimulationState = 'healthy' | 'disrupted' | 'recovered';

export type Track = 'AI Agents' | 'Developer Tools';

export type JudgeStatus = 'available' | 'judging' | 'unavailable' | 'overloaded';

export type SubmissionStatus = 'queued' | 'in_review' | 'scored';

export interface CriteriaScore {
  innovation: number;   // 1 - 10
  technical: number;    // 1 - 10
  polish: number;       // 1 - 10
  impact: number;       // 1 - 10
  total: number;        // Max 40
  feedback?: string;
  timestamp?: string;
}

export interface Team {
  id: string;
  name: string;
  projectTitle: string;
  tagline: string;
  track: Track;
  tableNumber: number;
  assignedJudgeId: string;
  originalJudgeId: string; // for tracking reallocations
  status: SubmissionStatus;
  isAffected?: boolean;    // marked true when assigned judge is unavailable
  scores: Record<string, CriteriaScore>; // judgeId -> score
  averageScore?: number;
}

export interface Judge {
  id: string;
  name: string;
  avatar: string;
  title: string;
  company: string;
  trackSpecialty: Track;
  roomNumber: string;
  status: JudgeStatus;
  assignedTeamIds: string[];
  completedCount: number;
  targetCount: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  priority: 'urgent' | 'normal' | 'info';
  targetAudience: 'all' | 'judges' | 'participants';
}

export interface EventHealthMetrics {
  score: number;             // e.g. 96%, 62%, 94%
  status: 'optimal' | 'warning' | 'critical';
  predictedDelayMin: number; // 0, 28, 4
  recoveredMin: number;      // 0, 0, 24
  affectedTeamsCount: number;// 0, 5, 0
  totalTeams: number;
  scoredTeams: number;
  attendanceRate: number;    // 96%
  totalAttendees: number;    // 120
  checkedInAttendees: number;// 115
}

export interface EventContextType {
  // Navigation
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  
  // Personas
  activeJudgeId: string;
  setActiveJudgeId: (id: string) => void;
  activeTeamId: string;
  setActiveTeamId: (id: string) => void;

  // Simulation State Machine
  simulationState: SimulationState;
  simulateDisruption: () => void;
  applyRecoveryPlan: () => void;
  resetSimulation: () => void;

  // Entities
  teams: Team[];
  judges: Judge[];
  announcements: Announcement[];
  eventHealth: EventHealthMetrics;

  // Actions
  submitJudgeScore: (
    teamId: string,
    judgeId: string,
    rubric: { innovation: number; technical: number; polish: number; impact: number },
    feedback: string
  ) => void;
  
  addAnnouncement: (
    title: string,
    content: string,
    priority: 'urgent' | 'normal' | 'info',
    targetAudience: 'all' | 'judges' | 'participants'
  ) => void;
}
