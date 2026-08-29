import { describe, it, expect } from 'vitest';
import { formBalancedTeams } from '../utils/teamFormation';
import { INITIAL_APPLICANTS } from '../data/mockData';
import { Applicant } from '../types';

describe('Smart Team Formation Heuristic', () => {
  it('1. Excludes unavailable participants from formed teams', () => {
    // In INITIAL_APPLICANTS, app-12 (Gabriel Silva) is marked available: false
    const teams = formBalancedTeams(INITIAL_APPLICANTS, 3);
    const allAssignedMembers = teams.flatMap((t) => t.members);

    expect(allAssignedMembers.some((m) => m.id === 'app-12')).toBe(false);
    expect(allAssignedMembers.every((m) => m.available)).toBe(true);
  });

  it('2. Assigns every available participant exactly once without duplicates', () => {
    const teams = formBalancedTeams(INITIAL_APPLICANTS, 3);
    const allAssignedMembers = teams.flatMap((t) => t.members);
    const availableApplicants = INITIAL_APPLICANTS.filter((a) => a.available);

    expect(allAssignedMembers.length).toBe(availableApplicants.length);

    // Verify each ID is unique
    const assignedIds = allAssignedMembers.map((m) => m.id);
    const uniqueIds = new Set(assignedIds);
    expect(uniqueIds.size).toBe(assignedIds.length);

    // Verify every available applicant ID is accounted for
    for (const applicant of availableApplicants) {
      expect(uniqueIds.has(applicant.id)).toBe(true);
    }
  });

  it('3. Keeps team sizes balanced within ±1 member', () => {
    // 11 available applicants across 3 teams should result in sizes [4, 4, 3]
    const teams = formBalancedTeams(INITIAL_APPLICANTS, 3);
    const teamSizes = teams.map((t) => t.members.length);

    expect(teamSizes).toEqual([4, 4, 3]);

    const maxSize = Math.max(...teamSizes);
    const minSize = Math.min(...teamSizes);
    expect(maxSize - minSize).toBeLessThanOrEqual(1);
  });

  it('4. Produces deterministic output for identical inputs', () => {
    const run1 = formBalancedTeams(INITIAL_APPLICANTS, 3);
    const run2 = formBalancedTeams(INITIAL_APPLICANTS, 3);

    expect(run1).toEqual(run2);
  });

  it('5. Represents skill diversity across generated teams', () => {
    const teams = formBalancedTeams(INITIAL_APPLICANTS, 3);

    for (const team of teams) {
      // Each team should cover at least 3 distinct primary disciplines
      expect(team.skillsCovered.length).toBeGreaterThanOrEqual(3);
      expect(team.rationale).toContain('coverage');
    }
  });

  it('6. Dynamically respects availability changes when candidates are toggled', () => {
    // Make all 12 applicants available
    const allAvailable = INITIAL_APPLICANTS.map((a) => ({ ...a, available: true }));
    const teams12 = formBalancedTeams(allAvailable, 3);
    const teamSizes12 = teams12.map((t) => t.members.length);
    expect(teamSizes12).toEqual([4, 4, 4]);

    const allAssigned12 = teams12.flatMap((t) => t.members);
    expect(allAssigned12.some((m) => m.id === 'app-12')).toBe(true);
  });
});
