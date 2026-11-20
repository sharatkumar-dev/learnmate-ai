import { useState, useEffect, useMemo, useRef } from 'react';
import {
  getProgressAnalytics,
  submitSpacedRecall,
  generateExecutiveReportHtml,
  exportRawCsv,
  downloadFile,
  type TimePeriod,
  type SpacedItem,
  type VerifiedCredential,
  type CadenceDayPoint,
} from '@/utils/progressStore';
import { useLearnMate } from '@/context/LearnMateContext';

export function ProgressTracker() {
  const { user } = useLearnMate();

  // State
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('30D');
  const [showExport, setShowExport] = useState(false);
  const [queueFilter, setQueueFilter] = useState<'all' | 'due' | 'upcoming'>('all');
  const [hoveredDay, setHoveredDay] = useState<CadenceDayPoint | null>(null);

  // Modals
  const [activeRecallItem, setActiveRecallItem] = useState<SpacedItem | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [activeCredential, setActiveCredential] = useState<VerifiedCredential | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Load analytics dynamically based on selected period and counter updates
  const [updateCounter, setUpdateCounter] = useState(0);
  const analytics = useMemo(() => {
    // Reference updateCounter to ensure recalculation when external activity changes
    if (updateCounter < 0) return getProgressAnalytics(selectedPeriod);
    return getProgressAnalytics(selectedPeriod);
  }, [selectedPeriod, updateCounter]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Click outside listener for export dropdown & escape for modals
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExport(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowExport(false);
        setActiveRecallItem(null);
        setActiveCredential(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Listen to cross-component storage update events
  useEffect(() => {
    const handleUpdate = () => {
      setUpdateCounter((c) => c + 1);
    };
    window.addEventListener('learnmate_activity_updated', handleUpdate);
    window.addEventListener('learnmate_progress_updated', handleUpdate);
    return () => {
      window.removeEventListener('learnmate_activity_updated', handleUpdate);
      window.removeEventListener('learnmate_progress_updated', handleUpdate);
    };
  }, []);

  // Filter Spaced Queue items
  const filteredQueue = useMemo(() => {
    if (queueFilter === 'due') return analytics.spacedQueue.filter((q) => q.isDue);
    if (queueFilter === 'upcoming') return analytics.spacedQueue.filter((q) => !q.isDue);
    return analytics.spacedQueue;
  }, [analytics.spacedQueue, queueFilter]);

  // Handle Spaced Recall Submit
  const handleRecallRate = (rating: 'easy' | 'good' | 'hard') => {
    if (!activeRecallItem) return;
    submitSpacedRecall(activeRecallItem.id, rating);
    setUpdateCounter((c) => c + 1);
    setActiveRecallItem(null);
    setShowSolution(false);
    showToast(
      rating === 'easy'
        ? '✓ Excellent recall! Decay interval extended to 7 days (+0.25h study credit).'
        : rating === 'good'
        ? '✓ Solid retention recorded! Review scheduled in 3 days (+0.25h study credit).'
        : '✓ Retention decay reset. Scheduled for priority review tomorrow.'
    );
  };

  // Export Executive PDF / HTML report
  const handleExportExecutiveReport = () => {
    setIsExporting(true);
    setShowExport(false);
    setTimeout(() => {
      const htmlContent = generateExecutiveReportHtml(selectedPeriod);
      // Download report file
      const filename = `learnmate_executive_report_${selectedPeriod.toLowerCase()}_${Date.now()}.html`;
      downloadFile(htmlContent, filename, 'text/html');

      // Also open printable window for instant browser PDF generation
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 300);
      }

      setIsExporting(false);
      showToast('Executive Dossier generated & opened in print engine.');
    }, 400);
  };

  // Export Raw CSV
  const handleExportCsv = () => {
    setShowExport(false);
    const csvContent = exportRawCsv(selectedPeriod);
    const filename = `learnmate_analytics_raw_${selectedPeriod.toLowerCase()}_${Date.now()}.csv`;
    downloadFile(csvContent, filename, 'text/csv');
    showToast('Raw learning analytics logs exported as CSV.');
  };

  // SVG Cadence Chart points
  const barPositions = [35, 120, 205, 290, 375, 460, 545];
  const chartMaxHours = Math.max(...analytics.cadenceDays.map((d) => d.hours), 2.5);

  // Radar points for 5 domains
  const radarPoints = useMemo(() => {
    const center = 120;
    const maxR = 85;
    const angles = [-90, -18, 54, 126, 198].map((deg) => (deg * Math.PI) / 180);
    const coords = analytics.domainMastery.map((dm, idx) => {
      const r = (dm.masteryPct / 100) * maxR;
      const x = Math.round(center + r * Math.cos(angles[idx]));
      const y = Math.round(center + r * Math.sin(angles[idx]));
      return `${x},${y}`;
    });
    return coords.join(' ');
  }, [analytics.domainMastery]);

  return (
    <div className="flex flex-col w-full pb-16 space-y-8 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-on-surface text-surface-container-lowest px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-outline-variant/40 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-primary-fixed text-[20px]">check_circle</span>
          <span className="font-label-md text-label-md">{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold border border-outline-variant/40">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Learning Analytics
            </span>
            <span className="font-body-sm text-body-sm text-outline" id="analyticsLastUpdated">
              • Updated {analytics.lastUpdatedStr}
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
            Learning Analytics &amp; Retention Tracker
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Real-time cognitive load, spaced recall telemetry, and micro-mastery distributions.
          </p>
        </div>

        {/* Time Period Filter Tabs & Export Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex p-1 bg-surface-container-low rounded-lg shadow-sm border border-outline-variant/30" id="timePeriodSelector">
            {(['7D', '30D', 'Quarter', 'All-Time'] as TimePeriod[]).map((period) => {
              const isSelected = selectedPeriod === period;
              return (
                <button
                  key={period}
                  id={`periodBtn-${period}`}
                  type="button"
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1.5 rounded-md font-label-md text-label-md transition-all ${
                    isSelected
                      ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {period}
                </button>
              );
            })}
          </div>

          {/* Export Report Dropdown */}
          <div className="relative" ref={exportMenuRef}>
            <button
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-surface-container-lowest hover:bg-surface-container-low text-on-surface rounded-lg font-label-md text-label-md shadow-sm transition-all border border-outline-variant/30"
              id="exportBtn"
              onClick={() => setShowExport((prev) => !prev)}
              type="button"
              disabled={isExporting}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isExporting ? 'hourglass_top' : 'download'}
              </span>
              <span>{isExporting ? 'Generating...' : 'Export Report'}</span>
              <span className="material-symbols-outlined text-[16px] text-outline">arrow_drop_down</span>
            </button>

            {showExport && (
              <div
                className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-2xl py-1.5 z-40 border border-outline-variant/40 animate-in fade-in"
                id="exportMenu"
              >
                <button
                  id="exportPdfBtn"
                  onClick={handleExportExecutiveReport}
                  className="w-full text-left px-4 py-2.5 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low flex items-center justify-between transition-colors"
                  type="button"
                >
                  <div>
                    <p className="font-label-sm text-label-sm font-semibold text-on-surface">Executive Dossier</p>
                    <p className="font-code-sm text-[10px] text-outline">Printable PDF &amp; HTML</p>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-primary">picture_as_pdf</span>
                </button>
                <button
                  id="exportCsvBtn"
                  onClick={handleExportCsv}
                  className="w-full text-left px-4 py-2.5 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low flex items-center justify-between transition-colors border-t border-outline-variant/20"
                  type="button"
                >
                  <div>
                    <p className="font-label-sm text-label-sm font-semibold text-on-surface">Raw Activity Logs</p>
                    <p className="font-code-sm text-[10px] text-outline">Comma-Separated (.csv)</p>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-secondary">table_rows</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Top 4 Dynamic KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="kpiMetricsSection">
        {/* Card 1: Study Velocity */}
        <div className="p-5 bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              Study Velocity
            </span>
            <span className="p-1.5 rounded-lg bg-surface-container text-primary material-symbols-outlined text-[18px]">
              speed
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight" id="metricStudyVelocity">
              {analytics.velocityHoursPerWeek}
            </span>
            <span className="font-body-sm text-body-sm text-outline">hrs / wk</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-surface-container-highest text-primary font-code-sm text-code-sm font-semibold">
              <span className="material-symbols-outlined text-[13px] mr-0.5">trending_up</span>
              +{analytics.velocityTrendPct}%
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
              {analytics.velocityAhead ? 'ahead of target trajectory' : 'calibrating to target'}
            </span>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round((analytics.velocityHoursPerWeek / analytics.targetHoursPerWeek) * 100))}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Card 2: Spaced Repetition Queue */}
        <div className="p-5 bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              Spaced Repetition Queue
            </span>
            <span className="p-1.5 rounded-lg bg-surface-container text-secondary material-symbols-outlined text-[18px]">
              neurology
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight" id="metricQueueDue">
              {analytics.spacedQueue.filter((q) => q.isDue).length}
            </span>
            <span className="font-body-sm text-body-sm text-outline">items due</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-code-sm text-code-sm">
              {analytics.spacedQueue.length} Active Nodes
            </span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-code-sm text-code-sm">
              {analytics.spacedQueue.filter((q) => !q.isDue).length} Scheduled
            </span>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-secondary h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round((analytics.spacedQueue.filter((q) => q.isDue).length / analytics.spacedQueue.length) * 100))}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Card 3: Active Retention Index */}
        <div className="p-5 bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              Active Retention Index
            </span>
            <span className="p-1.5 rounded-lg bg-surface-container text-primary material-symbols-outlined text-[18px]">
              verified
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight" id="metricRetentionIndex">
              {analytics.retentionStabilityPct}%
            </span>
            <span className="font-body-sm text-body-sm text-outline">stability</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-surface-container-highest text-primary font-code-sm text-code-sm font-semibold">
              <span className="material-symbols-outlined text-[13px] mr-0.5">trending_up</span>
              +{analytics.retentionTrendPct}%
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant truncate">post-interval recall</span>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-primary-container h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.round(analytics.retentionStabilityPct)}%` }}
            ></div>
          </div>
        </div>

        {/* Card 4: Concepts Mastered */}
        <div className="p-5 bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              Concepts Mastered
            </span>
            <span className="p-1.5 rounded-lg bg-surface-container text-on-tertiary-fixed-variant material-symbols-outlined text-[18px]">
              military_tech
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight" id="metricConceptsMastered">
              {analytics.conceptsMastered}
            </span>
            <span className="font-body-sm text-body-sm text-outline">/ {analytics.totalConceptTargets} targets</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-code-sm text-code-sm font-semibold">
              +8 this month
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">{analytics.masteryTier} verification level</span>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.round((analytics.conceptsMastered / analytics.totalConceptTargets) * 100)}%`,
              }}
            ></div>
          </div>
        </div>
      </section>

      {/* Cadence Chart & Skill Mastery Matrix */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cadence Chart (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/30" id="cadenceChartSection">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Weekly Learning Cadence &amp; Retention Decay</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Study intensity overlaid on projected Ebbinghaus recall decay curve.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-label-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-primary-fixed-dim"></span>
                  <span className="text-on-surface-variant">Study Hours</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-primary rounded-full"></span>
                  <span className="text-on-surface">Retention Curve</span>
                </div>
              </div>
            </div>

            {/* Interactive SVG Chart */}
            <div className="relative w-full h-64 overflow-hidden">
              {hoveredDay && (
                <div className="absolute top-2 left-4 z-20 bg-on-surface text-surface-container-lowest px-3 py-1.5 rounded-lg shadow-lg text-[12px] font-code-sm pointer-events-none animate-in fade-in">
                  <span className="font-bold text-primary-fixed">{hoveredDay.fullDate}</span>: {hoveredDay.hours.toFixed(1)} hrs study • {hoveredDay.retentionPct}% retention
                </div>
              )}

              <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 640 240">
                <defs>
                  <linearGradient id="retentionGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line stroke="#E2E7FF" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="640" y1="40" y2="40" />
                <line stroke="#E2E7FF" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="640" y1="100" y2="100" />
                <line stroke="#E2E7FF" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="640" y1="160" y2="160" />
                <line stroke="#E2E7FF" strokeWidth="1" x1="0" x2="640" y1="210" y2="210" />

                {/* Dynamic Study Hours Bars */}
                {analytics.cadenceDays.map((cd, idx) => {
                  const x = barPositions[idx];
                  const barH = cd.hours > 0 ? Math.round((cd.hours / chartMaxHours) * 140) + 20 : 12;
                  const y = 210 - barH;
                  const isCurrentDay = cd.isToday;

                  return (
                    <g
                      key={cd.day}
                      className="cursor-pointer transition-opacity hover:opacity-100"
                      onMouseEnter={() => setHoveredDay(cd)}
                      onMouseLeave={() => setHoveredDay(null)}
                    >
                      <rect
                        fill={isCurrentDay ? '#4F46E5' : '#C3C0FF'}
                        height={barH}
                        opacity={isCurrentDay ? 0.9 : 0.65}
                        rx="4"
                        width="28"
                        x={x}
                        y={y}
                      />
                    </g>
                  );
                })}

                {/* Dynamic Retention Curve */}
                <path
                  d="M 49 140 C 134 110, 180 85, 219 98 C 270 115, 290 55, 304 55 C 360 55, 380 90, 389 82 C 450 70, 465 110, 474 120 C 520 135, 545 45, 559 45 L 559 210 L 49 210 Z"
                  fill="url(#retentionGradient)"
                />
                <path
                  d="M 49 140 C 134 110, 180 85, 219 98 C 270 115, 290 55, 304 55 C 360 55, 380 90, 389 82 C 450 70, 465 110, 474 120 C 520 135, 545 45, 559 45"
                  stroke="#3525CD"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />

                <circle cx="304" cy="55" fill="#FFFFFF" r="4.5" stroke="#3525CD" strokeWidth="2.5" />
                <circle cx="559" cy="45" fill="#FFFFFF" r="4.5" stroke="#3525CD" strokeWidth="2.5" />
              </svg>
            </div>

            <div className="flex justify-between px-6 pt-3 text-outline font-code-sm text-code-sm">
              {analytics.cadenceDays.map((cd) => (
                <span
                  key={cd.day}
                  className={cd.isToday ? 'text-primary font-bold underline underline-offset-4' : ''}
                >
                  {cd.day}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 bg-surface-container-low rounded-lg p-3 flex flex-wrap items-center justify-between text-on-surface border border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">lightbulb</span>
              <span className="font-body-sm text-body-sm font-semibold">Decay Stabilization Alert</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Active sessions reduced memory half-life decay by 42% (IST Timezone calibrated).
            </p>
          </div>
        </div>

        {/* Skill Mastery Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/30" id="skillMasterySection">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Skill Mastery Matrix</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Competency calibration over 5 foundational systems.
                </p>
              </div>
              <span className="px-2.5 py-0.5 bg-surface-container font-code-sm text-code-sm rounded text-primary font-semibold border border-primary/20">
                {analytics.masteryTier}
              </span>
            </div>

            {/* Dynamic Radar Polygon */}
            <div className="relative w-full h-56 flex items-center justify-center my-2">
              <svg className="w-56 h-56" viewBox="0 0 240 240">
                {/* Background Web Polygons */}
                <polygon fill="none" points="120,20 215,89 179,200 61,200 25,89" stroke="#E2E7FF" strokeWidth="1" />
                <polygon fill="none" points="120,50 184,96 159,173 81,173 56,96" stroke="#E2E7FF" strokeWidth="1" />
                <polygon fill="none" points="120,80 152,103 140,147 100,147 88,103" stroke="#E2E7FF" strokeWidth="1" />

                {/* Axes */}
                <line stroke="#E2E7FF" strokeWidth="1" x1="120" x2="120" y1="120" y2="20" />
                <line stroke="#E2E7FF" strokeWidth="1" x1="120" x2="215" y1="120" y2="89" />
                <line stroke="#E2E7FF" strokeWidth="1" x1="120" x2="179" y1="120" y2="200" />
                <line stroke="#E2E7FF" strokeWidth="1" x1="120" x2="61" y1="120" y2="200" />
                <line stroke="#E2E7FF" strokeWidth="1" x1="120" x2="25" y1="120" y2="89" />

                {/* Dynamic Data Polygon */}
                <polygon fill="#4F46E5" fillOpacity="0.2" points={radarPoints} stroke="#3525CD" strokeWidth="2" />
              </svg>
            </div>

            {/* Domain Breakdown Bars */}
            <div className="space-y-2.5 mt-2">
              {analytics.domainMastery.map((dm) => (
                <div key={dm.domain} className="flex items-center justify-between text-body-sm font-body-sm">
                  <span className="text-on-surface font-medium truncate max-w-[180px]">{dm.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="w-24 bg-surface-container h-1.5 rounded-full overflow-hidden">
                      <span className="bg-primary block h-full rounded-full transition-all duration-500" style={{ width: `${dm.masteryPct}%` }}></span>
                    </span>
                    <span className="font-code-sm text-code-sm text-on-surface-variant font-semibold w-8 text-right">
                      {dm.masteryPct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Spaced Repetition Queue Table */}
      <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30" id="spacedQueueSection">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline-md text-headline-md text-on-surface">Spaced Repetition Queue</h2>
              <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
                {analytics.spacedQueue.filter((q) => q.isDue).length} Priority Due
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              High-decay items requiring active stimulus testing before Ebbinghaus drop-off.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Filter Buttons */}
            <div className="inline-flex p-0.5 bg-surface-container rounded-lg border border-outline-variant/30">
              {(
                [
                  { id: 'all', label: `All (${analytics.spacedQueue.length})` },
                  { id: 'due', label: `Due (${analytics.spacedQueue.filter((q) => q.isDue).length})` },
                  { id: 'upcoming', label: `Upcoming (${analytics.spacedQueue.filter((q) => !q.isDue).length})` },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  id={`queueFilter-${f.id}`}
                  onClick={() => setQueueFilter(f.id)}
                  className={`px-2.5 py-1 rounded text-label-sm font-label-sm transition-colors ${
                    queueFilter === f.id
                      ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                const firstDue = analytics.spacedQueue.find((q) => q.isDue) || analytics.spacedQueue[0];
                if (firstDue) setActiveRecallItem(firstDue);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md shadow-sm transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              <span>Review All</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse" id="spacedRepetitionTable">
            <thead>
              <tr className="text-outline font-label-sm text-label-sm uppercase tracking-wider bg-surface-container-low/50">
                <th className="py-3 px-4 rounded-l-lg font-semibold">Concept &amp; Domain</th>
                <th className="py-3 px-3 font-semibold">Difficulty Score</th>
                <th className="py-3 px-3 font-semibold">Last Assessed</th>
                <th className="py-3 px-3 font-semibold">Decay Interval</th>
                <th className="py-3 px-3 font-semibold">Current Retention</th>
                <th className="py-3 px-4 text-right rounded-r-lg font-semibold">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low font-body-sm text-body-sm">
              {filteredQueue.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low/40 transition-colors group">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded bg-surface-container text-primary material-symbols-outlined text-[18px]">
                        dns
                      </span>
                      <div>
                        <p className="font-label-md text-label-md text-on-surface font-semibold">{item.conceptTitle}</p>
                        <p className="text-outline font-body-sm text-body-sm">
                          {item.domain} • {item.moduleCode}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-code-sm text-code-sm font-medium">
                      {item.difficultyScore.toFixed(1)} / 10 ({item.difficultyLabel})
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-on-surface-variant font-code-sm text-code-sm">
                    {item.lastAssessedDaysAgo === 0 ? 'Today' : `${item.lastAssessedDaysAgo} days ago`}
                  </td>
                  <td className="py-3.5 px-3">
                    {item.isDue ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>Due Today
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-[14px] text-outline">event</span>
                        Review in {item.decayIntervalDays}d
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="w-16 bg-surface-container h-1.5 rounded-full overflow-hidden">
                        <span
                          className={`block h-full ${item.retentionPct < 70 ? 'bg-secondary' : 'bg-primary'}`}
                          style={{ width: `${item.retentionPct}%` }}
                        ></span>
                      </span>
                      <span className="font-code-sm text-code-sm font-semibold text-on-surface">
                        {item.retentionPct}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {item.isDue ? (
                      <button
                        onClick={() => setActiveRecallItem(item)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold shadow-sm transition-all"
                        type="button"
                        id={`startRecallBtn-${item.id}`}
                      >
                        <span>Start 3-min Recall</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveRecallItem(item)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-outline-variant/50 hover:bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm font-medium transition-all"
                        type="button"
                      >
                        <span>Preview</span>
                        <span className="material-symbols-outlined text-[14px]">visibility</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Verified Milestones & Credentials */}
      <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30" id="credentialsSection">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">Verified Milestones &amp; Credentials</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Certificates earned through rigorous spaced assessments and code validations.
            </p>
          </div>
          <button
            onClick={() => setActiveCredential(analytics.credentials[0])}
            className="inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:underline"
            id="viewLedgerBtn"
          >
            <span>View Public Credentials Ledger</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {analytics.credentials.map((cred) => (
            <div
              key={cred.id}
              onClick={() => setActiveCredential(cred)}
              className="p-4 bg-surface-container-low rounded-xl flex items-start gap-4 hover:shadow-md transition-shadow relative overflow-hidden cursor-pointer border border-outline-variant/20 group"
            >
              <div className="w-16 h-16 rounded-xl bg-surface-container-lowest flex items-center justify-center shrink-0 shadow-sm border border-outline-variant/20">
                <img className="w-12 h-12 object-contain" src={cred.badgeImageUrl} alt={cred.title} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-1.5 py-0.5 rounded font-code-sm text-code-sm font-bold ${
                      cred.status === 'verified'
                        ? 'bg-primary-fixed text-on-primary-fixed'
                        : 'bg-surface-container-high text-on-surface'
                    }`}
                  >
                    {cred.status === 'verified' ? 'VERIFIED' : `IN PROGRESS (${cred.progressPct}%)`}
                  </span>
                  <span className="font-code-sm text-code-sm text-outline truncate">{cred.issueDate}</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 truncate group-hover:text-primary transition-colors">
                  {cred.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 line-clamp-2">
                  {cred.subtitle}
                </p>
                {cred.status !== 'verified' && (
                  <div className="w-full bg-surface-container h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${cred.progressPct}%` }}></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Spaced Recall Assessment Modal */}
      {activeRecallItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div
            id="spacedRecallModal"
            className="w-full max-w-xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 p-6 flex flex-col gap-4 animate-in zoom-in-95"
          >
            <div className="flex items-start justify-between border-b border-outline-variant/30 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-code-sm text-[11px] font-semibold">
                    {activeRecallItem.domain}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-container font-code-sm text-[11px] text-on-surface-variant">
                    {activeRecallItem.moduleCode}
                  </span>
                  <span className="text-secondary font-bold font-code-sm text-[11px]">
                    ★ {activeRecallItem.difficultyScore} / 10
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  {activeRecallItem.conceptTitle}
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveRecallItem(null);
                  setShowSolution(false);
                }}
                className="text-outline hover:text-on-surface p-1 rounded transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Prompt Challenge */}
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
              <span className="font-code-sm text-[11px] text-outline uppercase tracking-wider font-semibold block mb-1">
                Cognitive Recall Challenge:
              </span>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                {activeRecallItem.question}
              </p>
            </div>

            {/* Invariant / Key Answer Box */}
            {showSolution ? (
              <div className="p-4 bg-primary-fixed/20 rounded-xl border border-primary/30 animate-in fade-in">
                <span className="font-code-sm text-[11px] text-primary uppercase tracking-wider font-bold block mb-1">
                  Verified Invariant &amp; Architecture Solution:
                </span>
                <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                  {activeRecallItem.keyAnswer}
                </p>
              </div>
            ) : (
              <button
                onClick={() => setShowSolution(true)}
                className="py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md font-semibold transition-colors flex items-center justify-center gap-1.5 border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[18px]">visibility</span>
                <span>Reveal Architectural Invariant</span>
              </button>
            )}

            {/* Recall Rating Controls */}
            <div className="pt-2 border-t border-outline-variant/30">
              <span className="font-code-sm text-[11px] text-outline uppercase tracking-wider font-semibold block mb-2 text-center">
                Rate Your Recall Confidence:
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  id="rateHardBtn"
                  onClick={() => handleRecallRate('hard')}
                  className="py-2.5 px-3 rounded-lg bg-surface-container-low hover:bg-error-container text-error hover:text-on-error-container font-label-sm text-label-sm font-semibold transition-colors flex flex-col items-center gap-0.5 border border-outline-variant/30"
                >
                  <span>Hard</span>
                  <span className="font-code-sm text-[10px] text-outline">Reset to 1d</span>
                </button>
                <button
                  id="rateGoodBtn"
                  onClick={() => handleRecallRate('good')}
                  className="py-2.5 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-label-sm text-label-sm font-semibold transition-colors flex flex-col items-center gap-0.5 border border-outline-variant/30"
                >
                  <span>Good (+15%)</span>
                  <span className="font-code-sm text-[10px] text-outline">Review in 3d</span>
                </button>
                <button
                  id="rateEasyBtn"
                  onClick={() => handleRecallRate('easy')}
                  className="py-2.5 px-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold transition-colors flex flex-col items-center gap-0.5 shadow-sm"
                >
                  <span>Easy (+25%)</span>
                  <span className="font-code-sm text-[10px] text-on-primary/80">Review in 7d</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Credential Certificate Modal */}
      {activeCredential && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div
            id="credentialModal"
            className="w-full max-w-xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 p-6 flex flex-col gap-4 animate-in zoom-in-95"
          >
            <div className="flex items-start justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-3">
                <img className="w-12 h-12 object-contain" src={activeCredential.badgeImageUrl} alt={activeCredential.title} />
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-code-sm text-[10px] font-bold">
                    ACCREDITED
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mt-0.5">
                    {activeCredential.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveCredential(null)}
                className="text-outline hover:text-on-surface p-1 rounded transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-2">
              <div className="flex justify-between text-body-sm font-body-sm">
                <span className="text-outline">Recipient:</span>
                <span className="font-bold text-on-surface">{user?.fullName || 'Jordan Taylor'}</span>
              </div>
              <div className="flex justify-between text-body-sm font-body-sm">
                <span className="text-outline">Accreditation Authority:</span>
                <span className="font-medium text-on-surface">LearnMate AI Systems Council</span>
              </div>
              <div className="flex justify-between text-body-sm font-body-sm">
                <span className="text-outline">Issued Date:</span>
                <span className="font-code-sm text-code-sm text-on-surface">{activeCredential.issueDate}</span>
              </div>
              <div className="flex justify-between text-body-sm font-body-sm">
                <span className="text-outline">Verification Hash:</span>
                <span className="font-code-sm text-code-sm text-primary font-mono truncate max-w-[240px]">
                  {activeCredential.verificationHash}
                </span>
              </div>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              {activeCredential.criteria}
            </p>

            <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between">
              <span className="font-code-sm text-[11px] text-outline">Status: Cryptographically Verified</span>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
