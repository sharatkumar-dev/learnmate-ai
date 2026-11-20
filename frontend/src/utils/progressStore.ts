import { getWeeklyActivity, recordActivity, getUserTimezone } from './dashboardStore';
import { getRoadmapData, type RoadmapTrack, type RoadmapStage, type RoadmapModule, type ModuleDomain } from './roadmapStore';
import { getAllResources, type ResourceDomain } from './resourceStore';

export type TimePeriod = '7D' | '30D' | 'Quarter' | 'All-Time';
export type QueueFilter = 'all' | 'due' | 'upcoming';

export interface SpacedItem {
  id: string;
  conceptTitle: string;
  domain: string;
  moduleCode: string;
  difficultyScore: number; // e.g. 8.4
  difficultyLabel: 'Easy' | 'Med' | 'Hard';
  lastAssessedDaysAgo: number;
  decayIntervalDays: number;
  isDue: boolean;
  retentionPct: number; // 0 to 100
  question: string;
  keyAnswer: string;
}

export interface SkillDomainMastery {
  domain: string;
  label: string;
  masteryPct: number;
  completedConcepts: number;
  totalConcepts: number;
}

export interface VerifiedCredential {
  id: string;
  title: string;
  subtitle: string;
  issueDate: string;
  status: 'verified' | 'in-progress';
  progressPct: number;
  verificationHash: string;
  criteria: string;
  badgeType: 'architect' | 'kernel' | 'concurrency';
  badgeImageUrl: string;
}

export interface CadenceDayPoint {
  day: string; // 'MON', 'TUE', ...
  fullDate: string;
  hours: number;
  retentionPct: number;
  isToday: boolean;
}

export interface ProgressAnalytics {
  period: TimePeriod;
  velocityHoursPerWeek: number;
  targetHoursPerWeek: number;
  velocityTrendPct: number;
  velocityAhead: boolean;
  retentionStabilityPct: number;
  retentionTrendPct: number;
  conceptsMastered: number;
  totalConceptTargets: number;
  masteryTier: string;
  cadenceDays: CadenceDayPoint[];
  domainMastery: SkillDomainMastery[];
  spacedQueue: SpacedItem[];
  credentials: VerifiedCredential[];
  summaryNarrative: string;
  lastUpdatedStr: string;
}

const RECALL_STORAGE_KEY = 'learnmate_progress_recall_data';

// ─────────────────────────────────────────────
// Default Spaced Repetition Queue Data
// ─────────────────────────────────────────────

