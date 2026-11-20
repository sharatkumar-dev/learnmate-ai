import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearnMate } from '@/context/LearnMateContext';
import {
  getRoadmapData,
  getAllTracks,
  setActiveTrackId,
  toggleModuleCompletion,
  toggleModuleBookmark,
  submitQuizAnswers,
  adaptRoadmapWithAi,
  getOverallProgressPct,
  type RoadmapTrack,
  type ModuleStatus,
  type ModuleDomain,
} from '@/utils/roadmapStore';

export function LearningPathway() {
  const navigate = useNavigate();
  const { user } = useLearnMate();

  // Load user profile / onboarding trajectory
  const storedUser = useMemo(() => {
    try {
      const raw = localStorage.getItem('learnmate_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const storedOnboarding = useMemo(() => {
    try {
      const raw = localStorage.getItem('learnmate_onboarding_data');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const userTrajectory =
    user?.trajectory ||
    storedOnboarding?.targetRole ||
    storedUser?.trajectory ||
    'Distributed Systems Staff Engineer';

  const weeklyCommitmentHours =
    storedOnboarding?.weeklyHours ||
    (storedUser?.commitment === 'casual' ? 4 : storedUser?.commitment === 'intensive' ? 15 : 8);

  // Active track and roadmap data
  const [track, setTrack] = useState<RoadmapTrack>(() => getRoadmapData(userTrajectory));
  const [activeView, setActiveView] = useState<'tree' | 'timeline' | 'matrix'>('tree');
  const [zoom, setZoom] = useState(100);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('mod-201');
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed' | 'locked'>('all');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrereqs, setShowPrereqs] = useState(true);

  // Collapsible stages state: map of stageId -> boolean (true = expanded)
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({
    'stage-1': true,
    'stage-2': true,
    'stage-3': true,
    'stage-4': false,
    'rust-stage-1': true,
    'rust-stage-2': true,
    'formal-stage-1': true,
  });

  // Track switcher dropdown state
  const [trackDropdownOpen, setTrackDropdownOpen] = useState(false);
  const trackDropdownRef = useRef<HTMLDivElement>(null);

  // Canvas Settings dropdown
  const [canvasSettingsOpen, setCanvasSettingsOpen] = useState(false);
  const canvasSettingsRef = useRef<HTMLDivElement>(null);
  const [compactCards, setCompactCards] = useState(false);

  // AI Adapt Modal state
  const [showAdaptModal, setShowAdaptModal] = useState(false);
  const [adaptFeedback, setAdaptFeedback] = useState('');
  const [isAdapting, setIsAdapting] = useState(false);

  // Interactive Quiz Modal state
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<{ passed: boolean; score: number; correctCount: number; totalCount: number } | null>(null);

  // Floating Toast Feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Listen to external roadmap updates
  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent<RoadmapTrack>;
      if (custom && custom.detail) {
        setTrack(custom.detail);
      } else {
        setTrack(getRoadmapData(userTrajectory));
      }
    };
    window.addEventListener('learnmate_roadmap_updated', handleUpdate);
    return () => {
      window.removeEventListener('learnmate_roadmap_updated', handleUpdate);
    };
  }, [userTrajectory]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (trackDropdownRef.current && !trackDropdownRef.current.contains(event.target as Node)) {
        setTrackDropdownOpen(false);
      }
      if (canvasSettingsRef.current && !canvasSettingsRef.current.contains(event.target as Node)) {
        setCanvasSettingsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Zoom helpers
  const adjustZoom = (delta: number) => {
    setZoom((prev) => Math.min(Math.max(prev + delta, 50), 150));
  };
  const resetZoom = () => setZoom(100);

  // Flattened modules across all stages
  const allModules = useMemo(() => track.stages.flatMap((s) => s.modules), [track]);

  // Selected module
  const selectedModule = useMemo(() => {
    return allModules.find((m) => m.id === selectedModuleId) || allModules[0] || null;
  }, [allModules, selectedModuleId]);

  // Dynamic filter counts
  const inProgressCount = useMemo(() => allModules.filter((m) => m.status === 'in-progress').length, [allModules]);
  const completedCount = useMemo(() => allModules.filter((m) => m.status === 'completed').length, [allModules]);
  const lockedCount = useMemo(() => allModules.filter((m) => m.status === 'locked').length, [allModules]);
  const overallProgress = useMemo(() => getOverallProgressPct(track), [track]);

  // Filtered stages and modules
  const filteredStages = useMemo(() => {
    return track.stages
      .map((stage) => {
        const matchingModules = stage.modules.filter((m) => {
          // Status filter
          if (filter !== 'all' && m.status !== filter) return false;
          // Domain filter
          if (domainFilter !== 'all' && m.domain !== domainFilter) return false;
          // Search query
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchesText =
              m.title.toLowerCase().includes(q) ||
              m.code.toLowerCase().includes(q) ||
              m.description.toLowerCase().includes(q) ||
              m.keyConcepts.some((c) => c.toLowerCase().includes(q));
            if (!matchesText) return false;
          }
          return true;
        });

        return {
          ...stage,
          modules: matchingModules,
        };
      })
      .filter((stage) => stage.modules.length > 0 || (!searchQuery && filter === 'all' && domainFilter === 'all'));
  }, [track, filter, domainFilter, searchQuery]);

  // Handle module completion toggle
  const handleToggleComplete = (moduleId: string) => {
    const { track: updatedTrack, completed } = toggleModuleCompletion(track.id, moduleId);
    setTrack(updatedTrack);
    showToast(
      completed
        ? `Module marked complete! +0.75h logged toward weekly study goal.`
        : `Module set back to in-progress.`
    );
  };

  // Handle bookmark toggle
  const handleToggleBookmark = (moduleId: string) => {
    const updatedTrack = toggleModuleBookmark(track.id, moduleId);
    setTrack(updatedTrack);
    const mod = allModules.find((m) => m.id === moduleId);
    showToast(mod?.bookmarked ? `Removed bookmark.` : `Module bookmarked for quick review.`);
  };

  // Handle Track Switch
  const handleSelectTrack = (trackId: string) => {
    setActiveTrackId(trackId);
    const newTrack = getRoadmapData();
    setTrack(newTrack);
    if (newTrack.stages[0]?.modules[0]) {
      setSelectedModuleId(newTrack.stages[0].modules[0].id);
    }
    setTrackDropdownOpen(false);
    showToast(`Switched curriculum to "${newTrack.title}".`);
  };

  // Handle AI Adaptation
  const handleAdaptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adaptFeedback.trim()) return;
    setIsAdapting(true);

    setTimeout(() => {
      const adapted = adaptRoadmapWithAi(track.id, adaptFeedback.trim());
      setTrack(adapted);
      setIsAdapting(false);
      setShowAdaptModal(false);
      setAdaptFeedback('');
      showToast('Roadmap adapted with AI! Curriculum reordered per your specifications.');
    }, 1000);
  };

  // Open Quiz for active module
  const handleOpenQuiz = () => {
    setUserQuizAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);
    setQuizModalOpen(true);
  };

  // Submit Quiz
  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModule) return;

    const result = submitQuizAnswers(track.id, selectedModule.id, userQuizAnswers);
    setQuizResult(result);
    setQuizSubmitted(true);
    setTrack(result.track);

    if (result.passed) {
      showToast(`Mastery Confirmed! Scored ${result.score}% on Knowledge Check (+1.0h logged).`);
    } else {
      showToast(`Scored ${result.score}%. Review explanations and retry to achieve mastery.`);
    }
  };

  // Stage accordion expand/collapse
  const toggleStageExpand = (stageId: string) => {
    setExpandedStages((prev) => ({
      ...prev,
      [stageId]: !prev[stageId],
    }));
  };

  // Helper for status badge styling
  const getStatusBadge = (status: ModuleStatus, pct: number) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-code text-[11px] font-semibold border border-emerald-500/20">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            <span>100% Done</span>
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-code text-[11px] font-semibold border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>{pct}% Active</span>
          </span>
        );
      case 'unlocked':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-code text-[11px] font-medium border border-outline/10">
            <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            <span>Ready</span>
          </span>
        );
      case 'locked':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-outline font-code text-[11px] font-medium">
            <span className="material-symbols-outlined text-[13px]">lock</span>
            <span>Locked</span>
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col w-full space-y-5 pb-16">
      {/* Floating Action Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-on-surface text-surface shadow-2xl flex items-center gap-2.5 font-sans text-sm animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Command & Track Switcher Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-surface-container">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 text-on-surface-variant font-mono text-xs">
            <span>CURRICULUM</span>
            <span>/</span>
            <span className="text-primary font-semibold">{track.trackCode}</span>
            <span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant text-[10px] font-bold">
              SYNCED
            </span>
          </div>

          {/* Interactive Roadmap Switcher Dropdown */}
          <div className="relative mt-1" ref={trackDropdownRef}>
            <button
              type="button"
              id="roadmapTrackSwitcherBtn"
              onClick={() => setTrackDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 text-left group cursor-pointer"
            >
              <h1 className="font-headline text-xl sm:text-2xl font-bold text-on-surface tracking-tight truncate group-hover:text-primary transition-colors">
                {track.title}
              </h1>
              <span className="p-1 rounded-lg text-on-surface-variant group-hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  {trackDropdownOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                </span>
              </span>
            </button>

            {trackDropdownOpen && (
              <div
                id="roadmapTrackDropdownMenu"
                className="absolute left-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-surface-container-lowest shadow-2xl border border-outline/20 p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-3 py-2 border-b border-outline/10 mb-1">
                  <p className="font-headline text-xs font-bold text-on-surface">Available Learning Tracks</p>
                  <p className="font-sans text-[11px] text-outline">Select a track tailored to your trajectory</p>
                </div>
                {getAllTracks().map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTrack(t.id)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                      track.id === t.id
                        ? 'bg-primary-fixed/40 text-primary font-semibold shadow-2xs'
                        : 'hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold truncate">{t.title}</p>
                      <p className="text-[11px] text-outline truncate">{t.role}</p>
                    </div>
                    {track.id === t.id && (
                      <span className="material-symbols-outlined text-primary text-base">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Controls Toolbar: Views + Zoom + AI Adapt */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Layout Mode Tabs (Tree, Timeline, Matrix) */}
          <div className="flex items-center p-1 bg-surface-container-low rounded-xl border border-surface-container">
            <button
              type="button"
              id="viewTreeBtn"
              onClick={() => setActiveView('tree')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'tree'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">account_tree</span>
              <span>Tree View</span>
            </button>
            <button
              type="button"
              id="viewTimelineBtn"
              onClick={() => setActiveView('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'timeline'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">timeline</span>
              <span>Timeline</span>
            </button>
            <button
              type="button"
              id="viewMatrixBtn"
              onClick={() => setActiveView('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'matrix'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              <span>Matrix</span>
            </button>
          </div>

          {/* Zoom Level Selector */}
          <div className="flex items-center bg-surface-container-low rounded-xl p-1 border border-surface-container text-xs">
            <button
              type="button"
              onClick={() => adjustZoom(-25)}
              className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest rounded-md transition-colors cursor-pointer"
              title="Zoom out"
            >
              <span className="material-symbols-outlined text-[16px]">remove</span>
            </button>
            <button
              type="button"
              onClick={resetZoom}
              className="font-mono text-xs px-2 text-on-surface font-semibold hover:text-primary transition-colors cursor-pointer"
              title="Click to reset to 100%"
            >
              {zoom}%
            </button>
            <button
              type="button"
              onClick={() => adjustZoom(25)}
              className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest rounded-md transition-colors cursor-pointer"
              title="Zoom in"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>

          {/* AI Customizer Trigger */}
          <button
            type="button"
            id="customizeWithAiBtn"
            onClick={() => setShowAdaptModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white font-sans text-xs font-semibold shadow-sm hover:bg-primary-container transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            <span>Customize with AI</span>
          </button>
        </div>
      </div>

      {/* Filter, Search & Sub-Nav Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-lowest p-3.5 rounded-2xl shadow-sm border border-surface-container">
        {/* Search input + Status filters */}
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Real-time search field */}
          <div className="relative min-w-[200px] max-w-xs flex-1">
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[16px] text-outline">
              search
            </span>
            <input
              type="text"
              id="roadmapSearchInput"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search modules, concepts..."
              className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-surface-container-low text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary border border-outline/10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            )}
          </div>

          {/* Status filters */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-primary text-white shadow-2xs'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All ({allModules.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('in-progress')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filter === 'in-progress'
                  ? 'bg-primary text-white shadow-2xs'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filter === 'completed'
                  ? 'bg-primary text-white shadow-2xs'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Completed ({completedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('locked')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filter === 'locked'
                  ? 'bg-primary text-white shadow-2xs'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Locked ({lockedCount})
            </button>
          </div>

          <div className="h-4 w-px bg-outline/20 mx-1 hidden sm:block" />

          {/* Domain Chips */}
          <div className="flex items-center gap-1">
            {(['concurrency', 'consensus', 'storage', 'fault-tolerance'] as ModuleDomain[]).map((dom) => (
              <button
                key={dom}
                type="button"
                onClick={() => setDomainFilter((prev) => (prev === dom ? 'all' : dom))}
                className={`px-2 py-0.5 rounded-md font-mono text-[11px] transition-all cursor-pointer ${
                  domainFilter === dom
                    ? 'bg-primary text-white font-bold'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                #{dom}
              </button>
            ))}
          </div>
        </div>

        {/* Prerequisite lines toggle + Canvas options */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              id="prereqLinesToggle"
              checked={showPrereqs}
              onChange={(e) => setShowPrereqs(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-8 h-4.5 bg-surface-container-high rounded-full peer peer-checked:bg-primary transition-colors relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-3.5 shadow-2xs" />
            <span className="font-sans text-xs text-on-surface-variant font-medium">Prereq Lines</span>
          </label>

          {/* Canvas Settings Menu */}
          <div className="relative" ref={canvasSettingsRef}>
            <button
              type="button"
              onClick={() => setCanvasSettingsOpen((prev) => !prev)}
              className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              title="Canvas Settings"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </button>

            {canvasSettingsOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-surface-container-lowest shadow-xl border border-outline/20 p-2 z-50 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    const allExp: Record<string, boolean> = {};
                    track.stages.forEach((s) => (allExp[s.id] = true));
                    setExpandedStages(allExp);
                    setCanvasSettingsOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Expand All Stages
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const allCol: Record<string, boolean> = {};
                    track.stages.forEach((s) => (allCol[s.id] = false));
                    setExpandedStages(allCol);
                    setCanvasSettingsOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Collapse All Stages
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCompactCards((prev) => !prev);
                    setCanvasSettingsOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>Compact Cards</span>
                  <span className="material-symbols-outlined text-sm">
                    {compactCards ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Canvas Workspace Grid: Canvas Layout + Node Inspector Sidecard */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Roadmap Interactive Canvas (8 cols) */}
        <div className="xl:col-span-8 bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-sm border border-surface-container relative overflow-hidden min-h-[700px]">
          {/* Subtle Ambient Background Grid */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Canvas Meta Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 relative z-10 border-b border-surface-container mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="font-sans text-xs uppercase tracking-wider text-primary font-bold">
                Personalized Learning Path
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs text-on-surface-variant">
              <span>
                Target Velocity:{' '}
                <strong className="text-on-surface font-semibold">{weeklyCommitmentHours} hrs/wk</strong>
              </span>
              <span>•</span>
              <span>
                Overall Mastery:{' '}
                <strong className="text-primary font-bold">{overallProgress}%</strong>
              </span>
            </div>
          </div>

          {/* Scalable Canvas Container */}
          <div
            className="transition-transform duration-200 origin-top-left"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            {/* VIEW 1: TREE VIEW */}
            {activeView === 'tree' && (
              <div className="space-y-8 relative z-10" id="roadmapTreeContainer">
                {filteredStages.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
                    <h3 className="font-headline font-bold text-base text-on-surface">No modules match your filter</h3>
                    <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                      Try clearing search query or switching status filters to view full curriculum stages.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setFilter('all');
                        setDomainFilter('all');
                      }}
                      className="px-4 py-1.5 rounded-lg bg-primary text-white font-sans text-xs font-semibold cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  filteredStages.map((stage, sIdx) => {
                    const isExpanded = expandedStages[stage.id] ?? true;
                    const isLastStage = sIdx === filteredStages.length - 1;

                    return (
                      <div key={stage.id} className="relative group">
                        <div className="flex items-start gap-4">
                          {/* Rail & Step Marker */}
                          <div className="flex flex-col items-center">
                            <div
                              onClick={() => toggleStageExpand(stage.id)}
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer transition-transform group-hover:scale-105 ${
                                stage.status === 'completed'
                                  ? 'bg-emerald-500 text-white'
                                  : stage.status === 'in-progress'
                                  ? 'bg-primary text-white ring-4 ring-primary/20'
                                  : stage.status === 'unlocked'
                                  ? 'bg-surface-container text-on-surface-variant border border-outline/20'
                                  : 'bg-surface-container-high text-outline'
                              }`}
                              title="Click to expand/collapse stage"
                            >
                              {stage.status === 'completed' ? (
                                <span className="material-symbols-outlined text-[18px]">done_all</span>
                              ) : stage.status === 'in-progress' ? (
                                <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                              ) : stage.status === 'unlocked' ? (
                                <span className="material-symbols-outlined text-[18px]">lock_open</span>
                              ) : (
                                <span className="material-symbols-outlined text-[18px]">lock</span>
                              )}
                            </div>
                            {!isLastStage && (
                              <div
                                className={`w-0.5 mt-2 transition-colors ${
                                  stage.status === 'completed' ? 'bg-emerald-500/40 h-full min-h-[120px]' : 'bg-surface-container-high h-full min-h-[120px]'
                                }`}
                              />
                            )}
                          </div>

                          {/* Stage Content */}
                          <div className="flex-1 pb-4 min-w-0">
                            {/* Stage Header */}
                            <div
                              onClick={() => toggleStageExpand(stage.id)}
                              className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-surface-container-low transition-colors"
                            >
                              <div className="min-w-0 pr-3">
                                <span className="font-mono text-xs font-bold text-primary">
                                  {stage.stageNumber}
                                </span>
                                <h3 className="font-headline text-base font-bold text-on-surface truncate">
                                  {stage.title}
                                </h3>
                                <p className="font-sans text-xs text-on-surface-variant line-clamp-1">
                                  {stage.subtitle}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <div className="hidden sm:flex items-center gap-2">
                                  <span className="font-mono text-xs font-semibold text-primary">
                                    {stage.progressPct}%
                                  </span>
                                  <div className="w-16 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-primary rounded-full transition-all duration-500"
                                      style={{ width: `${stage.progressPct}%` }}
                                    />
                                  </div>
                                </div>
                                <span className="material-symbols-outlined text-outline text-[20px]">
                                  {isExpanded ? 'expand_less' : 'expand_more'}
                                </span>
                              </div>
                            </div>

                            {/* Stage Modules Grid */}
                            {isExpanded && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-3 pt-1">
                                {stage.modules.map((mod) => {
                                  const isSelected = selectedModule?.id === mod.id;

                                  return (
                                    <div
                                      key={mod.id}
                                      onClick={() => setSelectedModuleId(mod.id)}
                                      className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group/card ${
                                        isSelected
                                          ? 'bg-surface-container-lowest ring-2 ring-primary shadow-md border-transparent'
                                          : 'bg-surface-container-low hover:bg-surface-container hover:shadow-xs border-surface-container'
                                      } ${mod.status === 'locked' ? 'opacity-70' : ''}`}
                                    >
                                      {/* Header row: code + status badge + bookmark */}
                                      <div className="flex items-center justify-between gap-2 mb-1.5">
                                        <div className="flex items-center gap-1.5">
                                          <span className="font-mono text-xs font-bold text-primary">
                                            {mod.code}
                                          </span>
                                          <span className="text-outline">•</span>
                                          <span className="font-mono text-[10px] text-outline font-medium">
                                            {mod.domainLabel}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          {getStatusBadge(mod.status, mod.progressPct)}
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleToggleBookmark(mod.id);
                                            }}
                                            className={`p-1 rounded hover:bg-surface-container-high transition-colors ${
                                              mod.bookmarked ? 'text-amber-500' : 'text-outline'
                                            }`}
                                            title={mod.bookmarked ? 'Bookmarked' : 'Bookmark module'}
                                          >
                                            <span className="material-symbols-outlined text-[16px]">
                                              {mod.bookmarked ? 'bookmark' : 'bookmark_border'}
                                            </span>
                                          </button>
                                        </div>
                                      </div>

                                      {/* Title */}
                                      <h4 className="font-headline text-sm font-bold text-on-surface leading-snug group-hover/card:text-primary transition-colors">
                                        {mod.title}
                                      </h4>

                                      {/* Description */}
                                      {!compactCards && (
                                        <p className="font-sans text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                                          {mod.description}
                                        </p>
                                      )}

                                      {/* Prerequisite line notice if toggled */}
                                      {showPrereqs && mod.prereqs.length > 0 && (
                                        <div className="mt-2 pt-2 border-t border-outline/10 flex flex-wrap items-center gap-1">
                                          <span className="text-[10px] font-mono text-outline">Prereqs:</span>
                                          {mod.prereqs.slice(0, 2).map((p, idx) => (
                                            <span
                                              key={idx}
                                              className="px-1.5 py-0.2 rounded bg-surface-container text-outline font-mono text-[10px]"
                                            >
                                              {p}
                                            </span>
                                          ))}
                                          {mod.prereqs.length > 2 && (
                                            <span className="text-[10px] text-outline font-mono">
                                              +{mod.prereqs.length - 2}
                                            </span>
                                          )}
                                        </div>
                                      )}

                                      {/* Card Footer Actions */}
                                      <div className="mt-3 pt-2 border-t border-outline/10 flex items-center justify-between text-xs">
                                        <span className="font-mono text-[11px] text-outline">
                                          ⏱ {mod.estimatedHours} hrs
                                        </span>
                                        <div className="flex items-center gap-2">
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleToggleComplete(mod.id);
                                            }}
                                            className={`px-2 py-0.5 rounded font-sans text-[11px] font-semibold transition-all cursor-pointer ${
                                              mod.status === 'completed'
                                                ? 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20'
                                                : 'bg-primary-fixed text-primary hover:bg-primary hover:text-white'
                                            }`}
                                          >
                                            {mod.status === 'completed' ? 'Done ✓' : 'Mark Done'}
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* VIEW 2: TIMELINE VIEW */}
            {activeView === 'timeline' && (
              <div className="space-y-6 relative z-10 py-2" id="roadmapTimelineContainer">
                <div className="p-3 rounded-xl bg-surface-container-low text-xs text-on-surface-variant flex items-center justify-between mb-4 border border-surface-container">
                  <span>Sprint-Based Milestone Timeline ({weeklyCommitmentHours}h/wk target commitment)</span>
                  <span className="font-mono text-primary font-semibold">Total: {track.estimatedWeeks} Weeks</span>
                </div>

                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-primary/20">
                  {allModules.map((mod, idx) => {
                    const estimatedWeek = Math.max(1, Math.ceil(((idx + 1) * mod.estimatedHours) / weeklyCommitmentHours));
                    const isSelected = selectedModule?.id === mod.id;

                    return (
                      <div key={mod.id} className="relative group">
                        {/* Timeline Bullet */}
                        <div
                          className={`absolute -left-6 top-1 w-4 h-4 rounded-full ring-4 transition-transform group-hover:scale-125 ${
                            mod.status === 'completed'
                              ? 'bg-emerald-500 ring-emerald-500/20'
                              : mod.status === 'in-progress'
                              ? 'bg-primary ring-primary/20 animate-pulse'
                              : 'bg-surface-container-high ring-surface-container'
                          }`}
                        />

                        {/* Milestone card */}
                        <div
                          onClick={() => setSelectedModuleId(mod.id)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-surface-container-lowest ring-2 ring-primary shadow-sm border-transparent'
                              : 'bg-surface-container-low hover:bg-surface-container border-surface-container'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-primary">
                              WEEK {estimatedWeek} • {mod.code}
                            </span>
                            {getStatusBadge(mod.status, mod.progressPct)}
                          </div>
                          <h4 className="font-headline text-sm font-bold text-on-surface">
                            {mod.title}
                          </h4>
                          <p className="font-sans text-xs text-on-surface-variant mt-1">
                            {mod.description}
                          </p>
                          <div className="mt-2.5 flex items-center justify-between text-xs text-outline font-mono">
                            <span>Estimated Duration: {mod.estimatedHours} hrs</span>
                            <span className="text-primary font-semibold hover:underline">
                              Inspect Invariants →
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW 3: COMPETENCY MATRIX VIEW */}
            {activeView === 'matrix' && (
              <div className="space-y-5 relative z-10 py-2" id="roadmapMatrixContainer">
                <div className="p-3 rounded-xl bg-surface-container-low text-xs text-on-surface-variant flex items-center justify-between border border-surface-container">
                  <span>Domain vs. Difficulty Competency Grid</span>
                  <span className="font-mono text-primary font-semibold">4 Domain Axes</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[620px]">
                    <thead>
                      <tr className="border-b border-surface-container text-xs text-outline font-mono uppercase tracking-wider">
                        <th className="py-2.5 px-3">Domain Track</th>
                        <th className="py-2.5 px-3">Foundational</th>
                        <th className="py-2.5 px-3">Intermediate</th>
                        <th className="py-2.5 px-3">Advanced</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container">
                      {(['concurrency', 'consensus', 'storage', 'fault-tolerance'] as ModuleDomain[]).map((dom) => {
                        const domainModules = allModules.filter((m) => m.domain === dom);

                        return (
                          <tr key={dom} className="hover:bg-surface-container-low/40 transition-colors">
                            <td className="py-3 px-3 align-top font-headline text-xs font-bold text-on-surface uppercase tracking-tight">
                              #{dom}
                            </td>
                            {(['Foundational', 'Intermediate', 'Advanced'] as const).map((diff) => {
                              const matching = domainModules.filter((m) => m.difficulty === diff);

                              return (
                                <td key={diff} className="py-3 px-2 align-top">
                                  {matching.length === 0 ? (
                                    <span className="text-[11px] text-outline font-mono">-</span>
                                  ) : (
                                    <div className="space-y-1.5">
                                      {matching.map((m) => (
                                        <div
                                          key={m.id}
                                          onClick={() => setSelectedModuleId(m.id)}
                                          className={`p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                                            selectedModule?.id === m.id
                                              ? 'bg-surface-container-lowest ring-2 ring-primary border-transparent'
                                              : 'bg-surface-container-low hover:bg-surface-container border-outline/10'
                                          }`}
                                        >
                                          <p className="font-semibold text-on-surface leading-tight text-[11px]">
                                            {m.title}
                                          </p>
                                          <div className="flex items-center justify-between mt-1">
                                            <span className="font-mono text-[10px] text-outline">
                                              {m.code}
                                            </span>
                                            {m.status === 'completed' ? (
                                              <span className="text-emerald-600 font-bold text-[10px]">✓</span>
                                            ) : (
                                              <span className="text-primary text-[10px]">
                                                {m.progressPct}%
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Canvas Footer Bar */}
          <div className="mt-8 pt-4 border-t border-surface-container flex items-center justify-between text-on-surface-variant font-mono text-xs">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface text-[10px] font-semibold">
                Click
              </kbd>{' '}
              to inspect any module
            </span>
            <span>Real-time local sync active</span>
          </div>
        </div>

        {/* Node Inspector Sidecard (4 cols) */}
        <div className="xl:col-span-4 space-y-4" id="roadmapInspectorPanel">
          {selectedModule ? (
            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-surface-container space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-mono text-[10px] font-bold">
                      ACTIVE INSPECTION
                    </span>
                    <span className="font-mono text-xs text-outline">{selectedModule.code}</span>
                  </div>
                  <h2 className="font-headline text-lg font-bold text-on-surface mt-1 leading-snug">
                    {selectedModule.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleBookmark(selectedModule.id)}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    selectedModule.bookmarked
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-600'
                      : 'border-outline/20 text-outline hover:text-on-surface'
                  }`}
                  title={selectedModule.bookmarked ? 'Bookmarked' : 'Add bookmark'}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {selectedModule.bookmarked ? 'bookmark' : 'bookmark_border'}
                  </span>
                </button>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-surface-container-low rounded-xl text-xs">
                <div>
                  <span className="text-outline uppercase tracking-wider font-semibold text-[10px]">
                    Difficulty
                  </span>
                  <p className="font-semibold text-on-surface mt-0.5 flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        selectedModule.difficulty === 'Foundational'
                          ? 'bg-emerald-500'
                          : selectedModule.difficulty === 'Intermediate'
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                    />
                    {selectedModule.difficulty}
                  </p>
                </div>
                <div>
                  <span className="text-outline uppercase tracking-wider font-semibold text-[10px]">
                    Estimated Time
                  </span>
                  <p className="font-semibold text-on-surface mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-primary">schedule</span>
                    {selectedModule.estimatedHours} hours
                  </p>
                </div>
              </div>

              {/* Prerequisites List */}
              <div>
                <span className="text-outline uppercase tracking-wider font-semibold text-[10px]">
                  Verified Prerequisites
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedModule.prereqs.map((prereq, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container font-mono text-[11px] text-on-surface"
                    >
                      <span className="material-symbols-outlined text-[13px] text-primary">check</span>
                      {prereq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dynamic Architecture Diagram SVG */}
              <div className="p-3 bg-surface-container-low rounded-xl space-y-1.5 border border-surface-container">
                <div className="flex items-center justify-between text-[10px] font-mono text-outline">
                  <span>ARCHITECTURE INVARIANT</span>
                  <span className="uppercase">{selectedModule.diagramType} TOPOLOGY</span>
                </div>

                {selectedModule.diagramType === 'quorum' && (
                  <svg className="w-full h-12 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 280 60">
                    <circle cx="30" cy="30" fill="#3525cd" r="14" stroke="none" />
                    <text fill="#ffffff" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle" x="30" y="34">L</text>
                    <line stroke="#c7c4d8" strokeDasharray="3 3" x1="44" x2="86" y1="30" y2="30" />
                    <circle cx="100" cy="30" fill="#eaedff" r="12" stroke="#3525cd" />
                    <text fill="#3525cd" fontFamily="monospace" fontSize="9" textAnchor="middle" x="100" y="34">F1</text>
                    <line stroke="#3525cd" x1="44" x2="156" y1="25" y2="15" />
                    <circle cx="170" cy="15" fill="#eaedff" r="12" stroke="#3525cd" />
                    <text fill="#3525cd" fontFamily="monospace" fontSize="9" textAnchor="middle" x="170" y="19">F2</text>
                    <line stroke="#3525cd" x1="44" x2="156" y1="35" y2="45" />
                    <circle cx="170" cy="45" fill="#eaedff" r="12" stroke="#3525cd" />
                    <text fill="#3525cd" fontFamily="monospace" fontSize="9" textAnchor="middle" x="170" y="49">F3</text>
                    <line stroke="#ba1a1a" strokeDasharray="2 2" x1="44" x2="226" y1="30" y2="30" />
                    <circle cx="240" cy="30" fill="#ffdad6" r="12" stroke="#ba1a1a" />
                    <text fill="#93000a" fontFamily="monospace" fontSize="9" textAnchor="middle" x="240" y="34">✕</text>
                  </svg>
                )}

                {selectedModule.diagramType === 'ring' && (
                  <svg className="w-full h-12 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 280 60">
                    <ellipse cx="140" cy="30" rx="90" ry="22" stroke="#c7c4d8" strokeDasharray="3 3" />
                    <circle cx="60" cy="24" fill="#3525cd" r="8" stroke="none" />
                    <circle cx="140" cy="8" fill="#3525cd" r="8" stroke="none" />
                    <circle cx="220" cy="24" fill="#3525cd" r="8" stroke="none" />
                    <circle cx="140" cy="52" fill="#3525cd" r="8" stroke="none" />
                    <text fill="#3525cd" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle" x="140" y="33">HASH RING (Murmur3)</text>
                  </svg>
                )}

                {(selectedModule.diagramType === 'pipeline' || selectedModule.diagramType === 'memory' || selectedModule.diagramType === 'crdt') && (
                  <svg className="w-full h-12 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 280 60">
                    <rect x="20" y="16" width="60" height="28" rx="4" fill="#eaedff" stroke="#3525cd" />
                    <text fill="#3525cd" fontFamily="monospace" fontSize="9" textAnchor="middle" x="50" y="33">IN-MEM</text>
                    <line x1="80" y1="30" x2="110" y2="30" stroke="#3525cd" />
                    <rect x="110" y="16" width="60" height="28" rx="4" fill="#3525cd" stroke="none" />
                    <text fill="#ffffff" fontFamily="monospace" fontSize="9" textAnchor="middle" x="140" y="33">REACTOR</text>
                    <line x1="170" y1="30" x2="200" y2="30" stroke="#3525cd" />
                    <rect x="200" y="16" width="60" height="28" rx="4" fill="#eaedff" stroke="#3525cd" />
                    <text fill="#3525cd" fontFamily="monospace" fontSize="9" textAnchor="middle" x="230" y="33">DISPATCH</text>
                  </svg>
                )}
              </div>

              {/* AI Core Intuition Summary */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-primary text-xs font-semibold">
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  <span>AI CORE INTUITION SUMMARY</span>
                </div>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                  {selectedModule.intuitionSummary}
                </p>
              </div>

              {/* Action CTAs */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  id="takeKnowledgeCheckBtn"
                  onClick={handleOpenQuiz}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-white font-sans text-xs font-semibold shadow-sm hover:bg-primary-container transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">quiz</span>
                  <span>Take Knowledge Check (5 Questions)</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleComplete(selectedModule.id)}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      selectedModule.status === 'completed'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700'
                        : 'bg-surface-container-low border-surface-container text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {selectedModule.status === 'completed' ? 'check_circle' : 'circle'}
                    </span>
                    <span>{selectedModule.status === 'completed' ? 'Completed' : 'Mark Complete'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 py-2 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-on-surface text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">terminal</span>
                    <span>Launch Lab</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container text-center text-outline text-xs">
              Select a module from the canvas to inspect its architecture.
            </div>
          )}

          {/* Compact Rhythm & Target Widget */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-surface-container space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-headline font-bold text-on-surface">Weekly Study Rhythm</span>
              <span className="font-mono text-primary font-bold">{weeklyCommitmentHours}h Target</span>
            </div>
            <p className="font-sans text-xs text-on-surface-variant">
              Maintaining {weeklyCommitmentHours} hours of weekly focus keeps you aligned with your{' '}
              <strong className="text-on-surface">{track.targetRole}</strong> certification milestone.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs">
              <div className="w-6 h-6 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-[10px]">
                AI
              </div>
              <p className="font-sans text-on-surface text-[11px] italic">
                "Review edge case quorums before completing the stage assessment."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 5-Question Knowledge Check Modal */}
      {quizModalOpen && selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-surface-container relative max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container shrink-0">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">quiz</span>
                <div>
                  <h3 className="font-headline font-bold text-base text-on-surface">
                    Knowledge Check: {selectedModule.code}
                  </h3>
                  <p className="text-[11px] font-sans text-outline">{selectedModule.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuizModalOpen(false)}
                className="p-1 rounded-lg text-outline hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Quiz Result Banner if submitted */}
            {quizSubmitted && quizResult && (
              <div
                className={`p-3.5 my-3 rounded-xl border flex items-center justify-between text-xs shrink-0 ${
                  quizResult.passed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800'
                    : 'bg-error-container/60 border-error/30 text-error'
                }`}
              >
                <div>
                  <p className="font-bold">
                    {quizResult.passed ? '🎉 Assessment Passed!' : 'Needs Review (Score < 80%)'}
                  </p>
                  <p className="text-[11px] mt-0.5">
                    You scored {quizResult.score}% ({quizResult.correctCount} of {quizResult.totalCount} correct).
                    {quizResult.passed
                      ? ' Module marked complete and 1.0 hour study progress logged!'
                      : ' Review the explanations below and try again.'}
                  </p>
                </div>
                <span className="font-mono text-base font-bold">{quizResult.score}%</span>
              </div>
            )}

            {/* Questions Form */}
            <form onSubmit={handleQuizSubmit} className="flex-1 overflow-y-auto py-2 space-y-5 pr-1">
              {selectedModule.quizQuestions.map((q, qIdx) => {
                const selectedOpt = userQuizAnswers[q.id];
                const isCorrect = selectedOpt === q.correctIndex;

                return (
                  <div key={q.id} className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container space-y-2.5">
                    <p className="font-sans text-xs font-semibold text-on-surface">
                      <span className="font-mono text-primary mr-1">Q{qIdx + 1}.</span> {q.question}
                    </p>

                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => {
                        const checked = selectedOpt === optIdx;

                        return (
                          <label
                            key={optIdx}
                            className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                              checked
                                ? 'bg-primary/5 border-primary text-on-surface font-medium'
                                : 'bg-surface-container-lowest border-surface-container text-on-surface-variant hover:bg-surface-container'
                            }`}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              checked={checked}
                              onChange={() =>
                                setUserQuizAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: optIdx,
                                }))
                              }
                              className="mt-0.5 text-primary focus:ring-primary"
                              disabled={quizSubmitted}
                            />
                            <span className="flex-1 leading-snug">{opt}</span>
                          </label>
                        );
                      })}
                    </div>

                    {/* Show explanation if submitted */}
                    {quizSubmitted && (
                      <div
                        className={`p-2.5 rounded-lg text-[11px] ${
                          isCorrect ? 'bg-emerald-500/10 text-emerald-800' : 'bg-error-container/40 text-error'
                        }`}
                      >
                        <p className="font-bold">{isCorrect ? 'Correct!' : 'Incorrect'}</p>
                        <p className="mt-0.5">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-3 border-t border-surface-container flex items-center justify-between shrink-0">
                <span className="text-[11px] font-mono text-outline">
                  {Object.keys(userQuizAnswers).length} of {selectedModule.quizQuestions.length} answered
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuizModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low cursor-pointer"
                  >
                    Close
                  </button>
                  {!quizSubmitted ? (
                    <button
                      type="submit"
                      id="submitKnowledgeCheckBtn"
                      disabled={Object.keys(userQuizAnswers).length < selectedModule.quizQuestions.length}
                      className="px-5 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-container shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      Submit Check
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setQuizSubmitted(false);
                        setUserQuizAnswers({});
                        setQuizResult(null);
                      }}
                      className="px-5 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-container shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      Retake Check
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Adapt Pathway Modal */}
      {showAdaptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-surface-container relative">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
                <h3 className="font-headline font-bold text-base text-on-surface">
                  Customize Pathway with AI
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdaptModal(false)}
                className="p-1 rounded-lg text-outline hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAdaptSubmit} className="mt-4 space-y-4">
              <p className="text-xs font-sans text-on-surface-variant leading-relaxed">
                Describe how you would like your curriculum adjusted. IBM Granite will restructure modules, insert
                prerequisite refreshers, or accelerate advanced concepts according to your objectives.
              </p>
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Adaptation Prompt / Goal Focus
                </label>
                <textarea
                  id="adaptPathwayInput"
                  value={adaptFeedback}
                  onChange={(e) => setAdaptFeedback(e.target.value)}
                  placeholder="e.g. Focus deeply on Paxos vs Raft invariants and lock-free memory models; skip basics..."
                  className="w-full h-28 px-3 py-2 rounded-xl border border-outline/20 bg-surface-container-low text-on-surface font-sans text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setShowAdaptModal(false)}
                  className="px-4 py-2 rounded-lg font-sans text-xs font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="applyAdaptationBtn"
                  disabled={isAdapting}
                  className="px-5 py-2 rounded-lg bg-primary text-white font-sans text-xs font-semibold shadow-sm hover:bg-primary-container disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isAdapting && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                  <span>{isAdapting ? 'Adapting with Granite...' : 'Apply Adaptation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
