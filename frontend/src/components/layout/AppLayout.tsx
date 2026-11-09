import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLearnMate } from '@/context/LearnMateContext';
import { MockBanner } from '@/components/MockBanner';
import {
  Home,
  Map,
  Target,
  BookOpen,
  TrendingUp,
  MessageCircle,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Get Started', icon: Home, end: true },
  { to: '/pathway', label: 'My Pathway', icon: Map, end: false },
  { to: '/skills', label: 'Skill Gaps', icon: Target, end: false },
  { to: '/recommendations', label: 'Recommendations', icon: BookOpen, end: false },
  { to: '/progress', label: 'Progress', icon: TrendingUp, end: false },
  { to: '/companion', label: 'AI Companion', icon: MessageCircle, end: false },
] as const;

function NavItems({ onClick }: { onClick?: () => void }) {
  return (
    <nav aria-label="Main navigation">
      <ul className="space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              onClick={onClick}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isMockMode } = useLearnMate();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside
        aria-label="Sidebar"
        className="hidden md:flex md:w-56 lg:w-64 flex-col border-r bg-background shrink-0"
      >
        <div className="flex h-14 items-center border-b px-4">
          <span className="font-semibold text-base">LearnMate AI</span>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <NavItems />
        </div>
      </aside>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-50 flex w-64 flex-col border-r bg-background">
            <div className="flex h-14 items-center justify-between border-b px-4">
              <span className="font-semibold text-base">LearnMate AI</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded p-1 text-muted-foreground hover:bg-accent"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <NavItems onClick={() => setMobileOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex h-14 shrink-0 items-center border-b bg-background px-4 gap-3">
          <button
            type="button"
            className="md:hidden rounded p-1 text-muted-foreground hover:bg-accent"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-semibold text-base md:hidden">LearnMate AI</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {isMockMode && (
            <div className="px-6 pt-4">
              <MockBanner />
            </div>
          )}
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
