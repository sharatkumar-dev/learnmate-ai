import { recordActivity } from './dashboardStore';

export type ResourceFormat = 'lab' | 'paper' | 'video' | 'sandbox' | 'cheatsheet';
export type ResourceDomain =
  | 'distributed-systems'
  | 'system-design'
  | 'concurrency'
  | 'consensus'
  | 'storage'
  | 'rust'
  | 'formal-verification';
export type ResourceDifficulty = 'Foundational' | 'Intermediate' | 'Expert';
export type ResourceStatus = 'not-started' | 'in-progress' | 'completed';

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  format: ResourceFormat;
  formatLabel: string;
  formatIcon: string;
  domain: ResourceDomain;
  domainLabel: string;
  difficulty: ResourceDifficulty;
  estimatedDurationMinutes: number;
  durationLabel: string;
  rating: number;
  reviewCount: number;
  authorName: string;
  authorAffiliation: string;
  authorInitials: string;
  authorAvatar?: string;
  status: ResourceStatus;
  progressPct: number;
  bookmarked: boolean;
  notes?: string;
  publicationDate: string;
  externalUrl: string;
  roadmapModuleCode?: string;
  keyTakeaways: string[];
  diagramSvgType:
    | 'raft'
    | 'dynamo'
    | 'lsm'
    | 'msqueue'
    | 'pacelc'
    | 'vectorclock'
    | 'spanner'
    | 'tokio'
    | 'tlapaxos'
    | 'byzantine';
  primaryActionLabel: string;
  studyHoursCredit: number;
}

export interface CuratedCollection {
  id: string;
  badge: string;
  tag: string;
  title: string;
  description: string;
  authorName: string;
  authorInitials: string;
  gradientClass: string;
  actionLabel: string;
  actionIcon: string;
  domain: ResourceDomain;
  resourceIds: string[];
}

export interface QuickNote {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  resourceId?: string;
}

export interface ResourceFilterOptions {
  searchQuery?: string;
  format?: ResourceFormat | 'all';
  domain?: ResourceDomain | 'all';
  difficulty?: ResourceDifficulty | 'all';
  status?: ResourceStatus | 'bookmarked' | 'all';
  minRating?: number;
  sortBy?: 'highest' | 'recent' | 'time-asc' | 'time-desc' | 'progress-desc';
}

const RESOURCE_OVERRIDE_KEY = 'learnmate_resource_library';
const RESOURCE_NOTES_KEY = 'learnmate_resource_notes';

// ─────────────────────────────────────────────
// Default Masterworks & Learning Resources
// ─────────────────────────────────────────────

