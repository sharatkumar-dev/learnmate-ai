import type { UserSettings } from '@/types/index';

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  activeDates: string[];
}

export interface WeeklyActivityData {
  weekStart: string; // YYYY-MM-DD (Monday)
  targetHours: number;
  dailyHours: Record<string, number>; // { 'M': 1.2, 'T': 1.0, ... }
  totalHours: number;
}

export interface DashboardNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'milestone' | 'goal' | 'mentor' | 'system';
  link?: string;
}

export interface DashboardMilestone {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  completed: boolean;
  dueDate?: string;
}

const STREAK_KEY = 'learnmate_streak_data';
const WEEKLY_KEY = 'learnmate_weekly_activity';
const NOTIFICATIONS_KEY = 'learnmate_notifications';
const SIDEBAR_KEY = 'learnmate_sidebar_collapsed';
const MILESTONES_KEY = 'learnmate_dashboard_milestones';
const TIMEZONE_KEY = 'learnmate_timezone';

// ─────────────────────────────────────────────
// Timezone & IST (UTC+5:30) Engine
// ─────────────────────────────────────────────

/**
 * Resolves the active user timezone with first-class Indian Standard Time (IST) support.
 */
export function getUserTimezone(): string {
  try {
    const stored = localStorage.getItem(TIMEZONE_KEY);
    if (stored) return stored;
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return detected || 'Asia/Kolkata';
  } catch {
    return 'Asia/Kolkata';
  }
}

export function setUserTimezone(tz: string): void {
  try {
    localStorage.setItem(TIMEZONE_KEY, tz);
  } catch {
    // Ignore
  }
}

/**
 * Returns current hour (0-23) in the target timezone.
 */
export function getHourInTimezone(date = new Date(), tz = getUserTimezone()): number {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: 'numeric',
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const hourPart = parts.find((p) => p.type === 'hour');
    return hourPart ? parseInt(hourPart.value, 10) : date.getHours();
  } catch {
    return date.getHours();
  }
}

/**
 * Returns time-appropriate greeting in the target timezone:
 * - 05:00 - 11:59: "Good morning"
 * - 12:00 - 16:59: "Good afternoon"
 * - 17:00 - 04:59: "Good evening"
 */
export function getTimeBasedGreeting(tz = getUserTimezone()): string {
  const hour = getHourInTimezone(new Date(), tz);
  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}

/**
 * Helper to get local date string YYYY-MM-DD in the target timezone.
 */
export function getTodayKeyInTimezone(tz = getUserTimezone()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(new Date());
  } catch {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}

/**
 * Legacy alias for getTodayKeyInTimezone using default active timezone.
 */
export function getTodayKey(): string {
  return getTodayKeyInTimezone();
}

/**
 * Helper to get current day abbreviation ('M', 'T', 'W', 'Th', 'F', 'Sa', 'Su') in target timezone.
 */
export function getDayAbbrInTimezone(date = new Date(), tz = getUserTimezone()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      weekday: 'short',
    });
    const weekday = formatter.format(date);
    const map: Record<string, string> = {
      Mon: 'M',
      Tue: 'T',
      Wed: 'W',
      Thu: 'Th',
      Fri: 'F',
      Sat: 'Sa',
      Sun: 'Su',
    };
    return map[weekday] || 'M';
  } catch {
    const days = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'];
    return days[date.getDay()];
  }
}

export function getDayAbbr(date = new Date()): string {
  return getDayAbbrInTimezone(date);
}

/**
 * Helper to get Monday of the current week YYYY-MM-DD in target timezone.
 */
