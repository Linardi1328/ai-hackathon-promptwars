import React, { useEffect } from 'react';
import { EventProvider, useEventContext } from './context/EventContext';
import { Header } from './components/layout/Header';
import { OrganizerDashboard } from './components/organizer/OrganizerDashboard';
import { JudgeView } from './components/judge/JudgeView';
import { ParticipantView } from './components/participant/ParticipantView';
import { AlertTriangle, Sparkles } from 'lucide-react';

const MainView: React.FC = () => {
  const { activeRole } = useEventContext();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeRole]);

  return (
    <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      {activeRole === 'organizer' && <OrganizerDashboard />}
      {activeRole === 'judge' && <JudgeView />}
      {activeRole === 'participant' && <ParticipantView />}
    </main>
  );
};

export function App() {
  return (
    <EventProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
        <a className="event-skip-link" href="#main-content">Skip to main content</a>
        <Header />
        <aside aria-label="Prototype data notice" className="border-b border-amber-900/60 bg-amber-950/30 px-4 py-2 text-xs leading-5 text-amber-100">
          <div className="mx-auto flex max-w-7xl items-start gap-2">
            <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
            <p><strong>Synthetic simulation only.</strong> Teams, judges, pass codes, scores, attendance, announcements, delay predictions, and recovery actions are demo data/state. Do not enter real attendee, credential, confidential event, or personal information.</p>
          </div>
        </aside>
        <MainView />
        <footer className="border-t border-slate-900 bg-slate-950/90 py-5 text-center text-xs text-slate-400 mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-3">
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold font-mono text-slate-300">EVENT TWIN</span>
                <span aria-hidden="true">•</span>
                <span>Smart Hackathon Disruption Simulation Platform</span>
              </div>
              <div className="text-slate-400 flex items-center gap-1.5">
                <Sparkles aria-hidden="true" className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reactive Shared Event State • Frontend Prototype</span>
              </div>
            </div>
            <nav aria-label="Legal policies" className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              <a className="underline underline-offset-4 hover:text-white" href="/privacy.html">Privacy</a>
              <a className="underline underline-offset-4 hover:text-white" href="/terms.html">Terms</a>
              <a className="underline underline-offset-4 hover:text-white" href="/cookies.html">Cookies</a>
              <a className="underline underline-offset-4 hover:text-white" href="/refunds.html">Payments &amp; refunds</a>
            </nav>
          </div>
        </footer>
      </div>
    </EventProvider>
  );
}

export default App;