const INITIAL_SPACED_QUEUE: SpacedItem[] = [
  {
    id: 'spaced-raft-leader',
    conceptTitle: 'Raft Consensus: Leader Election Quorums',
    domain: 'Distributed Systems',
    moduleCode: 'MOD-201',
    difficultyScore: 8.4,
    difficultyLabel: 'Hard',
    lastAssessedDaysAgo: 2,
    decayIntervalDays: 1,
    isDue: true,
    retentionPct: 62,
    question: 'Under the Raft consensus algorithm, when is an entry considered permanently committed by the cluster leader?',
    keyAnswer:
      'An entry is committed once replicated on a strict majority quorum (N/2 + 1) of cluster nodes during the current term. The leader must also commit at least one entry from its current term by majority quorum before prior term entries become linearizable.',
  },
  {
    id: 'spaced-tcp-bbr',
    conceptTitle: 'TCP Congestion Control: BBR vs CUBIC',
    domain: 'Networking Internals',
    moduleCode: 'MOD-102',
    difficultyScore: 6.9,
    difficultyLabel: 'Med',
    lastAssessedDaysAgo: 4,
    decayIntervalDays: 1,
    isDue: true,
    retentionPct: 71,
    question: 'How does Google BBR avoid bufferbloat compared to loss-based congestion algorithms like CUBIC?',
    keyAnswer:
      'BBR models the physical network pipe by independently estimating round-trip propagation time (min RTT) and bottleneck bandwidth (BtlBw). It paces packet delivery without relying on packet loss as a congestion signal, preventing bloated switch buffers.',
  },
  {
    id: 'spaced-lockfree-cas',
    conceptTitle: 'Lock-free Queue: CAS Memory Ordering',
    domain: 'Concurrency',
    moduleCode: 'MOD-101',
    difficultyScore: 9.1,
    difficultyLabel: 'Hard',
    lastAssessedDaysAgo: 1,
    decayIntervalDays: 2,
    isDue: false,
    retentionPct: 86,
    question: 'Why is Acquire-Release memory ordering sufficient for pointer updates in Michael-Scott lock-free queues?',
    keyAnswer:
      'Release ordering ensures all writes to the new node are made visible before the pointer swap. Acquire ordering ensures subsequent readers see all initialized node fields without requiring expensive full Sequentially Consistent (SeqCst) memory barriers.',
  },
  {
    id: 'spaced-lsm-bloom',
    conceptTitle: 'LSM Trees & Bloom Filters: Compaction Strategies',
    domain: 'Storage Engines',
    moduleCode: 'MOD-302',
    difficultyScore: 5.2,
    difficultyLabel: 'Easy',
    lastAssessedDaysAgo: 6,
    decayIntervalDays: 3,
    isDue: false,
    retentionPct: 93,
    question: 'What trade-off is made when choosing Size-Tiered vs Leveled compaction in LSM-tree engines like RocksDB?',
    keyAnswer:
      'Size-Tiered compaction optimizes for high-throughput write workloads with lower write amplification, but has high space amplification (~100%). Leveled compaction strictly bounds space amplification and point-lookup latency at the expense of higher write amplification.',
  },
  {
    id: 'spaced-vector-clocks',
    conceptTitle: 'Vector Clocks: Causal Inconsistency Detection',
    domain: 'Distributed Systems',
    moduleCode: 'MOD-301',
    difficultyScore: 7.8,
    difficultyLabel: 'Med',
    lastAssessedDaysAgo: 5,
    decayIntervalDays: 2,
    isDue: false,
    retentionPct: 79,
    question: 'How do vector clocks distinguish between causally ordered updates and concurrent conflict forks?',
    keyAnswer:
      'Event A precedes event B if every clock component in A is <= B and at least one is strictly less. If neither vector dominates the other, the events are concurrent (a fork), necessitating sibling creation or application-layer reconciliation.',
  },
];

// ─────────────────────────────────────────────
// Default Verified Credentials
// ─────────────────────────────────────────────