export function getMondayKeyInTimezone(tz = getUserTimezone()): string {
  try {
    const todayStr = getTodayKeyInTimezone(tz);
    const [year, month, day] = todayStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay(); // 0 is Sunday
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    const y = monday.getFullYear();
    const m = String(monday.getMonth() + 1).padStart(2, '0');
    const d = String(monday.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  } catch {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    const y = monday.getFullYear();
    const m = String(monday.getMonth() + 1).padStart(2, '0');
    const d = String(monday.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}

export function getMondayKey(): string {
  return getMondayKeyInTimezone();
}

// ─────────────────────────────────────────────
// Streak Management
// ─────────────────────────────────────────────
export function getStreakData(): StreakData {
  const today = getTodayKeyInTimezone();
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) {
      const data: StreakData = JSON.parse(raw);
      // Check days difference between lastActiveDate and today
      const lastDate = new Date(data.lastActiveDate);
      const todayDate = new Date(today);
      const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Active today, streak remains
        return data;
      } else if (diffDays === 1) {
        // Active yesterday, streak intact
        return data;
      } else {
        // Missed one or more days, streak resets to 0 (best preserved)
        return {
          currentStreak: 0,
          bestStreak: Math.max(data.bestStreak || 0, data.currentStreak || 0),
          lastActiveDate: data.lastActiveDate,
          activeDates: data.activeDates || [],
        };
      }
    }
  } catch {
    // Ignore error
  }

  // Default active baseline (14 days established for ongoing student profile)
  const defaultStreak: StreakData = {
    currentStreak: 14,
    bestStreak: 14,
    lastActiveDate: today,
    activeDates: [today],
  };
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(defaultStreak));
  } catch {
    // Ignore
  }
  return defaultStreak;
}

export function recordActivity(hoursLogged = 0.5): { streak: StreakData; weekly: WeeklyActivityData } {
  const today = getTodayKeyInTimezone();
  const currentStreakData = getStreakData();

  let newCurrentStreak = currentStreakData.currentStreak;
  if (currentStreakData.lastActiveDate !== today) {
    newCurrentStreak += 1;
  }
  const newBestStreak = Math.max(currentStreakData.bestStreak, newCurrentStreak);
  const activeDates = Array.from(new Set([...(currentStreakData.activeDates || []), today]));

  const updatedStreak: StreakData = {
    currentStreak: newCurrentStreak,
    bestStreak: newBestStreak,
    lastActiveDate: today,
    activeDates,
  };

  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(updatedStreak));
  } catch {
    // Ignore
  }

  // Also log to weekly hours
  const weekly = logWeeklyHours(hoursLogged);

  // Dispatch global window events for real-time reactivity
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('learnmate_streak_updated', { detail: updatedStreak }));
    window.dispatchEvent(new CustomEvent('learnmate_activity_updated', { detail: weekly }));
  }

  return { streak: updatedStreak, weekly };
}

// ─────────────────────────────────────────────
// Weekly Activity Management
// ─────────────────────────────────────────────
export function getWeeklyActivity(commitment: 'casual' | 'accelerated' | 'intensive' = 'accelerated'): WeeklyActivityData {
  const targetHours = commitment === 'casual' ? 4 : commitment === 'accelerated' ? 8 : 15;
  const currentMonday = getMondayKeyInTimezone();

  try {
    const raw = localStorage.getItem(WEEKLY_KEY);
    if (raw) {
      const data: WeeklyActivityData = JSON.parse(raw);
      if (data.weekStart === currentMonday) {
        data.targetHours = targetHours;
        const total = Object.values(data.dailyHours).reduce((a, b) => a + b, 0);
        data.totalHours = Math.round(total * 10) / 10;
        return data;
      }
    }
  } catch {
    // Ignore
  }

  // Realistic partial progress starter matching cohort pacing (e.g. ~40% progress)
  // Ensures sidebar weekly goal does NOT falsely show 100% on start
  const baseDaily: Record<string, number> =
    commitment === 'casual'
      ? { M: 0.8, T: 0.6, W: 0.4, Th: 0, F: 0, Sa: 0, Su: 0 } // 1.8h / 4h = 45%
      : commitment === 'accelerated'
      ? { M: 1.2, T: 1.0, W: 1.0, Th: 0, F: 0, Sa: 0, Su: 0 } // 3.2h / 8h = 40%
      : { M: 2.2, T: 2.0, W: 1.8, Th: 0, F: 0, Sa: 0, Su: 0 }; // 6.0h / 15h = 40%

  const total = Object.values(baseDaily).reduce((a, b) => a + b, 0);
  const newWeekly: WeeklyActivityData = {
    weekStart: currentMonday,
    targetHours,
    dailyHours: baseDaily,
    totalHours: Math.round(total * 10) / 10,
  };

  try {
    localStorage.setItem(WEEKLY_KEY, JSON.stringify(newWeekly));
  } catch {
    // Ignore
  }

  return newWeekly;
}

