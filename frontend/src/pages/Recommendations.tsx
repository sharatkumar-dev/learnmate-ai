import { useState, useEffect, useRef, useMemo } from 'react';
import {
  getAllResources,
  getCuratedCollections,
  getQuickNotes,
  addQuickNote,
  deleteQuickNote,
  toggleBookmark,
  updateResourceProgress,
  markResourceCompleted,
  filterAndSortResources,
  type LearningResource,
  type CuratedCollection,
  type QuickNote,
  type ResourceFormat,
  type ResourceDomain,
  type ResourceDifficulty,
  type ResourceStatus,
} from '@/utils/resourceStore';
import { useLearnMate } from '@/context/LearnMateContext';

// ─────────────────────────────────────────────
// Inline Diagram SVGs for Cards
// ─────────────────────────────────────────────

function ResourceSvg({ type }: { type: LearningResource['diagramSvgType'] }) {
  switch (type) {
    case 'raft':
      return (
        <svg className="w-full h-full p-3 opacity-90 relative z-10" fill="none" viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="raftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#3525cd" />
            </linearGradient>
            <radialGradient id="leaderGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c3c0ff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
            </radialGradient>
          </defs>
          <line x1="60" y1="60" x2="160" y2="36" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <line x1="160" y1="36" x2="260" y2="60" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <line x1="60" y1="60" x2="160" y2="92" stroke="#c7c4d8" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5" />
          <line x1="260" y1="60" x2="160" y2="92" stroke="#c7c4d8" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5" />
          <circle cx="160" cy="36" r="26" fill="url(#leaderGlow)" />
          <circle cx="160" cy="36" r="16" fill="url(#raftGrad)" />
          <text x="160" y="39" fill="#ffffff" fontSize="8.5" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle" letterSpacing="0.05em">LEADER</text>
          <text x="160" y="47" fill="#dad7ff" fontSize="7" fontFamily="JetBrains Mono" textAnchor="middle">Term 14</text>
          <circle cx="60" cy="60" r="14" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
          <text x="60" y="63" fill="#3525cd" fontSize="8" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">n1:Fol</text>
          <circle cx="260" cy="60" r="14" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
          <text x="260" y="63" fill="#3525cd" fontSize="8" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">n2:Fol</text>
          <circle cx="160" cy="92" r="12" fill="#ffffff" stroke="#777587" strokeWidth="1.5" />
          <text x="160" y="95" fill="#464555" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">n3:Can</text>
          <rect x="225" y="16" width="75" height="20" rx="10" fill="#ffffff" stroke="#c7c4d8" strokeWidth="0.75" opacity="0.95" />
          <text x="262" y="29" fill="#4648d4" fontSize="7.5" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">● Heartbeat 48ms</text>
        </svg>
      );
    case 'dynamo':
      return (
        <svg className="w-full h-full p-2 opacity-90 relative z-10" fill="none" viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg">
          <circle cx="160" cy="60" r="42" stroke="#c7c4d8" strokeWidth="1.5" strokeDasharray="4 3" />
          <circle cx="160" cy="60" r="42" stroke="#4648d4" strokeWidth="2.5" strokeDasharray="70 200" strokeLinecap="round" />
          <circle cx="160" cy="18" r="6" fill="#4648d4" />
          <text x="160" y="11" fill="#4648d4" fontSize="7.5" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">Token A (R1)</text>
          <circle cx="198" cy="42" r="5" fill="#6063ee" />
          <text x="234" y="44" fill="#464555" fontSize="7" fontFamily="JetBrains Mono" textAnchor="middle">Token B (vnode)</text>
          <circle cx="192" cy="86" r="6" fill="#4648d4" />
          <text x="228" y="92" fill="#4648d4" fontSize="7.5" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">Token C (R2)</text>
          <circle cx="128" cy="86" r="5" fill="#6063ee" />
          <text x="92" y="92" fill="#464555" fontSize="7" fontFamily="JetBrains Mono" textAnchor="middle">Token D (vnode)</text>
          <circle cx="122" cy="42" r="6" fill="#4648d4" />
          <text x="86" y="44" fill="#4648d4" fontSize="7.5" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">Token E (R3)</text>
          <rect x="136" y="50" width="48" height="20" rx="4" fill="#ffffff" stroke="#c7c4d8" strokeWidth="1" />
          <text x="160" y="63" fill="#131b2e" fontSize="8" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">N=3, W=2</text>
        </svg>
      );
    case 'lsm':
      return (
        <svg className="w-full h-full p-3 opacity-90 relative z-10" fill="none" viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg">
          <rect x="24" y="20" width="62" height="28" rx="4" fill="#eaedff" stroke="#4f46e5" strokeWidth="1.5" />
          <text x="55" y="33" fill="#3525cd" fontSize="7.5" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">MemTable</text>
          <text x="55" y="42" fill="#464555" fontSize="6.5" fontFamily="JetBrains Mono" textAnchor="middle">RAM (SkipList)</text>
          <path d="M88 34L116 34" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="2 2" />
          <rect x="118" y="16" width="86" height="36" rx="4" fill="#ffffff" stroke="#c7c4d8" strokeWidth="1" />
          <rect x="122" y="20" width="78" height="12" rx="2" fill="#f2f3ff" />
          <text x="161" y="29" fill="#131b2e" fontSize="7" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">L0 SSTable [4MB]</text>
          <rect x="122" y="35" width="78" height="12" rx="2" fill="#f2f3ff" />
          <text x="161" y="44" fill="#131b2e" fontSize="7" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">L0 SSTable [4MB]</text>
          <path d="M161 54L161 68" stroke="#ba1a1a" strokeWidth="1.5" strokeDasharray="2 2" />
          <rect x="100" y="70" width="122" height="34" rx="4" fill="#dae2fd" stroke="#4648d4" strokeWidth="1.2" />
          <text x="161" y="82" fill="#07006c" fontSize="7.5" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">L1 Compaction [64MB]</text>
          <text x="161" y="93" fill="#2f2ebe" fontSize="7" fontFamily="JetBrains Mono" textAnchor="middle">Bloom Filter 99.4%</text>
          <rect x="234" y="32" width="66" height="44" rx="4" fill="#ffffff" stroke="#c7c4d8" strokeWidth="0.8" />
          <text x="267" y="46" fill="#131b2e" fontSize="7" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">B-Tree</text>
          <line x1="242" y1="52" x2="292" y2="52" stroke="#c7c4d8" strokeWidth="0.8" />
          <text x="267" y="62" fill="#ba1a1a" fontSize="6.5" fontFamily="JetBrains Mono" textAnchor="middle">Write Amp: 24x</text>
          <text x="267" y="70" fill="#3525cd" fontSize="6.5" fontFamily="JetBrains Mono" textAnchor="middle">LSM Amp: 4.2x</text>
        </svg>
      );
    case 'msqueue':
      return (
        <div className="w-full bg-surface-container-lowest/90 p-2.5 rounded-lg border border-outline-variant/40 shadow-sm relative z-10 flex flex-col justify-between h-[85%]">
          <div className="flex items-center justify-between pb-1 border-b border-outline-variant/30 text-[10px]">
            <span className="text-secondary font-bold font-code-sm">crossbeam::epoch::Atomic</span>
            <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-primary font-code-sm text-[9px] font-semibold">AcqRel</span>
          </div>
          <div className="font-code-sm text-[11px] leading-relaxed py-1">
            <div className="text-on-surface truncate"><span className="text-primary font-semibold">let</span> tail = <span className="text-secondary font-semibold">self</span>.tail.load(Acquire, &amp;guard);</div>
            <div className="text-on-surface-variant text-[10px] truncate"><span className="text-outline">// CAS eliminates ABA hazard</span></div>
            <div className="text-secondary text-[10.5px] truncate font-semibold">tail.compare_exchange(curr, next, Release)?</div>
          </div>
        </div>
      );
    case 'pacelc':
      return (
        <svg className="w-full h-full p-4 opacity-75" fill="none" viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg">
          <rect className="fill-surface-container-high stroke-outline" height="60" rx="3" strokeWidth="1" width="60" x="40" y="30" />
          <text className="fill-on-surface-variant font-code-sm text-[11px] font-bold" textAnchor="middle" x="70" y="65">CAP</text>
          <rect className="fill-surface-container-high stroke-outline" height="60" rx="3" strokeWidth="1" width="60" x="120" y="30" />
          <text className="fill-on-surface-variant font-code-sm text-[11px] font-bold" textAnchor="middle" x="150" y="65">PACELC</text>
          <rect className="fill-surface-container-high stroke-outline" height="60" rx="3" strokeWidth="1" width="60" x="200" y="30" />
          <text className="fill-on-surface-variant font-code-sm text-[11px] font-bold" textAnchor="middle" x="230" y="65">BASE</text>
        </svg>
      );
    case 'vectorclock':
      return (
        <svg className="w-full h-full p-4 opacity-80" fill="none" viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg">
          <circle className="stroke-primary" cx="150" cy="60" r="42" strokeDasharray="4 2" strokeWidth="2" />
          <circle className="fill-primary" cx="150" cy="18" r="7" />
          <circle className="fill-secondary" cx="192" cy="60" r="7" />
          <circle className="fill-tertiary" cx="150" cy="102" r="7" />
          <circle className="fill-primary-container" cx="108" cy="60" r="7" />
          <path className="stroke-error" d="M120 40 L180 80" strokeWidth="1.5" />
          <text className="fill-error font-code-sm text-[9px] font-bold" x="215" y="105">Partition A/B</text>
        </svg>
      );
    case 'spanner':
      return (
        <svg className="w-full h-full p-3 opacity-90" fill="none" viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="25" width="240" height="20" rx="4" fill="#e8ebff" stroke="#4f46e5" strokeWidth="1" />
          <text x="150" y="38" fill="#3525cd" fontSize="8" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">TrueTime Interval: [earliest, latest] ± 7ms</text>
          <line x1="80" y1="55" x2="220" y2="55" stroke="#ba1a1a" strokeWidth="2" strokeDasharray="4 2" />
          <circle cx="80" cy="55" r="4" fill="#ba1a1a" />
          <circle cx="220" cy="55" r="4" fill="#ba1a1a" />
          <text x="150" y="70" fill="#464555" fontSize="7" fontFamily="JetBrains Mono" textAnchor="middle">Commit Wait: 2 * ε Uncertainty</text>
          <rect x="90" y="80" width="120" height="22" rx="11" fill="#4f46e5" />
          <text x="150" y="94" fill="#ffffff" fontSize="7.5" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">Strict Linearizability</text>
        </svg>
      );
    case 'tokio':
      return (
        <svg className="w-full h-full p-3 opacity-90" fill="none" viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="20" width="80" height="40" rx="4" fill="#eaedff" stroke="#4f46e5" strokeWidth="1" />
          <text x="60" y="38" fill="#3525cd" fontSize="7.5" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">Worker 1</text>
          <text x="60" y="50" fill="#464555" fontSize="6.5" fontFamily="JetBrains Mono" textAnchor="middle">Deque: [4 tasks]</text>
          <rect x="200" y="20" width="80" height="40" rx="4" fill="#eaedff" stroke="#4f46e5" strokeWidth="1" />
          <text x="240" y="38" fill="#3525cd" fontSize="7.5" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">Worker 2</text>
          <text x="240" y="50" fill="#ba1a1a" fontSize="6.5" fontFamily="JetBrains Mono" textAnchor="middle">Starved (Empty)</text>
          <path d="M185 40 L115 40" stroke="#ba1a1a" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrow)" />
          <text x="150" y="34" fill="#ba1a1a" fontSize="7" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">STEAL HALF</text>
          <rect x="60" y="78" width="180" height="22" rx="4" fill="#dae2fd" stroke="#4648d4" strokeWidth="1" />
          <text x="150" y="92" fill="#07006c" fontSize="7.5" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">MIO OS Epoll / Kqueue Driver</text>
        </svg>
      );
    case 'tlapaxos':
    default:
      return (
        <svg className="w-full h-full p-3 opacity-90" fill="none" viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y="20" width="220" height="30" rx="4" fill="#eaedff" stroke="#4f46e5" strokeWidth="1.2" />
          <text x="150" y="36" fill="#3525cd" fontSize="8" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">TypeOK ∧ VotesSafe ∧ InvQuorum</text>
          <text x="150" y="45" fill="#464555" fontSize="6.5" fontFamily="JetBrains Mono" textAnchor="middle">TLA+ State Invariant Check: 4.8M States</text>
          <circle cx="90" cy="80" r="14" fill="#dae2fd" stroke="#4648d4" strokeWidth="1.5" />
          <text x="90" y="84" fill="#07006c" fontSize="7" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">Phase 1b</text>
          <line x1="104" y1="80" x2="196" y2="80" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="2 2" />
          <circle cx="210" cy="80" r="14" fill="#4f46e5" />
          <text x="210" y="84" fill="#ffffff" fontSize="7" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">Phase 2b</text>
        </svg>
      );
  }
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export function Recommendations() {
  const { user } = useLearnMate();

  // Resource Store State
  const [resources, setResources] = useState<LearningResource[]>(() => getAllResources());
  const [collections] = useState<CuratedCollection[]>(() => getCuratedCollections());
  const [notes, setNotes] = useState<QuickNote[]>(() => getQuickNotes());

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<ResourceFormat | 'all'>('all');
  const [selectedDomain, setSelectedDomain] = useState<ResourceDomain | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ResourceDifficulty | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ResourceStatus | 'bookmarked' | 'all'>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'highest' | 'recent' | 'time-asc' | 'time-desc' | 'progress-desc'>('highest');

  // UI Interactive Controls
  const [refineOpen, setRefineOpen] = useState(false);
  const [quickDrawerOpen, setQuickDrawerOpen] = useState(false);
  const [activeCollectionIndex, setActiveCollectionIndex] = useState(0);

  // Modals & Inspectors
  const [inspectResource, setInspectResource] = useState<LearningResource | null>(null);
  const [readerResource, setReaderResource] = useState<LearningResource | null>(null);

  // Scratchpad Note Inputs
  const [scratchpadTitle, setScratchpadTitle] = useState('');
  const [scratchpadContent, setScratchpadContent] = useState('');

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Search input ref for ⌘F shortcut
  const searchInputRef = useRef<HTMLInputElement>(null);
  const refineRef = useRef<HTMLDivElement>(null);

  // Show toast utility
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Keyboard shortcut listener for ⌘F / Ctrl+F
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
      if (e.key === 'Escape') {
        setRefineOpen(false);
        setInspectResource(null);
        setReaderResource(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Listen to cross-component storage update events
  useEffect(() => {
    const handleResourceUpdate = () => {
      setResources(getAllResources());
    };
    const handleNotesUpdate = () => {
      setNotes(getQuickNotes());
    };
    window.addEventListener('learnmate_resource_updated', handleResourceUpdate);
    window.addEventListener('learnmate_notes_updated', handleNotesUpdate);
    return () => {
      window.removeEventListener('learnmate_resource_updated', handleResourceUpdate);
      window.removeEventListener('learnmate_notes_updated', handleNotesUpdate);
    };
  }, []);

  // Filter & Sort Calculation
  const { filtered, formatCounts } = useMemo(() => {
    return filterAndSortResources(resources, {
      searchQuery,
      format: selectedFormat,
      domain: selectedDomain,
      difficulty: selectedDifficulty,
      status: selectedStatus,
      minRating,
      sortBy,
    });
  }, [resources, searchQuery, selectedFormat, selectedDomain, selectedDifficulty, selectedStatus, minRating, sortBy]);

  // Adjust pagination during render if filters changed
  const filterKey = `${searchQuery}_${selectedFormat}_${selectedDomain}_${selectedDifficulty}_${selectedStatus}_${minRating}_${sortBy}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setCurrentPage(1);
  }

  // Paginated Slicing
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginatedResources = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  // Bookmarked items list
  const bookmarkedResources = useMemo(() => {
    return resources.filter((r) => r.bookmarked);
  }, [resources]);

  // Count active refine filters
  const activeRefineCount = useMemo(() => {
    let count = 0;
    if (selectedDifficulty !== 'all') count++;
    if (selectedStatus !== 'all') count++;
    if (minRating > 0) count++;
    return count;
  }, [selectedDifficulty, selectedStatus, minRating]);

  // Handlers
  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextState = toggleBookmark(id);
    setResources(getAllResources());
    showToast(nextState ? 'Resource saved to your bookmarks' : 'Resource removed from bookmarks');
  };

  const handleMarkCompleted = (id: string) => {
    markResourceCompleted(id);
    setResources(getAllResources());
    if (inspectResource?.id === id) {
      setInspectResource(getAllResources().find((r) => r.id === id) || null);
    }
    if (readerResource?.id === id) {
      setReaderResource(getAllResources().find((r) => r.id === id) || null);
    }
    showToast('✓ Completed! Study hours logged to Dashboard.');
  };

  const handleShareResource = (resource: LearningResource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard?.writeText?.(resource.externalUrl);
    showToast(`Copied verified link for "${resource.title}" to clipboard!`);
  };

  const handleSaveScratchpadNote = () => {
    if (!scratchpadContent.trim()) return;
    addQuickNote(scratchpadTitle || 'Resource Study Note', scratchpadContent);
    setScratchpadTitle('');
    setScratchpadContent('');
    showToast('Note saved to your workspace docs!');
  };

  const handleDeleteNote = (id: string) => {
    deleteQuickNote(id);
    showToast('Note deleted.');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedFormat('all');
    setSelectedDomain('all');
    setSelectedDifficulty('all');
    setSelectedStatus('all');
    setMinRating(0);
    setSortBy('highest');
    setRefineOpen(false);
    showToast('All filters reset.');
  };

  return (
    <div className="flex flex-col w-full pb-space-xl relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-on-surface text-surface-container-lowest px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-outline-variant/40 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-primary-fixed text-[20px]">check_circle</span>
          <span className="font-label-md text-label-md">{toastMessage}</span>
        </div>
      )}

      {/* Background Ambient Glows */}
      <div className="relative w-full">
        <div className="absolute -top-10 -right-12 w-96 h-96 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-48 -left-20 w-80 h-80 bg-secondary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10"></div>

        {/* Header Section */}
        <div className="flex flex-col gap-space-lg mb-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <div className="flex items-center gap-space-sm mb-space-xs">
                <span className="font-code-sm text-code-sm uppercase tracking-wider text-primary font-medium bg-primary-fixed/60 px-2.5 py-0.5 rounded-full">
                  Directory // 04
                </span>
                <span className="text-outline text-body-sm">•</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wide font-medium" id="headerNodeCount">
                  {resources.length} Peer-Reviewed Nodes
                </span>
                <span className="text-outline text-body-sm">•</span>
                <span className="font-label-sm text-label-sm text-primary tracking-wide font-medium">
                  {user?.trajectory || 'Distributed Systems Staff Engineer'}
                </span>
              </div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Curated Resource Library</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-2xl">
                Distilled technical literature, interactive memory simulators, and hyper-annotated whitepapers tuned for master-level systems engineering.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-surface-container-low px-space-md py-space-sm rounded-xl shadow-sm self-start md:self-auto border border-outline-variant/40">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                <span className="font-code-sm text-code-sm text-on-surface-variant font-medium">Synced w/ ArXiv &amp; GitHub</span>
              </div>
              <div className="w-px h-4 bg-outline-variant/50"></div>
              <span className="font-label-sm text-label-sm text-primary font-bold">14 New This Week</span>
            </div>
          </div>

          {/* Search, Sort & Refine Controls */}
          <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center gap-space-sm border border-outline-variant/30">
            {/* Live Search Input */}
            <div className="relative flex-1 flex items-center">
              <span className="material-symbols-outlined absolute left-space-md text-outline pointer-events-none text-[20px]">search</span>
              <input
                ref={searchInputRef}
                id="resourceSearchInput"
                className="w-full pl-11 pr-16 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Filter by title, author, format, or architectural pattern..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-10 text-outline hover:text-on-surface p-1 transition-colors"
                  title="Clear search"
                  id="clearSearchBtn"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              ) : null}
              <span className="hidden sm:inline-block absolute right-3 px-1.5 py-0.5 rounded bg-surface-container font-code-sm text-code-sm text-on-surface-variant">
                ⌘F
              </span>
            </div>

            {/* Sort & Refine Buttons */}
            <div className="flex items-center gap-space-sm flex-wrap sm:flex-nowrap relative" ref={refineRef}>
              <div className="relative flex items-center">
                <label className="sr-only" htmlFor="sort-select">Sort by</label>
                <div className="flex items-center gap-2 px-space-md py-2.5 bg-surface-container-low rounded-lg text-on-surface hover:bg-surface-container transition-colors cursor-pointer w-full sm:w-auto justify-between border border-outline-variant/30">
                  <span className="material-symbols-outlined text-outline text-[18px]">swap_vert</span>
                  <select
                    className="bg-transparent font-label-md text-label-md text-on-surface focus:outline-none cursor-pointer pr-4 appearance-none"
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                  >
                    <option value="highest">Highest Rated (★)</option>
                    <option value="recent">Recently Added</option>
                    <option value="time-asc">Estimated Time (Asc)</option>
                    <option value="time-desc">Estimated Time (Desc)</option>
                    <option value="progress-desc">Progress / In Progress First</option>
                  </select>
                  <span className="material-symbols-outlined text-outline text-[16px] -ml-3 pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Refine Filter Toggle Button */}
              <div className="relative">
                <button
                  id="refineFilterBtn"
                  onClick={() => setRefineOpen((prev) => !prev)}
                  className={`px-space-md py-2.5 rounded-lg font-label-md text-label-md flex items-center gap-1.5 transition-colors border ${
                    activeRefineCount > 0 || refineOpen
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container-low hover:bg-surface-container text-on-surface border-outline-variant/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  <span>Refine</span>
                  {activeRefineCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-on-primary text-primary font-code-sm text-[11px] font-bold">
                      {activeRefineCount}
                    </span>
                  )}
                </button>

                {/* Refine Dropdown Popover */}
                {refineOpen && (
                  <div
                    id="refinePopoverMenu"
                    className="absolute right-0 top-12 z-40 w-72 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/40 p-4 flex flex-col gap-3 animate-in fade-in"
                  >
                    <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
                      <span className="font-label-md text-label-md font-bold text-on-surface">Filter Criteria</span>
                      <button
                        onClick={handleResetFilters}
                        className="text-primary hover:underline font-code-sm text-[11px]"
                      >
                        Reset All
                      </button>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <span className="font-code-sm text-[11px] text-outline uppercase tracking-wider font-semibold block mb-1.5">
                        Difficulty
                      </span>
                      <div className="flex gap-1.5 flex-wrap">
                        {(['all', 'Foundational', 'Intermediate', 'Expert'] as const).map((diff) => (
                          <button
                            key={diff}
                            onClick={() => setSelectedDifficulty(diff)}
                            className={`px-2 py-1 rounded text-[12px] font-label-sm ${
                              selectedDifficulty === diff
                                ? 'bg-primary text-on-primary font-semibold'
                                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                            }`}
                          >
                            {diff === 'all' ? 'All' : diff}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <span className="font-code-sm text-[11px] text-outline uppercase tracking-wider font-semibold block mb-1.5">
                        Status &amp; Saves
                      </span>
                      <div className="flex gap-1.5 flex-wrap">
                        {(
                          [
                            { id: 'all', label: 'All' },
                            { id: 'bookmarked', label: '★ Bookmarked' },
                            { id: 'in-progress', label: 'In Progress' },
                            { id: 'completed', label: 'Completed' },
                            { id: 'not-started', label: 'Not Started' },
                          ] as const
                        ).map((st) => (
                          <button
                            key={st.id}
                            onClick={() => setSelectedStatus(st.id as any)}
                            className={`px-2 py-1 rounded text-[12px] font-label-sm ${
                              selectedStatus === st.id
                                ? 'bg-primary text-on-primary font-semibold'
                                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Minimum Rating */}
                    <div>
                      <span className="font-code-sm text-[11px] text-outline uppercase tracking-wider font-semibold block mb-1.5">
                        Minimum Rating
                      </span>
                      <div className="flex gap-1.5">
                        {[
                          { val: 0, label: 'Any' },
                          { val: 4.9, label: '≥ 4.90★' },
                          { val: 4.95, label: '≥ 4.95★' },
                        ].map((rt) => (
                          <button
                            key={rt.val}
                            onClick={() => setMinRating(rt.val)}
                            className={`px-2 py-1 rounded text-[12px] font-label-sm ${
                              minRating === rt.val
                                ? 'bg-primary text-on-primary font-semibold'
                                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                            }`}
                          >
                            {rt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setRefineOpen(false)}
                      className="mt-1 w-full py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-sm text-label-sm font-semibold transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Format Category Tabs with Dynamic Counts */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-nowrap scrollbar-none" id="formatCategoryTabs">
            {[
              { id: 'all', label: 'All Nodes', icon: 'view_comfy', count: formatCounts.all },
              { id: 'lab', label: 'Interactive Labs', icon: 'terminal', count: formatCounts.lab },
              { id: 'paper', label: 'Research Papers', icon: 'article', count: formatCounts.paper },
              { id: 'video', label: 'Video Walkthroughs', icon: 'smart_display', count: formatCounts.video },
              { id: 'sandbox', label: 'Code Sandboxes', icon: 'code_blocks', count: formatCounts.sandbox },
              { id: 'cheatsheet', label: 'Cheat Sheets', icon: 'quick_reference_all', count: formatCounts.cheatsheet },
            ].map((tab) => {
              const active = selectedFormat === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`formatTab-${tab.id}`}
                  onClick={() => setSelectedFormat(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full font-label-sm text-label-sm shadow-sm transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-primary text-on-primary shadow-md font-semibold'
                      : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[16px] ${active ? 'text-on-primary' : 'text-primary'}`}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full font-code-sm text-[10px] ${
                      active ? 'bg-primary-container text-on-primary-container' : 'text-outline bg-surface-container-high'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Domain Chips Filter */}
          <div className="flex items-center gap-2 overflow-x-auto text-nowrap" id="domainFilterChips">
            <span className="font-code-sm text-code-sm text-outline uppercase tracking-wider pl-1">Domains:</span>
            {[
              { id: 'all', label: 'All Domains' },
              { id: 'distributed-systems', label: 'Distributed Systems' },
              { id: 'system-design', label: 'System Design' },
              { id: 'concurrency', label: 'Concurrency' },
              { id: 'consensus', label: 'Consensus Protocols' },
              { id: 'storage', label: 'Database Internals' },
              { id: 'rust', label: 'Rust' },
              { id: 'formal-verification', label: 'Formal Verification' },
            ].map((d) => {
              const active = selectedDomain === d.id;
              return (
                <button
                  key={d.id}
                  id={`domainChip-${d.id}`}
                  onClick={() => setSelectedDomain(d.id as any)}
                  className={`px-2.5 py-1 rounded-md font-label-sm text-label-sm transition-colors ${
                    active
                      ? 'bg-surface-container text-primary font-bold border border-primary/30'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Curated Staff Collections Carousel */}
        <div className="mb-space-xl">
          <div className="flex items-center justify-between mb-space-md">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">auto_stories</span>
              <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight">Curated Staff Collections</h2>
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm">
                Curator Picks
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveCollectionIndex((prev) => (prev > 0 ? prev - 1 : collections.length - 1))}
                className="p-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container shadow-sm transition-colors border border-outline-variant/30"
                title="Previous collection"
                id="prevCollectionBtn"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button
                onClick={() => setActiveCollectionIndex((prev) => (prev < collections.length - 1 ? prev + 1 : 0))}
                className="p-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container shadow-sm transition-colors border border-outline-variant/30"
                title="Next collection"
                id="nextCollectionBtn"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {collections.map((col, idx) => {
              const isHighlight = idx === activeCollectionIndex;
              return (
                <div
                  key={col.id}
                  className={`group relative rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between p-space-lg border ${
                    isHighlight ? 'ring-2 ring-primary/30 border-primary/40' : 'border-outline-variant/30'
                  }`}
                >
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${col.gradientClass}`}></div>
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-space-sm">
                      <span className="font-code-sm text-code-sm text-primary uppercase font-bold tracking-wider">{col.badge}</span>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm">
                        {col.tag}
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors mb-2">
                      {col.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 mb-space-md">
                      {col.description}
                    </p>
                  </div>
                  <div className="pt-space-md bg-surface-container-low/40 -mx-space-lg -mb-space-lg px-space-lg pb-space-md flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center font-code-sm text-code-sm font-bold text-on-primary-fixed">
                        {col.authorInitials}
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface font-medium truncate max-w-[150px]">
                        {col.authorName}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const target = resources.find((r) => col.resourceIds.includes(r.id));
                        if (target) setInspectResource(target);
                      }}
                      className="font-label-sm text-label-sm text-primary font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      {col.actionLabel}{' '}
                      <span className="material-symbols-outlined text-[16px]">{col.actionIcon}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Directory Index Header */}
        <div className="flex items-center justify-between mb-space-md">
          <div className="flex items-center gap-2">
            <span className="font-headline-sm text-headline-sm text-on-surface">Directory Index</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant" id="filteredCountLabel">
              (Showing {filtered.length} indexed masterworks)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-code-sm text-code-sm text-outline">View: Density Grid</span>
          </div>
        </div>

        {/* Empty State when no results */}
        {filtered.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl p-12 text-center border border-outline-variant/30 shadow-sm flex flex-col items-center justify-center my-space-lg">
            <span className="material-symbols-outlined text-outline text-[48px] mb-2">manage_search</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">No matching resources found</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-4">
              We couldn't find any resources matching your search query and filters. Try adjusting your search term or clearing filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* Resource Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg" id="resourceCardsGrid">
            {paginatedResources.map((resource) => {
              const isCompleted = resource.status === 'completed';
              const isInProgress = resource.status === 'in-progress';

              return (
                <article
                  key={resource.id}
                  className="group bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden border border-outline-variant/30"
                >
                  <div>
                    {/* SVG Diagram Canvas */}
                    <div className="relative w-full h-36 rounded-lg bg-surface-container-low mb-space-md overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-fixed/20 to-secondary-fixed/30 opacity-70"></div>
                      <ResourceSvg type={resource.diagramSvgType} />

                      {/* Format Pill */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm shadow-sm border border-outline-variant/20">
                        <span className="material-symbols-outlined text-primary text-[14px]">{resource.formatIcon}</span>
                        <span className="font-code-sm text-[11px] text-on-surface font-medium">{resource.formatLabel}</span>
                      </div>

                      {/* Bookmark Button */}
                      <button
                        onClick={(e) => handleToggleBookmark(resource.id, e)}
                        className={`absolute top-2 right-2 p-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm shadow-sm transition-colors border border-outline-variant/20 ${
                          resource.bookmarked ? 'text-primary' : 'text-outline hover:text-primary'
                        }`}
                        title={resource.bookmarked ? 'Remove bookmark' : 'Bookmark'}
                        id={`bookmarkBtn-${resource.id}`}
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: resource.bookmarked ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          {resource.bookmarked ? 'bookmark' : 'bookmark_border'}
                        </span>
                      </button>
                    </div>

                    {/* Meta Row: Difficulty, Duration, Rating */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-secondary font-semibold">
                        {resource.difficulty}
                      </span>
                      <span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px] text-outline">schedule</span>
                        {resource.durationLabel}
                      </span>
                      <span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface">
                        <span className="text-secondary font-bold">★ {resource.rating.toFixed(2)}</span>
                        <span className="text-outline font-code-sm text-[11px]">({resource.reviewCount})</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => setInspectResource(resource)}
                      className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors leading-snug mb-1.5 cursor-pointer"
                    >
                      {resource.title}
                    </h3>

                    {/* Description */}
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-space-md">
                      {resource.description}
                    </p>

                    {/* Author & Affiliation */}
                    <div className="flex items-center gap-2 mb-space-md">
                      {resource.authorAvatar ? (
                        <img className="w-5 h-5 rounded-full object-cover" src={resource.authorAvatar} alt={resource.authorName} />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center font-code-sm text-[9px] text-on-surface font-bold">
                          {resource.authorInitials}
                        </div>
                      )}
                      <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                        {resource.authorName}, {resource.authorAffiliation}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom Progress & Actions */}
                  <div className="pt-space-sm bg-surface-container-low/30 -mx-space-lg -mb-space-lg px-space-lg pb-space-md border-t border-outline-variant/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-code-sm text-code-sm text-on-surface-variant flex items-center gap-1">
                        {isCompleted ? (
                          <>
                            <span className="material-symbols-outlined text-secondary text-[14px]">check_circle</span> Read fully
                          </>
                        ) : isInProgress ? (
                          'Status: In Progress'
                        ) : (
                          'Status: Not started'
                        )}
                      </span>
                      <span
                        className={`font-code-sm text-code-sm font-bold ${
                          isCompleted ? 'text-secondary' : isInProgress ? 'text-primary' : 'text-outline'
                        }`}
                      >
                        {isCompleted ? 'Completed' : `${resource.progressPct}% Done`}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden mb-space-md">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-secondary' : isInProgress ? 'bg-primary' : 'bg-outline-variant'
                        }`}
                        style={{ width: `${resource.progressPct}%` }}
                      ></div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setReaderResource(resource)}
                        className={`flex-1 py-2 rounded-lg font-label-md text-label-md text-center transition-all shadow-sm ${
                          isCompleted
                            ? 'bg-surface-container-high hover:bg-surface-container text-on-surface font-medium'
                            : 'bg-primary hover:bg-primary-container text-on-primary font-semibold'
                        }`}
                      >
                        {resource.primaryActionLabel}
                      </button>

                      {/* Info / Details Button */}
                      <button
                        onClick={() => setInspectResource(resource)}
                        className="p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors shadow-sm border border-outline-variant/30"
                        title="Inspect node details"
                        id={`inspectBtn-${resource.id}`}
                      >
                        <span className="material-symbols-outlined text-[18px]">info</span>
                      </button>

                      {/* Share Button */}
                      <button
                        onClick={(e) => handleShareResource(resource, e)}
                        className="p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors shadow-sm border border-outline-variant/30"
                        title="Share resource"
                      >
                        <span className="material-symbols-outlined text-[18px]">share</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Dynamic Pagination */}
        {filtered.length > 0 && (
          <div className="mt-space-xl flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-lg bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30" id="resourcePaginationBar">
            <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
              <span>
                Showing <strong className="text-on-surface">{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filtered.length)}</strong> of {filtered.length} curated items
              </span>
              <span className="text-outline">•</span>
              <span className="font-code-sm text-code-sm">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm flex items-center gap-1 transition-colors ${
                  currentPage === 1
                    ? 'bg-surface-container text-outline cursor-not-allowed'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                }`}
                id="paginationPrevBtn"
              >
                <span className="material-symbols-outlined text-[16px]">west</span>
                <span>Previous</span>
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isCurrent = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg font-label-sm text-label-sm font-semibold transition-colors ${
                      isCurrent
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm flex items-center gap-1 transition-colors ${
                  currentPage === totalPages
                    ? 'bg-surface-container text-outline cursor-not-allowed'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                }`}
                id="paginationNextBtn"
              >
                <span>Next</span>
                <span className="material-symbols-outlined text-[16px]">east</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Quick Drawer (Scratchpad & Saves) */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3 pointer-events-none">
        {quickDrawerOpen && (
          <div
            id="quick-drawer"
            className="pointer-events-auto w-84 sm:w-96 bg-surface-container-lowest rounded-2xl shadow-2xl p-space-md transition-all flex flex-col gap-3 border border-outline-variant/40 animate-in slide-in-from-bottom-5"
          >
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">sticky_note_2</span>
                <h4 className="font-headline-sm text-headline-sm text-on-surface">Scratchpad &amp; Saves</h4>
              </div>
              <button
                onClick={() => setQuickDrawerOpen(false)}
                className="text-outline hover:text-on-surface p-1 rounded transition-colors"
                id="close-drawer"
                title="Close drawer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Pinned Bookmarked Items */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              <div className="flex items-center justify-between">
                <span className="font-code-sm text-[11px] text-outline uppercase tracking-wider font-semibold">
                  Pinned For Tonight ({bookmarkedResources.length})
                </span>
              </div>
              {bookmarkedResources.length === 0 ? (
                <p className="font-body-sm text-body-sm text-outline italic">No resources bookmarked yet. Click the bookmark icon on any card.</p>
              ) : (
                bookmarkedResources.map((bm) => (
                  <div
                    key={bm.id}
                    onClick={() => {
                      setInspectResource(bm);
                      setQuickDrawerOpen(false);
                    }}
                    className="p-2 rounded-lg bg-surface-container-low flex items-center justify-between hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/20"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-label-sm text-label-sm text-on-surface truncate font-medium">{bm.title}</p>
                      <p className="font-code-sm text-[10px] text-primary">{bm.formatLabel} • {bm.progressPct}% finished</p>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-outline">arrow_outward</span>
                  </div>
                ))
              )}
            </div>

            {/* Quick Note Input */}
            <div className="mt-1 pt-2 border-t border-outline-variant/30">
              <label className="font-code-sm text-[11px] text-outline uppercase tracking-wider font-semibold block mb-1" htmlFor="scratchpadTitleInput">
                Quick Note Title
              </label>
              <input
                id="scratchpadTitleInput"
                type="text"
                value={scratchpadTitle}
                onChange={(e) => setScratchpadTitle(e.target.value)}
                placeholder="e.g. Raft Invariant Notes"
                className="w-full mb-2 p-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/20"
              />
              <label className="font-code-sm text-[11px] text-outline uppercase tracking-wider font-semibold block mb-1" htmlFor="scratchpad">
                Note Content
              </label>
              <textarea
                className="w-full p-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary resize-none border border-outline-variant/20"
                id="scratchpad"
                placeholder="Jot down a question, invariant, or reminder..."
                rows={3}
                value={scratchpadContent}
                onChange={(e) => setScratchpadContent(e.target.value)}
              ></textarea>
            </div>

            <button
              id="saveScratchpadBtn"
              onClick={handleSaveScratchpadNote}
              className="w-full py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-semibold hover:bg-primary-container transition-colors shadow-sm"
            >
              Save to Workspace Docs
            </button>

            {/* Saved Notes History */}
            {notes.length > 0 && (
              <div className="mt-1 space-y-1.5 max-h-36 overflow-y-auto pr-1">
                <span className="font-code-sm text-[10px] text-outline uppercase tracking-wider font-semibold">
                  Saved Notes ({notes.length})
                </span>
                {notes.map((n) => (
                  <div key={n.id} className="p-2 rounded bg-surface-container-low text-on-surface border border-outline-variant/20 relative group">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm font-semibold text-primary truncate max-w-[180px]">{n.title}</span>
                      <button
                        onClick={() => handleDeleteNote(n.id)}
                        className="text-outline hover:text-error p-0.5 transition-colors"
                        title="Delete note"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                      </button>
                    </div>
                    <p className="font-body-sm text-[11px] text-on-surface-variant line-clamp-2 mt-0.5">{n.content}</p>
                    <span className="font-code-sm text-[9px] text-outline block mt-1">{n.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Floating Quick Drawer Toggle Pill */}
        <button
          aria-label="Open Quick Notes and Bookmarks Drawer"
          className="pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-full bg-on-background text-surface-container-lowest shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 group border border-outline-variant/40"
          id="toggle-drawer"
          onClick={() => setQuickDrawerOpen((prev) => !prev)}
        >
          <span className="material-symbols-outlined text-[20px] text-primary-fixed group-hover:rotate-12 transition-transform">
            edit_note
          </span>
          <span className="font-label-md text-label-md font-semibold tracking-wide">
            Quick Notes ({bookmarkedResources.length})
          </span>
          <span className="w-2 h-2 rounded-full bg-primary-fixed animate-ping"></span>
        </button>
      </div>

      {/* Resource Details Inspector Modal */}
      {inspectResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div
            id="resourceDetailsModal"
            className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-outline-variant/30 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-code-sm text-[11px] font-semibold">
                    {inspectResource.formatLabel}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-secondary font-semibold">
                    {inspectResource.difficulty}
                  </span>
                  {inspectResource.roadmapModuleCode && (
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary font-code-sm text-[11px] font-semibold">
                      Linked: {inspectResource.roadmapModuleCode}
                    </span>
                  )}
                  <span className="text-outline text-body-sm">•</span>
                  <span className="font-code-sm text-code-sm text-on-surface-variant">{inspectResource.durationLabel}</span>
                  <span className="text-secondary font-bold font-label-sm text-label-sm">★ {inspectResource.rating.toFixed(2)}</span>
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface">{inspectResource.title}</h2>
              </div>
              <button
                onClick={() => setInspectResource(null)}
                className="text-outline hover:text-on-surface p-1.5 rounded-lg transition-colors border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Author & Published Info */}
            <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-code-sm text-code-sm font-bold text-on-primary-fixed">
                {inspectResource.authorInitials}
              </div>
              <div>
                <p className="font-label-md text-label-md font-bold text-on-surface">{inspectResource.authorName}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {inspectResource.authorAffiliation} • Published {inspectResource.publicationDate}
                </p>
              </div>
            </div>

            {/* Abstract */}
            <div>
              <h4 className="font-label-sm text-label-sm font-bold text-outline uppercase tracking-wider mb-1">Abstract &amp; Summary</h4>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">{inspectResource.description}</p>
            </div>

            {/* Key Architectural Takeaways */}
            <div>
              <h4 className="font-label-sm text-label-sm font-bold text-outline uppercase tracking-wider mb-2">Key Architectural Takeaways</h4>
              <ul className="space-y-2">
                {inspectResource.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/20 font-body-sm text-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleBookmark(inspectResource.id)}
                  className={`px-3 py-2 rounded-lg font-label-sm text-label-sm flex items-center gap-1.5 transition-colors border ${
                    inspectResource.bookmarked
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container text-on-surface border-outline-variant/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {inspectResource.bookmarked ? 'bookmark_added' : 'bookmark_add'}
                  </span>
                  <span>{inspectResource.bookmarked ? 'Bookmarked' : 'Add to Bookmarks'}</span>
                </button>

                <a
                  href={inspectResource.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-sm text-label-sm flex items-center gap-1.5 transition-colors border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  <span>Open Official Source</span>
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="modalMarkCompletedBtn"
                  onClick={() => handleMarkCompleted(inspectResource.id)}
                  className={`px-4 py-2 rounded-lg font-label-md text-label-md font-semibold transition-colors shadow-sm flex items-center gap-1.5 ${
                    inspectResource.status === 'completed'
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-primary hover:bg-primary-container text-on-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {inspectResource.status === 'completed' ? 'check' : 'task_alt'}
                  </span>
                  <span>
                    {inspectResource.status === 'completed' ? 'Completed (+Study Credit)' : 'Mark as Completed'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resource Reader / Simulator Modal */}
      {readerResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div
            id="resourceReaderModal"
            className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">{readerResource.formatIcon}</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">{readerResource.title}</h3>
              </div>
              <button
                onClick={() => setReaderResource(null)}
                className="text-outline hover:text-on-surface p-1 rounded transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Simulator / Reader Viewport */}
            <div className="h-60 rounded-xl bg-surface-container-low p-4 overflow-hidden flex flex-col justify-between border border-outline-variant/30 relative">
              <div className="absolute inset-0 bg-primary-fixed/10 pointer-events-none"></div>
              <ResourceSvg type={readerResource.diagramSvgType} />
              <div className="relative z-10 bg-surface-container-lowest/90 backdrop-blur-md p-2 rounded-lg border border-outline-variant/30 flex items-center justify-between">
                <span className="font-code-sm text-[11px] text-primary font-semibold">
                  Active Simulation: {readerResource.roadmapModuleCode || 'STANDALONE-LAB'}
                </span>
                <span className="font-code-sm text-[11px] text-on-surface font-mono">
                  Runtime: Browser WASM Engine
                </span>
              </div>
            </div>

            {/* Study Progress Slider */}
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-md text-label-md font-semibold text-on-surface">Study Session Progress</span>
                <span className="font-code-sm text-code-sm font-bold text-primary">{readerResource.progressPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="25"
                value={readerResource.progressPct}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  const updated = updateResourceProgress(readerResource.id, val);
                  setReaderResource(updated);
                  setResources(getAllResources());
                }}
                className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] font-code-sm text-outline mt-1.5">
                <span>0% (Not Started)</span>
                <span>25%</span>
                <span>50% (Halfway)</span>
                <span>75%</span>
                <span>100% (Completed)</span>
              </div>
            </div>

            {/* Reader Modal Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30">
              <a
                href={readerResource.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-label-sm text-label-sm text-primary flex items-center gap-1 hover:underline"
              >
                <span>Read original manuscript</span>
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleMarkCompleted(readerResource.id);
                    setReaderResource(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors shadow-sm"
                >
                  Complete &amp; Award Hours (+{readerResource.studyHoursCredit}h)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
