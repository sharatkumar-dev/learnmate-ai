export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  activeDates: string[];
}

export interface WeeklyActivityData {
  weekStart: string; // YYYY-MM-DD (Monday)
  targetHours: number;
  dailyHours: Record<string, number>; // { 'M': 1.8, 'T': 2.4, ... }
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

// Helper to get local date string YYYY-MM-DD
export function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Helper to get current day abbreviation ('M', 'T', 'W', 'Th', 'F', 'Sa', 'Su')
export function getDayAbbr(date = new Date()): string {
  const days = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'];
  return days[date.getDay()];
}

// Helper to get Monday of the current week YYYY-MM-DD
export function getMondayKey(d = new Date()): string {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const monday = new Date(date.setDate(diff));
  const y = monday.getFullYear();
  const m = String(monday.getMonth() + 1).padStart(2, '0');
  const dayStr = String(monday.getDate()).padStart(2, '0');
  return `${y}-${m}-${dayStr}`;
}

// ─────────────────────────────────────────────
// Streak Management
// ─────────────────────────────────────────────
export function getStreakData(): StreakData {
  const today = getTodayKey();
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
        // Missed one or more days, streak resets to 0 (or 1 once active today)
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
  const today = getTodayKey();
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
  return { streak: updatedStreak, weekly };
}

// ─────────────────────────────────────────────
// Weekly Activity Management
// ─────────────────────────────────────────────
export function getWeeklyActivity(commitment: 'casual' | 'accelerated' | 'intensive' = 'accelerated'): WeeklyActivityData {
  const targetHours = commitment === 'casual' ? 4 : commitment === 'accelerated' ? 8 : 15;
  const currentMonday = getMondayKey();

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

  // Base starter activity for the week matching cohort pacing
  const baseDaily: Record<string, number> =
    commitment === 'casual'
      ? { M: 0.8, T: 1.0, W: 1.2, Th: 0.6, F: 0.8, Sa: 0.4, Su: 0 }
      : commitment === 'accelerated'
      ? { M: 1.8, T: 2.4, W: 2.1, Th: 1.5, F: 1.8, Sa: 0, Su: 0 }
      : { M: 2.5, T: 3.2, W: 3.5, Th: 2.8, F: 2.4, Sa: 1.2, Su: 0 };

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
  const dayKey = getDayAbbr();
  const existingDayHours = current.dailyHours[dayKey] || 0;
  current.dailyHours[dayKey] = Math.round((existingDayHours + hours) * 10) / 10;

  const total = Object.values(current.dailyHours).reduce((a, b) => a + b, 0);
  current.totalHours = Math.round(total * 10) / 10;

  try {
    localStorage.setItem(WEEKLY_KEY, JSON.stringify(current));
  } catch {
    // Ignore
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
      title: 'Weekly Study Target: 85% Reached',
      description: 'You are only 1.2 hours away from hitting your weekly dedicated commitment goal!',
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
// Dashboard Milestones Persistence
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
        subtitle: 'Today • 23:59 UTC',
        badge: 'High Pri',
        badgeColor: 'bg-error-container/60 text-error',
        completed: false,
      },
      {
        id: 'm3',
        title: 'Tokio Multi-Threaded Task Scheduling',
        subtitle: 'Due Thursday, Apr 17 • Peer Review',
        completed: false,
      },
      {
        id: 'm4',
        title: 'Lock-Free Queues Benchmark Capstone',
        subtitle: 'Due Apr 25 • Benchmark Evaluation',
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
        subtitle: 'Today • 23:59 UTC',
        badge: 'High Pri',
        badgeColor: 'bg-error-container/60 text-error',
        completed: false,
      },
      {
        id: 'm3',
        title: 'Byzantine Fault Tolerance & FLP Impossibility',
        subtitle: 'Due Thursday, Apr 17 • Cohort Peer Review',
        completed: false,
      },
      {
        id: 'm4',
        title: 'Asymmetric Network Quorum Capstone Paper',
        subtitle: 'Due Apr 25 • Formal Review',
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
        subtitle: 'Today • 23:59 UTC',
        badge: 'High Pri',
        badgeColor: 'bg-error-container/60 text-error',
        completed: false,
      },
      {
        id: 'm3',
        title: 'Byzantine Fault Tolerance Paper Review',
        subtitle: 'Due Thursday, Apr 17 • Cohort Peer Review',
        completed: false,
      },
      {
        id: 'm4',
        title: 'Distributed Storage Final Capstone',
        subtitle: 'Due Apr 25 • Benchmark Evaluation',
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
