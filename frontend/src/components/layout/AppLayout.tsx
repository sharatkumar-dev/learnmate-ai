import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useLearnMate } from '@/context/LearnMateContext';
import { MockBanner } from '@/components/MockBanner';
import { CommandPalette } from '@/components/CommandPalette';
import {
  getWeeklyActivity,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllNotifications,
  getSidebarCollapsed,
  setSidebarCollapsed,
  type DashboardNotification,
} from '@/utils/dashboardStore';

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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread'>('all');
  const [cmdOpen, setCmdOpen] = useState(false);

  // Collapsible Sidebar state with persistent storage
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => getSidebarCollapsed());

  const { profile, isMockMode, signOut, user, isAuthenticated } = useLearnMate();
  const navigate = useNavigate();
  const location = useLocation();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Dynamic commitment and real-time synchronized weekly activity
  const commitment = (profile?.time_available_hours_per_week === 4 ? 'casual' : profile?.time_available_hours_per_week === 15 ? 'intensive' : 'accelerated') as 'casual' | 'accelerated' | 'intensive';
  const [activityUpdateCount, setActivityUpdateCount] = useState(0);
  const weekly = getWeeklyActivity(commitment);
  const [notifications, setNotifications] = useState<DashboardNotification[]>(() => getNotifications());

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleActivity = () => {
      setActivityUpdateCount((c) => c + 1);
    };
    window.addEventListener('learnmate_activity_updated', handleActivity);
    return () => {
      window.removeEventListener('learnmate_activity_updated', handleActivity);
    };
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      setSidebarCollapsed(next);
      return next;
    });
  };

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setHeaderDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setHeaderDropdownOpen(false);
        setNotificationsOpen(false);
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/signup" replace state={{ from: location.pathname }} />;
  }

  const userName = user?.fullName || (profile?.target_role ? `Learner (${profile.target_role})` : 'Learner');
  const userEmail = user?.email || 'learner@learnmate.ai';
  const userTrajectory = user?.trajectory || profile?.target_role || 'Distributed Systems';
  const userInitials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'LM';

  // Weekly Goal calculations: raw percentage can exceed 100%, visual bar clamped at 100%
  const rawWeeklyPct =
    weekly.targetHours > 0 ? Math.round((weekly.totalHours / weekly.targetHours) * 100) : 0;
  const visualWeeklyPct = Math.min(100, Math.max(0, rawWeeklyPct));

  const filteredNotifications =
    notificationFilter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="min-h-screen flex bg-surface font-body text-on-surface antialiased" data-sync={activityUpdateCount}>
      {/* ⌘K Command Palette Modal */}
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />

      {/* Desktop Fixed Sidebar (Collapsible: 260px <-> 72px) */}
      <aside
        aria-label="Sidebar"
        className={`hidden md:flex flex-col justify-between fixed left-0 top-0 bottom-0 z-40 bg-surface-container-lowest/90 backdrop-blur-md border-r border-outline/20 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo Header + Sidebar Collapse Toggle */}
          <div className="h-16 px-3 flex items-center justify-between border-b border-outline/10">
            <NavLink
              to="/dashboard"
              className={`flex items-center transition-all ${
                isCollapsed ? 'justify-center w-full' : 'gap-2.5'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold shadow-xs shrink-0">
                LM
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <span className="font-headline font-bold text-base text-on-surface tracking-tight block truncate">
                    LearnMate
                  </span>
                  <span className="font-code text-[10px] text-outline block leading-none">
                    Adaptive AI
                  </span>
                </div>
              )}
            </NavLink>

            {/* Sidebar Collapse Toggle Button */}
            {!isCollapsed && (
              <button
                type="button"
                id="sidebarCollapseBtn"
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <span className="material-symbols-outlined text-[18px]">left_panel_close</span>
              </button>
            )}
          </div>

          {/* Quick Expand Button when collapsed */}
          {isCollapsed && (
            <div className="p-2 flex justify-center border-b border-outline/10">
              <button
                type="button"
                id="sidebarExpandBtn"
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <span className="material-symbols-outlined text-[18px]">left_panel_open</span>
              </button>
            </div>
          )}

          {/* Main Navigation Items */}
          <nav
            className={`flex-1 py-4 space-y-1 overflow-y-auto ${
              isCollapsed ? 'px-2' : 'px-3'
            }`}
            aria-label="Main Navigation"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center rounded-lg text-sm font-medium transition-all group ${
                    isCollapsed
                      ? 'justify-center p-2.5'
                      : 'justify-between px-3 py-2'
                  } ${
                    isActive
                      ? 'bg-surface-container text-primary shadow-sm font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`
                }
              >
                <div
                  className={`flex items-center min-w-0 ${
                    isCollapsed ? 'justify-center' : 'gap-3'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] shrink-0">
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!isCollapsed && item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-primary-fixed text-primary font-code text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Widget & User */}
        <div
          className={`border-t border-outline/10 bg-surface-container-lowest/50 ${
            isCollapsed ? 'p-2 space-y-2' : 'p-3 space-y-3'
          }`}
        >
          {/* Dynamic Weekly Goal Progress Pill */}
          {!isCollapsed ? (
            <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline/15">
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <span className="text-on-surface-variant font-medium">Weekly Goal</span>
                <span
                  id="sidebarWeeklyPctText"
                  className={`font-bold ${
                    rawWeeklyPct > 100 ? 'text-emerald-600' : 'text-primary'
                  }`}
                >
                  {rawWeeklyPct}%{rawWeeklyPct > 100 ? ' 🎯' : ''}
                </span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    rawWeeklyPct > 100 ? 'bg-emerald-500' : 'bg-primary'
                  }`}
                  style={{ width: `${visualWeeklyPct}%` }}
                />
              </div>
              <p className="text-[10px] font-mono text-outline mt-1 text-right">
                {weekly.totalHours}h / {weekly.targetHours}h logged
              </p>
            </div>
          ) : (
            <div
              className="flex justify-center p-1.5 rounded-lg bg-surface-container-low border border-outline/15"
              title={`Weekly Goal: ${rawWeeklyPct}% (${weekly.totalHours}h / ${weekly.targetHours}h)`}
            >
              <span
                id="sidebarWeeklyPctTextCollapsed"
                className={`text-[10px] font-bold ${
                  rawWeeklyPct > 100 ? 'text-emerald-600' : 'text-primary'
                }`}
              >
                {rawWeeklyPct}%
              </span>
            </div>
          )}

          {/* User Profile Trigger & Flyout */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`w-full flex items-center rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer text-left ${
                isCollapsed ? 'justify-center p-1.5' : 'justify-between p-1.5'
              }`}
              title={isCollapsed ? userName : undefined}
            >
              <div
                className={`flex items-center min-w-0 ${
                  isCollapsed ? 'justify-center' : 'gap-2.5'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-code text-xs font-bold shrink-0">
                  {userInitials}
                </div>
                {!isCollapsed && (
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-on-surface truncate leading-tight">
                      {userName}
                    </p>
                    <p className="text-[11px] text-on-surface-variant truncate">
                      {userTrajectory}
                    </p>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <span className="material-symbols-outlined text-[18px] text-outline shrink-0">
                  unfold_more
                </span>
              )}
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-64 bg-surface-container-lowest rounded-xl shadow-xl border border-outline/20 p-1.5 z-50">
                <div className="px-2.5 py-2 border-b border-outline/10 mb-1">
                  <p className="text-xs font-bold text-on-surface truncate">{userName}</p>
                  <p className="text-[11px] text-outline truncate">{userEmail}</p>
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-primary-fixed text-primary font-mono text-[10px] font-semibold">
                    {userTrajectory}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/settings');
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
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

          {/* Sidebar Clean Settings Link (Docs removed per requirement) */}
          <div className="pt-1 border-t border-outline/10 text-xs text-on-surface-variant flex items-center">
            <NavLink
              to="/settings"
              className={`flex items-center gap-1.5 hover:text-on-surface transition-colors py-1 w-full ${
                isCollapsed ? 'justify-center' : 'px-1'
              }`}
              title="Settings"
            >
              <span className="material-symbols-outlined text-[17px]">settings</span>
              {!isCollapsed && <span>Settings</span>}
            </NavLink>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
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
                  className="p-1 rounded-lg text-outline hover:bg-surface-container cursor-pointer"
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

      {/* Main Content Area (offset by 260px or 72px on desktop) */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'md:pl-[72px]' : 'md:pl-[260px]'
        }`}
      >
        {/* Top Header Navbar */}
        <header className="h-16 border-b border-outline/15 bg-surface-container-lowest/80 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 rounded-lg text-outline hover:text-on-surface md:hidden cursor-pointer"
              aria-label="Open navigation menu"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>

            {/* Quick Find Palette Trigger */}
            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline/15 text-outline hover:text-on-surface hover:border-outline/30 transition-all cursor-pointer group"
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

          {/* Right: Timezone Indicator + Notification + Profile */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Timezone Indicator Badge (Replaced redundant header streak indicator) */}
            <div
              id="headerTimezoneBadge"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-mono text-xs border border-outline/10 cursor-default"
              title="Timezone: Indian Standard Time (IST UTC+5:30)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>IST • UTC+5:30</span>
            </div>

            {/* Notification Flyout Center */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                id="dashboardNotificationsBtn"
                onClick={() => setNotificationsOpen((prev) => !prev)}
                className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors relative cursor-pointer"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-on-primary font-code text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-11 w-80 sm:w-96 rounded-2xl bg-surface-container-lowest shadow-2xl border border-outline/20 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-outline/10">
                    <div className="flex items-center gap-2">
                      <h3 className="font-headline text-sm font-bold text-on-surface">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-primary-fixed text-primary font-code text-[10px] font-bold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={() => setNotifications(markAllNotificationsAsRead())}
                          className="text-primary hover:underline font-medium cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-outline/10 text-xs">
                    <button
                      type="button"
                      onClick={() => setNotificationFilter('all')}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        notificationFilter === 'all'
                          ? 'bg-surface-container text-primary font-semibold'
                          : 'text-outline hover:text-on-surface'
                      }`}
                    >
                      All ({notifications.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotificationFilter('unread')}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        notificationFilter === 'unread'
                          ? 'bg-surface-container text-primary font-semibold'
                          : 'text-outline hover:text-on-surface'
                      }`}
                    >
                      Unread ({unreadCount})
                    </button>
                  </div>

                  {/* Notifications list */}
                  <div className="max-h-72 overflow-y-auto space-y-1.5">
                    {filteredNotifications.length === 0 ? (
                      <div className="text-center py-6 text-outline font-body text-xs">
                        No {notificationFilter === 'unread' ? 'unread' : ''} notifications.
                      </div>
                    ) : (
                      filteredNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            setNotifications(markNotificationAsRead(notif.id));
                            if (notif.link) {
                              setNotificationsOpen(false);
                              navigate(notif.link);
                            }
                          }}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                            notif.read
                              ? 'bg-surface-container-low/50 border-transparent text-on-surface-variant'
                              : 'bg-surface-container-low border-primary/20 text-on-surface shadow-2xs'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-[16px] text-primary">
                              {notif.type === 'milestone'
                                ? 'flag'
                                : notif.type === 'goal'
                                ? 'timer'
                                : notif.type === 'mentor'
                                ? 'auto_awesome'
                                : 'info'}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <p
                                className={`text-xs ${
                                  notif.read ? 'font-medium' : 'font-bold text-on-surface'
                                } truncate`}
                              >
                                {notif.title}
                              </p>
                              <span className="text-[10px] text-outline font-mono ml-2 shrink-0">
                                {notif.time}
                              </span>
                            </div>
                            <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-0.5">
                              {notif.description}
                            </p>
                          </div>
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="pt-2 mt-2 border-t border-outline/10 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setNotifications(clearAllNotifications())}
                        className="text-[11px] text-outline hover:text-red-500 transition-colors cursor-pointer"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-outline/20" />

            {/* Dynamic User Profile Avatar & Header Dropdown */}
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
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-code text-xs font-bold shadow-xs">
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
                        <p className="font-body text-[11px] text-outline truncate">{userEmail}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <p className="font-label text-[10px] text-on-surface-variant truncate font-semibold">
                            {userTrajectory}
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