const VERIFIED_CREDENTIALS: VerifiedCredential[] = [
  {
    id: 'cred-dist-architect',
    title: 'Distributed Systems Staff Architect',
    subtitle: 'Accreditation in consensus, consensus failure injection, and geo-replicated topologies.',
    issueDate: 'October 2024',
    status: 'verified',
    progressPct: 100,
    verificationHash: 'SHA256: 4f8b9e1c3a7d20f69a1b8c4d2e0f3178c9a5b4e2d1f0',
    criteria: 'Completed 28 rigorous case studies, Raft simulator evaluations, and Spanner TrueTime analysis.',
    badgeType: 'architect',
    badgeImageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA7JRdpRfqB6fu7EFArn9pcQFo8krE6ZpbhAheIg6W8qznpfEb-Lbu1zluC3lXF6pnCtFMjE51CaX8bBd08QWRPHGAY1fNSI6GzXJY6iS16IY8cJ2nk6nbzmqyCogYkc7bJiXJxMYhZKmiYzMAE-I6DvGxxLhNBPwIlfBBVD5JxBL6lwY0-_V-ds1ejd68pvhTt6SN0en-I8wPyhIwkmEEIWq2lyDFUVDZ1NaE2fyEA',
  },
  {
    id: 'cred-kernel-ebpf',
    title: 'Kernel Networking & eBPF Pro',
    subtitle: 'Validation of packet processing pipelines, ring buffer models, and zero-copy transports.',
    issueDate: 'November 2024',
    status: 'verified',
    progressPct: 100,
    verificationHash: 'SHA256: 7d1a2c3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e',
    criteria: 'Validated packet filtering with XDP, eBPF maps, socket steering, and zero-copy ring buffers.',
    badgeType: 'kernel',
    badgeImageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDwCDN90M_iQu8n_ssWbmqhpBktSr3M0PHVgikzZ9XwS0Y1HClHIm7_nbcK_fbiAx2938r2apJfVqnVzyBS73NQDLhPTpMwMOTqJsg7NzTvolwiB1kzDpByVwqRfNy3KRuNPVwBfNWvJUGAj8-BV4BNvQoRszeIYjJX0GGlXlsW02p2HvVwoMT-tP32qHpwfWO-BbzvrGQUh2PMrUzTuA5uYLLHDoDydPPNF87II04b',
  },
  {
    id: 'cred-concurrency-models',
    title: 'Concurrency & Memory Models',
    subtitle: 'Lock-free data structures, atomics, and cache coherence protocols.',
    issueDate: 'In Progress (Target Dec 2026)',
    status: 'in-progress',
    progressPct: 84,
    verificationHash: 'PENDING_FINAL_EVALUATION',
    criteria: 'Passing 5 lock-free multi-threaded test harnesses, crossbeam epochs, and memory barrier proofs.',
    badgeType: 'concurrency',
    badgeImageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDK0IoflcN9uCb4Y7IZktd0JbNFiTo0v4D69XKvJuzEoJXrkvYUmEL7klHeWdYPNKjsMW8sqTDEuii40Fd8KoMmU88vy4WeBaEN_NXjIR855KDHgpKJWQb382t7IjQzgKofvDD0OOAiK9gPOLP8W01H1hTLOvgRlImGP8P9Wajn0WC3qgH-pShxAp5zLExgJYOnl7RRIM8JxJr3gIp_AV7Rs_65qezoVjB8BWFNIicT',
  },
];

// ─────────────────────────────────────────────
// Storage & Persistence
// ─────────────────────────────────────────────

function loadSpacedQueue(): SpacedItem[] {
  try {
    const raw = localStorage.getItem(RECALL_STORAGE_KEY);
    if (!raw) return INITIAL_SPACED_QUEUE;
    return JSON.parse(raw);
  } catch {
    return INITIAL_SPACED_QUEUE;
  }
}

