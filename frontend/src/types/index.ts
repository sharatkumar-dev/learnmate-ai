// ─────────────────────────────────────────────
// Shared literal types
// ─────────────────────────────────────────────

export type ResourceType = 'course' | 'tutorial' | 'book' | 'video' | 'article';
export type SkillPriority = 'high' | 'medium' | 'low';
export type ChatRole = 'user' | 'assistant';

// ─────────────────────────────────────────────
// Learner profile
// ─────────────────────────────────────────────

export interface LearnerProfile {
  target_role: string;
  current_skills: string[];
  interests: string[];
  time_available_hours_per_week: number;
}

// ─────────────────────────────────────────────
// Learning pathway
// ─────────────────────────────────────────────

export interface Milestone {
  id: string;
  title: string;
  description: string;
  resources: string[];
  order: number;
  completed: boolean;
}

export interface Pathway {
  milestones: Milestone[];
  estimated_duration_weeks: number;
  target_role: string;
  _mock?: boolean;
}

// ─────────────────────────────────────────────
// Skill gap analysis
// ─────────────────────────────────────────────

export interface SkillGap {
  skill: string;
  priority: SkillPriority;
  rationale: string;
}

export interface SkillGapReport {
  gaps: SkillGap[];
  target_role: string;
  _mock?: boolean;
}

// ─────────────────────────────────────────────
// Course recommendations
// ─────────────────────────────────────────────

export interface Recommendation {
  title: string;
  url: string;
  type: ResourceType;
  duration: string;
  skill: string;
}

export interface RecommendationList {
  recommendations: Recommendation[];
  _mock?: boolean;
}

// ─────────────────────────────────────────────
// Progress tracking
// ─────────────────────────────────────────────

export interface ProgressState {
  milestones: string[]; // all milestone IDs
  completed: string[]; // completed milestone IDs
}

export interface ProgressSummary {
  narrative: string;
  completion_pct: number;
  next_steps: string[];
  _mock?: boolean;
}

// ─────────────────────────────────────────────
// Chat / AI companion
// ─────────────────────────────────────────────

export interface ChatMessage {
  role: ChatRole;
  content: string;
  timestamp: string; // ISO 8601
}

export interface ChatResponse {
  response: string;
  suggested_actions: string[];
  _mock?: boolean;
  model_used?: string;
  citations?: string[];
  conversation_id?: string;
}

// ─────────────────────────────────────────────
// Session state
// ─────────────────────────────────────────────

export interface SessionState {
  session_id: string;
  profile: LearnerProfile | null;
  pathway: Pathway | null;
  skill_gaps: SkillGapReport | null;
  recommendations: RecommendationList | null;
  progress: ProgressState;
  chat_history: ChatMessage[];
}

// ─────────────────────────────────────────────
// User settings & preferences
// ─────────────────────────────────────────────

export interface UserSettings {
  profile: {
    fullName: string;
    email: string;
    role: string;
    timezone: string;
    avatarUrl?: string;
    publicId: string;
    vcs: {
      github?: { username: string; linked: boolean };
      gitlab?: { username: string; linked: boolean };
    };
  };
  aiCompanion: {
    model: 'granite-3.0' | 'granite-3.0-instruct' | 'granite-3.0-guardian';
    cognitiveMode: 'socratic' | 'direct';
    contextWindowTokens: number;
    personalityDirective: string;
  };
  learning: {
    weeklyTargetHours: number;
    dailyCardLimit: number;
    retentionSensitivity: 'relaxed' | 'balanced' | 'strict';
    preferredSandbox: 'rust' | 'go' | 'python' | 'typescript';
  };
  appearance: {
    theme: 'system' | 'dark' | 'light';
    density: 'comfortable' | 'compact';
    highContrast: boolean;
    reducedMotion: boolean;
  };
  notifications: {
    emailDigest: boolean;
    spacedRepetitionAlerts: boolean;
    milestoneAchievements: boolean;
    mentorFeedback: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    activeSessions: Array<{
      id: string;
      device: string;
      location: string;
      ip: string;
      current: boolean;
      lastActive: string;
    }>;
  };
}

