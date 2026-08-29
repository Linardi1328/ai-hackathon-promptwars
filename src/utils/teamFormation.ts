import { Applicant, ApplicantSkill, FormedTeam, Track } from '../types';

const TEAM_NAMES = ['Team Nexus', 'Team CyberPulse', 'Team VertexAI', 'Team QuantumForge', 'Team Helix'];

/**
 * Deterministic Team Formation Heuristic
 * 
 * Priority hierarchy:
 * 1. Skill Diversity: Maximize unique primary skills per team (Frontend, Backend, AI / Data, Product / UX)
 * 2. Track Affinity: Align member track interests (AI Agents vs Developer Tools)
 * 3. Experience Balance: Distribute Senior / Mid / Junior experience
 * 4. Size Balance: Keep team sizes within ±1 participant
 */
export function formBalancedTeams(
  applicants: Applicant[],
  targetTeamCount: number = 3
): FormedTeam[] {
  // 1. Exclude unavailable applicants
  const eligibleApplicants = applicants.filter((a) => a.available);
  if (eligibleApplicants.length === 0) {
    return [];
  }

  // Initialize empty teams
  const teams: {
    id: string;
    name: string;
    members: Applicant[];
    dominantTrack: Track;
  }[] = Array.from({ length: targetTeamCount }, (_, idx) => ({
    id: `formed-team-${idx + 1}`,
    name: TEAM_NAMES[idx % TEAM_NAMES.length] || `Team ${idx + 1}`,
    members: [],
    dominantTrack: idx % 2 === 0 ? 'AI Agents' : 'Developer Tools',
  }));

  // Calculate target capacity per team
  const baseSize = Math.floor(eligibleApplicants.length / targetTeamCount);
  const remainder = eligibleApplicants.length % targetTeamCount;
  const maxCapacities = teams.map((_, idx) => baseSize + (idx < remainder ? 1 : 0));

  // Clone list of pool candidates to process deterministically
  const unassigned = [...eligibleApplicants];

  // Helper scoring function: Evaluate how well a candidate fits into a team
  const calculateCandidateFit = (candidate: Applicant, team: { members: Applicant[]; dominantTrack: Track }) => {
    let score = 0;

    // 1. Skill Diversity Bonus (Highest weight: +10 points if candidate brings a missing primary skill)
    const existingSkills = new Set(team.members.map((m) => m.primarySkill));
    if (!existingSkills.has(candidate.primarySkill)) {
      score += 10;
    } else {
      score -= 2; // slight penalty for duplicate primary skill
    }

    // 2. Track Preference Match (+4 points if candidate shares team's dominant track)
    if (candidate.trackPreference === team.dominantTrack) {
      score += 4;
    }

    // 3. Experience Level Balance (+2 points if candidate fills a missing experience tier)
    const existingExp = new Set(team.members.map((m) => m.experienceLevel));
    if (!existingExp.has(candidate.experienceLevel)) {
      score += 2;
    }

    return score;
  };

  // Phase 1: Seed each team with initial diverse core anchors (prefer Senior/Mid candidates with distinct primary skills)
  const sortedCandidates = [...unassigned].sort((a, b) => {
    const expWeight = { Senior: 3, Mid: 2, Junior: 1 };
    return expWeight[b.experienceLevel] - expWeight[a.experienceLevel] || a.id.localeCompare(b.id);
  });

  for (let teamIdx = 0; teamIdx < teams.length; teamIdx++) {
    const team = teams[teamIdx];
    const candidateIdx = sortedCandidates.findIndex((c) => {
      const matchTrack = c.trackPreference === team.dominantTrack;
      const notInTeam = !team.members.some((m) => m.primarySkill === c.primarySkill);
      return matchTrack && notInTeam;
    });

    const chosenIdx = candidateIdx !== -1 ? candidateIdx : 0;
    if (sortedCandidates.length > 0) {
      const [chosen] = sortedCandidates.splice(chosenIdx, 1);
      team.members.push(chosen);
      const unassignedIdx = unassigned.findIndex((u) => u.id === chosen.id);
      if (unassignedIdx !== -1) unassigned.splice(unassignedIdx, 1);
    }
  }

  // Phase 2: Distribute remaining candidates greedily to maximize skill diversity & track harmony
  while (unassigned.length > 0) {
    let bestFit = { candidateIdx: -1, teamIdx: -1, score: -Infinity };

    for (let cIdx = 0; cIdx < unassigned.length; cIdx++) {
      const candidate = unassigned[cIdx];

      for (let tIdx = 0; tIdx < teams.length; tIdx++) {
        // Skip team if already at capacity
        if (teams[tIdx].members.length >= maxCapacities[tIdx]) continue;

        const score = calculateCandidateFit(candidate, teams[tIdx]);
        if (score > bestFit.score) {
          bestFit = { candidateIdx: cIdx, teamIdx: tIdx, score };
        }
      }
    }

    if (bestFit.candidateIdx !== -1 && bestFit.teamIdx !== -1) {
      const [assignedCandidate] = unassigned.splice(bestFit.candidateIdx, 1);
      teams[bestFit.teamIdx].members.push(assignedCandidate);
    } else {
      // Fallback: append candidate to least filled team
      const candidate = unassigned.shift()!;
      const smallestTeam = teams.reduce((min, curr, idx) =>
        curr.members.length < teams[min].members.length ? idx : min, 0
      );
      teams[smallestTeam].members.push(candidate);
    }
  }

  // Phase 3: Build formatted FormedTeam response with dynamic deterministic rationale
  return teams.map((team) => {
    const uniqueSkills = Array.from(new Set(team.members.map((m) => m.primarySkill))) as ApplicantSkill[];
    const dominantTrackCount = team.members.filter((m) => m.trackPreference === team.dominantTrack).length;
    const skillCount = uniqueSkills.length;

    const rationale = `Combines ${uniqueSkills.join(', ')} coverage (${skillCount}/4 disciplines) with ${dominantTrackCount} of ${team.members.length} members sharing a ${team.dominantTrack} focus.`;

    return {
      id: team.id,
      name: team.name,
      members: team.members,
      dominantTrack: team.dominantTrack,
      skillsCovered: uniqueSkills,
      rationale,
    };
  });
}
