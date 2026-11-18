import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearnMate } from '@/context/LearnMateContext';
import {
  getStreakData,
  getWeeklyActivity,
  recordActivity,
  getStoredMilestones,
  saveStoredMilestones,
  type DashboardMilestone,
} from '@/utils/dashboardStore';

interface SimulationState {
  running: boolean;
  step: number;
  logs: string[];
}

export function Dashboard() {
  const navigate = useNavigate();
  const { chatHistory, user } = useLearnMate();

  // Load user profile & onboarding data
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

  const userName = user?.fullName || storedUser?.name || 'Jordan Taylor';
  const userTrajectory =
    user?.trajectory ||
    storedOnboarding?.targetRole ||
    storedUser?.trajectory ||
    'Distributed Systems Staff Engineer';
  const commitment = (storedOnboarding?.commitment || storedUser?.commitment || 'accelerated') as
    | 'casual'
    | 'accelerated'
    | 'intensive';
  const experienceLevel =
    storedOnboarding?.experienceLevel || storedUser?.experienceLevel || 'Senior (5+ yrs)';

  // Streak & Weekly Activity from store
  const [streak, setStreak] = useState(() => getStreakData());
  const [weekly, setWeekly] = useState(() => getWeeklyActivity(commitment));

  // Milestones with persistence
  const [milestones, setMilestones] = useState<DashboardMilestone[]>(() =>
    getStoredMilestones(userTrajectory),
  );

  // Custom Study Goal Modal State
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalSubtitle, setNewGoalSubtitle] = useState('');
  const [newGoalBadge, setNewGoalBadge] = useState('High Pri');

  // Interactive Code Sandbox State
  const [activeTab, setActiveTab] = useState<'node' | 'timer' | 'quorum'>('node');
  const [simulation, setSimulation] = useState<SimulationState>({
    running: false,
    step: 0,
    logs: [
      'func (n *RaftNode) StartElection() {',
      '    n.currentTerm++',
      '    n.votedFor = n.id',
      '    n.electionTimer.Reset(randomTimeout(150, 300))',
      '    // Broadcast RequestVoteArgs to quorum',
      '    votesReceived := n.broadcastVoteRequests()',
      '}',
    ],
  });

  // Action toast message
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Toggle milestone completion
  const handleToggleMilestone = (id: string) => {
    const updated = milestones.map((m) => {
      if (m.id === id) {
        const nextCompleted = !m.completed;
        if (nextCompleted) {
          // Log study activity upon milestone completion
          const { streak: newStreak, weekly: newWeekly } = recordActivity(0.5);
          setStreak(newStreak);
          setWeekly(newWeekly);
          showToast(`Milestone completed! +0.5h logged toward weekly target.`);
        }
        return { ...m, completed: nextCompleted };
      }
      return m;
    });
    setMilestones(updated);
    saveStoredMilestones(updated);
  };

  // Add custom goal
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    const newMilestone: DashboardMilestone = {
      id: `custom-${Date.now()}`,
      title: newGoalTitle.trim(),
      subtitle: newGoalSubtitle.trim() || 'Custom Priority Goal',
      badge: newGoalBadge,
      badgeColor:
        newGoalBadge === 'High Pri'
          ? 'bg-error-container/60 text-error'
          : 'bg-primary-fixed text-primary',
      completed: false,
    };

    const updated = [...milestones, newMilestone];
    setMilestones(updated);
    saveStoredMilestones(updated);
    setNewGoalTitle('');
    setNewGoalSubtitle('');
    setGoalModalOpen(false);
    showToast(`Custom goal "${newMilestone.title}" added to your milestones!`);
  };

  // Run interactive quorum simulation in Code Visualizer
  const handleRunSimulation = () => {
    if (simulation.running) return;

    setSimulation({
      running: true,
      step: 1,
      logs: [
        '--- SIMULATING RAFT CANDIDATE ELECTION ---',
        '[t+0ms] Node-02 transition to CANDIDATE phase. Incrementing term to 15.',
        '[t+12ms] Broadcasting RequestVote RPCs across simulated cluster quorum...',
      ],
    });

    setTimeout(() => {
      setSimulation((prev) => ({
        ...prev,
        step: 2,
        logs: [
          ...prev.logs,
          '[t+45ms] Node-01 vote granted (Term: 15, matchIndex: 42).',
          '[t+58ms] Node-03 vote granted (Term: 15, matchIndex: 42).',
          '[t+62ms] Affirmative quorum achieved (3/5 positive votes).',
        ],
      }));
    }, 900);

    setTimeout(() => {
      setSimulation((prev) => ({
        ...prev,
        running: false,
        step: 3,
        logs: [
          ...prev.logs,
          '[t+80ms] Node-02 assumes LEADER state. Initializing periodic heartbeat timers.',
          '>>> STATUS: CLUSTER QUORUM SYNCHRONIZED (All invariants verified) <<<',
        ],
      }));

      // Log progress on simulation completion
      const { streak: newStreak, weekly: newWeekly } = recordActivity(0.25);
      setStreak(newStreak);
      setWeekly(newWeekly);
      showToast('Simulation complete! +0.25h active study time logged to weekly goal.');
    }, 1800);
  };

  // Log manual study session
  const handleQuickLog = () => {
    const { streak: newStreak, weekly: newWeekly } = recordActivity(0.5);
    setStreak(newStreak);
    setWeekly(newWeekly);
    showToast('+0.5h study session logged! Weekly progress updated.');
  };

  // Derived metrics
  const completedMilestones = milestones.filter((m) => m.completed);
  const pendingMilestones = milestones.filter((m) => !m.completed);
  const nextPending = pendingMilestones[0] || milestones[0];
  const masteryPct = Math.round(
    (completedMilestones.length / Math.max(1, milestones.length)) * 100,
  );

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Action Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-on-surface text-surface shadow-2xl flex items-center gap-2.5 font-label-sm text-sm animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Editorial Greeting & Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-surface-container">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary-fixed/25 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed text-primary text-xs font-semibold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                ACTIVE COHORT • SPRING 2025
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-mono text-xs">
                <span>🔥</span>
                <span className="font-semibold text-on-surface">
                  {streak.currentStreak}-day streak
                </span>
                <span className="text-outline">•</span>
                <span>Top 5% consistency</span>
              </span>
            </div>
            <h1 className="font-headline text-3xl font-bold text-on-surface tracking-tight pt-1">
              Good morning, {userName.split(' ')[0]}. Ready to master{' '}
              <span className="text-primary">{userTrajectory}</span> today?
            </h1>
            <p className="font-sans text-sm text-on-surface-variant">
              You have completed {completedMilestones.length} of {milestones.length} targeted milestones. Next up is{' '}
              <strong className="text-on-surface">{nextPending?.title || 'Advanced Protocols'}</strong>.
            </p>
          </div>

          {/* Quick Resume Interactive Action Box */}
          <div className="w-full lg:w-96 rounded-xl bg-surface-container-low p-4 shadow-sm space-y-3 shrink-0 border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs uppercase tracking-wider text-outline font-semibold">
                Current Priority
              </span>
              <span className="font-mono text-xs text-primary font-medium">18 min remaining</span>
            </div>
            <div className="space-y-0.5">
              <h2 className="font-headline font-semibold text-base text-on-surface truncate">
                {nextPending?.title || 'Raft Consensus Algorithm'}
              </h2>
              <p className="font-sans text-xs text-on-surface-variant line-clamp-1">
                {nextPending?.subtitle || 'Section 3: Log Compaction & Heartbeat Timers'}
              </p>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center font-sans text-xs">
                <span className="text-on-surface-variant">Track Progress</span>
                <span className="font-semibold text-on-surface">{masteryPct}%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${masteryPct}%` }}
                />
              </div>
            </div>
            <button
              onClick={() => navigate('/pathway')}
              type="button"
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-primary text-white font-sans text-sm font-semibold hover:bg-primary-container transition-all shadow-sm active:scale-[0.99] cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">play_circle</span>
              <span>Resume: {nextPending?.title ? nextPending.title.split(':')[0] : 'Pathway'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Active Study Time */}
        <div className="rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs uppercase tracking-wider text-outline font-semibold">
              Active Study Time
            </span>
            <span className="p-1.5 rounded-md bg-surface-container-low text-primary material-symbols-outlined text-lg">
              schedule
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline text-2xl font-bold text-on-surface tracking-tight">
              {weekly.totalHours}
            </span>
            <span className="font-sans text-xs text-outline">hrs this week</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1 font-sans text-xs text-primary font-medium">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>Target: {weekly.targetHours}h/wk</span>
            </div>
            <button
              type="button"
              onClick={handleQuickLog}
              className="font-code-sm text-[11px] text-primary hover:underline cursor-pointer font-medium"
            >
              +0.5h quick log
            </button>
          </div>
        </div>

        {/* Stat 2: Concept Mastery */}
        <div className="rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs uppercase tracking-wider text-outline font-semibold">
              Concept Mastery
            </span>
            <span className="p-1.5 rounded-md bg-surface-container-low text-secondary material-symbols-outlined text-lg">
              verified
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline text-2xl font-bold text-on-surface tracking-tight">
              {masteryPct}%
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-sans text-xs text-on-surface-variant">
              {completedMilestones.length} of {milestones.length} topics validated
            </span>
            <div className="w-12 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full" style={{ width: `${masteryPct}%` }} />
            </div>
          </div>
        </div>

        {/* Stat 3: Current Track */}
        <div className="rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs uppercase tracking-wider text-outline font-semibold">
              Current Track
            </span>
            <span className="p-1.5 rounded-md bg-surface-container-low text-tertiary material-symbols-outlined text-lg">
              hub
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline text-lg font-bold text-on-surface truncate" title={userTrajectory}>
              {userTrajectory}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-mono text-xs text-on-surface-variant truncate mr-1">
              {experienceLevel}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface font-sans text-xs font-semibold shrink-0">
              Lvl 4
            </span>
          </div>
        </div>

        {/* Stat 4: AI Mentor Sessions */}
        <div className="rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs uppercase tracking-wider text-outline font-semibold">
              AI Mentor Queries
            </span>
            <span className="p-1.5 rounded-md bg-surface-container-low text-primary material-symbols-outlined text-lg">
              neurology
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline text-2xl font-bold text-on-surface tracking-tight">
              {chatHistory.length > 0 ? chatHistory.length : 28}
            </span>
            <span className="font-sans text-xs text-outline">queries logged</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1 font-sans text-xs text-primary font-medium">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>100% verified</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/companion')}
              className="font-code-sm text-[11px] text-primary hover:underline cursor-pointer font-medium"
            >
              Ask AI
            </button>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Primary Study Workspace: Interactive Code Sandbox */}
          <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4 border border-surface-container">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="font-sans text-xs uppercase tracking-widest text-outline font-semibold">
                  Active Learning Sandbox
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-primary font-mono text-xs font-semibold">
                MODULE 04 • LESSON 2.4
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="font-headline text-xl font-bold text-on-surface tracking-tight">
                Leader Election &amp; Randomized Heartbeat Delays
              </h2>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                In this interactive section, explore split-vote mitigation in Raft by orchestrating term counters and vote request envelopes under simulated asymmetric network partitions.
              </p>
            </div>

            {/* Interactive Multi-Tab Code Sandbox */}
            <div className="rounded-xl bg-[#1e232e] p-4 text-white space-y-3 shadow-inner border border-[#2e3544]">
              {/* Tab Navigation & Status */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2e3544] pb-2 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('node')}
                    className={`px-2.5 py-1 rounded font-mono transition-colors cursor-pointer ${
                      activeTab === 'node'
                        ? 'bg-[#2e3544] text-white font-semibold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    raft_node_state.go
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('timer')}
                    className={`px-2.5 py-1 rounded font-mono transition-colors cursor-pointer ${
                      activeTab === 'timer'
                        ? 'bg-[#2e3544] text-white font-semibold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    heartbeat_timer.go
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('quorum')}
                    className={`px-2.5 py-1 rounded font-mono transition-colors cursor-pointer ${
                      activeTab === 'quorum'
                        ? 'bg-[#2e3544] text-white font-semibold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    quorum_check.go
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-primary-fixed-dim font-mono">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        simulation.running ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'
                      }`}
                    />
                    {simulation.running ? 'SIMULATING...' : 'READY'}
                  </span>
                </div>
              </div>

              {/* Code / Execution Terminal Area */}
              <div
                id="dashboardCodeVisualizer"
                className="font-mono text-xs overflow-x-auto py-2 leading-relaxed text-gray-200 min-h-[140px]"
              >
                {activeTab === 'node' && (
                  <div>
                    {simulation.logs.map((line, idx) => (
                      <p
                        key={idx}
                        className={
                          line.startsWith('>>>')
                            ? 'text-emerald-400 font-bold'
                            : line.startsWith('---')
                            ? 'text-indigo-400 font-semibold'
                            : line.startsWith('[t+')
                            ? 'text-amber-300'
                            : 'text-gray-300'
                        }
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                )}
                {activeTab === 'timer' && (
                  <div className="space-y-1 text-gray-300">
                    <p className="text-purple-400">// Randomized Jitter Algorithm</p>
                    <p>func randomTimeout(min, max time.Duration) time.Duration &#123;</p>
                    <p className="pl-4">delta := max - min</p>
                    <p className="pl-4">return min + time.Duration(rand.Int63n(int64(delta)))</p>
                    <p>&#125;</p>
                  </div>
                )}
                {activeTab === 'quorum' && (
                  <div className="space-y-1 text-gray-300">
                    <p className="text-purple-400">// Quorum Validation Invariant</p>
                    <p>func hasQuorum(votes, totalNodes int) bool &#123;</p>
                    <p className="pl-4">return votes &gt; (totalNodes / 2)</p>
                    <p>&#125;</p>
                  </div>
                )}
              </div>

              {/* Simulation Action Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[#2e3544] text-xs text-gray-400">
                <span>Quorum simulation engine: Granite Diagnostics v3.2</span>
                <button
                  type="button"
                  id="runQuorumSimulationBtn"
                  disabled={simulation.running}
                  onClick={handleRunSimulation}
                  className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-white font-medium flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {simulation.running ? 'hourglass_top' : 'play_arrow'}
                  </span>
                  <span>{simulation.running ? 'Executing Quorum...' : 'Run Quorum Simulation'}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-4 text-on-surface-variant font-sans text-xs w-full sm:w-auto">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-outline">timer</span>
                  <span>
                    Est. time: <strong className="text-on-surface">18 mins</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-outline">psychology</span>
                  <span>
                    Diff: <strong className="text-on-surface">Intermediate</strong>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => navigate('/resources')}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-sans text-sm font-semibold transition-colors border border-surface-container cursor-pointer"
                >
                  Read Notes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleQuickLog();
                    navigate('/pathway');
                  }}
                  className="flex-1 sm:flex-none px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary-container font-sans text-sm font-semibold transition-all shadow-sm cursor-pointer"
                >
                  Continue Lesson
                </button>
              </div>
            </div>
          </div>

          {/* Actionable Micro-Lessons Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline text-lg font-bold text-on-surface">
                  Today's Recommended Focus
                </h3>
                <p className="font-sans text-xs text-on-surface-variant">
                  Targeted deep dives to bridge knowledge gaps identified during testing
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/resources')}
                className="font-sans text-sm font-semibold text-primary hover:text-primary-container flex items-center gap-1 cursor-pointer"
              >
                <span>View Syllabus</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Micro Lesson 1 */}
              <div
                onClick={() => {
                  handleQuickLog();
                  navigate('/pathway');
                }}
                className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer border border-outline-variant/30"
              >
                <div className="space-y-space-xs">
                  <div className="w-full h-28 rounded-lg overflow-hidden relative mb-2">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhjNYioFYISMztLN-aHE1MZGHf7WffLtQuNXZpyXS1Lc82tw1aKwE0f-W6E1QygL93SXjWE6qlPjN3JXfomxxD-gROLbx0m8XfW0zskA2Dqr_-vvT5oJ7CkfJaZAAUau4mvyPXU3uFrVpUSCQHzoKwxoC2ro8AZTgIQ4vIZX_521TJmsdwaEm4MoWX2zY67mukKEbPqwwcZdF_Mj92RtjpE9tSqAlFGsjdOpirMq_m"
                      alt="Vector Clocks"
                    />
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-surface-container-lowest/90 backdrop-blur-sm font-code-sm text-code-sm text-on-surface">
                      12 min
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">
                    Architecture Deep Dive
                  </span>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors leading-snug">
                    Vector Clocks in DynamoDB
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                    Detecting concurrent mutations without centralized lock orchestrators.
                  </p>
                </div>
                <div className="mt-space-md pt-space-xs flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant border-t border-outline-variant/20">
                  <span>94% Comprehension</span>
                  <span className="material-symbols-outlined text-[18px] text-outline group-hover:translate-x-1 transition-transform">
                    east
                  </span>
                </div>
              </div>

              {/* Micro Lesson 2 */}
              <div
                onClick={() => {
                  handleQuickLog();
                  navigate('/companion');
                }}
                className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer border border-outline-variant/30"
              >
                <div className="space-y-space-xs">
                  <div className="w-full h-28 rounded-lg overflow-hidden relative mb-2">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGT_HBPoN1344IMJwqBpTLD6SKVPbuPscRuwSa-VBXm2CMirT4NjB1WSi0_viJTwYM_RlHygVWGKCKMV48-x6l-Msnh1utMYTtQZwSrXdxKv8aSifvaLYeheGbCrcGg_5NScjIlF4mBlUrBOVOCmFymPiU6zhpiVglp6csx-I5-ByAoerMukgeB0mRrYKhMo_xle-6p25UhMNw22rAUKhiBvssmWGnnRx1MBuMq8Sb"
                      alt="Gossip Protocol"
                    />
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-surface-container-lowest/90 backdrop-blur-sm font-code-sm text-code-sm text-on-surface">
                      8 min
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                    Simulation Canvas
                  </span>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-secondary transition-colors leading-snug">
                    Gossip Protocol Visualizer
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                    Experiment with infection-style dissemination rates across 1,000 virtual nodes.
                  </p>
                </div>
                <div className="mt-space-md pt-space-xs flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant border-t border-outline-variant/20">
                  <span>Interactive Simulator</span>
                  <span className="material-symbols-outlined text-[18px] text-outline group-hover:translate-x-1 transition-transform">
                    east
                  </span>
                </div>
              </div>

              {/* Micro Lesson 3 */}
              <div
                onClick={() => {
                  handleQuickLog();
                  navigate('/resources');
                }}
                className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer border border-outline-variant/30"
              >
                <div className="space-y-space-xs">
                  <div className="w-full h-28 rounded-lg overflow-hidden relative mb-2">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCn-LXgVg-fZ0bSWEgueS9Mi8nupLgHE_RG2vtsvgRIXR50C9xwGNFeZEFlLb5aPz7gCNkGaydWmGKm766VA28QYyfuE4hdmRPIYNXfW2arNHZlbbyfe_510vRqpXH_MeIARq-gUpfgoOehTyn0H-bwxzCoJW1PkpDkNpfPtEiDviGYk2BHIlEORrSTRFO6-VyiedjEF8YKByi5uqy80S09-yaa5euvT31K-thsoSoe"
                      alt="Google Spanner"
                    />
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-surface-container-lowest/90 backdrop-blur-sm font-code-sm text-code-sm text-on-surface">
                      15 min
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary font-semibold">
                    Case Study
                  </span>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors leading-snug">
                    CAP Theorem: Google Spanner
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                    How hardware atomic clocks and TrueTime APIs bypass classic trade-offs.
                  </p>
                </div>
                <div className="mt-space-md pt-space-xs flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant border-t border-outline-variant/20">
                  <span>Includes Audio Deep Dive</span>
                  <span className="material-symbols-outlined text-[18px] text-outline group-hover:translate-x-1 transition-transform">
                    east
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Learning Companion Insight Box */}
          <div className="rounded-2xl bg-white p-5 shadow-sm relative overflow-hidden border border-surface-container">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-primary-fixed/30 blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xl text-primary">auto_awesome</span>
                <span className="font-headline font-bold text-sm text-on-surface">AI Mentor Insight</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-primary-fixed text-primary font-mono text-xs">
                Just now
              </span>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-surface-container-low text-on-surface space-y-1.5 border border-surface-container">
                <p className="font-sans text-xs leading-relaxed text-on-surface-variant">
                  "You mastered <strong className="text-on-surface">Paxos Leader Election</strong> faster than{' '}
                  <strong className="text-on-surface">89% of peers</strong>. Your retention index remains optimal at 94.2% across concurrency primitives."
                </p>
                <div className="pt-1 flex items-center justify-between text-outline font-sans text-xs">
                  <span>Next review due in 3 days</span>
                  <button
                    onClick={() => navigate('/progress')}
                    type="button"
                    className="text-primary font-semibold hover:underline cursor-pointer"
                  >
                    Review Flashcards
                  </button>
                </div>
              </div>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => navigate('/companion')}
                  className="w-full py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-sans text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-surface-container cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                  <span>Ask Follow-up Question</span>
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Milestones & Deadlines */}
          <div className="rounded-2xl bg-white p-5 shadow-sm space-y-4 border border-surface-container">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-sm text-on-surface">Upcoming Milestones</h3>
              <span className="font-sans text-xs text-primary font-bold">
                {pendingMilestones.length} Pending
              </span>
            </div>
            <div className="space-y-2">
              {milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  onClick={() => handleToggleMilestone(milestone.id)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg transition-colors cursor-pointer group border ${
                    milestone.completed
                      ? 'bg-transparent border-transparent opacity-60'
                      : 'bg-surface-container-low border-surface-container hover:bg-surface-container'
                  }`}
                >
                  <button
                    type="button"
                    aria-label={`Mark ${milestone.title} as ${
                      milestone.completed ? 'incomplete' : 'complete'
                    }`}
                    className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center text-xs shrink-0 transition-colors ${
                      milestone.completed
                        ? 'bg-primary text-white'
                        : 'bg-white shadow-xs border border-outline-variant/60'
                    }`}
                  >
                    {milestone.completed && (
                      <span className="material-symbols-outlined text-xs">check</span>
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-sans text-xs font-medium leading-snug ${
                        milestone.completed ? 'line-through text-outline' : 'text-on-surface'
                      }`}
                    >
                      {milestone.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[11px] text-on-surface-variant">
                        {milestone.subtitle}
                      </span>
                      {milestone.badge && !milestone.completed && (
                        <span
                          className={`px-1.5 py-0.2 rounded font-sans text-[10px] font-semibold ${
                            milestone.badgeColor || 'bg-primary-fixed text-primary'
                          }`}
                        >
                          {milestone.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Goal Modal Trigger */}
            <button
              type="button"
              id="addCustomGoalBtn"
              onClick={() => setGoalModalOpen(true)}
              className="w-full py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-sans text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-surface-container cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>+ Add Custom Study Goal</span>
            </button>
          </div>

          {/* Weekly Learning Rhythm (7-Day Heat Blocks) */}
          <div className="rounded-2xl bg-white p-5 shadow-sm space-y-3 border border-surface-container">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-sm text-on-surface">Weekly Rhythm</h3>
              <span className="font-mono text-xs text-primary font-semibold">
                Target: {commitment === 'casual' ? '0.6h/day' : commitment === 'accelerated' ? '1.2h/day' : '2.2h/day'}
              </span>
            </div>
            <p className="font-sans text-xs text-on-surface-variant">
              Total <strong className="text-on-surface">{weekly.totalHours} hrs</strong> logged this week across active study sessions ({commitment.toUpperCase()} PACING).
            </p>
            <div className="grid grid-cols-7 gap-1.5 pt-1">
              {[
                { day: 'M', key: 'M' },
                { day: 'T', key: 'T' },
                { day: 'W', key: 'W' },
                { day: 'Th', key: 'Th' },
                { day: 'F', key: 'F' },
                { day: 'Sa', key: 'Sa' },
                { day: 'Su', key: 'Su' },
              ].map((item) => {
                const hours = weekly.dailyHours[item.key] || 0;
                const bg =
                  hours >= 2.5
                    ? 'bg-primary text-white font-bold'
                    : hours >= 1.5
                    ? 'bg-primary/60 text-white font-medium'
                    : hours >= 0.8
                    ? 'bg-primary/30 text-primary font-medium'
                    : hours > 0
                    ? 'bg-primary/15 text-primary'
                    : 'bg-surface-container-low text-outline';

                return (
                  <div key={item.key} className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-full h-8 rounded flex items-center justify-center font-mono text-[10px] transition-transform hover:scale-105 cursor-pointer ${bg}`}
                      title={`${item.day}: ${hours}h logged`}
                    >
                      {hours > 0 ? `${hours}h` : '-'}
                    </div>
                    <span className="font-sans text-xs text-outline font-medium">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Inline Modal: Add Custom Study Goal */}
      {goalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-surface-container relative">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">flag</span>
                <h3 className="font-headline font-bold text-base text-on-surface">
                  Add Custom Study Goal
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setGoalModalOpen(false)}
                className="p-1 rounded-lg text-outline hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  id="customGoalTitleInput"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="e.g. Zero-Copy Buffer Benchmark"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline/20 text-on-surface font-sans text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Deadline / Context Subtitle
                </label>
                <input
                  type="text"
                  id="customGoalSubtitleInput"
                  value={newGoalSubtitle}
                  onChange={(e) => setNewGoalSubtitle(e.target.value)}
                  placeholder="e.g. Due Friday • Performance Benchmark"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline/20 text-on-surface font-sans text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Priority Badge
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['High Pri', 'Core Lab', 'Paper Review'] as const).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setNewGoalBadge(b)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                        newGoalBadge === b
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-surface-container-low border-surface-container text-on-surface-variant'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setGoalModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-on-surface-variant hover:bg-surface-container-low cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submitCustomGoalBtn"
                  className="px-5 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-container shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  Add Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
