import React, { useState } from 'react';
import { useEventContext } from '../../context/EventContext';
import { Megaphone, Plus, Send, AlertTriangle, Bell, Info } from 'lucide-react';

export const Announcements: React.FC = () => {
  const { announcements, addAnnouncement } = useEventContext();
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    addAnnouncement(title, content, 'normal', 'all');
    setTitle('');
    setContent('');
    setShowInput(false);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400">
            <Megaphone className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Broadcast Notices</h3>
        </div>

        <button
          onClick={() => setShowInput(!showInput)}
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showInput ? 'Cancel' : 'New Broadcast'}</span>
        </button>
      </div>

      {showInput && (
        <form onSubmit={handleSend} className="bg-slate-950 p-3 rounded-lg border border-slate-700 space-y-2">
          <input
            type="text"
            placeholder="Notice Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            required
          />
          <textarea
            rows={2}
            placeholder="Message details..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold flex items-center gap-1"
            >
              <Send className="w-3 h-3" /> Post
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`p-2.5 rounded-lg border text-xs ${
              ann.priority === 'urgent'
                ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="font-bold text-white truncate">{ann.title}</span>
              <span className="text-[10px] text-slate-500 font-mono">{ann.timestamp}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">{ann.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
