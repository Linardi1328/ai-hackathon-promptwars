import React from 'react';
import { EventProvider, useEventContext } from './context/EventContext';
import { Header } from './components/layout/Header';
import { OrganizerDashboard } from './components/organizer/OrganizerDashboard';
import { JudgeView } from './components/judge/JudgeView';
import { ParticipantView } from './components/participant/ParticipantView';
import { Sparkles } from 'lucide-react';

const MainView: React.FC = () => {
  const { activeRole } = useEventContext();

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
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
        <Header />
        <MainView />
        <footer className="border-t border-slate-900 bg-slate-950/90 py-5 text-center text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold font-mono text-slate-400">EVENT TWIN</span>
              <span>•</span>
              <span>Smart Hackathon Disruption Simulation Platform</span>
            </div>
            <div className="text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Reactive Shared State Engine (Zero Backend)</span>
            </div>
          </div>
        </footer>
      </div>
    </EventProvider>
  );
}

export default App;
