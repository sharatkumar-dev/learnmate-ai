import { getRoadmapData } from './roadmapStore';

export type CognitiveMode = 'socratic' | 'code' | 'direct';

export interface ChatAttachmentItem {
  id: string;
  name: string;
  size: number;
  type: 'code' | 'pdf' | 'doc' | 'text';
  textPreview: string;
  textContent: string;
  uploadedAt: string;
}

export interface CompanionMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode?: CognitiveMode | string;
  modelUsed?: string;
  citations?: string[];
  attachments?: ChatAttachmentItem[];
  feedback?: 'up' | 'down';
}

export interface ConversationThread {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  cognitiveMode: CognitiveMode;
  messages: CompanionMessage[];
  attachedDocs: ChatAttachmentItem[];
  isBookmarked: boolean;
}

const THREADS_STORAGE_KEY = 'learnmate_companion_threads_v2';
const ACTIVE_THREAD_KEY = 'learnmate_companion_active_thread_id_v2';

// ─────────────────────────────────────────────
// Default Starter Conversation
// ─────────────────────────────────────────────

function createInitialThread(_userName: string = 'Learner'): ConversationThread {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    id: 'thread-default-raft',
    title: 'Raft Consensus & Quorum Partition Safety',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    cognitiveMode: 'socratic',
    isBookmarked: true,
    attachedDocs: [
      {
        id: 'doc-ongaro-raft',
        name: 'Ongaro_Ousterhout_Raft_Paper.pdf',
        size: 524288,
        type: 'pdf',
        textPreview: 'In Search of an Understandable Consensus Algorithm (Diego Ongaro and John Ousterhout, Stanford University)...',
        textContent: 'In Search of an Understandable Consensus Algorithm (Diego Ongaro and John Ousterhout). Quorum requirements: Strict majority Q = floor(N/2) + 1. Leader election and log replication guarantees linearizable state machine replication.',
        uploadedAt: 'Today',
      },
      {
        id: 'doc-raft-core-go',
        name: 'raft_consensus_core.go',
        size: 14336,
        type: 'code',
        textPreview: 'package raft // Raft consensus implementation in Go with term guards and quorum commit check...',
        textContent: 'package raft\n\nfunc (rf *Raft) checkCommitQuorum(entryIndex int) bool {\n    matchCount := 1\n    quorum := (len(rf.peers) / 2) + 1\n    for _, matchIdx := range rf.matchIndex {\n        if matchIdx >= entryIndex { matchCount++ }\n    }\n    return matchCount >= quorum\n}',
        uploadedAt: 'Today',
      },
    ],
    messages: [
      {
        id: 'msg-seed-user',
        role: 'user',
        content:
          'Can you clarify why Raft requires a strict quorum for committing log entries, and what happens if a network partition isolates 2 nodes out of 5?',
        timestamp: timeStr,
      },
      {
        id: 'msg-seed-asst',
        role: 'assistant',
        content: `### Strict Majority Quorum & Network Partition Safety

In a cluster of **N = 5** nodes, Raft enforces that state machine transitions require agreement from a **strict majority**:
$$\\text{Quorum Size} = \\lfloor N / 2 \\rfloor + 1 = \\lfloor 5 / 2 \\rfloor + 1 = 3 \\text{ Nodes}$$

When a network partition bifurcates the cluster into **Partition A (3 nodes)** and **Partition B (2 nodes)**:

1. **Partition A (Majority)**: Can assemble a quorum ($3 \\ge 3$). It elects or maintains its leader and continues committing client requests.
2. **Partition B (Minority)**: Can collect at most 2 votes ($2 < 3$). Candidates repeatedly timeout and increment terms, but cannot form a quorum or commit log entries. State machine progress stalls safely on this side, preventing split-brain.
3. **Log Reconciliation on Heal**: Once the partition resolves, heartbeats from Partition A's leader (which committed entries with valid higher terms) force minority followers to overwrite uncommitted entries and synchronize.`,
        timestamp: timeStr,
        mode: 'socratic',
        modelUsed: 'Google Gemini 1.5 Flash (LearnMate Agent)',
        citations: ['Ongaro & Ousterhout (2014) §5.2, §5.4', 'Stanford CS244B Corpus'],
      },
    ],
  };
}

// ─────────────────────────────────────────────
// Thread Persistence & Management
// ─────────────────────────────────────────────

