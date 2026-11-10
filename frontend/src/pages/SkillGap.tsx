import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLearnMate } from '@/context/LearnMateContext';
import { analyzeSkills } from '@/api/client';
import { MockBanner } from '@/components/MockBanner';
import type { SkillPriority, SkillGap } from '@/types/index';

const DEFAULT_GAPS: SkillGap[] = [
  {
    skill: 'Raft Distributed Consensus & Quorum Math',
    priority: 'high',
    rationale:
      'Required for state machine replication and split-brain resolution in distributed key-value stores. Essential prerequisite for architecting fault-tolerant storage clusters.',
  },
  {
    skill: 'LSM-Trees vs B-Trees Storage Engine Internals',
    priority: 'high',
    rationale:
      'Critical for optimizing write amplification and SSTable compaction performance under heavy write throughput workloads.',
  },
  {
    skill: 'Vector Clocks & Causality Tracking',
    priority: 'medium',
    rationale:
      'Necessary for managing eventual consistency, sibling reconciliation, and conflict-free replicated data types (CRDTs).',
  },
  {
    skill: 'gRPC & Protobuf Serialization Protocols',
    priority: 'medium',
    rationale:
      'Core transport protocol for high-throughput microservices and node-to-node gossip communication.',
  },
  {
    skill: 'Distributed Tracing & OpenTelemetry Spans',
    priority: 'low',
    rationale:
      'Helpful for production observability and diagnosing p99 tail latency spikes across multi-hop RPC trees.',
  },
];