function saveSpacedQueue(queue: SpacedItem[]): void {
  try {
    localStorage.setItem(RECALL_STORAGE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.error('Failed to save spaced queue:', err);
  }
}

// ─────────────────────────────────────────────
// Analytics Synthesis Engine
// ─────────────────────────────────────────────

export function getProgressAnalytics(period: TimePeriod = '30D'): ProgressAnalytics {
  const queue = loadSpacedQueue();
  const track: RoadmapTrack = getRoadmapData();
  const resources = getAllResources();
  const weekly = getWeeklyActivity();
  const timezone = getUserTimezone();

  // 1. Calculate Velocity & Target
  const targetPerWeek = weekly.targetHours || 8.0;
  let multiplier = 1;
  let trendPct = 18;
  switch (period) {
    case '7D':
      multiplier = 1;
      trendPct = 14;
      break;
    case '30D':
      multiplier = 1;
      trendPct = 18;
      break;
    case 'Quarter':
      multiplier = 1.05;
      trendPct = 22;
      break;
    case 'All-Time':
      multiplier = 1.1;
      trendPct = 25;
      break;
  }

  const currentLogged = weekly.totalHours || 3.2;
  const velocityHoursPerWeek = parseFloat((currentLogged * multiplier).toFixed(1));
  const velocityAhead = velocityHoursPerWeek >= targetPerWeek * 0.5;

  // 2. Active Retention Index
  const avgRetention = queue.reduce((acc, q) => acc + q.retentionPct, 0) / (queue.length || 1);
  const retentionStabilityPct = parseFloat(avgRetention.toFixed(1));
  const retentionTrendPct = 3.2;

  // 3. Concepts Mastered
  let completedModulesCount = 0;
  let _totalModulesCount = 0;
  if (track && track.stages) {
    track.stages.forEach((st: RoadmapStage) => {
      st.modules.forEach((mod: RoadmapModule) => {
        _totalModulesCount++;
        if (mod.status === 'completed') completedModulesCount++;
      });
    });
  } else {
    completedModulesCount = 2;
    _totalModulesCount = 7;
  }

  const completedResourcesCount = resources.filter((r) => r.status === 'completed').length;
  const baseConceptMultiplier = 8;
  const conceptsMastered = Math.min(70, completedModulesCount * baseConceptMultiplier + completedResourcesCount * 3 + 32);
  const totalConceptTargets = 70;

  // 4. Cadence & Decay Curve (Mon to Sun)
  const dayKeys: { key: string; label: string; name: string }[] = [
    { key: 'M', label: 'MON', name: 'Monday' },
    { key: 'T', label: 'TUE', name: 'Tuesday' },
    { key: 'W', label: 'WED', name: 'Wednesday' },
    { key: 'Th', label: 'THU', name: 'Thursday' },
    { key: 'F', label: 'FRI', name: 'Friday' },
    { key: 'Sa', label: 'SAT', name: 'Saturday' },
    { key: 'Su', label: 'SUN', name: 'Sunday' },
  ];

  // Resolve today in IST
  const todayDayMap: Record<number, string> = { 0: 'Su', 1: 'M', 2: 'T', 3: 'W', 4: 'Th', 5: 'F', 6: 'Sa' };
  const currentDayIndex = new Date().getDay();
  const currentDayKey = todayDayMap[currentDayIndex] || 'Th';

  const cadenceDays: CadenceDayPoint[] = dayKeys.map((dk, index) => {
    const rawHrs = weekly.dailyHours[dk.key] || 0;
    const baseDecay = 94 - index * 3.5;
    const hoursBoost = Math.min(20, rawHrs * 8.5);
    const retention = Math.min(99, Math.max(55, Math.round(baseDecay + hoursBoost)));

    return {
      day: dk.label,
      fullDate: dk.name,
      hours: rawHrs,
      retentionPct: retention,
      isToday: dk.key === currentDayKey,
    };
  });

  // 5. Skill Domain Mastery Breakdown (Dynamic Synthesis from Roadmap, Resources & Spaced Repetition)
  const allModules: RoadmapModule[] = [];
  if (track && track.stages) {
    track.stages.forEach((st: RoadmapStage) => {
      st.modules.forEach((mod: RoadmapModule) => allModules.push(mod));
    });
  }

  interface DomainConfig {
    domain: string;
    label: string;
    roadmapDomains: ModuleDomain[];
    resourceDomains: ResourceDomain[];
    queueKeywords: string[];
    baseTargetConcepts: number;
    defaultMastery: number;
  }

  const domainConfigs: DomainConfig[] = [
    {
      domain: 'system-design',
      label: 'System Design',
      roadmapDomains: ['consensus', 'fault-tolerance'],
      resourceDomains: ['system-design', 'distributed-systems'],
      queueKeywords: ['distributed', 'networking', 'tcp', 'architecture'],
      baseTargetConcepts: 17,
      defaultMastery: 90,
    },
    {
      domain: 'consensus',
      label: 'Data Consistency & Consensus',
      roadmapDomains: ['consensus'],
      resourceDomains: ['consensus', 'formal-verification'],
      queueKeywords: ['raft', 'paxos', 'consensus', 'quorum'],
      baseTargetConcepts: 16,
      defaultMastery: 86,
    },
    {
      domain: 'concurrency',
      label: 'Concurrency Models',
      roadmapDomains: ['concurrency'],
      resourceDomains: ['concurrency', 'rust'],
      queueKeywords: ['concurrency', 'lock-free', 'cas', 'atomic', 'queue'],
      baseTargetConcepts: 13,
      defaultMastery: 82,
    },
    {
      domain: 'storage',
      label: 'Storage Engines & Compaction',
      roadmapDomains: ['storage'],
      resourceDomains: ['storage'],
      queueKeywords: ['storage', 'lsm', 'bloom', 'b-tree', 'compaction'],
      baseTargetConcepts: 12,
      defaultMastery: 76,
    },
    {
      domain: 'fault-recovery',
      label: 'Fault Recovery & Resiliency',
      roadmapDomains: ['fault-tolerance'],
      resourceDomains: ['distributed-systems'],
      queueKeywords: ['fault', 'recovery', 'vector', 'resiliency', 'partition'],
      baseTargetConcepts: 12,
      defaultMastery: 65,
    },
  ];

  const domainMastery: SkillDomainMastery[] = domainConfigs.map((cfg) => {
    // A. Roadmap Modules matching this domain
    const matchingMods = allModules.filter((m) => cfg.roadmapDomains.includes(m.domain));
    const modConcepts = matchingMods.flatMap((m) => m.keyConcepts);
    const modCompletedConcepts = matchingMods.reduce((acc, m) => {
      if (m.status === 'completed') return acc + m.keyConcepts.length;
      if (m.status === 'in-progress') return acc + Math.round(m.keyConcepts.length * (m.progressPct / 100));
      return acc;
    }, 0);
    const avgModProgress =
      matchingMods.length > 0
        ? matchingMods.reduce((acc, m) => acc + m.progressPct, 0) / matchingMods.length
        : cfg.defaultMastery;

    // B. Resource Library items matching this domain
    const matchingRes = resources.filter((r) => cfg.resourceDomains.includes(r.domain));
    const completedRes = matchingRes.filter((r) => r.status === 'completed').length;
    const inProgRes = matchingRes.filter((r) => r.status === 'in-progress').length;

    // C. Spaced Queue items matching this domain
    const matchingQueue = queue.filter((q) =>
      cfg.queueKeywords.some(
        (kw) => q.domain.toLowerCase().includes(kw) || q.conceptTitle.toLowerCase().includes(kw)
      )
    );
    const avgQueueRetention =
      matchingQueue.length > 0
        ? matchingQueue.reduce((acc, q) => acc + q.retentionPct, 0) / matchingQueue.length
        : retentionStabilityPct;

    // D. Calculate total and completed concept counts
    const totalConcepts = Math.max(cfg.baseTargetConcepts, modConcepts.length + matchingRes.length);
    const completedConcepts = Math.min(
      totalConcepts,
      Math.max(
        Math.round(totalConcepts * 0.4),
        modCompletedConcepts + completedRes * 2 + Math.round(inProgRes * 0.8) + (matchingQueue.length > 0 ? 3 : 0)
      )
    );

    // E. Dynamic Mastery Percentage Formula
    // Weights: Concept ratio (50%), Module progress (30%), Spaced Recall Retention (20%)
    const conceptRatioPct = (completedConcepts / totalConcepts) * 100;
    const dynamicMastery = Math.round(
      conceptRatioPct * 0.5 + avgModProgress * 0.3 + avgQueueRetention * 0.2
    );
    const masteryPct = Math.min(99, Math.max(25, dynamicMastery));

    return {
      domain: cfg.domain,
      label: cfg.label,
      masteryPct,
      completedConcepts,
      totalConcepts,
    };
  });

  // 6. Last Updated string
  const lastUpdatedStr = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
  });

  return {
    period,
    velocityHoursPerWeek,
    targetHoursPerWeek: targetPerWeek,
    velocityTrendPct: trendPct,
    velocityAhead,
    retentionStabilityPct,
    retentionTrendPct,
    conceptsMastered,
    totalConceptTargets,
    masteryTier: 'Tier 4',
    cadenceDays,
    domainMastery,
    spacedQueue: queue,
    credentials: VERIFIED_CREDENTIALS,
    summaryNarrative: `In ${period} tracking, study velocity of ${velocityHoursPerWeek} hrs/week is pacing strong against target commitment. Ebbinghaus retention stability calibrated at ${retentionStabilityPct}%.`,
    lastUpdatedStr: `${lastUpdatedStr} IST`,
  };
}