const DEFAULT_RESOURCES: LearningResource[] = [
  {
    id: 'res-raft-sim',
    title: 'Raft Consensus Failure Injection Simulator',
    description:
      'Step through split-vote states, simulate Byzantine network drop rates, and force leader re-elections in a deterministic event loop sandbox.',
    format: 'lab',
    formatLabel: 'Interactive Lab',
    formatIcon: 'terminal',
    domain: 'consensus',
    domainLabel: 'Consensus Protocols',
    difficulty: 'Expert',
    estimatedDurationMinutes: 45,
    durationLabel: '45 min lab',
    rating: 4.95,
    reviewCount: 512,
    authorName: 'Dr. Heidi Howard',
    authorAffiliation: 'Cambridge Distributed Systems',
    authorInitials: 'HH',
    authorAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBo8Sxr_k9sAVws7sL75jpKxs0Yqxw4Jg8QWVIH_JLUU4df6szq8as7fZtcXU9lhPlqBASJKW5atgwMvlQlbylwm4Z9kgsrySpcSG6Xhmcv-l6hZ4YeawxFnHUz9RTCOnpRc5saZsJvP6u1qoeAZerzVN9CsnjsUiu43gF4bMG5bQZmqQvyBbt4OV_u3_4BtVCwbffeT8sUrjppqLed4TJf4MRyWE7m7EGcVkBFH0L-',
    status: 'in-progress',
    progressPct: 80,
    bookmarked: true,
    publicationDate: '2023-11-14',
    externalUrl: 'https://raft.github.io/',
    roadmapModuleCode: 'MOD-201',
    keyTakeaways: [
      'Heartbeat election timeouts must be randomized between 150ms-300ms to avoid split votes.',
      'Log entries cannot be committed until a leader replicates them to a strict quorum majority (N/2 + 1).',
      'Leader completeness invariant guarantees that a newly elected leader holds all committed entries from prior terms.',
    ],
    diagramSvgType: 'raft',
    primaryActionLabel: 'Resume Lab',
    studyHoursCredit: 1.0,
  },
  {
    id: 'res-dynamo-paper',
    title: "Dynamo: Amazon's Highly Available Key-Value Store",
    description:
      'Critical architectural analysis of consistent hashing rings, sloppy quorums, vector clocks, and hinted handoff mechanisms under network partitions.',
    format: 'paper',
    formatLabel: 'Annotated PDF',
    formatIcon: 'article',
    domain: 'distributed-systems',
    domainLabel: 'Distributed Systems',
    difficulty: 'Intermediate',
    estimatedDurationMinutes: 30,
    durationLabel: '30 min read',
    rating: 4.88,
    reviewCount: 280,
    authorName: 'Giuseppe DeCandia et al.',
    authorAffiliation: 'Amazon Web Services Engineering',
    authorInitials: 'GD',
    authorAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCuQ2Y5ttrlmAeAU8UoU24QKvvxet-851sfvJxUYxNRbuWnw3bCpY3ep28Fq6TLLWlrHIUTakOGhWhe_Fg53MBvyzP59nv1d1FL563yi3O9QNcDwrTpvsIJJFlAPybeEt9SJ1ZTGiRLChV4_It2QOfhlFDyfhJd1ZdSJiFbMK-_WmLr7X764XMliP-redoK4Ur13ZSor8jnQbPXycuKo-YlIYoVCfi-wVf4WE4HE2O_',
    status: 'completed',
    progressPct: 100,
    bookmarked: false,
    publicationDate: '2023-04-20',
    externalUrl: 'https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf',
    roadmapModuleCode: 'MOD-301',
    keyTakeaways: [
      'Virtual nodes solve non-uniform key distribution across heterogeneous physical servers.',
      'Configurable consistency (N, R, W) allows trading off write latency for read consistency.',
      'Sloppy quorums ensure write availability during network splits via hinted handoffs.',
    ],
    diagramSvgType: 'dynamo',
    primaryActionLabel: 'Review Notes',
    studyHoursCredit: 0.75,
  },
  {
    id: 'res-lsm-trees',
    title: 'LSM Trees vs B-Trees: The IO Cost Landscape',
    description:
      'Visualizing disk seek amortizations, write amplification factors, multi-level compaction algorithms, and Bloom filter index lookup speeds.',
    format: 'video',
    formatLabel: '4K Walkthrough',
    formatIcon: 'smart_display',
    domain: 'storage',
    domainLabel: 'Storage Internals',
    difficulty: 'Foundational',
    estimatedDurationMinutes: 18,
    durationLabel: '18 min video',
    rating: 4.92,
    reviewCount: 621,
    authorName: 'Prof. Martin Kleppmann',
    authorAffiliation: 'University of Cambridge / Author DDIA',
    authorInitials: 'MK',
    authorAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAmnxRosHNa4ITV9KxcKEAbjt_JIcuDNmEXOZewxHhJciLcrXshAyI260R8dGy7BbKki1OVN6YTz8rNOOT6hFr9-iWHK0DMlJ6An5aCp_MSZ7s1StMwN0XR5WVMPn1vWxK8S-rm-JiytgP9Kuv6mDMEocuvz93b7DeRrbNBQpTtN-vBAlbUSARRjydKkBc-I3pDkPET3Ula1OCJyLN5xLPO_icPQM0TUfBTtrZfn5T8',
    status: 'not-started',
    progressPct: 0,
    bookmarked: false,
    publicationDate: '2024-01-12',
    externalUrl: 'https://dataintensive.net/',
    roadmapModuleCode: 'MOD-302',
    keyTakeaways: [
      'LSM-trees turn random disk writes into sequential append-only writes, drastically accelerating write workloads.',
      'Compaction cascades (LevelDB/RocksDB) bound write amplification at the expense of background I/O.',
      'Bloom filters prevent costly random disk reads for non-existent keys in immutable SSTables.',
    ],
    diagramSvgType: 'lsm',
    primaryActionLabel: 'Watch Session',
    studyHoursCredit: 0.5,
  },
  {
    id: 'res-ms-queue-rust',
    title: 'Lock-Free Michael-Scott Queue in Safe Rust',
    description:
      'Confronting the ABA problem using epoch-based memory reclamation (Crossbeam), atomic pointers, and relaxed cache synchronizations.',
    format: 'sandbox',
    formatLabel: 'Rust Sandbox',
    formatIcon: 'code_blocks',
    domain: 'concurrency',
    domainLabel: 'Concurrency & Atomics',
    difficulty: 'Expert',
    estimatedDurationMinutes: 50,
    durationLabel: '50 min sandbox',
    rating: 4.97,
    reviewCount: 403,
    authorName: 'Mara Bos',
    authorAffiliation: "Rust Library Team Lead / O'Reilly Author",
    authorInitials: 'MB',
    status: 'in-progress',
    progressPct: 35,
    bookmarked: true,
    publicationDate: '2024-02-18',
    externalUrl: 'https://marabos.nl/atomics/',
    roadmapModuleCode: 'MOD-101',
    keyTakeaways: [
      'Epoch-based reclamation groups allocations into three cyclic global epochs to guarantee deferred deallocation safety.',
      'Compare-And-Swap (CAS) on queue tail requires loop retry semantics to handle interleaved consumer updates.',
      'Acquire-Release memory ordering eliminates hardware cache store-buffer reorderings without full sequential consistency barriers.',
    ],
    diagramSvgType: 'msqueue',
    primaryActionLabel: 'Open Cargo Workspace',
    studyHoursCredit: 1.25,
  },
  {
    id: 'res-pacelc-matrix',
    title: 'Distributed Systems Trade-off Matrix (PACELC)',
    description:
      'A high-density side-by-side comparison of Cassandra, CockroachDB, MongoDB, DynamoDB, and VoltDB under real-world network partition scenarios.',
    format: 'cheatsheet',
    formatLabel: 'Cheat Sheet',
    formatIcon: 'quick_reference_all',
    domain: 'system-design',
    domainLabel: 'System Design',
    difficulty: 'Intermediate',
    estimatedDurationMinutes: 12,
    durationLabel: '12 min reference',
    rating: 4.9,
    reviewCount: 890,
    authorName: 'Prof. Daniel Abadi',
    authorAffiliation: 'University of Maryland / ACM Fellow',
    authorInitials: 'DA',
    status: 'completed',
    progressPct: 100,
    bookmarked: false,
    publicationDate: '2023-09-05',
    externalUrl: 'https://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf',
    roadmapModuleCode: 'MOD-202',
    keyTakeaways: [
      'CAP theorem only considers partition states; PACELC addresses trade-offs during normal operation (Latency vs Consistency).',
      'PC/EC systems like CockroachDB prioritize consistency during partitions and during normal execution.',
      'PA/EL systems like Cassandra maximize availability and minimize latency at the expense of eventual consistency.',
    ],
    diagramSvgType: 'pacelc',
    primaryActionLabel: 'Export Cheatsheet',
    studyHoursCredit: 0.5,
  },
  {
    id: 'res-vector-clocks',
    title: 'Distributed Vector Clocks & Conflict Resolution',
    description:
      'Execute manual causal history reconciliations, sibling generation in Riak-style storage, and deterministic Last-Write-Wins (LWW) merge strategies.',
    format: 'lab',
    formatLabel: 'Interactive Lab',
    formatIcon: 'terminal',
    domain: 'distributed-systems',
    domainLabel: 'Distributed Systems',
    difficulty: 'Expert',
    estimatedDurationMinutes: 40,
    durationLabel: '40 min lab',
    rating: 4.98,
    reviewCount: 318,
    authorName: 'Leslie Lamport Research Group',
    authorAffiliation: 'Microsoft Research / Turing Laureate',
    authorInitials: 'LL',
    status: 'not-started',
    progressPct: 0,
    bookmarked: false,
    publicationDate: '2023-12-01',
    externalUrl: 'https://lamport.azurewebsites.net/pubs/time-clocks.pdf',
    roadmapModuleCode: 'MOD-301',
    keyTakeaways: [
      'Lamport timestamps establish strict partial orders but cannot detect concurrent causal forks.',
      'Vector clocks maintain an array of clocks per replica, precisely detecting when two updates are causally independent.',
      'Conflict-free Replicated Data Types (CRDTs) resolve vector clock siblings mathematically without application-layer heuristics.',
    ],
    diagramSvgType: 'vectorclock',
    primaryActionLabel: 'Start Simulation',
    studyHoursCredit: 1.0,
  },
  {
    id: 'res-spanner-annotated',
    title: 'The Google Spanner Paper: Annotated Edition',
    description:
      'Line-by-line marginalia decoding TrueTime API, GPS atomic clock synchronization bounds, and multi-version distributed concurrency control.',
    format: 'paper',
    formatLabel: 'Annotated Masterwork',
    formatIcon: 'article',
    domain: 'distributed-systems',
    domainLabel: 'Distributed Systems',
    difficulty: 'Expert',
    estimatedDurationMinutes: 60,
    durationLabel: '60 min deep dive',
    rating: 4.99,
    reviewCount: 740,
    authorName: 'Dr. James C. Corbett et al.',
    authorAffiliation: 'Google Systems Infrastructure',
    authorInitials: 'JC',
    status: 'not-started',
    progressPct: 0,
    bookmarked: true,
    publicationDate: '2024-01-30',
    externalUrl: 'https://research.google/pubs/pub39966/',
    roadmapModuleCode: 'MOD-201',
    keyTakeaways: [
      'TrueTime provides an uncertainty interval [earliest, latest] bounded by GPS and atomic rubidium oscillators (typically < 7ms).',
      'Wait-out-the-uncertainty commit protocol guarantees external consistency (linearizability) across global multi-region transactions.',
      'Read-only transactions execute without locks at a user-chosen timestamp without blocking concurrent read-write mutations.',
    ],
    diagramSvgType: 'spanner',
    primaryActionLabel: 'Read Annotated Paper',
    studyHoursCredit: 1.5,
  },
  {
    id: 'res-tokio-runtime',
    title: 'Tokio Internals: Cooperative Work-Stealing Scheduler',
    description:
      'Deep dive into the Rust asynchronous runtime: epoll/kqueue reactor integration, task budgets, lock-free work-stealing deques, and timer wheels.',
    format: 'sandbox',
    formatLabel: 'Code Sandbox',
    formatIcon: 'code_blocks',
    domain: 'rust',
    domainLabel: 'Rust Systems',
    difficulty: 'Expert',
    estimatedDurationMinutes: 45,
    durationLabel: '45 min lab',
    rating: 4.94,
    reviewCount: 382,
    authorName: 'Carl Lerche',
    authorAffiliation: 'Tokio Lead / AWS Systems',
    authorInitials: 'CL',
    status: 'not-started',
    progressPct: 0,
    bookmarked: false,
    publicationDate: '2024-03-08',
    externalUrl: 'https://tokio.rs/tokio/tutorial',
    roadmapModuleCode: 'MOD-102',
    keyTakeaways: [
      'Non-blocking I/O drivers wake dormant task wakers via Mio and OS-level epoll notifications.',
      'Work-stealing thread pools distribute tasks among core-bound run queues, stealing from neighbor tails when starved.',
      'Cooperative task yielding enforces execution budgets (128 ops) to prevent CPU-intensive futures from starving socket polling.',
    ],
    diagramSvgType: 'tokio',
    primaryActionLabel: 'Launch Tokio Sandbox',
    studyHoursCredit: 1.0,
  },
  {
    id: 'res-tla-paxos',
    title: 'Formal Specification of Paxos in TLA+',
    description:
      'Rigorous mathematical modeling of Synod consensus, state invariants, TLC model-checker runs, and induction proofs for unforgeable quorums.',
    format: 'paper',
    formatLabel: 'Formal Proof',
    formatIcon: 'article',
    domain: 'formal-verification',
    domainLabel: 'Formal Verification',
    difficulty: 'Expert',
    estimatedDurationMinutes: 75,
    durationLabel: '75 min study',
    rating: 4.96,
    reviewCount: 195,
    authorName: 'Leslie Lamport & Hillel Wayne',
    authorAffiliation: 'TLA+ Project & Verification Labs',
    authorInitials: 'LW',
    status: 'not-started',
    progressPct: 0,
    bookmarked: false,
    publicationDate: '2023-10-18',
    externalUrl: 'https://lamport.azurewebsites.net/tla/tla.html',
    roadmapModuleCode: 'MOD-401',
    keyTakeaways: [
      'Temporal Logic of Actions (TLA+) expresses distributed state transitions as mathematical relations between unprimed and primed states.',
      'TLC model checker exhaustively checks all reachable graph states for deadlock and safety invariant violations.',
      'Liveness properties require weak and strong fairness conditions to prove progress under non-deterministic network delays.',
    ],
    diagramSvgType: 'tlapaxos',
    primaryActionLabel: 'Examine TLA+ Spec',
    studyHoursCredit: 1.75,
  },
];

