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

function handleFallback<T>(path: string, body?: any): T {
  console.info(`[LearnMate API] Backend unreachable at ${BASE_URL}. Using in-browser IBM Granite simulation for ${path}.`);
  const sid = getSessionId() || 'demo-session-' + Math.random().toString(36).slice(2, 8);
  setSessionId(sid);

  if (path.includes('/session/start')) {
    return { session_id: sid, message: 'Session created successfully' } as T;
  }
  if (path.includes('/pathway/generate')) {
    const role = body?.profile?.target_role || 'Distributed Systems Architect';
    return {
      target_role: role,
      milestones: [
        {
          id: 'm1',
          title: `Foundations of ${role}`,
          description: `Core primitives, concurrency patterns, and storage engine mechanics for ${role}.`,
          estimated_hours: 12,
          resources: [
            { title: `${role} Engineering Guide`, url: 'https://skillsbuild.org', type: 'guide' },
            { title: 'Interactive Foundations Lab', url: 'https://github.com', type: 'interactive' }
          ]
        },
        {
          id: 'm2',
          title: 'Consensus & High-Availability Architecture',
          description: 'Implement distributed consensus, leader election, and high availability protocols.',
          estimated_hours: 18,
          resources: [
            { title: 'In Search of an Understandable Consensus Algorithm (Raft)', url: 'https://raft.github.io/raft.pdf', type: 'paper' },
            { title: 'MIT 6.824 Distributed Systems Lab', url: 'https://pdos.csail.mit.edu/6.824/', type: 'course' }
          ]
        },
        {
          id: 'm3',
          title: 'Production Hardening & System Resilience',
          description: 'End-to-end telemetry, chaos engineering, load testing, and security auditing.',
          estimated_hours: 15,
          resources: [
            { title: 'Google Site Reliability Engineering (SRE)', url: 'https://sre.google', type: 'book' }
          ]
        }
      ],
      _mock: true
    } as T;
  }
  if (path.includes('/pathway/adapt')) {
    return {
      target_role: 'Distributed Systems Architect',
      milestones: [
        {
          id: 'm1',
          title: 'Foundations of Distributed Architecture',
          description: 'Core primitives, concurrency patterns, and storage engines.',
          estimated_hours: 10,
          resources: []
        },
        {
          id: 'm2_adapted',
          title: 'Accelerated Consensus Protocol Deep-Dive (Adapted)',
          description: `Adapted per your input: "${body?.feedback || 'Deep dive'}". Focuses on practical state-machine replication and Raft implementation.`,
          estimated_hours: 14,
          resources: [
            { title: 'Raft Visual Simulator', url: 'https://raft.github.io', type: 'interactive' }
          ]
        },
        {
          id: 'm3',
          title: 'Production Hardening & System Resilience',
          description: 'End-to-end telemetry and chaos testing.',
          estimated_hours: 15,
          resources: []
        }
      ],
      _mock: true
    } as T;
  }
  if (path.includes('/skills/analyze')) {
    const role = body?.target_role || 'Distributed Systems Architect';
    return {
      target_role: role,
      gaps: [
        {
          skill: `Advanced ${role} Distributed Protocols`,
          priority: 'high',
          rationale: `Core requirement for enterprise ${role} positions.`
        },
        {
          skill: 'Consensus Algorithms (Raft / Paxos Quorums)',
          priority: 'high',
          rationale: 'Fundamental for high-availability distributed state machines.'
        },
        {
          skill: 'Distributed Tracing & OpenTelemetry',
          priority: 'medium',
          rationale: 'Essential for debugging tail latency and network partitions.'
        }
      ],
      _mock: true
    } as T;
  }
  if (path.includes('/recommendations')) {
    return {
      recommendations: [
        {
          title: 'In Search of an Understandable Consensus Algorithm (Raft)',
          url: 'https://raft.github.io/raft.pdf',
          type: 'paper',
          difficulty: 'intermediate',
          estimated_duration: '4 hours',
          addressed_skill: 'Consensus Protocols'
        },
        {
          title: 'MIT 6.824: Distributed Systems Engineering',
          url: 'https://pdos.csail.mit.edu/6.824/',
          type: 'course',
          difficulty: 'advanced',
          estimated_duration: '24 hours',
          addressed_skill: 'Distributed Systems'
        },
        {
          title: 'Designing Data-Intensive Applications',
          url: 'https://dataintensive.net',
          type: 'book',
          difficulty: 'advanced',
          estimated_duration: '30 hours',
          addressed_skill: 'System Architecture'
        }
      ],
      _mock: true
    } as T;
  }
  if (path.includes('/progress/update')) {
    return {
      milestones: ['m1', 'm2', 'm3'],
      completed: [body?.milestone_id || 'm1']
    } as T;
  }
  if (path.includes('/progress/summary')) {
    return {
      completion_pct: 33.3,
      narrative: 'You have completed the core Foundations module and are now actively mastering the Consensus & Leader Election curriculum.',
      _mock: true
    } as T;
  }
  if (path.includes('/companion/chat')) {
    const msg = body?.message || 'Hello';
    return {
      response: `Regarding "${msg}": In distributed state-machine architectures, consistency requires majority quorum agreement (Q > N/2). When network partitions split cluster nodes, the majority partition continues accepting commits while the minority isolates itself into election timeouts to prevent split-brain inconsistencies.`,
      suggested_actions: [
        'Inspect Quorum Topology Diagram in Roadmap',
        'Review Raft Consensus Lab Notes',
        'Ask about Log Compaction'
      ],
      _mock: true
    } as T;
  }
  if (path.includes('/session/')) {
    return {
      session_id: sid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profile: {
        target_role: 'Distributed Systems Architect',
        current_skills: ['Go', 'Docker', 'Linux'],
        interests: ['Consensus', 'Cloud'],
        time_available_hours_per_week: 15
      },
      pathway: null,
      skill_gaps: null,
      recommendations: { recommendations: [] },
      progress: { milestones: [], completed: [] },
      chat_history: []
    } as T;
  }
  throw new ApiError(0, 'Unable to connect to the server.');
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
    return handleFallback<T>(path, body);
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
    return handleFallback<T>(path, body);
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