export function logWeeklyHours(hours: number): WeeklyActivityData {
  const current = getWeeklyActivity();
  const dayKey = getDayAbbrInTimezone();
  const existingDayHours = current.dailyHours[dayKey] || 0;
  current.dailyHours[dayKey] = Math.round((existingDayHours + hours) * 10) / 10;

  const total = Object.values(current.dailyHours).reduce((a, b) => a + b, 0);
  current.totalHours = Math.round(total * 10) / 10;

  try {
    localStorage.setItem(WEEKLY_KEY, JSON.stringify(current));
  } catch {
    // Ignore
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('learnmate_activity_updated', { detail: current }));
  }

  return current;
}

// ─────────────────────────────────────────────
// Notifications Store
// ─────────────────────────────────────────────
export function getNotifications(): DashboardNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore
  }

  const initialNotifications: DashboardNotification[] = [
    {
      id: 'notif-1',
      title: 'Adaptive Pathway Updated',
      description: 'Your syllabus has adjusted to your recent quiz performance in Distributed Storage.',
      time: '12m ago',
      read: false,
      type: 'milestone',
      link: '/pathway',
    },
    {
      id: 'notif-2',
      title: 'Weekly Study Target: 40% Reached',
      description: 'You have logged 3.2 hours toward your weekly 8.0-hour goal. Keep up the momentum!',
      time: '1h ago',
      read: false,
      type: 'goal',
      link: '/dashboard',
    },
    {
      id: 'notif-3',
      title: 'AI Mentor Diagnostic Available',
      description: 'Granite has prepared a 10-minute diagnostic challenge on Raft Quorum Invariants.',
      time: '3h ago',
      read: false,
      type: 'mentor',
      link: '/companion',
    },
    {
      id: 'notif-4',
      title: 'Streak Milestone Achieved',
      description: 'You have maintained your consistent study rhythm for 14 consecutive days.',
      time: 'Yesterday',
      read: true,
      type: 'system',
      link: '/dashboard',
    },
  ];

  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(initialNotifications));
  } catch {
    // Ignore
  }
  return initialNotifications;
}

export function markNotificationAsRead(id: string): DashboardNotification[] {
  const notifications = getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch {
    // Ignore
  }
  return notifications;
}

export function markAllNotificationsAsRead(): DashboardNotification[] {
  const notifications = getNotifications().map((n) => ({ ...n, read: true }));
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch {
    // Ignore
  }
  return notifications;
}

export function clearAllNotifications(): DashboardNotification[] {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
  } catch {
    // Ignore
  }
  return [];
}

