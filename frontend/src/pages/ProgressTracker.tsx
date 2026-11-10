import { useState } from 'react';

export function ProgressTracker() {
  const [showExport, setShowExport] = useState(false);
  return (
    <div className="flex flex-col w-full pb-16 space-y-8">

<section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
<div>
<div className="flex items-center gap-2 mb-1"><span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold border border-outline-variant/40"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span>Learning Analytics</span><span className="font-body-sm text-body-sm text-outline">• Updated Just Now</span></div>
<h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Learning Analytics &amp; Retention Tracker</h1>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">Real-time cognitive load, spaced recall telemetry, and micro-mastery distributions.</p>
</div>

<div className="flex flex-wrap items-center gap-3">
<div className="inline-flex p-1 bg-surface-container-low rounded-lg shadow-sm">
<button className="px-3 py-1.5 rounded-md font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"  type="button">7D</button>
<button className="px-3 py-1.5 rounded-md bg-surface-container-lowest text-primary shadow-sm font-label-md text-label-md font-semibold transition-all"  type="button">30D</button>
<button className="px-3 py-1.5 rounded-md font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"  type="button">Quarter</button>
<button className="px-3 py-1.5 rounded-md font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"  type="button">All-Time</button>
</div>
<div className="relative">
<button className="inline-flex items-center gap-2 px-3.5 py-2 bg-surface-container-lowest hover:bg-surface-container-low text-on-surface rounded-lg font-label-md text-label-md shadow-sm transition-all" id="exportBtn" onClick={() => setShowExport(prev => !prev)} type="button">
<span className="material-symbols-outlined text-[18px]">download</span>
<span>Export Report</span>
<span className="material-symbols-outlined text-[16px] text-outline">arrow_drop_down</span>
</button>
<div className={`absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-xl py-1.5 z-30 ${showExport ? '' : 'hidden'}`} id="exportMenu">
<button className="w-full text-left px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low flex items-center justify-between" type="button">
<span>Executive PDF (.pdf)</span>
<span className="material-symbols-outlined text-[16px] text-outline">picture_as_pdf</span>
</button>
<button className="w-full text-left px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low flex items-center justify-between" type="button">
<span>Raw Logs (.csv)</span>
<span className="material-symbols-outlined text-[16px] text-outline">table_rows</span>
</button>
</div>
</div>
</div>
</section>

<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

<div className="p-5 bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Study Velocity</span>
<span className="p-1.5 rounded-lg bg-surface-container text-primary material-symbols-outlined text-[18px]">speed</span>
</div>
<div className="mt-4 flex items-baseline gap-2">
<span className="font-headline-xl text-headline-xl text-on-surface tracking-tight">4.8</span>
<span className="font-body-sm text-body-sm text-outline">hrs / wk</span>
</div>
<div className="mt-3 flex items-center gap-1.5">
<span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-surface-container-highest text-primary font-code-sm text-code-sm font-semibold">
<span className="material-symbols-outlined text-[13px] mr-0.5">trending_up</span>+18%
        </span>
<span className="font-body-sm text-body-sm text-on-surface-variant">ahead of target trajectory</span>
</div>
<div className="w-full bg-surface-container h-1 rounded-full mt-4 overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{ width: '78%' }}></div>
</div>
</div>

<div className="p-5 bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Spaced Repetition Queue</span>
<span className="p-1.5 rounded-lg bg-surface-container text-secondary material-symbols-outlined text-[18px]">neurology</span>
</div>
<div className="mt-4 flex items-baseline gap-2">
<span className="font-headline-xl text-headline-xl text-on-surface tracking-tight">14</span>
<span className="font-body-sm text-body-sm text-outline">items due</span>
</div>
<div className="mt-3 flex items-center gap-2">
<span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-code-sm text-code-sm">12 Flashcards</span>
<span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-code-sm text-code-sm">2 Prompts</span>
</div>
<div className="w-full bg-surface-container h-1 rounded-full mt-4 overflow-hidden">
<div className="bg-secondary h-full rounded-full" style={{ width: '45%' }}></div>
</div>
</div>

<div className="p-5 bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Active Retention Index</span>
<span className="p-1.5 rounded-lg bg-surface-container text-primary material-symbols-outlined text-[18px]">verified</span>
</div>
<div className="mt-4 flex items-baseline gap-2">
<span className="font-headline-xl text-headline-xl text-on-surface tracking-tight">91.4%</span>
<span className="font-body-sm text-body-sm text-outline">stability</span>
</div>
<div className="mt-3 flex items-center gap-1.5">
<span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-surface-container-highest text-primary font-code-sm text-code-sm font-semibold">
<span className="material-symbols-outlined text-[13px] mr-0.5">trending_up</span>+3.2%
        </span>
<span className="font-body-sm text-body-sm text-on-surface-variant">post-interval recall</span>
</div>
<div className="w-full bg-surface-container h-1 rounded-full mt-4 overflow-hidden">
<div className="bg-primary-container h-full rounded-full" style={{ width: '91%' }}></div>
</div>
</div>

<div className="p-5 bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Concepts Mastered</span>
<span className="p-1.5 rounded-lg bg-surface-container text-on-tertiary-fixed-variant material-symbols-outlined text-[18px]">military_tech</span>
</div>
<div className="mt-4 flex items-baseline gap-2">
<span className="font-headline-xl text-headline-xl text-on-surface tracking-tight">54</span>
<span className="font-body-sm text-body-sm text-outline">/ 70 targets</span>
</div>
<div className="mt-3 flex items-center gap-1.5">
<span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-code-sm text-code-sm font-semibold">
          +8 this month
        </span>
<span className="font-body-sm text-body-sm text-on-surface-variant">L3 verification level</span>
</div>
<div className="w-full bg-surface-container h-1 rounded-full mt-4 overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{ width: '77%' }}></div>
</div>
</div>
</section>

<section className="grid grid-cols-1 lg:grid-cols-12 gap-6">

<div className="lg:col-span-7 bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
<div>
<h2 className="font-headline-md text-headline-md text-on-surface">Weekly Learning Cadence &amp; Retention Decay</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Study intensity overlaid on projected Ebbinghaus recall decay curve.</p>
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

<div className="relative w-full h-64 overflow-hidden">
<svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 640 240">
<defs>
<linearGradient id="retentionGradient" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#4F46E5" stopOpacity="0.28"></stop>
<stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0"></stop>
</linearGradient>
</defs>

<line stroke="#E2E7FF" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="640" y1="40" y2="40"></line>
<line stroke="#E2E7FF" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="640" y1="100" y2="100"></line>
<line stroke="#E2E7FF" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="640" y1="160" y2="160"></line>
<line stroke="#E2E7FF" strokeWidth="1" x1="0" x2="640" y1="210" y2="210"></line>


<rect fill="#C3C0FF" height="100" opacity="0.65" rx="4" width="28" x="35" y="110"></rect>

<rect fill="#4F46E5" height="130" opacity="0.85" rx="4" width="28" x="120" y="80"></rect>

<rect fill="#C3C0FF" height="70" opacity="0.65" rx="4" width="28" x="205" y="140"></rect>

<rect fill="#4F46E5" height="150" opacity="0.85" rx="4" width="28" x="290" y="60"></rect>

<rect fill="#C3C0FF" height="110" opacity="0.65" rx="4" width="28" x="375" y="100"></rect>

<rect fill="#C3C0FF" height="60" opacity="0.45" rx="4" width="28" x="460" y="150"></rect>

<rect fill="#4F46E5" height="140" opacity="0.9" rx="4" width="28" x="545" y="70"></rect>

<path d="M 49 140 C 134 110, 180 85, 219 98 C 270 115, 290 55, 304 55 C 360 55, 380 90, 389 82 C 450 70, 465 110, 474 120 C 520 135, 545 45, 559 45 L 559 210 L 49 210 Z" fill="url(#retentionGradient)"></path>

<path d="M 49 140 C 134 110, 180 85, 219 98 C 270 115, 290 55, 304 55 C 360 55, 380 90, 389 82 C 450 70, 465 110, 474 120 C 520 135, 545 45, 559 45" stroke="#3525CD" strokeLinecap="round" strokeWidth="2.5"></path>

<circle cx="304" cy="55" fill="#FFFFFF" r="4.5" stroke="#3525CD" strokeWidth="2.5"></circle>
<circle cx="559" cy="45" fill="#FFFFFF" r="4.5" stroke="#3525CD" strokeWidth="2.5"></circle>
</svg>
</div>

<div className="flex justify-between px-6 pt-3 text-outline font-code-sm text-code-sm">
<span>MON</span>
<span>TUE</span>
<span>WED</span>
<span>THU</span>
<span>FRI</span>
<span>SAT</span>
<span>SUN</span>
</div>
</div>
<div className="mt-6 pt-4 bg-surface-container-low rounded-lg p-3 flex flex-wrap items-center justify-between text-on-surface">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[18px]">lightbulb</span>
<span className="font-body-sm text-body-sm font-medium">Decay Stabilization Alert</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Spaced repetitions on Thursday reduced memory half-life decay by 42%.</p>
</div>
</div>

<div className="lg:col-span-5 bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-4">
<div>
<h2 className="font-headline-md text-headline-md text-on-surface">Skill Mastery Matrix</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Competency calibration over 5 foundational systems.</p>
</div>
<span className="px-2 py-0.5 bg-surface-container font-code-sm text-code-sm rounded text-primary font-semibold">Tier 4</span>
</div>

<div className="relative w-full h-56 flex items-center justify-center my-2">
<svg className="w-56 h-56" viewBox="0 0 240 240">

<polygon fill="none" points="120,20 215,89 179,200 61,200 25,89" stroke="#E2E7FF" strokeWidth="1"></polygon>
<polygon fill="none" points="120,50 184,96 159,173 81,173 56,96" stroke="#E2E7FF" strokeWidth="1"></polygon>
<polygon fill="none" points="120,80 152,103 140,147 100,147 88,103" stroke="#E2E7FF" strokeWidth="1"></polygon>

<line stroke="#E2E7FF" strokeWidth="1" x1="120" x2="120" y1="120" y2="20"></line>
<line stroke="#E2E7FF" strokeWidth="1" x1="120" x2="215" y1="120" y2="89"></line>
<line stroke="#E2E7FF" strokeWidth="1" x1="120" x2="179" y1="120" y2="200"></line>
<line stroke="#E2E7FF" strokeWidth="1" x1="120" x2="61" y1="120" y2="200"></line>
<line stroke="#E2E7FF" strokeWidth="1" x1="120" x2="25" y1="120" y2="89"></line>


<polygon fill="#4F46E5" fillOpacity="0.2" points="120,28 200,94 170,185 75,165 40,95" stroke="#3525CD" strokeWidth="2"></polygon>
<circle cx="120" cy="28" fill="#3525CD" r="3.5"></circle>
<circle cx="200" cy="94" fill="#3525CD" r="3.5"></circle>
<circle cx="170" cy="185" fill="#3525CD" r="3.5"></circle>
<circle cx="75" cy="165" fill="#3525CD" r="3.5"></circle>
<circle cx="40" cy="95" fill="#3525CD" r="3.5"></circle>
</svg>
</div>

<div className="space-y-2 mt-2">
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="text-on-surface">System Design</span>
<div className="flex items-center gap-2">
<span className="w-20 bg-surface-container h-1.5 rounded-full overflow-hidden">
<span className="bg-primary block h-full" style={{ width: '94%' }}></span>
</span>
<span className="font-code-sm text-code-sm text-on-surface-variant font-medium">94%</span>
</div>
</div>
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="text-on-surface">Data Consistency</span>
<div className="flex items-center gap-2">
<span className="w-20 bg-surface-container h-1.5 rounded-full overflow-hidden">
<span className="bg-primary block h-full" style={{ width: '88%' }}></span>
</span>
<span className="font-code-sm text-code-sm text-on-surface-variant font-medium">88%</span>
</div>
</div>
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="text-on-surface">Concurrency Models</span>
<div className="flex items-center gap-2">
<span className="w-20 bg-surface-container h-1.5 rounded-full overflow-hidden">
<span className="bg-primary block h-full" style={{ width: '84%' }}></span>
</span>
<span className="font-code-sm text-code-sm text-on-surface-variant font-medium">84%</span>
</div>
</div>
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="text-on-surface">Networking &amp; Protocols</span>
<div className="flex items-center gap-2">
<span className="w-20 bg-surface-container h-1.5 rounded-full overflow-hidden">
<span className="bg-primary block h-full" style={{ width: '78%' }}></span>
</span>
<span className="font-code-sm text-code-sm text-on-surface-variant font-medium">78%</span>
</div>
</div>
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="text-on-surface">Fault Recovery</span>
<div className="flex items-center gap-2">
<span className="w-20 bg-surface-container h-1.5 rounded-full overflow-hidden">
<span className="bg-primary block h-full" style={{ width: '65%' }}></span>
</span>
<span className="font-code-sm text-code-sm text-on-surface-variant font-medium">65%</span>
</div>
</div>
</div>
</div>
</div>
</section>

<section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
<div>
<div className="flex items-center gap-2">
<h2 className="font-headline-md text-headline-md text-on-surface">Spaced Repetition Queue</h2>
<span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">Priority Today</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">High-decay items requiring active stimulus testing before Ebbinghaus drop-off.</p>
</div>
<div className="flex items-center gap-2">
<button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md" type="button">
<span className="material-symbols-outlined text-[16px]">tune</span>
<span>Filter Status</span>
</button>
<button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md shadow-sm transition-all" type="button">
<span className="material-symbols-outlined text-[16px]">play_arrow</span>
<span>Review All (14)</span>
</button>
</div>
</div>

<div className="overflow-x-auto -mx-6 px-6">
<table className="w-full text-left border-collapse">
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

<tr className="hover:bg-surface-container-low/40 transition-colors group">
<td className="py-3.5 px-4">
<div className="flex items-center gap-3">
<span className="p-2 rounded bg-surface-container text-primary material-symbols-outlined text-[18px]">dns</span>
<div>
<p className="font-label-md text-label-md text-on-surface font-semibold">Raft Consensus: Leader Election Quorums</p>
<p className="text-outline font-body-sm text-body-sm">Distributed Systems • Module 4.2</p>
</div>
</div>
</td>
<td className="py-3.5 px-3">
<span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-code-sm text-code-sm font-medium">8.4 / 10 (Hard)</span>
</td>
<td className="py-3.5 px-3 text-on-surface-variant font-code-sm text-code-sm">2 days ago</td>
<td className="py-3.5 px-3">
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold"><span className="material-symbols-outlined text-[14px]">schedule</span>Due Today</span>
</td>
<td className="py-3.5 px-3">
<div className="flex items-center gap-2">
<span className="w-16 bg-surface-container h-1.5 rounded-full overflow-hidden">
<span className="bg-secondary block h-full" style={{ width: '62%' }}></span>
</span>
<span className="font-code-sm text-code-sm font-semibold text-on-surface">62%</span>
</div>
</td>
<td className="py-3.5 px-4 text-right">
<button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold shadow-sm transition-all" type="button"><span>Start 3-min Recall</span><span className="material-symbols-outlined text-[14px]">arrow_forward</span></button>
</td>
</tr>

<tr className="hover:bg-surface-container-low/40 transition-colors group">
<td className="py-3.5 px-4">
<div className="flex items-center gap-3">
<span className="p-2 rounded bg-surface-container text-primary material-symbols-outlined text-[18px]">swap_horiz</span>
<div>
<p className="font-label-md text-label-md text-on-surface font-semibold">TCP Congestion Control: BBR vs CUBIC</p>
<p className="text-outline font-body-sm text-body-sm">Networking Internals • Module 2.1</p>
</div>
</div>
</td>
<td className="py-3.5 px-3">
<span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-code-sm text-code-sm font-medium">6.9 / 10 (Med)</span>
</td>
<td className="py-3.5 px-3 text-on-surface-variant font-code-sm text-code-sm">4 days ago</td>
<td className="py-3.5 px-3">
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold"><span className="material-symbols-outlined text-[14px]">schedule</span>Due Today</span>
</td>
<td className="py-3.5 px-3">
<div className="flex items-center gap-2">
<span className="w-16 bg-surface-container h-1.5 rounded-full overflow-hidden">
<span className="bg-primary block h-full" style={{ width: '71%' }}></span>
</span>
<span className="font-code-sm text-code-sm font-semibold text-on-surface">71%</span>
</div>
</td>
<td className="py-3.5 px-4 text-right">
<button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold shadow-sm transition-all" type="button"><span>Start 3-min Recall</span><span className="material-symbols-outlined text-[14px]">arrow_forward</span></button>
</td>
</tr>

<tr className="hover:bg-surface-container-low/40 transition-colors group">
<td className="py-3.5 px-4">
<div className="flex items-center gap-3">
<span className="p-2 rounded bg-surface-container text-primary material-symbols-outlined text-[18px]">lock_clock</span>
<div>
<p className="font-label-md text-label-md text-on-surface font-semibold">Lock-free Queue: CAS Memory Ordering</p>
<p className="text-outline font-body-sm text-body-sm">Concurrency • Module 3.5</p>
</div>
</div>
</td>
<td className="py-3.5 px-3">
<span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-code-sm text-code-sm font-medium">9.1 / 10 (Hard)</span>
</td>
<td className="py-3.5 px-3 text-on-surface-variant font-code-sm text-code-sm">1 day ago</td>
<td className="py-3.5 px-3">
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm"><span className="material-symbols-outlined text-[14px] text-outline">event</span>Review in 1 day</span>
</td>
<td className="py-3.5 px-3">
<div className="flex items-center gap-2">
<span className="w-16 bg-surface-container h-1.5 rounded-full overflow-hidden">
<span className="bg-primary block h-full" style={{ width: '86%' }}></span>
</span>
<span className="font-code-sm text-code-sm font-semibold text-on-surface">86%</span>
</div>
</td>
<td className="py-3.5 px-4 text-right">
<button className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-outline-variant/50 hover:bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm font-medium transition-all" type="button"><span>Preview</span><span className="material-symbols-outlined text-[14px]">visibility</span></button>
</td>
</tr>

<tr className="hover:bg-surface-container-low/40 transition-colors group">
<td className="py-3.5 px-4">
<div className="flex items-center gap-3">
<span className="p-2 rounded bg-surface-container text-primary material-symbols-outlined text-[18px]">memory</span>
<div>
<p className="font-label-md text-label-md text-on-surface font-semibold">LSM Trees &amp; Bloom Filters: Compaction Strategies</p>
<p className="text-outline font-body-sm text-body-sm">Storage Engines • Module 1.4</p>
</div>
</div>
</td>
<td className="py-3.5 px-3">
<span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-code-sm text-code-sm font-medium">5.2 / 10 (Easy)</span>
</td>
<td className="py-3.5 px-3 text-on-surface-variant font-code-sm text-code-sm">6 days ago</td>
<td className="py-3.5 px-3">
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm"><span className="material-symbols-outlined text-[14px] text-outline">event</span>Review in 3 days</span>
</td>
<td className="py-3.5 px-3">
<div className="flex items-center gap-2">
<span className="w-16 bg-surface-container h-1.5 rounded-full overflow-hidden">
<span className="bg-primary block h-full" style={{ width: '93%' }}></span>
</span>
<span className="font-code-sm text-code-sm font-semibold text-on-surface">93%</span>
</div>
</td>
<td className="py-3.5 px-4 text-right">
<button className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-outline-variant/50 hover:bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm font-medium transition-all" type="button"><span>Preview</span><span className="material-symbols-outlined text-[14px]">visibility</span></button>
</td>
</tr>
</tbody>
</table>
</div>
</section>

<section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
<div>
<h2 className="font-headline-md text-headline-md text-on-surface">Verified Milestones &amp; Credentials</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Certificates earned through rigorous spaced assessments and code validations.</p>
</div>
<a className="inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:underline" href="#">
<span>View Public Credentials Ledger</span>
<span className="material-symbols-outlined text-[16px]">open_in_new</span>
</a>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-5">

<div className="p-4 bg-surface-container-low rounded-xl flex items-start gap-4 hover:shadow-md transition-shadow relative overflow-hidden">
<div className="w-16 h-16 rounded-xl bg-surface-container-lowest flex items-center justify-center shrink-0 shadow-sm">
<img className="w-12 h-12 object-contain" data-alt="A modern 3D metallic gold and deep indigo credential crest with clean minimalist geometric lines representing distributed architecture certification, soft studio lighting, ultra sharp focus." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7JRdpRfqB6fu7EFArn9pcQFo8krE6ZpbhAheIg6W8qznpfEb-Lbu1zluC3lXF6pnCtFMjE51CaX8bBd08QWRPHGAY1fNSI6GzXJY6iS16IY8cJ2nk6nbzmqyCogYkc7bJiXJxMYhZKmiYzMAE-I6DvGxxLhNBPwIlfBBVD5JxBL6lwY0-_V-ds1ejd68pvhTt6SN0en-I8wPyhIwkmEEIWq2lyDFUVDZ1NaE2fyEA" />
</div>
<div className="min-w-0 flex-1">
<div className="flex items-center gap-1.5">
<span className="px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-code-sm text-code-sm font-bold">VERIFIED</span>
<span className="font-code-sm text-code-sm text-outline">Oct 2024</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 truncate">Distributed Systems Architect</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 line-clamp-2">Completed 28 rigorous case studies and consensus simulator evaluations.</p>
</div>
</div>

<div className="p-4 bg-surface-container-low rounded-xl flex items-start gap-4 hover:shadow-md transition-shadow relative overflow-hidden">
<div className="w-16 h-16 rounded-xl bg-surface-container-lowest flex items-center justify-center shrink-0 shadow-sm">
<img className="w-12 h-12 object-contain" data-alt="A sleek isometric high-tech badge with sapphire glass textures, geometric hexagonal network nodes, representing low latency networking mastery, indigo and white background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwCDN90M_iQu8n_ssWbmqhpBktSr3M0PHVgikzZ9XwS0Y1HClHIm7_nbcK_fbiAx2938r2apJfVqnVzyBS73NQDLhPTpMwMOTqJsg7NzTvolwiB1kzDpByVwqRfNy3KRuNPVwBfNWvJUGAj8-BV4BNvQoRszeIYjJX0GGlXlsW02p2HvVwoMT-tP32qHpwfWO-BbzvrGQUh2PMrUzTuA5uYLLHDoDydPPNF87II04b" />
</div>
<div className="min-w-0 flex-1">
<div className="flex items-center gap-1.5">
<span className="px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-code-sm text-code-sm font-bold">VERIFIED</span>
<span className="font-code-sm text-code-sm text-outline">Nov 2024</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 truncate">Kernel Networking &amp; eBPF Pro</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 line-clamp-2">Validated packet processing pipelines and zero-copy ring buffer models.</p>
</div>
</div>

<div className="p-4 bg-surface-container-low rounded-xl flex items-start gap-4 hover:shadow-md transition-shadow relative overflow-hidden opacity-90">
<div className="w-16 h-16 rounded-xl bg-surface-container-lowest flex items-center justify-center shrink-0 shadow-sm border border-dashed border-outline-variant">
<img className="w-12 h-12 object-contain grayscale-[30%]" data-alt="A futuristic silver badge with glowing holographic violet accents showing a high concurrency CPU core concept, sleek minimalist vector-inspired 3D badge." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK0IoflcN9uCb4Y7IZktd0JbNFiTo0v4D69XKvJuzEoJXrkvYUmEL7klHeWdYPNKjsMW8sqTDEuii40Fd8KoMmU88vy4WeBaEN_NXjIR855KDHgpKJWQb382t7IjQzgKofvDD0OOAiK9gPOLP8W01H1hTLOvgRlImGP8P9Wajn0WC3qgH-pShxAp5zLExgJYOnl7RRIM8JxJr3gIp_AV7Rs_65qezoVjB8BWFNIicT" />
</div>
<div className="min-w-0 flex-1">
<div className="flex items-center justify-between">
<span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface font-code-sm text-code-sm font-semibold">IN PROGRESS (84%)</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 truncate">Concurrency &amp; Memory Models</h3>
<div className="w-full bg-surface-container h-1.5 rounded-full mt-2 overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{ width: '84%' }}></div>
</div>
</div>
</div>
</div>
</section>
</div>

  );
}