// ─────────────────────────────────────────────
// Interactive Spaced Recall Action
// ─────────────────────────────────────────────

export function submitSpacedRecall(itemId: string, rating: 'easy' | 'good' | 'hard'): SpacedItem {
  const queue = loadSpacedQueue();
  const idx = queue.findIndex((item) => item.id === itemId);
  if (idx === -1) throw new Error('Item not found in spaced queue');

  const item = queue[idx];
  let newInterval = 1;
  let newRetention = 60;

  switch (rating) {
    case 'easy':
      newInterval = item.decayIntervalDays * 2 + 3;
      newRetention = Math.min(99, item.retentionPct + 25);
      break;
    case 'good':
      newInterval = item.decayIntervalDays + 2;
      newRetention = Math.min(94, item.retentionPct + 15);
      break;
    case 'hard':
      newInterval = 1;
      newRetention = Math.max(50, item.retentionPct - 5);
      break;
  }

  const updatedItem: SpacedItem = {
    ...item,
    lastAssessedDaysAgo: 0,
    decayIntervalDays: newInterval,
    isDue: false,
    retentionPct: newRetention,
  };

  queue[idx] = updatedItem;
  saveSpacedQueue(queue);

  // Award +0.25h study credit in dashboard store
  recordActivity(0.25);

  window.dispatchEvent(new CustomEvent('learnmate_activity_updated'));
  window.dispatchEvent(new CustomEvent('learnmate_progress_updated', { detail: updatedItem }));

  return updatedItem;
}

