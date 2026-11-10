import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useLearnMate } from '@/context/LearnMateContext';
import { MockBanner } from '@/components/MockBanner';
import { CommandPalette } from '@/components/CommandPalette';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  badge?: string;
  end?: boolean;
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/pathway', label: 'Learning Roadmap', icon: 'alt_route' },
  { to: '/resources', label: 'Resource Library', icon: 'local_library' },
  { to: '/progress', label: 'Progress Tracker', icon: 'trending_up' },
  { to: '/companion', label: 'AI Companion', icon: 'auto_awesome', badge: 'AI Beta' },
];

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [headerDropdownOpen, setHeaderDropdownOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const { profile, isMockMode, signOut } = useLearnMate();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setHeaderDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setHeaderDropdownOpen(false);
      }
    }
    if (headerDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [headerDropdownOpen]);

  const userName = profile?.target_role ? `Learner (${profile.target_role})` : 'Alex Rivera';
  const userInitials = profile?.target_role ? profile.target_role.slice(0, 2).toUpperCase() : 'AR';

  return (
    <div className="min-h-screen flex bg-surface font-body text-on-surface antialiased">
      {/* ⌘K Command Palette Modal */}
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />

      {/* Desktop Fixed Sidebar (260px) */}
      <aside
        aria-label="Sidebar"
        className="hidden md:flex md:w-[260px] flex-col justify-between fixed left-0 top-0 bottom-0 z-40 bg-surface-container-lowest/80 backdrop-blur-md border-r border-outline/20"
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-outline/10">
            <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm shrink-0 transition-transform group-hover:scale-105">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  <path d="M12 3v4" strokeWidth="1.5" />
                </svg>
              </div>
              <span className="font-headline text-lg font-bold text-on-surface tracking-tight">
                LearnMate
              </span>
            </NavLink>
            <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-code text-[11px] border border-outline/20 font-medium">
              v2.4
            </span>
          </div>

          {/* Section Header */}
          <div className="px-4 pt-5 pb-2">
            <span className="text-[11px] font-headline uppercase tracking-wider text-outline font-semibold">
              Workspace
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto" aria-label="Main Navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-surface-container text-primary shadow-sm font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`
                }
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="material-symbols-outlined text-[19px] shrink-0">
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-primary-fixed text-primary font-code text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Widget & User */}
        <div className="p-3 border-t border-outline/10 space-y-3 bg-surface-container-lowest/50">
          {/* Weekly Goal Progress Pill */}
          <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline/15">
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="text-on-surface-variant font-medium">Weekly Goal</span>
              <span className="text-primary font-bold">85%</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500 w-[85%]" />
            </div>
          </div>

          {/* User Profile Trigger & Flyout */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-code text-xs font-bold shrink-0">
                  {userInitials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-on-surface truncate leading-tight">
                    {userName}
                  </p>
                  <p className="text-[11px] text-on-surface-variant truncate">Personal Pro</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px] text-outline shrink-0">
                unfold_more
              </span>
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full bg-surface-container-lowest rounded-xl shadow-xl border border-outline/20 p-1.5 z-50">
                <div className="px-2.5 py-2 border-b border-outline/10 mb-1">
                  <p className="text-xs font-bold text-on-surface truncate">{userName}</p>
                  <p className="text-[11px] text-outline truncate">Active Learner Session</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/settings');
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-on-surface hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-outline">
                    settings
                  </span>
                  Account Settings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    signOut();
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-red-600 hover:bg-red-500/10 transition-colors font-medium cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-outline/10 text-xs text-on-surface-variant">
            <NavLink
              to="/settings"
              className="flex items-center gap-1 hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">settings</span>
              <span>Settings</span>
            </NavLink>
            <a
              href="https://github.com/sharatkumar-dev/learnmate-ai"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">menu_book</span>
              <span>Docs</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-50 flex w-72 flex-col justify-between bg-surface-container-lowest border-r border-outline/20 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-outline/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold">
                    LM
                  </div>
                  <span className="font-headline font-bold text-lg text-on-surface">LearnMate</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded-lg text-outline hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                        isActive
                          ? 'bg-surface-container text-primary font-semibold'
                          : 'text-on-surface-variant hover:bg-surface-container-low'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  </NavLink>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area (offset by 260px on desktop) */}
      <div className="flex-1 flex flex-col md:pl-[260px] min-w-0">
        {/* Top Header Bar (Sticky) */}
        <header className="sticky top-0 z-30 h-16 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline/15 flex items-center justify-between px-4 md:px-8">
          {/* Left: Mobile hamburger or Quick Find */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container"
              aria-label="Open mobile menu"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>

            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline/20 text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all group"
            >
              <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-colors">
                search
              </span>
              <span className="font-body text-xs hidden sm:inline">Quick find...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-lowest border border-outline/20 font-code text-[10px] text-outline font-semibold shadow-2xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Streak indicator + Notification + Profile */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Streak Indicator Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-700">
              <span className="text-[14px]">🔥</span>
              <span className="font-label text-xs font-bold">14 days</span>
            </div>

            {/* Notifications */}
            <button
              type="button"
              className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors relative"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </button>

            <div className="h-4 w-px bg-outline/20" />

            {/* User Profile Avatar & Header Dropdown (Stitch Spec) */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                id="userProfileDropdownBtn"
                onClick={() => setHeaderDropdownOpen((prev) => !prev)}
                className={`flex items-center rounded-full ring-2 transition-all p-0.5 cursor-pointer ${
                  headerDropdownOpen
                    ? 'ring-primary ring-offset-2 ring-offset-surface'
                    : 'ring-outline/20 hover:ring-primary'
                }`}
                aria-expanded={headerDropdownOpen}
                aria-haspopup="true"
                aria-label="User profile and settings menu"
                title={userName}
              >
                <img
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVMlySAvthLBnT02K-Y39Sn3Zwboj8jDxUos2n5AUipsMS4QEEaQTWOmkAdCjGY90T6HB-aGpRS--3AhvWsgKfT3J-PaiAbfsXkMGnpAEKrXoRoqSBAJViWI2uuOJTUM5fQMIGhtsD-sojp57rvahNFXa5RzQCQF97e4G7jpHIu1TcE3twOoXV1MB9HfKCONu_DGq1bU2CjDAbEdKBP5QtrCaWbmgTr1RaYVKtYJ7G"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement | null;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div
                  style={{ display: 'none' }}
                  className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-code text-xs font-bold"
                >
                  {userInitials}
                </div>
              </button>

              {/* Header Dropdown Menu */}
              {headerDropdownOpen && (
                <div
                  id="headerUserDropdown"
                  className="absolute right-0 top-11 w-64 rounded-2xl bg-surface-container-lowest shadow-2xl border border-outline/20 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  role="menu"
                >
                  {/* User Profile Header */}
                  <div className="px-3.5 py-2.5 border-b border-outline/10">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-code text-xs font-bold shrink-0">
                        {userInitials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-headline text-xs font-bold text-on-surface truncate">
                          {userName}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <p className="font-label text-[11px] text-on-surface-variant truncate">
                            Personal Pro • Active
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation & Setting Actions */}
                  <div className="py-1">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setHeaderDropdownOpen(false);
                        navigate('/settings');
                      }}
                      className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-low transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-colors">
                          settings
                        </span>
                        <span>User Settings</span>
                      </div>
                      <span className="font-code text-[10px] text-outline">G S</span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setHeaderDropdownOpen(false);
                        navigate('/onboarding');
                      }}
                      className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-low transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-colors">
                          tune
                        </span>
                        <span>Calibration Wizard</span>
                      </div>
                      <span className="font-code text-[10px] text-outline">G C</span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setHeaderDropdownOpen(false);
                        setCmdOpen(true);
                      }}
                      className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-low transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-colors">
                          keyboard
                        </span>
                        <span>Quick Command</span>
                      </div>
                      <kbd className="px-1.5 py-0.5 rounded bg-surface-container border border-outline/20 font-code text-[10px] text-outline font-semibold">
                        ⌘K
                      </kbd>
                    </button>

                    <a
                      href="https://github.com/sharatkumar-dev/learnmate-ai"
                      target="_blank"
                      rel="noreferrer"
                      role="menuitem"
                      onClick={() => setHeaderDropdownOpen(false)}
                      className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-low transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-colors">
                          menu_book
                        </span>
                        <span>Documentation</span>
                      </div>
                      <span className="material-symbols-outlined text-[14px] text-outline">
                        open_in_new
                      </span>
                    </a>
                  </div>

                  <div className="h-px bg-outline/10 my-1" />

                  {/* Sign Out Item */}
                  <div className="px-1.5 py-1">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setHeaderDropdownOpen(false);
                        signOut();
                        navigate('/');
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-500/10 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[18px] text-red-600 group-hover:rotate-12 transition-transform">
                          logout
                        </span>
                        <span>Sign Out</span>
                      </div>
                      <span className="font-code text-[10px] text-red-500/80">Landing</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Global Mock Preview Banner */}
        {isMockMode && <MockBanner />}

        {/* Page Main Content */}
        <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