// ─────────────────────────────────────────────
// Sidebar Collapsed State
// ─────────────────────────────────────────────
export function getSidebarCollapsed(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setSidebarCollapsed(collapsed: boolean): void {
  try {
    localStorage.setItem(SIDEBAR_KEY, String(collapsed));
  } catch {
    // Ignore
  }
}

// ─────────────────────────────────────────────
// Dashboard Milestones Persistence (Timezone & IST aware)
// ─────────────────────────────────────────────
export function getStoredMilestones(defaultTrajectory = 'career'): DashboardMilestone[] {
  try {
    const raw = localStorage.getItem(MILESTONES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore
  }

  let defaults: DashboardMilestone[] = [];
  if (defaultTrajectory.includes('tech') || defaultTrajectory.includes('Rust')) {
    defaults = [
      {
        id: 'm1',
        title: 'Rust Concurrency & Arc/Mutex Internals',
        subtitle: 'Completed Yesterday • Score: 98%',
        completed: true,
      },
      {
        id: 'm2',
        title: 'Zero-Copy Sockets & io_uring Lab',
        subtitle: 'Today • 11:59 PM IST',
        badge: 'High Pri',
        badgeColor: 'bg-error-container/60 text-error',
        completed: false,
      },
      {
        id: 'm3',
        title: 'Tokio Multi-Threaded Task Scheduling',
        subtitle: 'Tomorrow • 06:00 PM IST • Peer Review',
        completed: false,
      },
      {
        id: 'm4',
        title: 'Lock-Free Queues Benchmark Capstone',
        subtitle: 'Next Week • 08:00 PM IST • Benchmark Evaluation',
        completed: false,
      },
    ];
  } else if (defaultTrajectory.includes('research')) {
    defaults = [
      {
        id: 'm1',
        title: 'Paxos vs. Raft Comparative Proof Analysis',
        subtitle: 'Completed Yesterday • Score: 98%',
        completed: true,
      },
      {
        id: 'm2',
        title: 'TLA+ Model Checking & Safety Invariants',
        subtitle: 'Today • 11:59 PM IST',
        badge: 'High Pri',
        badgeColor: 'bg-error-container/60 text-error',
        completed: false,
      },
      {
        id: 'm3',
        title: 'Byzantine Fault Tolerance & FLP Impossibility',
        subtitle: 'Tomorrow • 06:00 PM IST • Cohort Peer Review',
        completed: false,
      },
      {
        id: 'm4',
        title: 'Asymmetric Network Quorum Capstone Paper',
        subtitle: 'Next Week • 08:00 PM IST • Formal Review',
        completed: false,
      },
    ];
  } else {
    defaults = [
      {
        id: 'm1',
        title: 'MapReduce Practical Implementation',
        subtitle: 'Completed Yesterday • Score: 98%',
        completed: true,
      },
      {
        id: 'm2',
        title: 'Raft Consensus Algorithm Lab',
        subtitle: 'Today • 11:59 PM IST',
        badge: 'High Pri',
        badgeColor: 'bg-error-container/60 text-error',
        completed: false,
      },
      {
        id: 'm3',
        title: 'Byzantine Fault Tolerance Paper Review',
        subtitle: 'Tomorrow • 06:00 PM IST • Cohort Peer Review',
        completed: false,
      },
      {
        id: 'm4',
        title: 'Distributed Storage Final Capstone',
        subtitle: 'Next Week • 08:00 PM IST • Benchmark Evaluation',
        completed: false,
      },
    ];
  }

  try {
    localStorage.setItem(MILESTONES_KEY, JSON.stringify(defaults));
  } catch {
    // Ignore
  }
  return defaults;
}

export function saveStoredMilestones(milestones: DashboardMilestone[]): void {
  try {
    localStorage.setItem(MILESTONES_KEY, JSON.stringify(milestones));
  } catch {
    // Ignore
  }
}

// ─────────────────────────────────────────────
// Settings & Theme Preferences Engine
// ─────────────────────────────────────────────

export const SETTINGS_KEY = 'learnmate_settings';
export const THEME_KEY = 'learnmate_theme';

export function getThemePreference(): 'system' | 'dark' | 'light' {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light' || stored === 'system') {
      return stored;
    }
    return 'system';
  } catch {
    return 'system';
  }
}

export function applyTheme(theme: 'system' | 'dark' | 'light'): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function setThemePreference(theme: 'system' | 'dark' | 'light'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  } catch {
    // Ignore
  }
}