// ─────────────────────────────────────────────
// Curated Staff Collections
// ─────────────────────────────────────────────

const DEFAULT_COLLECTIONS: CuratedCollection[] = [
  {
    id: 'col-spanner',
    badge: 'Annotated Masterwork',
    tag: 'Staff Pick',
    title: 'The Google Spanner Paper: Annotated Edition',
    description:
      'Complete line-by-line marginalia decoding TrueTime API, GPS clock synchronization uncertainties, and multi-version distributed concurrency.',
    authorName: 'Dr. James C. Corbett et al.',
    authorInitials: 'JC',
    gradientClass: 'from-primary to-secondary',
    actionLabel: 'Examine',
    actionIcon: 'arrow_forward',
    domain: 'distributed-systems',
    resourceIds: ['res-spanner-annotated'],
  },
  {
    id: 'col-simulators',
    badge: 'Simulation Suite',
    tag: 'WASM Enabled',
    title: 'Essential Systems Interactive Sandboxes',
    description:
      'Seven micro-simulators simulating network partitions, split-brain conditions, gossip protocols, and Raft leader elections directly in browser runtime.',
    authorName: 'LearnMate Systems Lab',
    authorInitials: 'LM',
    gradientClass: 'from-secondary to-primary-container',
    actionLabel: 'Launch',
    actionIcon: 'play_arrow',
    domain: 'consensus',
    resourceIds: ['res-raft-sim', 'res-vector-clocks'],
  },
  {
    id: 'col-mit6824',
    badge: 'Curriculum Companion',
    tag: 'Academic Rigor',
    title: 'MIT 6.824 Lecture Breakdown & Code Companion',
    description:
      "Comprehensive breakdowns of Robert Morris's flagship distributed engineering syllabus with runnable Go tests and failure injection harnesses.",
    authorName: 'Prof. Robert Morris + PDOS',
    authorInitials: 'RM',
    gradientClass: 'from-tertiary-container to-primary',
    actionLabel: 'Explore',
    actionIcon: 'library_books',
    domain: 'distributed-systems',
    resourceIds: ['res-raft-sim', 'res-dynamo-paper', 'res-pacelc-matrix'],
  },
];

