import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'dashboard', shortcut: 'G D' },
    { label: 'Learning Roadmap', path: '/pathway', icon: 'alt_route', shortcut: 'G R' },
    { label: 'Skill Gap & Deficiency Matrix', path: '/skills', icon: 'radar', shortcut: 'G M' },
    { label: 'Curated Resource Library', path: '/resources', icon: 'local_library', shortcut: 'G L' },
    { label: 'Progress & Retention Analytics', path: '/progress', icon: 'trending_up', shortcut: 'G P' },
    { label: 'AI Learning Companion', path: '/companion', icon: 'auto_awesome', shortcut: 'G C' },
    { label: 'Calibration & Onboarding', path: '/onboarding', icon: 'tune', shortcut: 'G O' },
    { label: 'Account & Settings', path: '/settings', icon: 'settings', shortcut: 'G S' },
    { label: 'Authentication & Sign Up', path: '/signup', icon: 'login', shortcut: 'G A' },
    { label: 'Landing & Architecture Showcase', path: '/', icon: 'home', shortcut: 'G H' },
  ];

  const filtered = navItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = (path: string) => {
    navigate(path);
    onOpenChange(false);
    setQuery('');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4 transition-all"
      onClick={() => onOpenChange(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-xl border border-outline/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-outline/10">
          <span className="material-symbols-outlined text-outline text-[20px]">
            search
          </span>
          <input
            className="w-full bg-transparent border-0 text-on-surface font-body text-sm focus:outline-none placeholder:text-outline"
            placeholder="Search actions, modules, or shortcuts..."
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd
            className="px-2 py-0.5 rounded bg-surface-container-low text-outline font-code text-[11px] border border-outline/20 cursor-pointer hover:bg-surface-container"
            onClick={() => onOpenChange(false)}
          >
            ESC
          </kbd>
        </div>

        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-label uppercase tracking-wider text-outline font-semibold">
            Navigation
          </div>
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-sm text-outline">
              No matching pages found
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => handleSelect(item.path)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-container text-on-surface transition-colors text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="font-body text-sm font-medium">{item.label}</span>
                </div>
                <span className="font-code text-[11px] text-outline bg-surface-container-low px-1.5 py-0.5 rounded border border-outline/10">
                  {item.shortcut}
                </span>
              </button>
            ))
          )}

          <div className="px-3 pt-3 pb-1 text-[11px] font-label uppercase tracking-wider text-outline font-semibold">
            Quick Actions
          </div>
          <button
            type="button"
            onClick={() => handleSelect('/companion')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-container text-on-surface text-left transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-secondary">
                psychology
              </span>
              <span className="font-body text-sm font-medium">Ask Socratic AI a Question</span>
            </div>
            <span className="font-code text-[11px] text-outline">↵</span>
          </button>
        </div>
      </div>
    </div>
  );
}