export function getDefaultSettings(
  user?: { fullName?: string; email?: string; trajectory?: string } | null,
): UserSettings {
  const name = user?.fullName || 'Alex Rivera';
  const email = user?.email || 'alex.rivera@distributed-core.io';
  const role = user?.trajectory || 'Staff Systems Engineer';

  return {
    profile: {
      fullName: name,
      email: email,
      role: role,
      timezone: getUserTimezone(),
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAXpXrboKZ3t3zyTfpdX2qdG5qJKRnB0Yr0ev8TDWomCidH9kNXTTvFrBR0L4L3XJEjDzIFkUZuy12j8RfG2NUuulFupU9kxglD4pQF5rb6oQGDGjvd_u3MIVxFzcROxqaOwWxuucO9g8smwJ6siyhE8j8Qof5xdYrM-YUdFflXM4mN02JmHbSl9K8Xet4L6K_nCFwFTvYydAYOrwwnRMtYZygDussufkJfzrum1axk',
      publicId: '#ALX-8902',
      vcs: {
        github: { username: 'arivera-kernel', linked: true },
        gitlab: { username: 'alex-rivera-ops', linked: true },
      },
    },
    aiCompanion: {
      model: 'granite-3.0',
      cognitiveMode: 'socratic',
      contextWindowTokens: 64,
      personalityDirective:
        'You are an expert distributed systems staff architect. When critiquing code, focus on memory-safety, raft consensus subtleties, p99 tail-latencies, and failover states before syntax.',
    },
    learning: {
      weeklyTargetHours: 8,
      dailyCardLimit: 15,
      retentionSensitivity: 'balanced',
      preferredSandbox: 'rust',
    },
    appearance: {
      theme: getThemePreference(),
      density: 'comfortable',
      highContrast: false,
      reducedMotion: false,
    },
    notifications: {
      emailDigest: true,
      spacedRepetitionAlerts: true,
      milestoneAchievements: true,
      mentorFeedback: false,
    },
    security: {
      twoFactorEnabled: true,
      activeSessions: [
        {
          id: 'sess-1',
          device: 'Chrome on macOS Sequoia (Apple Silicon)',
          location: 'San Francisco, USA',
          ip: '192.168.1.104',
          current: true,
          lastActive: 'Active now',
        },
        {
          id: 'sess-2',
          device: 'LearnMate iOS App v2.4',
          location: 'San Francisco, USA',
          ip: '192.168.1.105',
          current: false,
          lastActive: 'Last active 2 hours ago',
        },
      ],
    },
  };
}

export function getUserSettings(
  user?: { fullName?: string; email?: string; trajectory?: string } | null,
): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure any newly added fields have defaults
      const defaults = getDefaultSettings(user);
      return {
        ...defaults,
        ...parsed,
        profile: { ...defaults.profile, ...(parsed.profile || {}) },
        aiCompanion: { ...defaults.aiCompanion, ...(parsed.aiCompanion || {}) },
        learning: { ...defaults.learning, ...(parsed.learning || {}) },
        appearance: { ...defaults.appearance, ...(parsed.appearance || {}) },
        notifications: { ...defaults.notifications, ...(parsed.notifications || {}) },
        security: { ...defaults.security, ...(parsed.security || {}) },
      };
    }
  } catch {
    // Ignore error
  }
  return getDefaultSettings(user);
}

export function setUserSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    if (settings.profile.timezone) {
      setUserTimezone(settings.profile.timezone);
    }
    if (settings.appearance.theme) {
      setThemePreference(settings.appearance.theme);
    }
  } catch {
    // Ignore
  }
}

export function exportUserDataBackup(): void {
  if (typeof window === 'undefined') return;
  const backupData: Record<string, any> = {
    exportDate: new Date().toISOString(),
    platform: 'LearnMate AI',
    version: '2.4',
  };

  const keys = [
    'learnmate_user',
    'learnmate_auth',
    'learnmate_settings',
    'learnmate_timezone',
    'learnmate_streak_data',
    'learnmate_weekly_activity',
    'learnmate_dashboard_milestones',
    'learnmate_notifications',
  ];

  keys.forEach((k) => {
    try {
      const item = localStorage.getItem(k);
      if (item) {
        backupData[k] = JSON.parse(item);
      }
    } catch {
      backupData[k] = localStorage.getItem(k);
    }
  });

  const blob = new Blob([JSON.stringify(backupData, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const dateStr = new Date().toISOString().split('T')[0];
  a.download = `learnmate_user_backup_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function clearOfflineCache(): void {
  try {
    const preserveKeys = ['learnmate_auth', 'learnmate_accounts', 'learnmate_user', 'learnmate_settings'];
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !preserveKeys.includes(key)) {
        toRemove.push(key);
      }
    }
    toRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    // Ignore
  }
}