// ─────────────────────────────────────────────
// Storage & Persistence Functions
// ─────────────────────────────────────────────

interface ResourceOverrides {
  status?: ResourceStatus;
  progressPct?: number;
  bookmarked?: boolean;
  notes?: string;
}

function loadOverrides(): Record<string, ResourceOverrides> {
  try {
    const raw = localStorage.getItem(RESOURCE_OVERRIDE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveOverrides(overrides: Record<string, ResourceOverrides>): void {
  try {
    localStorage.setItem(RESOURCE_OVERRIDE_KEY, JSON.stringify(overrides));
  } catch (err) {
    console.error('Failed to save resource overrides:', err);
  }
}

export function getAllResources(): LearningResource[] {
  const overrides = loadOverrides();
  return DEFAULT_RESOURCES.map((res) => {
    const ov = overrides[res.id];
    if (!ov) return { ...res };
    return {
      ...res,
      status: ov.status ?? res.status,
      progressPct: ov.progressPct ?? res.progressPct,
      bookmarked: ov.bookmarked ?? res.bookmarked,
      notes: ov.notes ?? res.notes,
    };
  });
}

export function getResourceById(id: string): LearningResource | undefined {
  const resources = getAllResources();
  return resources.find((r) => r.id === id);
}

export function getCuratedCollections(): CuratedCollection[] {
  return DEFAULT_COLLECTIONS;
}

export function filterAndSortResources(
  resources: LearningResource[],
  options: ResourceFilterOptions = {}
): {
  filtered: LearningResource[];
  totalAvailable: number;
  formatCounts: Record<string, number>;
} {
  const totalAvailable = resources.length;

  // Compute format counts across all resources
  const formatCounts: Record<string, number> = {
    all: resources.length,
    lab: 0,
    paper: 0,
    video: 0,
    sandbox: 0,
    cheatsheet: 0,
  };
  for (const r of resources) {
    if (formatCounts[r.format] !== undefined) {
      formatCounts[r.format]++;
    }
  }

  let result = [...resources];

  // 1. Text Search Query
  if (options.searchQuery && options.searchQuery.trim().length > 0) {
    const q = options.searchQuery.trim().toLowerCase();
    result = result.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.authorName.toLowerCase().includes(q) ||
        r.authorAffiliation.toLowerCase().includes(q) ||
        r.domainLabel.toLowerCase().includes(q) ||
        (r.roadmapModuleCode && r.roadmapModuleCode.toLowerCase().includes(q)) ||
        r.keyTakeaways.some((t) => t.toLowerCase().includes(q))
    );
  }

  // 2. Format Category Tab Filter
  if (options.format && options.format !== 'all') {
    result = result.filter((r) => r.format === options.format);
  }

  // 3. Domain Filter
  if (options.domain && options.domain !== 'all') {
    result = result.filter((r) => r.domain === options.domain);
  }

  // 4. Difficulty Filter
  if (options.difficulty && options.difficulty !== 'all') {
    result = result.filter((r) => r.difficulty === options.difficulty);
  }

  // 5. Status / Bookmarked Filter
  if (options.status && options.status !== 'all') {
    if (options.status === 'bookmarked') {
      result = result.filter((r) => r.bookmarked);
    } else {
      result = result.filter((r) => r.status === options.status);
    }
  }

  // 6. Minimum Rating
  if (options.minRating && options.minRating > 0) {
    result = result.filter((r) => r.rating >= options.minRating!);
  }

  // 7. Sorting
  const sortBy = options.sortBy || 'highest';
  switch (sortBy) {
    case 'highest':
      result.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    case 'recent':
      result.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
      break;
    case 'time-asc':
      result.sort((a, b) => a.estimatedDurationMinutes - b.estimatedDurationMinutes);
      break;
    case 'time-desc':
      result.sort((a, b) => b.estimatedDurationMinutes - a.estimatedDurationMinutes);
      break;
    case 'progress-desc':
      result.sort((a, b) => b.progressPct - a.progressPct);
      break;
    default:
      break;
  }

  return {
    filtered: result,
    totalAvailable,
    formatCounts,
  };
}

export function toggleBookmark(id: string): boolean {
  const overrides = loadOverrides();
  const current = overrides[id]?.bookmarked ?? DEFAULT_RESOURCES.find((r) => r.id === id)?.bookmarked ?? false;
  const next = !current;

  overrides[id] = {
    ...overrides[id],
    bookmarked: next,
  };
  saveOverrides(overrides);
  window.dispatchEvent(new CustomEvent('learnmate_resource_updated', { detail: { id, bookmarked: next } }));
  return next;
}

export function updateResourceProgress(
  id: string,
  progressPct: number,
  status?: ResourceStatus
): LearningResource {
  const overrides = loadOverrides();
  const clampedProgress = Math.min(100, Math.max(0, progressPct));
  const resolvedStatus = status || (clampedProgress === 100 ? 'completed' : clampedProgress > 0 ? 'in-progress' : 'not-started');

  overrides[id] = {
    ...overrides[id],
    progressPct: clampedProgress,
    status: resolvedStatus,
  };
  saveOverrides(overrides);

  window.dispatchEvent(new CustomEvent('learnmate_resource_updated', { detail: { id, progressPct: clampedProgress, status: resolvedStatus } }));
  return getResourceById(id)!;
}

export function markResourceCompleted(id: string): LearningResource {
  const res = getResourceById(id);
  const creditHours = res?.studyHoursCredit || 0.75;

  // Award activity hours in dashboard store
  recordActivity(creditHours);

  const updated = updateResourceProgress(id, 100, 'completed');
  window.dispatchEvent(new CustomEvent('learnmate_activity_updated'));
  return updated;
}

export function resetResourceProgress(id: string): LearningResource {
  return updateResourceProgress(id, 0, 'not-started');
}

// ─────────────────────────────────────────────
// Quick Notes & Scratchpad Storage
// ─────────────────────────────────────────────

const DEFAULT_NOTES: QuickNote[] = [
  {
    id: 'note-raft-split',
    title: 'Raft Split-Vote Prevention Rule',
    content: 'Randomized election timeout must be strictly greater than heartbeat interval (e.g. 150-300ms vs 50ms) to ensure single candidate reaches majority quorum.',
    timestamp: '2026-11-19 18:30 IST',
    resourceId: 'res-raft-sim',
  },
  {
    id: 'note-lsm-bloom',
    title: 'LSM Bloom Filter Optimization',
    content: '10 bits per key in Bloom filter yields ~1% false positive rate, saving 99% of unnecessary disk seeks on point queries.',
    timestamp: '2026-11-20 14:15 IST',
    resourceId: 'res-lsm-trees',
  },
];

export function getQuickNotes(): QuickNote[] {
  try {
    const raw = localStorage.getItem(RESOURCE_NOTES_KEY);
    if (!raw) return DEFAULT_NOTES;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_NOTES;
  }
}

export function addQuickNote(title: string, content: string, resourceId?: string): QuickNote {
  const notes = getQuickNotes();
  const dateStr = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const newNote: QuickNote = {
    id: 'note-' + Date.now(),
    title: title.trim() || 'Quick Engineering Note',
    content: content.trim(),
    timestamp: `${dateStr} IST`,
    resourceId,
  };
  const updated = [newNote, ...notes];
  try {
    localStorage.setItem(RESOURCE_NOTES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save quick note:', err);
  }
  window.dispatchEvent(new CustomEvent('learnmate_notes_updated', { detail: newNote }));
  return newNote;
}

export function deleteQuickNote(id: string): void {
  const notes = getQuickNotes().filter((n) => n.id !== id);
  try {
    localStorage.setItem(RESOURCE_NOTES_KEY, JSON.stringify(notes));
  } catch (err) {
    console.error('Failed to delete quick note:', err);
  }
  window.dispatchEvent(new CustomEvent('learnmate_notes_updated', { detail: { id, deleted: true } }));
}