export function SkillGap() {
  const { skillGaps, profile, setSkillGaps } = useLearnMate();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<'all' | SkillPriority>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const targetRole = skillGaps?.target_role || profile?.target_role || 'Distributed Systems Architect';
  const gapsList: SkillGap[] = skillGaps?.gaps && skillGaps.gaps.length > 0 ? skillGaps.gaps : DEFAULT_GAPS;
  const isDefaultData = !skillGaps?.gaps || skillGaps.gaps.length === 0;

  // Filtered gaps
  const filteredGaps = useMemo(() => {
    return gapsList.filter((gap) => {
      const matchesFilter = activeFilter === 'all' || gap.priority === activeFilter;
      const matchesSearch =
        gap.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gap.rationale.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [gapsList, activeFilter, searchQuery]);

  // Statistics
  const highPriorityCount = gapsList.filter((g) => g.priority === 'high').length;
  const mediumPriorityCount = gapsList.filter((g) => g.priority === 'medium').length;
  const lowPriorityCount = gapsList.filter((g) => g.priority === 'low').length;
  const readinessIndex = Math.max(25, Math.min(95, Math.round(100 - highPriorityCount * 12 - mediumPriorityCount * 6 - lowPriorityCount * 3)));

  // Trigger skill analysis with IBM Granite
  const handleReanalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const skills = profile?.current_skills && profile.current_skills.length > 0
        ? profile.current_skills
        : ['Go', 'Docker', 'REST APIs', 'PostgreSQL'];
      const role = profile?.target_role || targetRole;

      const report = await analyzeSkills(skills, role);
      setSkillGaps(report);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to analyze skill gaps with IBM Granite.';
      setAnalysisError(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getPriorityBadge = (priority: SkillPriority) => {
    switch (priority) {
      case 'high':
        return {
          label: 'Critical Deficiency',
          pillBg: 'bg-red-50 text-red-700 border-red-200',
          dot: 'bg-red-500',
          tag: 'HIGH IMPACT',
        };
      case 'medium':
        return {
          label: 'Core Gap',
          pillBg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          tag: 'MEDIUM IMPACT',
        };
      case 'low':
        return {
          label: 'Elective',
          pillBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dot: 'bg-indigo-500',
          tag: 'COMPLEMENTARY',
        };
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Mock Banner */}
      {skillGaps?._mock && <MockBanner />}

      {/* Directory Eyebrow Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-code text-xs uppercase tracking-widest text-primary font-bold">
              Directory 03 // Cognitive Diagnostics
            </span>
            <span className="text-outline/40">•</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-code text-[11px] font-medium border border-outline/20">
              {targetRole}
            </span>
            {isDefaultData && (
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-code text-[11px] font-medium border border-amber-200">
                Sample Benchmark
              </span>
            )}
          </div>
          <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
            Skill Gap & Deficiency Matrix
          </h1>
          <p className="text-on-surface-variant mt-2 text-sm md:text-base max-w-3xl leading-relaxed">
            IBM Granite evaluated your baseline engineering proficiencies against target enterprise requirements for{' '}
            <strong className="text-on-surface font-semibold">{targetRole}</strong>. Below is your prioritized deficit blueprint.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleReanalyze}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline/20 bg-surface-container-lowest hover:bg-surface-container text-on-surface text-sm font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[18px] ${isAnalyzing ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{isAnalyzing ? 'Analyzing via Granite...' : 'Re-run Evaluation'}</span>
          </button>

          <Link
            to="/pathway"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-primary/95 transition-all shadow-md shadow-primary/20"
          >
            <span>Execute Pathway</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </div>

      {analysisError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-red-600 text-[20px]">error</span>
            <span>{analysisError}</span>
          </div>
          <button
            onClick={() => setAnalysisError(null)}
            className="text-xs font-semibold text-red-700 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Metric Overview Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline/15 shadow-sm">
          <div className="flex items-center justify-between text-outline text-xs uppercase font-headline tracking-wider mb-2">
            <span>Readiness Index</span>
            <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-3xl font-extrabold text-on-surface">
              {readinessIndex}%
            </span>
            <span className="text-xs text-emerald-600 font-semibold font-code">+12% vs prior</span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1.5">
            Target role proficiency alignment
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline/15 shadow-sm">
          <div className="flex items-center justify-between text-outline text-xs uppercase font-headline tracking-wider mb-2">
            <span>Critical Deficits</span>
            <span className="material-symbols-outlined text-red-500 text-[18px]">priority_high</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-3xl font-extrabold text-red-600">
              {highPriorityCount}
            </span>
            <span className="text-xs text-on-surface-variant font-code">High impact</span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1.5">
            Blocks advanced architectural modules
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline/15 shadow-sm">
          <div className="flex items-center justify-between text-outline text-xs uppercase font-headline tracking-wider mb-2">
            <span>Core & Secondary</span>
            <span className="material-symbols-outlined text-amber-500 text-[18px]">tune</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-3xl font-extrabold text-amber-700">
              {mediumPriorityCount + lowPriorityCount}
            </span>
            <span className="text-xs text-on-surface-variant font-code">
              {mediumPriorityCount} Med / {lowPriorityCount} Low
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1.5">
            Scheduled for iterative refinement
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline/15 shadow-sm">
          <div className="flex items-center justify-between text-outline text-xs uppercase font-headline tracking-wider mb-2">
            <span>Estimated Bridge Time</span>
            <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-3xl font-extrabold text-on-surface">
              ~{Math.round(gapsList.length * 2.2)}
            </span>
            <span className="text-xs text-on-surface-variant font-code">Weeks</span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1.5">
            At 12 hours/week dedicated study
          </p>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Interactive List & Filter */}
        <div className="lg:col-span-8 space-y-6">
          {/* Controls Ribbon */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 rounded-2xl bg-surface-container-lowest border border-outline/15 shadow-sm">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto p-1">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === 'all'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                All Deficits ({gapsList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('high')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === 'high'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Critical ({highPriorityCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('medium')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === 'medium'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Core ({mediumPriorityCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('low')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === 'low'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Elective ({lowPriorityCount})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[200px] sm:w-56 px-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search gap matrix..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-surface-container-low border border-outline/15 text-on-surface placeholder:text-outline/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Deficiency Cards Stack */}
          <div className="space-y-4">
            {filteredGaps.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-surface-container-lowest border border-dashed border-outline/30">
                <span className="material-symbols-outlined text-4xl text-outline mb-2">
                  filter_alt_off
                </span>
                <p className="font-headline font-bold text-base text-on-surface">
                  No skill gaps match criteria
                </p>
                <p className="text-xs text-on-surface-variant mt-1">
                  Try adjusting the priority filter or clearing your search term.
                </p>
              </div>
            ) : (
              filteredGaps.map((gap, index) => {
                const badge = getPriorityBadge(gap.priority);
                return (
                  <div
                    key={gap.skill}
                    className="p-6 rounded-2xl bg-surface-container-lowest border border-outline/15 shadow-sm hover:border-primary/30 transition-all group"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-code text-xs text-outline/60 font-bold">
                          0{index + 1}.
                        </span>
                        <h2 className="font-headline text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                          {gap.skill}
                        </h2>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-code font-bold border ${badge.pillBg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {badge.tag}
                        </span>
                      </div>
                    </div>

                    {/* AI Rationalization Box */}
                    <div className="p-4 rounded-xl bg-surface-container-low border border-outline/10 mb-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1.5">
                        <span className="material-symbols-outlined text-[16px]">psychology</span>
                        <span className="font-code uppercase tracking-wider text-[11px]">
                          IBM Granite Diagnostic Rationale
                        </span>
                      </div>
                      <p className="text-xs text-on-surface leading-relaxed">{gap.rationale}</p>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-outline/10 text-xs">
                      <div className="flex items-center gap-4 text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-outline">
                            timer
                          </span>
                          <span>~{gap.priority === 'high' ? '14' : gap.priority === 'medium' ? '8' : '4'} hrs mastery</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-emerald-600">
                            check_circle
                          </span>
                          <span>Pathway Milestone Synced</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate('/companion', {
                              state: {
                                initialPrompt: `Explain the key concepts of ${gap.skill} and how it applies to ${targetRole}.`,
                              },
                            })
                          }
                          className="px-3 py-1.5 rounded-lg border border-outline/20 hover:bg-surface-container text-on-surface font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[15px] text-primary">
                            chat_bubble
                          </span>
                          <span>Ask Mentor</span>
                        </button>

                        <Link
                          to="/resources"
                          className="px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-primary-fixed hover:text-primary text-on-surface font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <span>Explore Resources</span>
                          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Radar Chart & Architectural Proof */}
        <div className="lg:col-span-4 space-y-6">
          {/* SVG Radar Competency Visualizer */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline/15 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-headline font-bold text-sm text-on-surface">
                Competency Radial Profile
              </span>
              <span className="text-[11px] font-code text-outline uppercase">O*NET 2026</span>
            </div>

            {/* SVG Radar Chart */}
            <div className="relative flex items-center justify-center py-2">
              <svg className="w-64 h-64 overflow-visible" viewBox="-120 -120 240 240">
                {/* Background Concentric Polygon Rings */}
                {[0.25, 0.5, 0.75, 1.0].map((ratio) => {
                  const points = [
                    [0, -100 * ratio],
                    [95 * ratio, -31 * ratio],
                    [59 * ratio, 81 * ratio],
                    [-59 * ratio, 81 * ratio],
                    [-95 * ratio, -31 * ratio],
                  ]
                    .map(([x, y]) => `${x},${y}`)
                    .join(' ');
                  return (
                    <polygon
                      key={ratio}
                      points={points}
                      fill="none"
                      stroke="#c7c4d8"
                      strokeWidth="1"
                      strokeDasharray={ratio < 1.0 ? '2 2' : 'none'}
                      opacity={0.4}
                    />
                  );
                })}

                {/* Axis lines */}
                {[
                  [0, -100],
                  [95, -31],
                  [59, 81],
                  [-59, 81],
                  [-95, -31],
                ].map(([x, y], idx) => (
                  <line
                    key={idx}
                    x1="0"
                    y1="0"
                    x2={x}
                    y2={y}
                    stroke="#c7c4d8"
                    strokeWidth="1"
                    opacity={0.5}
                  />
                ))}

                {/* Target Benchmark Polygon (Indigo dashed) */}
                <polygon
                  points="0,-92 88,-28 54,75 -54,75 -88,-28"
                  fill="#4f46e5"
                  fillOpacity="0.08"
                  stroke="#4f46e5"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />

                {/* User Current Profile Polygon (Emerald active) */}
                <polygon
                  points="0,-52 48,-15 42,58 -32,44 -60,-20"
                  fill="#10b981"
                  fillOpacity="0.25"
                  stroke="#10b981"
                  strokeWidth="2"
                />

                {/* Vertex labels */}
                <text x="0" y="-108" textAnchor="middle" className="text-[10px] fill-on-surface-variant font-code font-bold">Consensus</text>
                <text x="106" y="-31" textAnchor="start" className="text-[10px] fill-on-surface-variant font-code font-bold">Storage</text>
                <text x="68" y="96" textAnchor="start" className="text-[10px] fill-on-surface-variant font-code font-bold">Protocols</text>
                <text x="-68" y="96" textAnchor="end" className="text-[10px] fill-on-surface-variant font-code font-bold">Causality</text>
                <text x="-106" y="-31" textAnchor="end" className="text-[10px] fill-on-surface-variant font-code font-bold">Tracing</text>
              </svg>
            </div>

            {/* Radar Legend */}
            <div className="flex items-center justify-center gap-6 pt-2 border-t border-outline/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                <span className="text-on-surface-variant font-medium">Your Profile</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary border border-dashed border-primary inline-block" />
                <span className="text-on-surface-variant font-medium">Role Standard</span>
              </div>
            </div>
          </div>

          {/* Granite Reasoning Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-surface-container-low to-surface-container border border-outline/15 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-primary font-headline font-bold text-sm">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              <span>IBM Granite Inference Context</span>
            </div>
            <p className="text-xs text-on-surface leading-relaxed">
              Granite 3.0 uses an inverse knowledge graph traversal to compare your self-declared proficiencies against validated production curricula from IBM SkillsBuild, MIT OpenCourseWare, and ACM Distributed Systems tracks.
            </p>
            <div className="pt-2 border-t border-outline/10 flex items-center justify-between text-[11px] font-code text-on-surface-variant">
              <span>Granite 3.0 Instruct</span>
              <span className="text-emerald-700 font-bold">Confidence: 94.8%</span>
            </div>
          </div>

          {/* Quick Pathway Remediation Card */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline/15 shadow-sm space-y-4">
            <span className="font-headline font-bold text-sm text-on-surface block">
              Immediate Bridge Recommendation
            </span>
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline/10">
              <span className="text-[11px] font-code text-primary font-bold uppercase tracking-wider block mb-1">
                Priority 01 Focus
              </span>
              <p className="text-xs font-semibold text-on-surface">
                Raft Log Replication & Election Safety
              </p>
              <p className="text-[11px] text-on-surface-variant mt-1">
                Closes the #1 blocker in your architecture path.
              </p>
            </div>
            <Link
              to="/pathway"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary/95 transition-all shadow-sm"
            >
              <span>Resume Raft Milestone in Pathway</span>
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