export function getStoredThreads(userName: string = 'Learner'): ConversationThread[] {
  try {
    const raw = localStorage.getItem(THREADS_STORAGE_KEY);
    if (!raw) {
      const initial = [createInitialThread(userName)];
      localStorage.setItem(THREADS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = [createInitialThread(userName)];
      localStorage.setItem(THREADS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return parsed;
  } catch {
    return [createInitialThread(userName)];
  }
}

export function saveStoredThreads(threads: ConversationThread[]): void {
  try {
    localStorage.setItem(THREADS_STORAGE_KEY, JSON.stringify(threads));
    window.dispatchEvent(new CustomEvent('learnmate_companion_threads_updated'));
  } catch (err) {
    console.error('Failed to save companion threads:', err);
  }
}

export function getActiveThreadId(): string {
  try {
    const active = localStorage.getItem(ACTIVE_THREAD_KEY);
    if (active) return active;
    const threads = getStoredThreads();
    const id = threads[0]?.id || 'thread-default-raft';
    localStorage.setItem(ACTIVE_THREAD_KEY, id);
    return id;
  } catch {
    return 'thread-default-raft';
  }
}

export function setActiveThreadId(threadId: string): void {
  try {
    localStorage.setItem(ACTIVE_THREAD_KEY, threadId);
    window.dispatchEvent(new CustomEvent('learnmate_companion_active_thread_changed', { detail: threadId }));
  } catch (err) {
    console.error('Failed to set active thread id:', err);
  }
}

export function createNewThread(
  title: string = 'New Conversation',
  mode: CognitiveMode = 'socratic'
): ConversationThread {
  const threads = getStoredThreads();
  const newThread: ConversationThread = {
    id: `thread-${Date.now()}`,
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cognitiveMode: mode,
    messages: [],
    attachedDocs: [],
    isBookmarked: false,
  };

  const updated = [newThread, ...threads];
  saveStoredThreads(updated);
  setActiveThreadId(newThread.id);
  return newThread;
}

export function deleteThread(threadId: string): ConversationThread[] {
  const threads = getStoredThreads();
  const filtered = threads.filter((t) => t.id !== threadId);
  if (filtered.length === 0) {
    filtered.push(createInitialThread());
  }
  saveStoredThreads(filtered);
  if (getActiveThreadId() === threadId) {
    setActiveThreadId(filtered[0].id);
  }
  return filtered;
}

export function addMessageToActiveThread(
  threadId: string,
  message: CompanionMessage
): ConversationThread | null {
  const threads = getStoredThreads();
  const idx = threads.findIndex((t) => t.id === threadId);
  if (idx === -1) return null;

  const target = threads[idx];
  const newMessages = [...target.messages, message];

  // Auto-generate title if this is the first user prompt
  let title = target.title;
  if (target.messages.length === 0 && message.role === 'user') {
    title = message.content.slice(0, 42).trim() + (message.content.length > 42 ? '...' : '');
  }

  const updatedThread: ConversationThread = {
    ...target,
    title,
    updatedAt: new Date().toISOString(),
    messages: newMessages,
  };

  threads[idx] = updatedThread;
  saveStoredThreads(threads);
  return updatedThread;
}

export function updateThreadCognitiveMode(threadId: string, mode: CognitiveMode): void {
  const threads = getStoredThreads();
  const idx = threads.findIndex((t) => t.id === threadId);
  if (idx !== -1) {
    threads[idx].cognitiveMode = mode;
    saveStoredThreads(threads);
  }
}

export function toggleThreadBookmark(threadId: string): boolean {
  const threads = getStoredThreads();
  const idx = threads.findIndex((t) => t.id === threadId);
  if (idx !== -1) {
    threads[idx].isBookmarked = !threads[idx].isBookmarked;
    saveStoredThreads(threads);
    return threads[idx].isBookmarked;
  }
  return false;
}

export function addDocumentToThread(threadId: string, doc: ChatAttachmentItem): void {
  const threads = getStoredThreads();
  const idx = threads.findIndex((t) => t.id === threadId);
  if (idx !== -1) {
    threads[idx].attachedDocs = [
      ...threads[idx].attachedDocs.filter((d) => d.name !== doc.name),
      doc,
    ];
    saveStoredThreads(threads);
  }
}

export function removeDocumentFromThread(threadId: string, docId: string): void {
  const threads = getStoredThreads();
  const idx = threads.findIndex((t) => t.id === threadId);
  if (idx !== -1) {
    threads[idx].attachedDocs = threads[idx].attachedDocs.filter((d) => d.id !== docId);
    saveStoredThreads(threads);
  }
}

// ─────────────────────────────────────────────
// Prompt Suggestions Generator
// ─────────────────────────────────────────────

export function getDynamicSuggestedPrompts(
  moduleCode: string = 'MOD-201',
  attachedDocs: ChatAttachmentItem[] = []
): string[] {
  if (attachedDocs.length > 0) {
    const doc = attachedDocs[attachedDocs.length - 1];
    return [
      `Analyze ${doc.name} and identify potential concurrency or safety flaws`,
      `Explain the core architectural invariants described in ${doc.name}`,
      `Generate unit test cases covering edge cases for ${doc.name}`,
    ];
  }

  const track = getRoadmapData();
  const activeStage = track.stages.find((s) => s.status === 'in-progress') || track.stages[0];
  const activeMod = activeStage.modules.find((m) => m.code === moduleCode) || activeStage.modules[0];

  if (activeMod.domain === 'concurrency') {
    return [
      'Why is CAS insufficient without acquire-release memory barriers?',
      'Show an example of the ABA race condition and how hazard pointers solve it',
      'Compare SeqCst vs Acquire-Release CPU cost on x86 vs ARM64',
    ];
  }

  if (activeMod.domain === 'storage') {
    return [
      'Compare Leveled vs Size-Tiered compaction write amplification in LSM trees',
      'How do Bloom filters achieve O(1) negative point lookup checks?',
      'Explain WAL segment durability and fsync flush backpressure in RocksDB',
    ];
  }

  // Default: Consensus & Distributed Systems
  return [
    'Explain split-brain isolation and majority quorum in Raft',
    'Write a Go verification check for Raft checkCommitQuorum()',
    'Compare Raft log replication guarantees with Multi-Paxos and Zab',
  ];
}

// ─────────────────────────────────────────────
// Export Engine (Markdown & HTML)
// ─────────────────────────────────────────────

export function exportThreadToMarkdown(thread: ConversationThread, userName: string = 'Learner'): string {
  let md = `# LearnMate AI Companion Transcript: ${thread.title}\n\n`;
  md += `- **Date**: ${new Date(thread.createdAt).toLocaleString()}\n`;
  md += `- **Learner**: ${userName}\n`;
  md += `- **Cognitive Mode**: ${thread.cognitiveMode.toUpperCase()}\n`;
  md += `- **Attached Sources**: ${thread.attachedDocs.map((d) => d.name).join(', ') || 'None'}\n\n`;
  md += `---\n\n`;

  thread.messages.forEach((msg) => {
    const sender = msg.role === 'user' ? `You (${userName})` : 'LearnMate AI Tutor';
    md += `### ${sender} • ${msg.timestamp}\n\n`;
    md += `${msg.content}\n\n`;
    if (msg.citations && msg.citations.length > 0) {
      md += `*Citations: ${msg.citations.join(' • ')}*\n\n`;
    }
    md += `---\n\n`;
  });

  return md;
}

export function exportThreadToHtml(thread: ConversationThread, userName: string = 'Learner'): string {
  const title = thread.title;
  const messagesHtml = thread.messages
    .map((msg) => {
      const isUser = msg.role === 'user';
      return `
      <div style="margin-bottom: 24px; padding: 18px; border-radius: 12px; background: ${isUser ? '#EEF2FF' : '#F9FAFB'}; border-left: 4px solid ${isUser ? '#4F46E5' : '#10B981'};">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; color: #6B7280; font-family: sans-serif;">
          <strong>${isUser ? `You (${userName})` : 'LearnMate AI Tutor'}</strong>
          <span>${msg.timestamp}</span>
        </div>
        <div style="font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${msg.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        ${msg.citations && msg.citations.length > 0 ? `<div style="margin-top: 10px; font-size: 12px; color: #4F46E5;"><strong>Referenced:</strong> ${msg.citations.join(' • ')}</div>` : ''}
      </div>
    `;
    })
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title} - LearnMate Transcript</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 860px; margin: 40px auto; padding: 0 20px; color: #111827; }
    h1 { color: #312E81; border-bottom: 2px solid #E0E7FF; padding-bottom: 12px; }
    .meta { background: #F3F4F6; padding: 12px 16px; border-radius: 8px; margin-bottom: 30px; font-size: 13px; color: #4B5563; }
    @media print { body { max-width: 100%; margin: 0; } }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="meta">
    <div><strong>Learner:</strong> ${userName}</div>
    <div><strong>Cognitive Mode:</strong> ${thread.cognitiveMode.toUpperCase()}</div>
    <div><strong>Generated Date:</strong> ${new Date().toLocaleString()}</div>
    <div><strong>Attached References:</strong> ${thread.attachedDocs.map((d) => d.name).join(', ') || 'None'}</div>
  </div>
  <div>${messagesHtml}</div>
</body>
</html>`;
}