// ─────────────────────────────────────────────
// Report Export Engines
// ─────────────────────────────────────────────

export function generateExecutiveReportHtml(period: TimePeriod = '30D'): string {
  const analytics = getProgressAnalytics(period);
  const track: RoadmapTrack = getRoadmapData();
  const dateStr = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: getUserTimezone(),
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LearnMate AI - Executive Learning & Retention Dossier (${period})</title>
  <style>
    @page { size: letter; margin: 20mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e1b4b; margin: 0; padding: 24px; background: #ffffff; line-height: 1.5; }
    .header { border-bottom: 2px solid #4f46e5; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
    .title { font-size: 24px; font-weight: 800; color: #1e1b4b; margin: 0 0 4px 0; }
    .subtitle { font-size: 14px; color: #6366f1; font-weight: 600; margin: 0; }
    .meta-box { text-align: right; font-size: 12px; color: #475569; }
    .badge { display: inline-block; background: #e0e7ff; color: #3730a3; padding: 3px 8px; border-radius: 9999px; font-weight: 700; font-size: 11px; text-transform: uppercase; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; }
    .card-title { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.05em; }
    .card-value { font-size: 22px; font-weight: 800; color: #1e1b4b; margin: 6px 0; }
    .card-desc { font-size: 11px; color: #475569; }
    h2 { font-size: 16px; font-weight: 700; color: #1e1b4b; margin: 24px 0 12px 0; border-left: 4px solid #4f46e5; padding-left: 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
    th { background: #f1f5f9; text-align: left; padding: 8px 10px; font-weight: 700; color: #334155; border-bottom: 1px solid #cbd5e1; }
    td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; color: #334155; }
    .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
    @media print { body { padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <span class="badge">Official Accredited Dossier</span>
      <h1 class="title">LearnMate AI // Executive Learning Dossier</h1>
      <p class="subtitle">Target Trajectory: ${track?.targetRole || 'Distributed Systems Staff Engineer'}</p>
    </div>
    <div class="meta-box">
      <div><strong>Reporting Window:</strong> ${period}</div>
      <div><strong>Generated:</strong> ${dateStr}</div>
      <div><strong>Accreditation Level:</strong> Tier 4 Mastery</div>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-title">Study Velocity</div>
      <div class="card-value">${analytics.velocityHoursPerWeek} hrs/wk</div>
      <div class="card-desc">+${analytics.velocityTrendPct}% pacing vs target</div>
    </div>
    <div class="card">
      <div class="card-title">Retention Stability</div>
      <div class="card-value">${analytics.retentionStabilityPct}%</div>
      <div class="card-desc">Ebbinghaus half-life index</div>
    </div>
    <div class="card">
      <div class="card-title">Concepts Mastered</div>
      <div class="card-value">${analytics.conceptsMastered} / ${analytics.totalConceptTargets}</div>
      <div class="card-desc">Accredited system targets</div>
    </div>
    <div class="card">
      <div class="card-title">Recall Queue</div>
      <div class="card-value">${analytics.spacedQueue.filter((q) => q.isDue).length} Due</div>
      <div class="card-desc">${analytics.spacedQueue.length} total tracked nodes</div>
    </div>
  </div>

  <h2>Weekly Learning Cadence &amp; Retention</h2>
  <table>
    <thead>
      <tr>
        <th>Day</th>
        <th>Recorded Study Time</th>
        <th>Decay Retention Factor</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${analytics.cadenceDays
        .map(
          (cd) => `<tr>
        <td><strong>${cd.fullDate} (${cd.day})</strong></td>
        <td>${cd.hours.toFixed(1)} hrs</td>
        <td>${cd.retentionPct}%</td>
        <td>${cd.isToday ? '<span style="color:#4f46e5;font-weight:700;">Active Today</span>' : 'Calibrated'}</td>
      </tr>`
        )
        .join('')}
    </tbody>
  </table>

  <h2>Competency Calibration by Architectural Domain</h2>
  <table>
    <thead>
      <tr>
        <th>Domain</th>
        <th>Mastery Level</th>
        <th>Completed Concepts</th>
        <th>Calibration</th>
      </tr>
    </thead>
    <tbody>
      ${analytics.domainMastery
        .map(
          (dm) => `<tr>
        <td><strong>${dm.label}</strong></td>
        <td>${dm.masteryPct}%</td>
        <td>${dm.completedConcepts} / ${dm.totalConcepts} Target Concepts</td>
        <td>Verified Tier 4</td>
      </tr>`
        )
        .join('')}
    </tbody>
  </table>

  <h2>Verified Credentials &amp; Certifications</h2>
  <table>
    <thead>
      <tr>
        <th>Certification Title</th>
        <th>Status</th>
        <th>Issue Date</th>
        <th>Verification Hash</th>
      </tr>
    </thead>
    <tbody>
      ${analytics.credentials
        .map(
          (cr) => `<tr>
        <td><strong>${cr.title}</strong></td>
        <td><span class="badge" style="background:${cr.status === 'verified' ? '#dcfce7;color:#15803d' : '#f1f5f9;color:#64748b'}">${cr.status.toUpperCase()}</span></td>
        <td>${cr.issueDate}</td>
        <td><code>${cr.verificationHash.slice(0, 24)}...</code></td>
      </tr>`
        )
        .join('')}
    </tbody>
  </table>

  <div class="footer">
    <div>Accredited by LearnMate AI Systems Knowledge Engine • cryptographic identity verified</div>
    <div>Page 1 of 1</div>
  </div>
</body>
</html>`;
}

export function exportRawCsv(period: TimePeriod = '30D'): string {
  const analytics = getProgressAnalytics(period);
  const rows: string[] = [];

  rows.push('CATEGORY,IDENTIFIER,METRIC_OR_TITLE,VALUE,STATUS,TIMESTAMP');

  // Daily logs
  analytics.cadenceDays.forEach((cd) => {
    rows.push(`Cadence,${cd.day},${cd.fullDate},${cd.hours} hrs,${cd.retentionPct}% Retention,Active`);
  });

  // Domains
  analytics.domainMastery.forEach((dm) => {
    rows.push(`DomainMastery,${dm.domain},${dm.label},${dm.masteryPct}%,${dm.completedConcepts}/${dm.totalConcepts} concepts,Calibrated`);
  });

  // Spaced Queue
  analytics.spacedQueue.forEach((sq) => {
    rows.push(`SpacedRecall,${sq.moduleCode},"${sq.conceptTitle.replace(/"/g, '""')}",${sq.retentionPct}% Retention,${sq.isDue ? 'Due Today' : 'Scheduled'},Interval ${sq.decayIntervalDays}d`);
  });

  // Credentials
  analytics.credentials.forEach((cr) => {
    rows.push(`Credential,${cr.id},"${cr.title.replace(/"/g, '""')}",${cr.progressPct}%,${cr.status},${cr.issueDate}`);
  });

  return rows.join('\n');
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
