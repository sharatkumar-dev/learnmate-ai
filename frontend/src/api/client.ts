import type {
  LearnerProfile,
  Pathway,
  ProgressState,
  ProgressSummary,
  RecommendationList,
  SessionState,
  SkillGapReport,
  ChatResponse,
} from '@/types/index';

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  'http://localhost:8000';

const SESSION_KEY = 'learnmate_session_id';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function getSessionId(): string | null {
  return sessionStorage.getItem(SESSION_KEY);
}

function setSessionId(id: string): void {
  sessionStorage.setItem(SESSION_KEY, id);
}

function clearSessionId(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const sid = getSessionId();
  if (sid) {
    headers['X-Session-ID'] = sid;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      0,
      'Unable to connect to the server. Please ensure the backend is running.',
    );
  }

  if (res.status === 404) {
    clearSessionId();
    throw new ApiError(404, 'Session not found. Please restart onboarding.');
  }

  if (res.status >= 500) {
    throw new ApiError(res.status, 'Something went wrong. Please try again.');
  }

  if (!res.ok) {
    let msg = res.statusText;
    try {
      const err = (await res.json()) as { detail?: string };
      if (err.detail) msg = err.detail;
    } catch {
      // ignore parse error
    }
    throw new ApiError(res.status, msg);
  }

  return res.json() as Promise<T>;
}

async function requestWithSessionCapture<T>(
  path: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const sid = getSessionId();
  if (sid) headers['X-Session-ID'] = sid;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      0,
      'Unable to connect to the server. Please ensure the backend is running.',
    );
  }

  if (!res.ok) {
    throw new ApiError(
      res.status,
      res.status >= 500 ? 'Something went wrong. Please try again.' : res.statusText,
    );
  }

  const newSid = res.headers.get('X-Session-ID');
  if (newSid) setSessionId(newSid);

  return res.json() as Promise<T>;
}

// ── Public API functions ──────────────────────────────────────────────────────

export async function startSession(
  profile?: LearnerProfile,
): Promise<{ session_id: string }> {
  return requestWithSessionCapture<{ session_id: string }>(
    '/api/session/start',
    { profile },
  );
}

export async function getSession(sessionId: string): Promise<SessionState> {
  return request<SessionState>('GET', `/api/session/${sessionId}`);
}

export async function generatePathway(profile: LearnerProfile): Promise<Pathway> {
  return request<Pathway>('POST', '/api/pathway/generate', { profile });
}

export async function adaptPathway(
  feedback: string,
  completedMilestoneIds: string[],
): Promise<Pathway> {
  return request<Pathway>('POST', '/api/pathway/adapt', {
    feedback,
    completed_milestone_ids: completedMilestoneIds,
  });
}

export async function analyzeSkills(
  currentSkills: string[],
  targetRole: string,
): Promise<SkillGapReport> {
  return request<SkillGapReport>('POST', '/api/skills/analyze', {
    current_skills: currentSkills,
    target_role: targetRole,
  });
}

export async function getRecommendations(): Promise<RecommendationList> {
  return request<RecommendationList>('POST', '/api/recommendations');
}

export async function updateProgress(milestoneId: string): Promise<ProgressState> {
  return request<ProgressState>('POST', '/api/progress/update', {
    milestone_id: milestoneId,
  });
}

export async function getProgressSummary(): Promise<ProgressSummary> {
  return request<ProgressSummary>('GET', '/api/progress/summary');
}

export async function sendCompanionMessage(message: string): Promise<ChatResponse> {
  return request<ChatResponse>('POST', '/api/companion/chat', { message });
}
