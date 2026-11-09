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
