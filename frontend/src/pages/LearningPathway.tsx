import React, { useState } from 'react';
import { useLearnMate } from '@/context/LearnMateContext';
import { adaptPathway, ApiError } from '@/api/client';

export function LearningPathway() {
  const { pathway, progress, setPathway } = useLearnMate();
  const [activeView, setActiveView] = useState<'tree' | 'timeline' | 'matrix'>('tree');
  const [zoom, setZoom] = useState(100);
  const [selectedNode, setSelectedNode] = useState<'raft' | 'paxos'>('raft');
  const [filter, setFilter] = useState<'all' | 'progress' | 'completed' | 'locked'>('all');
  const [showPrereqs, setShowPrereqs] = useState(true);

  // Adapt Dialog State
  const [showAdaptModal, setShowAdaptModal] = useState(false);
  const [adaptFeedback, setAdaptFeedback] = useState('');
  const [isAdapting, setIsAdapting] = useState(false);
  const [adaptError, setAdaptError] = useState<string | null>(null);

  const adjustZoom = (delta: number) => {
    setZoom((prev) => Math.min(Math.max(prev + delta, 50), 150));
  };

  const handleAdapt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adaptFeedback.trim()) return;
    setIsAdapting(true);
    setAdaptError(null);
    try {
      const updated = await adaptPathway(adaptFeedback, progress.completed);
      setPathway(updated);
      setShowAdaptModal(false);
      setAdaptFeedback('');
    } catch (err) {
      if (err instanceof ApiError) {
        setAdaptError(err.message);
      } else {
        setAdaptError('Failed to adapt pathway. Please check backend connection.');
      }
    } finally {
      setIsAdapting(false);
    }
  };

  const nodeInfo = selectedNode === 'paxos' ? {
    id: 'MOD-202',
    title: 'Multi-Paxos & Leaseholders: Optimizing Round-Trip Latency',
    desc: 'Multi-Paxos skips Phase 1 (Prepare/Promise) during steady-state by electing a stable master node for a prolonged lease duration, enabling single round-trip distributed consensus across geo-distributed replicas.',
    difficulty: 'Advanced',
    time: '3.8 hours',
    prereqs: ['Basic Paxos Invariant', 'Epoch Numbers', 'Two-Phase Commit'],
  } : {
    id: 'MOD-201',
    title: 'Raft Consensus Algorithm: Leader Election & Log Replication',
    desc: 'Raft breaks distributed consensus into explicit independent subproblems: leader election, log replication, and safety. A single elected leader assumes total responsibility for managing the replicated log, reducing consensus to a linear commit phase through majority quorums.',
    difficulty: 'Advanced',
    time: '4.5 hours',
    prereqs: ['RPC Basics (gRPC)', 'TCP/IP Handshake & Buffering', 'State Machines'],
  };

  return (
    <>
      <div className="flex flex-col w-full space-y-space-md">
        {/* Top Command & Action Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-space-xs text-on-surface-variant font-code-sm text-code-sm">
              <span>CURRICULUM</span>
              <span>/</span>
              <span className="text-primary font-medium">SYSTEMS-TRACK-v4.2</span>
              <span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant text-[10px]">SYNCED</span>
            </div>
            <div className="flex items-center gap-space-sm mt-1">
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight truncate">
                {pathway?.target_role || 'Fullstack Systems & Distributed Architecture'}
              </h1>
              <button className="p-1 rounded text-on-surface-variant hover:bg-surface-container-low transition-colors" title="Switch Roadmap" type="button">
                <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
              </button>
            </div>
          </div>
          {/* Controls Toolbar */}
          <div className="flex flex-wrap items-center gap-space-sm">
            {/* Layout Mode Tabs */}
            <div className="flex items-center p-1 bg-surface-container-low rounded-lg">
              <button 
                onClick={() => setActiveView('tree')}
                className={`flex items-center gap-1.5 px-space-sm py-1 rounded font-label-md text-label-md transition-all ${activeView === 'tree' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">account_tree</span>
                <span>Tree View</span>
              </button>
              <button 
                onClick={() => setActiveView('timeline')}
                className={`flex items-center gap-1.5 px-space-sm py-1 rounded font-label-md text-label-md transition-all ${activeView === 'timeline' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">timeline</span>
                <span>Timeline</span>
              </button>
              <button 
                onClick={() => setActiveView('matrix')}
                className={`flex items-center gap-1.5 px-space-sm py-1 rounded font-label-md text-label-md transition-all ${activeView === 'matrix' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">grid_view</span>
                <span>Matrix</span>
              </button>
            </div>
            {/* Zoom Level Selector */}
            <div className="flex items-center bg-surface-container-low rounded-lg p-0.5">
              <button className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest rounded transition-colors" onClick={() => adjustZoom(-25)} type="button">
                <span className="material-symbols-outlined text-[16px]">remove</span>
              </button>
              <span className="font-code-sm text-code-sm px-2 text-on-surface font-medium select-none">{zoom}%</span>
              <button className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest rounded transition-colors" onClick={() => adjustZoom(25)} type="button">
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>
            {/* AI Customizer Trigger */}
            <button 
              onClick={() => setShowAdaptModal(true)}
              className="flex items-center gap-1.5 px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all" 
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>Customize with AI</span>
            </button>
          </div>
        </div>

        {/* Filter & Sub-Nav Strip */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-lowest px-space-md py-2.5 rounded-xl shadow-sm">
          <div className="flex flex-wrap items-center gap-space-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mr-2">Filter</span>
            <button 
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold transition-all ${filter === 'all' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'}`}
            >
              All Nodes (28)
            </button>
            <button 
              onClick={() => setFilter('progress')}
              className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm transition-all ${filter === 'progress' ? 'bg-primary-fixed text-on-primary-fixed font-semibold' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'}`}
            >
              In Progress (4)
            </button>
            <button 
              onClick={() => setFilter('completed')}
              className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm transition-all ${filter === 'completed' ? 'bg-primary-fixed text-on-primary-fixed font-semibold' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'}`}
            >
              Completed (12)
            </button>
            <button 
              onClick={() => setFilter('locked')}
              className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm transition-all ${filter === 'locked' ? 'bg-primary-fixed text-on-primary-fixed font-semibold' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'}`}
            >
              Locked (12)
            </button>
            <div className="h-4 w-[1px] bg-surface-container-high mx-2"></div>
            {/* Domains Dropdown Chips */}
            <div className="flex items-center gap-1">
              <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-code-sm text-code-sm">#networking</span>
              <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-code-sm text-code-sm">#consensus</span>
              <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-code-sm text-code-sm">#storage</span>
            </div>
          </div>
          {/* Toggle Prerequisites */}
          <div className="flex items-center gap-space-sm">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                checked={showPrereqs} 
                onChange={(e) => setShowPrereqs(e.target.checked)}
                className="sr-only peer" 
                type="checkbox" 
              />
              <div className="w-8 h-4.5 bg-surface-container-high rounded-full peer peer-checked:bg-primary transition-colors relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-surface-container-lowest after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-3.5"></div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Prerequisite Lines</span>
            </label>
            <button className="p-1 rounded text-on-surface-variant hover:bg-surface-container-low transition-colors" title="Canvas Settings" type="button">
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </button>
          </div>
        </div>

        {/* Main Canvas Workspace Grid: Visual Tree + Node Inspector */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md items-start">
          {/* Roadmap Interactive Flow Surface (8 cols) */}
          <div className="xl:col-span-8 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm relative overflow-hidden min-h-[720px]">
            {/* Ambient Visual Background Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            {/* Canvas Header Meta */}
            <div className="flex items-center justify-between pb-space-md relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">Execution Path Active</span>
              </div>
              <div className="flex items-center gap-3 font-code-sm text-code-sm text-on-surface-variant">
                <span>Target Velocity: <strong className="text-on-surface font-semibold">3.8 hrs/wk</strong></span>
                <span>•</span>
                <span>Overall: <strong className="text-on-surface font-semibold">{(progress as any).overall_progress_pct || 48}%</strong></span>
              </div>
            </div>

            {/* Roadmap Flow Stages Container */}
            <div className="space-y-10 relative z-10 transition-transform duration-200 origin-top-left" style={{ transform: `scale(${zoom / 100})` }}>
              {/* STAGE 1: COMPLETED */}
              <div className="relative group">
                <div className="flex items-start gap-space-md">
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed shadow-sm">
                      <span className="material-symbols-outlined text-[20px] font-bold text-primary">done_all</span>
                    </div>
                    <div className="w-0.5 h-32 bg-primary/30 mt-2"></div>
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-code-sm text-code-sm text-primary font-medium">STAGE 01</span>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">Foundations of Concurrency &amp; Interprocess I/O</h3>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
                        100% Completed
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm mt-space-sm">
                      <div className="p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-label-sm text-label-sm text-on-surface-variant">Module 1.1</span>
                          <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                        </div>
                        <h4 className="font-headline-sm text-[14px] text-on-surface font-semibold">Memory Models &amp; Atomic Operations</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-1">Volatile registers, CAS instructions &amp; happen-before semantics.</p>
                      </div>
                      <div className="p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-label-sm text-label-sm text-on-surface-variant">Module 1.2</span>
                          <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                        </div>
                        <h4 className="font-headline-sm text-[14px] text-on-surface font-semibold">Event Loops &amp; Epoll Multiplexing</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-1">Kernel event dispatch, non-blocking sockets &amp; reactor design.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* STAGE 2: IN PROGRESS (ACTIVE) */}
              <div className="relative group -mt-4">
                <div className="flex items-start gap-space-md">
                  <div className="flex flex-col items-center">
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-12 h-12 rounded-full bg-primary/20 animate-pulse"></span>
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-md z-10">
                        <span className="material-symbols-outlined text-[20px]">sync</span>
                      </div>
                    </div>
                    <div className="w-0.5 h-36 bg-surface-container-highest mt-2"></div>
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-code-sm text-code-sm text-primary font-semibold">STAGE 02 • ACTIVE OBJECTIVE</span>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">Consensus, Log Replication &amp; State Machines</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-code-sm text-code-sm text-primary font-bold">65%</span>
                        <div className="w-20 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full w-[65%]"></div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm mt-space-sm">
                      {/* Active Highlighted Node: Raft */}
                      <div 
                        onClick={() => setSelectedNode('raft')}
                        className={`p-space-sm rounded-lg transition-all cursor-pointer relative ${selectedNode === 'raft' ? 'bg-surface-container-lowest ring-2 ring-primary shadow-sm hover:shadow-md' : 'bg-surface-container-low hover:bg-surface-container'}`}
                      >
                        {selectedNode === 'raft' && (
                          <div className="absolute -top-2 right-2 px-2 py-0.2 bg-primary text-on-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                            Selected
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-label-sm text-label-sm text-primary font-semibold">Module 2.1 • Current</span>
                          <span className="px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-code-sm text-[11px]">80% Log Done</span>
                        </div>
                        <h4 className="font-headline-sm text-[14px] text-on-surface font-semibold flex items-center gap-1.5">
                          Raft Consensus Algorithm
                          <span className="material-symbols-outlined text-primary text-[16px]">bolt</span>
                        </h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-1">Leader election, term numbers &amp; quorum commit barriers.</p>
                      </div>

                      {/* Node 2.2: Multi-Paxos */}
                      <div 
                        onClick={() => setSelectedNode('paxos')}
                        className={`p-space-sm rounded-lg transition-all cursor-pointer relative ${selectedNode === 'paxos' ? 'bg-surface-container-lowest ring-2 ring-primary shadow-sm hover:shadow-md' : 'bg-surface-container-low hover:bg-surface-container'}`}
                      >
                        {selectedNode === 'paxos' && (
                          <div className="absolute -top-2 right-2 px-2 py-0.2 bg-primary text-on-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                            Selected
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-label-sm text-label-sm text-on-surface-variant">Module 2.2</span>
                          <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-code-sm text-[11px]">Queued Next</span>
                        </div>
                        <h4 className="font-headline-sm text-[14px] text-on-surface font-semibold">Multi-Paxos &amp; Leaseholders</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-1">Round-trip latency reduction via steady-state leader pipelining.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* STAGE 3: UNLOCKED / UPCOMING */}
              <div className="relative group -mt-4">
                <div className="flex items-start gap-space-md">
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">lock_open</span>
                    </div>
                    <div className="w-0.5 h-32 bg-surface-container-high mt-2"></div>
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-code-sm text-code-sm text-on-surface-variant font-medium">STAGE 03</span>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">Distributed Storage &amp; Partition Strategies</h3>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                        Unlocked • 0%
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm mt-space-sm">
                      <div className="p-space-sm rounded-lg bg-surface-container-low/70 hover:bg-surface-container transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-label-sm text-label-sm text-on-surface-variant">Module 3.1</span>
                          <span className="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_forward</span>
                        </div>
                        <h4 className="font-headline-sm text-[14px] text-on-surface font-semibold">Consistent Hashing &amp; V-Nodes</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-1">Ring topology, murmur3 hash key bounds and data migration limits.</p>
                      </div>
                      <div className="p-space-sm rounded-lg bg-surface-container-low/70 hover:bg-surface-container transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-label-sm text-label-sm text-on-surface-variant">Module 3.2</span>
                          <span className="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_forward</span>
                        </div>
                        <h4 className="font-headline-sm text-[14px] text-on-surface font-semibold">LSM Trees &amp; SSTable Storage Engines</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-1">Write amplification reduction, memtables, and compaction tiers.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* STAGE 4: LOCKED */}
              <div className="relative group -mt-4 opacity-70 hover:opacity-100 transition-opacity">
                <div className="flex items-start gap-space-md">
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-outline shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-code-sm text-code-sm text-outline">STAGE 04</span>
                        <h3 className="font-headline-sm text-headline-sm text-outline">High Availability, Split-Brain &amp; Chaos Verification</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-surface-container text-outline font-label-sm text-label-sm">
                        Requires Stage 03 Completion
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm mt-space-sm">
                      <div className="p-space-sm rounded-lg bg-surface-container-low/40">
                        <span className="font-label-sm text-label-sm text-outline">Module 4.1</span>
                        <h4 className="font-headline-sm text-[14px] text-outline font-semibold">Jepsen Analysis &amp; Partition Injection</h4>
                        <p className="font-body-sm text-body-sm text-outline mt-1 line-clamp-1">Simulating symmetric partitions and clock drift anomalies.</p>
                      </div>
                      <div className="p-space-sm rounded-lg bg-surface-container-low/40">
                        <span className="font-label-sm text-label-sm text-outline">Module 4.2</span>
                        <h4 className="font-headline-sm text-[14px] text-outline font-semibold">Vector Clocks &amp; CRDT Convergence</h4>
                        <p className="font-body-sm text-body-sm text-outline mt-1 line-clamp-1">Conflict-free replicated datatypes in active-active topology.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Canvas Interactive Footer Tip */}
            <div className="mt-8 pt-4 flex items-center justify-between text-on-surface-variant font-code-sm text-code-sm">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface">Space</kbd> + Drag to Pan Canvas
              </span>
              <span>Autosaved 2m ago</span>
            </div>
          </div>

          {/* Node Inspector Flyout / Sidecard (4 cols) */}
          <div className="xl:col-span-4 space-y-space-md">
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-md">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-code-sm text-code-sm font-semibold">
                      ACTIVE FOCUS
                    </span>
                    <span className="font-code-sm text-code-sm text-on-surface-variant">ID: {nodeInfo.id}</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface mt-1.5 leading-snug">
                    {nodeInfo.title}
                  </h2>
                </div>
                <button className="p-1 rounded text-on-surface-variant hover:bg-surface-container-low transition-colors" title="Bookmark Node" type="button">
                  <span className="material-symbols-outlined text-[20px]">bookmark</span>
                </button>
              </div>

              {/* Node Meta Badges Grid */}
              <div className="grid grid-cols-2 gap-space-xs p-space-sm bg-surface-container-low rounded-lg">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Difficulty</span>
                  <p className="font-label-md text-label-md text-on-surface font-semibold mt-0.5 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-error"></span>
                    {nodeInfo.difficulty}
                  </p>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Estimated Time</span>
                  <p className="font-label-md text-label-md text-on-surface font-semibold mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                    {nodeInfo.time}
                  </p>
                </div>
              </div>

              {/* Prerequisites Tag List */}
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Verified Prerequisites</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {nodeInfo.prereqs.map((prereq, idx) => (
                    <span key={idx} className="flex items-center gap-1 px-2 py-1 rounded bg-surface-container font-code-sm text-code-sm text-on-surface">
                      <span className="material-symbols-outlined text-[14px] text-primary">check</span>
                      {prereq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Visual Mini Diagram Asset */}
              <div className="p-3 bg-surface-container-low rounded-lg space-y-2">
                <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                  <span>QUORUM TOPOLOGY</span>
                  <span>3 OF 5 NODES</span>
                </div>
                <svg className="w-full h-12 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 280 60">
                  <circle cx="30" cy="30" fill="#3525cd" r="14" stroke="none"></circle>
                  <text fill="#ffffff" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle" x="30" y="34">L</text>
                  <line stroke="#c7c4d8" strokeDasharray="3 3" x1="44" x2="86" y1="30" y2="30"></line>
                  <circle cx="100" cy="30" fill="#eaedff" r="12" stroke="#3525cd"></circle>
                  <text fill="#3525cd" fontFamily="monospace" fontSize="9" textAnchor="middle" x="100" y="34">F1</text>
                  <line stroke="#3525cd" x1="44" x2="156" y1="25" y2="15"></line>
                  <circle cx="170" cy="15" fill="#eaedff" r="12" stroke="#3525cd"></circle>
                  <text fill="#3525cd" fontFamily="monospace" fontSize="9" textAnchor="middle" x="170" y="19">F2</text>
                  <line stroke="#3525cd" x1="44" x2="156" y1="35" y2="45"></line>
                  <circle cx="170" cy="45" fill="#eaedff" r="12" stroke="#3525cd"></circle>
                  <text fill="#3525cd" fontFamily="monospace" fontSize="9" textAnchor="middle" x="170" y="49">F3</text>
                  <line stroke="#ba1a1a" strokeDasharray="2 2" x1="44" x2="226" y1="30" y2="30"></line>
                  <circle cx="240" cy="30" fill="#ffdad6" r="12" stroke="#ba1a1a"></circle>
                  <text fill="#93000a" fontFamily="monospace" fontSize="9" textAnchor="middle" x="240" y="34">✕</text>
                </svg>
              </div>

              {/* AI Generated Synopsis Section */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-primary font-label-sm text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  <span>AI CORE INTUITION SUMMARY</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {nodeInfo.desc}
                </p>
              </div>

              {/* Action / Assessment CTAs */}
              <div className="space-y-2 pt-2">
                <button className="w-full flex items-center justify-center gap-2 py-2 px-space-md rounded-lg bg-primary text-on-primary font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all" type="button">
                  <span className="material-symbols-outlined text-[18px]">quiz</span>
                  <span>Take Knowledge Check (5 Questions)</span>
                </button>
                <a className="w-full flex items-center justify-center gap-2 py-2 px-space-md rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md transition-all" href="#">
                  <span className="material-symbols-outlined text-[18px]">terminal</span>
                  <span>Launch Go Raft Consensus Sandbox</span>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">open_in_new</span>
                </a>
              </div>
            </div>

            {/* Compact Velocity & Recommendation Widget */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-sm">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-[14px] text-on-surface font-semibold">Learning Rhythm</span>
                <span className="font-code-sm text-code-sm text-primary font-bold">On Schedule</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Completing this node by Thursday keeps you aligned with your senior engineer target certification timeline.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-[12px]">
                  AI
                </div>
                <p className="font-body-sm text-body-sm text-on-surface italic">
                  "Review section 5.2 on Randomized Timers before taking the quiz."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Adapt Pathway Modal */}
      {showAdaptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/40">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-lg">auto_awesome</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Customize Pathway with AI</h3>
              </div>
              <button
                onClick={() => setShowAdaptModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAdapt} className="mt-4 space-y-4">
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                Describe how you'd like your pathway tailored. IBM Granite will restructure modules, insert prerequisite refresher topics, or accelerate advanced concepts.
              </p>
              <div>
                <label className="block text-label-sm font-label-sm font-semibold text-on-surface mb-1">
                  Adaptation Prompt / Goal Change
                </label>
                <textarea
                  value={adaptFeedback}
                  onChange={(e) => setAdaptFeedback(e.target.value)}
                  placeholder="e.g. Focus more on Paxos and Raft edge cases, or skip basics as I already know sockets in C..."
                  className="w-full h-28 px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              {adaptError && (
                <div className="p-3 rounded-lg bg-error-container text-error text-body-sm font-body-sm">
                  {adaptError}
                </div>
              )}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdaptModal(false)}
                  className="px-4 py-2 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdapting}
                  className="px-5 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold shadow-sm hover:bg-primary-container disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isAdapting && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                  <span>{isAdapting ? 'Adapting with Granite...' : 'Apply Adaptation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
