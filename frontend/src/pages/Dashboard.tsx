import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Milestone {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  completed: boolean;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Alex Rivera');
  const [userTrajectory, setUserTrajectory] = useState('Distributed Systems');

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: 'm1',
      title: 'MapReduce Practical Implementation',
      subtitle: 'Completed Yesterday • Score: 98%',
      completed: true,
    },
    {
      id: 'm2',
      title: 'Raft Consensus Algorithm Lab',
      subtitle: 'Today • 23:59 UTC',
      badge: 'High Pri',
      badgeColor: 'bg-error-container/60 text-error',
      completed: false,
    },
    {
      id: 'm3',
      title: 'Byzantine Fault Tolerance Paper Review',
      subtitle: 'Due Thursday, Apr 17 • Cohort Peer Review',
      completed: false,
    },
    {
      id: 'm4',
      title: 'Distributed Storage Final Capstone',
      subtitle: 'Due Apr 25 • Benchmark Evaluation',
      completed: false,
    },
  ]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('learnmate_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) setUserName(parsed.name);
        if (parsed.trajectory) setUserTrajectory(parsed.trajectory);
      }
    } catch (e) {
      // Keep defaults
    }
  }, []);

  const toggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  return (
    <div className="flex flex-col w-full space-y-6">
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
                <span className="font-semibold text-on-surface">14-day streak</span>
                <span className="text-outline">•</span>
                <span>Top 5% consistency</span>
              </span>
            </div>
            <h1 className="font-headline text-3xl font-bold text-on-surface tracking-tight pt-1">
              Good morning, {userName.split(' ')[0]}. Ready to master{' '}
              <span className="text-primary">{userTrajectory}</span> today?
            </h1>
            <p className="font-sans text-sm text-on-surface-variant">
              You are 3 lessons away from completing Module 04: Consensus Mechanisms. Retention index remains optimal at 94.2%.
            </p>
          </div>

          {/* Quick Resume Interactive Action Box */}
          <div className="w-full lg:w-96 rounded-xl bg-surface-container-low p-4 shadow-sm space-y-3 shrink-0 border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs uppercase tracking-wider text-outline font-semibold">
                Current Priority
              </span>
              <span className="font-mono text-xs text-primary font-medium">
                18 min remaining
              </span>
            </div>
            <div className="space-y-0.5">
              <h2 className="font-headline font-semibold text-base text-on-surface truncate">
                Raft Consensus Algorithm
              </h2>
              <p className="font-sans text-xs text-on-surface-variant line-clamp-1">
                Section 3: Log Compaction & Heartbeat Timers
              </p>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center font-sans text-xs">
                <span className="text-on-surface-variant">Progress (Part 2/3)</span>
                <span className="font-semibold text-on-surface">68%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: '68%' }}
                />
              </div>
            </div>
            <button
              onClick={() => navigate('/pathway')}
              type="button"
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-primary text-white font-sans text-sm font-semibold hover:bg-primary-container transition-all shadow-sm active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-lg">play_circle</span>
              <span>Resume: Raft Consensus</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
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
              34.2
            </span>
            <span className="font-sans text-xs text-outline">hrs</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1 font-sans text-xs text-primary font-medium">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+12% this month</span>
            </div>
            <svg className="w-16 h-5 text-primary" fill="none" viewBox="0 0 64 20">
              <path
                d="M2 17 L14 14 L26 15 L38 9 L50 11 L62 3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Stat 2 */}
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
              78.4%
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-sans text-xs text-on-surface-variant">42 of 54 topics validated</span>
            <div className="w-12 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full" style={{ width: '78.4%' }} />
            </div>
          </div>
        </div>

        {/* Stat 3 */}
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
            <span className="font-headline text-lg font-bold text-on-surface truncate">
              {userTrajectory}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-mono text-xs text-on-surface-variant">Tier 3 • Core Engine</span>
            <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface font-sans text-xs font-semibold">
              Lvl 4
            </span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs uppercase tracking-wider text-outline font-semibold">
              AI Mentor Sessions
            </span>
            <span className="p-1.5 rounded-md bg-surface-container-low text-primary material-symbols-outlined text-lg">
              neurology
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline text-2xl font-bold text-on-surface tracking-tight">
              28
            </span>
            <span className="font-sans text-xs text-outline">queries logged</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1 font-sans text-xs text-primary font-medium">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>94% verification</span>
            </div>
            <span className="font-mono text-xs text-on-surface-variant">2 pending</span>
          </div>
        </div>
      </div>

      {/* Two-Column Asymmetric Layout (8 cols / 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Deep Interactive Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Primary Study Workspace: Continue Learning Module */}
          <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4 border border-surface-container">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="font-sans text-xs uppercase tracking-widest text-outline font-semibold">
                  Active Learning Module
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-primary font-mono text-xs font-semibold">
                MODULE 04 • LESSON 2.4
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="font-headline text-xl font-bold text-on-surface tracking-tight">
                Leader Election & Randomized Heartbeat Delays
              </h2>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                In this interactive section, explore split-vote mitigation in Raft by orchestrating term counters and vote request envelopes under simulated asymmetric network partitions.
              </p>
            </div>

            {/* Rich Code Visualizer Sandbox */}
            <div className="rounded-xl bg-[#1e232e] p-4 text-white space-y-3 shadow-inner border border-[#2e3544]">
              <div className="flex items-center justify-between font-mono text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-primary-fixed-dim">terminal</span>
                  <span>raft_node_state.go (Candidate Phase)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-primary-fixed-dim">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" /> Node-02: CANDIDATE
                  </span>
                  <span>Term: 14</span>
                </div>
              </div>
              <div className="font-mono text-xs overflow-x-auto py-1 leading-relaxed text-gray-200">
                <p>
                  <span className="text-purple-400">func</span> (n *RaftNode){' '}
                  <span className="text-indigo-400">StartElection</span>() {'{'}
                </p>
                <p className="pl-4">n.currentTerm++</p>
                <p className="pl-4">n.votedFor = n.id</p>
                <p className="pl-4">
                  n.electionTimer.Reset(randomElectionTimeout(
                  <span className="text-amber-300">150*time.Millisecond</span>,{' '}
                  <span className="text-amber-300">300*time.Millisecond</span>))
                </p>
                <p className="pl-4 text-gray-500">// Broadcast RequestVoteArgs to quorum</p>
                <p className="pl-4">votesReceived := n.broadcastVoteRequests()</p>
                <p>{'}'}</p>
              </div>
              <div className="pt-2 flex items-center justify-between font-sans text-xs text-gray-400 border-t border-[#2e3544]">
                <span>Terminal status: Node-02 quorum response 3/5 affirmative</span>
                <span className="text-indigo-400 font-medium">State machine synced</span>
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
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-sans text-sm font-semibold transition-colors border border-surface-container"
                >
                  Read Notes
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/pathway')}
                  className="flex-1 sm:flex-none px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary-container font-sans text-sm font-semibold transition-all shadow-sm"
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
                className="font-sans text-sm font-semibold text-primary hover:text-primary-container flex items-center gap-1"
              >
                <span>View Syllabus</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Micro Lesson 1 */}
              <div
                onClick={() => navigate('/pathway')}
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
                onClick={() => navigate('/companion')}
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
                onClick={() => navigate('/resources')}
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

        {/* Right Column (4 cols): Insights, Schedule & Cadence */}
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
                  <strong className="text-on-surface">89% of peers</strong>. Your Spaced Repetition retention score indicates log compaction is your only weak spot."
                </p>
                <div className="pt-1 flex items-center justify-between text-outline font-sans text-xs">
                  <span>Next review due in 3 days</span>
                  <button
                    onClick={() => navigate('/progress')}
                    type="button"
                    className="text-primary font-semibold hover:underline"
                  >
                    Review Flashcards
                  </button>
                </div>
              </div>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => navigate('/companion')}
                  className="w-full py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-sans text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-surface-container"
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
                {milestones.filter((m) => !m.completed).length} Pending
              </span>
            </div>
            <div className="space-y-2">
              {milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  onClick={() => toggleMilestone(milestone.id)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg transition-colors cursor-pointer group border ${
                    milestone.completed
                      ? 'bg-transparent border-transparent opacity-60'
                      : 'bg-surface-container-low border-surface-container hover:bg-surface-container'
                  }`}
                >
                  <button
                    type="button"
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
                        milestone.completed
                          ? 'line-through text-outline'
                          : 'text-on-surface'
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
            <button
              type="button"
              onClick={() => navigate('/progress')}
              className="w-full py-1.5 text-center text-on-surface-variant hover:text-on-surface font-sans text-xs font-medium transition-colors"
            >
              + Add Custom Study Goal
            </button>
          </div>

          {/* Weekly Learning Rhythm (7-Day Heat Blocks) */}
          <div className="rounded-2xl bg-white p-5 shadow-sm space-y-3 border border-surface-container">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-sm text-on-surface">Weekly Rhythm</h3>
              <span className="font-mono text-xs text-outline">Target: 2.5h/day</span>
            </div>
            <p className="font-sans text-xs text-on-surface-variant">
              Total 16.4 hrs logged this week across 7 active study sessions.
            </p>
            <div className="grid grid-cols-7 gap-1.5 pt-1">
              {[
                { day: 'M', hours: '1.8h', bg: 'bg-primary/20 text-primary' },
                { day: 'T', hours: '2.4h', bg: 'bg-primary/40 text-primary' },
                { day: 'W', hours: '3.1h', bg: 'bg-primary text-white font-bold' },
                { day: 'T', hours: '2.0h', bg: 'bg-primary/30 text-primary' },
                { day: 'F', hours: '2.8h', bg: 'bg-primary/60 text-white' },
                { day: 'S', hours: '3.5h', bg: 'bg-primary text-white font-bold' },
                { day: 'S', hours: '0.8h', bg: 'bg-primary/10 text-primary' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-full h-8 rounded flex items-center justify-center font-mono text-[10px] transition-transform hover:scale-105 cursor-pointer ${item.bg}`}
                    title={`${item.day}: ${item.hours}`}
                  >
                    {item.hours}
                  </div>
                  <span className="font-sans text-xs text-outline font-medium">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
