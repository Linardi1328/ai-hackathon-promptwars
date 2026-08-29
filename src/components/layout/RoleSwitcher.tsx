import React from 'react';
import { useEventContext } from '../../context/EventContext';
import { Role } from '../../types';
import { Shield, UserCheck, Users, Sparkles } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { activeRole, setActiveRole } = useEventContext();

  const roles: { id: Role; label: string; icon: React.ComponentType<{ className?: string }>; description: string; badge?: string }[] = [
    {
      id: 'organizer',
      label: 'Organizer View',
      icon: Shield,
      description: 'Operations cockpit & Event Twin telemetry',
      badge: 'Primary'
    },
    {
      id: 'judge',
      label: 'Judge Portal',
      icon: UserCheck,
      description: 'Review assigned submissions & rubric grading',
    },
    {
      id: 'participant',
      label: 'Participant Hub',
      icon: Users,
      description: 'Event pass, team status & in-session rankings',
    },
  ];

  return (
    <div
      role="tablist"
      aria-label="Event role navigation"
      className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 shadow-inner"
    >
      {roles.map((role) => {
        const Icon = role.icon;
        const isActive = activeRole === role.id;

        return (
          <button
            key={role.id}
            role="tab"
            aria-selected={isActive}
            aria-label={`${role.label}: ${role.description}`}
            onClick={() => setActiveRole(role.id)}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
              isActive
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{role.label}</span>
            {role.badge && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-2.5 h-2.5" />
                {role.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
