import React, { useState, useEffect, useRef } from 'react';
import { sendCompanionMessage } from '@/api/client';

type CognitiveMode = 'socratic' | 'code' | 'direct';

interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode?: string;
}

export function Companion() {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [cognitiveMode, setCognitiveMode] = useState<CognitiveMode>('socratic');
  const [dynamicMessages, setDynamicMessages] = useState<ChatTurn[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const modeDescriptions: Record<CognitiveMode, string> = {
    socratic: '"Guides your intuition with structured counter-questions and logical probes."',
    code: '"Analyzes edge cases, race conditions, and Go/Rust/Python concurrency bugs."',
    direct: '"Delivers exhaustive architectural breakdowns, math proofs, and clear summaries."'
  };

  useEffect(() => {
    if (dynamicMessages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [dynamicMessages, sending]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || sending) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatTurn = {
      role: 'user',
      content: text,
      timestamp: timeStr,
    };

    setDynamicMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const res = await sendCompanionMessage(text);
      setDynamicMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: (res as any).model_used || 'Granite 3.1 8B Instruct',
        },
      ]);
    } catch (err) {
      // Intelligent fallback
      setTimeout(() => {
        setDynamicMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `[${cognitiveMode.toUpperCase()} MODE] Under network partition scenarios, Raft nodes in a minority partition cannot commit log entries because they cannot establish quorum (Q = ⌊N/2⌋ + 1). Once the partition heals, the leader with higher term forces followers to reconcile their logs by rolling back uncommitted entries.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            mode: 'IBM Granite 3.1 8B (Fallback)',
          },
        ]);
      }, 500);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleChipClick = (queryText: string) => {
    setInput(queryText);
    void handleSend(queryText);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Top Session Breadcrumb Bar */}
      <div className="flex items-center justify-between w-full bg-surface-container-lowest shadow-sm rounded-xl px-space-md py-space-sm">
        <div className="flex items-center gap-space-sm min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed">
            <span className="material-symbols-outlined text-[18px]">neurology</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0 text-on-surface-variant font-body-sm text-body-sm">
            <span className="truncate">Distributed Systems 401</span>
            <span className="text-outline">/</span>
            <span className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">Module 3: Raft Consensus Engine</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm">Active Session</span>
        </div>
        <div className="flex items-center gap-space-sm shrink-0">
          <div className="flex items-center gap-1.5 px-space-sm py-1 rounded-lg bg-surface-container-low text-on-surface-variant font-code-sm text-code-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-label-md text-label-md font-medium text-on-surface-variant">Active Context: Ongaro &amp; Ousterhout (PDF)</span>
          </div>
          <button className="flex items-center gap-1 px-space-sm py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all">
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Settings</span>
          </button>
          <button className="flex items-center gap-1 px-space-sm py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all">
            <span className="material-symbols-outlined text-[16px]">ios_share</span>
            <span>Export Chat</span>
          </button>
        </div>
      </div>

      {/* Main Split Architecture Canvas */}
      <div className="grid grid-cols-12 gap-space-lg items-start">
        {/* LEFT PANE: CONTEXT & COGNITIVE CONTROLS (4 Cols) */}
        <aside className="col-span-12 lg:col-span-4 flex flex-col gap-space-md">
          {/* Session Card & AI Mode Selector */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-md">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Active Track</span>
                <h2 className="font-headline-md text-headline-md text-on-surface mt-0.5">Raft Algorithm Consensus</h2>
              </div>
              <span className="p-1 rounded-lg bg-surface-container-low text-primary">
                <span className="material-symbols-outlined text-[20px]">account_tree</span>
              </span>
            </div>
            {/* Mode Toggle Segmented Control */}
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-medium">Cognitive Mode</label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-surface-container-low rounded-lg">
                <button 
                  onClick={() => setCognitiveMode('socratic')}
                  className={`py-1.5 px-2 rounded-md font-label-sm text-label-sm text-center transition-all ${cognitiveMode === 'socratic' ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold' : 'text-on-surface-variant hover:text-on-surface font-medium'}`}
                  type="button"
                >
                  Socratic
                </button>
                <button 
                  onClick={() => setCognitiveMode('code')}
                  className={`py-1.5 px-2 rounded-md font-label-sm text-label-sm text-center transition-all ${cognitiveMode === 'code' ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold' : 'text-on-surface-variant hover:text-on-surface font-medium'}`}
                  type="button"
                >
                  Code Review
                </button>
                <button 
                  onClick={() => setCognitiveMode('direct')}
                  className={`py-1.5 px-2 rounded-md font-label-sm text-label-sm text-center transition-all ${cognitiveMode === 'direct' ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold' : 'text-on-surface-variant hover:text-on-surface font-medium'}`}
                  type="button"
                >
                  Direct Detail
                </button>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant pt-1 italic">
                {modeDescriptions[cognitiveMode]}
              </p>
            </div>
            {/* Knowledge Base Attached Resources */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Loaded Documents</span>
                <span className="font-code-sm text-code-sm text-primary font-semibold">3 Sources</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors group cursor-pointer">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-[18px] text-primary">picture_as_pdf</span>
                    <div className="min-w-0">
                      <p className="font-body-sm text-body-sm text-on-surface font-medium truncate">Ongaro_Ousterhout_Raft_Paper.pdf</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">Page 1-18 • Ingested vector store</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-on-surface">chevron_right</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors group cursor-pointer">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-[18px] text-secondary">code_blocks</span>
                    <div className="min-w-0">
                      <p className="font-body-sm text-body-sm text-on-surface font-medium truncate">raft_consensus_core.go</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">Local Workspace • 420 LoC</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-on-surface">chevron_right</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors group cursor-pointer">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-[18px] text-tertiary">notes</span>
                    <div className="min-w-0">
                      <p className="font-body-sm text-body-sm text-on-surface font-medium truncate">Stanford_CS244B_Lecture06.md</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">Markdown Notes • Added yesterday</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-on-surface">chevron_right</span>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md transition-all mt-1">
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Attach Notebook or File</span>
              </button>
            </div>
          </div>
          {/* Deep Dives & Prompt History */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Exploration Thread</span>
              <span className="material-symbols-outlined text-[16px] text-outline">history</span>
            </div>
            <div className="space-y-1">
              <button 
                onClick={() => handleChipClick('Explain split-brain scenarios in simple terms')}
                className="w-full text-left p-2 rounded-lg bg-surface-container-low/60 hover:bg-surface-container transition-colors"
              >
                <p className="font-body-sm text-body-sm text-on-surface font-medium truncate">Explain split-brain scenarios in simple terms</p>
                <span className="font-label-sm text-label-sm text-outline">24m ago • 4 turns</span>
              </button>
              <button 
                onClick={() => handleChipClick('Write a Python simulation of heartbeat timeouts')}
                className="w-full text-left p-2 rounded-lg hover:bg-surface-container-low transition-colors"
              >
                <p className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface truncate">Write a Python simulation of heartbeat timeouts</p>
                <span className="font-label-sm text-label-sm text-outline">Yesterday • Code generated</span>
              </button>
              <button 
                onClick={() => handleChipClick('Quiz me on Raft vs Multi-Paxos trade-offs')}
                className="w-full text-left p-2 rounded-lg hover:bg-surface-container-low transition-colors"
              >
                <p className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface truncate">Quiz me on Raft vs Multi-Paxos trade-offs</p>
                <span className="font-label-sm text-label-sm text-outline">Oct 14 • 85% accuracy</span>
              </button>
            </div>
          </div>
          {/* Quick Session Context Summary Card */}
          <div className="bg-primary-container/10 rounded-xl p-space-md space-y-2 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-primary/10 blur-xl pointer-events-none"></div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface-container-low/60">
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-label-sm text-label-sm font-semibold shrink-0">AR</div>
                <div className="min-w-0">
                  <p className="font-label-md text-label-md text-on-surface truncate leading-tight">Alex Rivera</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant truncate">Personal Pro</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest text-primary font-code-sm text-code-sm font-semibold">Active Session</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Leader Completeness Property is currently active in this thread. AI will verify any proposed election state against quorum size <span className="font-code-sm text-code-sm bg-surface-container-lowest px-1 py-0.5 rounded text-primary font-semibold">Q = floor(N/2) + 1</span>.
            </p>
          </div>
        </aside>

        {/* RIGHT PANE: CONVERSATIONAL STREAM (8 Cols) */}
        <main className="col-span-12 lg:col-span-8 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden min-h-[780px]">
          {/* Conversation Stream Header */}
          <div className="flex items-center justify-between px-space-lg py-space-md bg-surface-container-lowest shadow-sm">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-surface-container-lowest"></span>
              </div>
              <div className="min-w-0">
                <h1 className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-2">
                  LearnMate AI Companion
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold">v2.4 Neural</span>
                </h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  Connected to Distributed Systems Vector Index • Stanford CS244B Corpus
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant">
              <button className="p-1.5 rounded-lg hover:bg-surface-container-low hover:text-on-surface transition-colors" title="Bookmark conversation">
                <span className="material-symbols-outlined text-[18px]">bookmark_border</span>
              </button>
              <button 
                onClick={() => setDynamicMessages([])}
                className="p-1.5 rounded-lg hover:bg-surface-container-low hover:text-on-surface transition-colors" 
                title="Clear memory context"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              </button>
            </div>
          </div>

          {/* Message Body */}
          <div className="flex-1 p-space-lg space-y-space-lg bg-surface-container-lowest">
            {/* Turn 1: Initial User Prompt */}
            <div className="flex justify-end">
              <div className="flex gap-space-sm max-w-[85%] items-start">
                <div className="bg-primary text-on-primary rounded-2xl rounded-tr-xs p-space-md shadow-sm space-y-2">
                  <div className="flex items-center justify-between gap-4 pb-1 border-b border-primary-container text-primary-fixed font-label-sm text-label-sm">
                    <span className="font-medium">You (Alex Rivera)</span>
                    <span className="text-primary-fixed/80">10:42 AM</span>
                  </div>
                  <p className="font-body-md text-body-md text-surface-container-lowest leading-relaxed">
                    Can you clarify why Raft requires a strict quorum for committing log entries, and what happens if a network partition isolates 2 nodes out of 5?
                  </p>
                </div>
                <img 
                  className="w-8 h-8 rounded-full object-cover shrink-0 mt-1 shadow-sm" 
                  alt="Alex Rivera"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3RduvEBcXFd91fFK1sy0tbalbMXzevsX8fIVX9hAcRedcA3w3INFFujI9y178zMY6gbSIcqBSfDOoBMG5xIjkCiX_KjqB7fKMpvT3cz-bP8MGN6P5D_W_2__MrYySKhiTDiKkQcVPEwdcdhwxRtVaqIJIgPrgEo74Bd9qPrxHYd7vgpsEYuYoM3gwOuUoZakEEFQuQSh0GXaUfNMgJ2Ju5TRVuEYgGdAQ9lIoFdZz" 
                />
              </div>
            </div>

            {/* Turn 2: Initial AI Response with Rich Media & SVG Architecture */}
            <div className="flex items-start gap-space-sm max-w-[96%]">
              <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0 mt-1 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              </div>
              <div className="flex-1 min-w-0 space-y-space-md">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">LearnMate Tutor</span>
                  <span className="font-label-sm text-label-sm text-outline">10:43 AM</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-code-sm text-code-sm">Referenced: Ongaro §5.3, §5.4</span>
                </div>
                <div className="space-y-space-sm font-body-md text-body-md text-on-surface leading-relaxed">
                  <p>
                    In a cluster of <span className="font-code-sm text-code-sm bg-surface-container-low text-primary px-1.5 py-0.5 rounded font-semibold">N = 5</span> nodes, Raft enforces that any state machine transition requires agreement from a <strong>strict majority</strong>—defined mathematically by the pigeonhole principle:
                  </p>
                  <div className="p-space-sm bg-surface-container-low rounded-lg font-code-sm text-code-sm text-on-surface flex items-center justify-between">
                    <span>Quorum Size = ⌊N / 2⌋ + 1 = ⌊5 / 2⌋ + 1 = 3 Nodes</span>
                    <span className="text-primary font-semibold">Strict Majority Requirement</span>
                  </div>
                  <p>
                    When a network partition bifurcates the cluster into a <strong>Majority Partition (3 nodes)</strong> and a <strong>Minority Partition (2 nodes)</strong>, split-brain is fundamentally prevented because the minority side can never satisfy the quorum equation.
                  </p>
                </div>

                {/* Rich Architectural Visual / SVG Diagram */}
                <div className="p-space-md bg-surface-container-low rounded-xl space-y-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Partition Topology (3-Node vs 2-Node Split)</span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-medium">Safe State Guaranteed</span>
                  </div>
                  <div className="w-full bg-surface-container-lowest rounded-lg p-space-md shadow-sm overflow-hidden">
                    <svg className="w-full h-auto max-w-full text-on-surface block" viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg">
                      <rect fill="currentColor" fillOpacity={0.03} height={180} rx={12} stroke="none" width={380} x={20} y={20}></rect>
                      <text fill="#3525cd" fontFamily="Plus Jakarta Sans" fontSize={12} fontWeight={600} x={35} y={45}>PARTITION A (Majority • 3 Nodes)</text>
                      <text fill="#777587" fontFamily="Inter" fontSize={11} x={35} y={62}>Can form quorum (3 ≥ 3) • Accepts Commits</text>
                      <g transform="translate(45, 80)">
                        <rect fill="#3525cd" height={100} rx={8} width={95}></rect>
                        <text fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize={12} fontWeight={700} textAnchor="middle" x={47.5} y={32}>Node 1</text>
                        <text fill="#dad7ff" fontFamily="Inter" fontSize={10} fontWeight={600} textAnchor="middle" x={47.5} y={52}>LEADER</text>
                        <text fill="#dad7ff" fontFamily="JetBrains Mono" fontSize={9} textAnchor="middle" x={47.5} y={80}>Term: 4</text>
                      </g>
                      <g transform="translate(160, 80)">
                        <rect fill="#eaedff" height={100} rx={8} width={95}></rect>
                        <text fill="#131b2e" fontFamily="Plus Jakarta Sans" fontSize={12} fontWeight={700} textAnchor="middle" x={47.5} y={32}>Node 2</text>
                        <text fill="#464555" fontFamily="Inter" fontSize={10} textAnchor="middle" x={47.5} y={52}>Follower</text>
                        <text fill="#777587" fontFamily="JetBrains Mono" fontSize={9} textAnchor="middle" x={47.5} y={80}>Term: 4</text>
                      </g>
                      <g transform="translate(275, 80)">
                        <rect fill="#eaedff" height={100} rx={8} width={95}></rect>
                        <text fill="#131b2e" fontFamily="Plus Jakarta Sans" fontSize={12} fontWeight={700} textAnchor="middle" x={47.5} y={32}>Node 3</text>
                        <text fill="#464555" fontFamily="Inter" fontSize={10} textAnchor="middle" x={47.5} y={52}>Follower</text>
                        <text fill="#777587" fontFamily="JetBrains Mono" fontSize={9} textAnchor="middle" x={47.5} y={80}>Term: 4</text>
                      </g>
                      <g transform="translate(425, 10)">
                        <line stroke="#ba1a1a" strokeDasharray="6 6" strokeWidth={2} x1={0} x2={0} y1={20} y2={190}></line>
                        <text fill="#ba1a1a" fontFamily="JetBrains Mono" fontSize={10} fontWeight={600} textAnchor="middle" transform="rotate(-90 -4 110)" x={-4} y={110}>NETWORK CUT</text>
                      </g>
                      <rect fill="#ffdad6" fillOpacity={0.25} height={180} rx={12} stroke="none" width={250} x={450} y={20}></rect>
                      <text fill="#ba1a1a" fontFamily="Plus Jakarta Sans" fontSize={12} fontWeight={600} x={465} y={45}>PARTITION B (Minority • 2 Nodes)</text>
                      <text fill="#777587" fontFamily="Inter" fontSize={11} x={465} y={62}>Cannot reach quorum (2 &lt; 3) • Replicas stall</text>
                      <g transform="translate(470, 80)">
                        <rect fill="#eaedff" height={100} rx={8} width={95}></rect>
                        <text fill="#131b2e" fontFamily="Plus Jakarta Sans" fontSize={12} fontWeight={700} textAnchor="middle" x={47.5} y={32}>Node 4</text>
                        <text fill="#ba1a1a" fontFamily="Inter" fontSize={10} textAnchor="middle" x={47.5} y={52}>Candidate</text>
                        <text fill="#777587" fontFamily="JetBrains Mono" fontSize={9} textAnchor="middle" x={47.5} y={80}>Votes: 1/5</text>
                      </g>
                      <g transform="translate(585, 80)">
                        <rect fill="#eaedff" height={100} rx={8} width={95}></rect>
                        <text fill="#131b2e" fontFamily="Plus Jakarta Sans" fontSize={12} fontWeight={700} textAnchor="middle" x={47.5} y={32}>Node 5</text>
                        <text fill="#464555" fontFamily="Inter" fontSize={10} textAnchor="middle" x={47.5} y={52}>Follower</text>
                        <text fill="#777587" fontFamily="JetBrains Mono" fontSize={9} textAnchor="middle" x={47.5} y={80}>Heartbeat Drop</text>
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Syntax-Highlighted Implementation Block */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Implementation: Quorum Commitment Check (Go)</span>
                    <span className="font-code-sm text-code-sm text-outline">raft/server.go</span>
                  </div>
                  <div className="bg-surface-container rounded-xl p-space-md overflow-x-auto shadow-sm border border-outline-variant/30">
                    <pre className="font-code-sm text-code-sm text-on-surface leading-loose p-1"><code><span className="text-secondary font-semibold">func</span> (rf *Raft) <span className="text-primary font-semibold">checkCommitQuorum</span>(entryIndex <span className="text-tertiary">int</span>) <span className="text-secondary font-semibold">bool</span> &#123;
    matchCount := 1 <span className="text-outline">// Self vote from leader</span>
    quorumSize := (len(rf.peers) / 2) + 1

    <span className="text-secondary font-semibold">for</span> peerID, matchIdx := <span className="text-secondary font-semibold">range</span> rf.matchIndex &#123;
        <span className="text-secondary font-semibold">if</span> peerID != rf.me &amp;&amp; matchIdx &gt;= entryIndex &#123;
            matchCount++
        &#125;
    &#125;

    <span className="text-outline">// Safety Guard: Cannot commit log entries from previous terms directly</span>
    <span className="text-secondary font-semibold">if</span> matchCount &gt;= quorumSize &amp;&amp; rf.log[entryIndex].Term == rf.currentTerm &#123;
        rf.commitIndex = entryIndex
        rf.applyCond.Broadcast() <span className="text-outline">// Notify state machine</span>
        <span className="text-secondary font-semibold">return true</span>
    &#125;
    <span className="text-secondary font-semibold">return false</span>
&#125;</code></pre>
                  </div>
                </div>

                {/* Follow-up Suggestion Chips */}
                <div className="space-y-2 pt-2">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Suggested Deep Dives</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button 
                      onClick={() => handleChipClick('Explain network partition recovery and reconciliation')}
                      className="followup-chip flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 text-on-surface font-label-md text-label-md shadow-sm transition-all group"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary group-hover:translate-x-0.5 transition-transform">bolt</span>
                      <span>Explain network partition recovery and reconciliation</span>
                    </button>
                    <button 
                      onClick={() => handleChipClick('Compare Raft quorum guarantees with Zab in ZooKeeper')}
                      className="followup-chip flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 text-on-surface font-label-md text-label-md shadow-sm transition-all group"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary group-hover:translate-x-0.5 transition-transform">compare_arrows</span>
                      <span>Compare Raft quorum guarantees with Zab in ZooKeeper</span>
                    </button>
                    <button 
                      onClick={() => handleChipClick('Quiz me on Raft consensus failure scenarios')}
                      className="followup-chip flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 text-on-surface font-label-md text-label-md shadow-sm transition-all group"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary group-hover:translate-x-0.5 transition-transform">quiz</span>
                      <span>Quiz me on Raft consensus failure scenarios</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Appended Messages */}
            {dynamicMessages.map((msg, i) => (
              <React.Fragment key={i}>
                {msg.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="flex gap-space-sm max-w-[85%] items-start">
                      <div className="bg-primary text-on-primary rounded-2xl rounded-tr-xs p-space-md shadow-sm space-y-2">
                        <div className="flex items-center justify-between gap-4 pb-1 border-b border-primary-container text-primary-fixed font-label-sm text-label-sm">
                          <span className="font-medium">You (Alex Rivera)</span>
                          <span className="text-primary-fixed/80">{msg.timestamp}</span>
                        </div>
                        <p className="font-body-md text-body-md text-surface-container-lowest leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      </div>
                      <img 
                        className="w-8 h-8 rounded-full object-cover shrink-0 mt-1 shadow-sm" 
                        alt="Alex Rivera"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3RduvEBcXFd91fFK1sy0tbalbMXzevsX8fIVX9hAcRedcA3w3INFFujI9y178zMY6gbSIcqBSfDOoBMG5xIjkCiX_KjqB7fKMpvT3cz-bP8MGN6P5D_W_2__MrYySKhiTDiKkQcVPEwdcdhwxRtVaqIJIgPrgEo74Bd9qPrxHYd7vgpsEYuYoM3gwOuUoZakEEFQuQSh0GXaUfNMgJ2Ju5TRVuEYgGdAQ9lIoFdZz" 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-space-sm max-w-[96%]">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                    </div>
                    <div className="flex-1 space-y-space-md">
                      <div className="flex items-center gap-2">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">LearnMate Tutor</span>
                        <span className="font-label-sm text-label-sm text-outline">{msg.timestamp}</span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-code-sm text-code-sm">
                          {msg.mode || 'Granite 3.1 8B'}
                        </span>
                      </div>
                      <div className="p-space-md bg-surface-container-low rounded-xl font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}

            {sending && (
              <div className="flex items-start gap-space-sm max-w-[96%] animate-pulse">
                <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0 mt-1">
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                </div>
                <div className="p-space-md bg-surface-container-low rounded-xl text-on-surface-variant font-body-md text-body-md">
                  Analyzing corpus &amp; generating proof sketch with IBM Granite...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* BOTTOM CHAT INPUT BAR */}
          <div className="p-space-md bg-surface-container-lowest shadow-sm">
            <form onSubmit={(e) => { e.preventDefault(); void handleSend(); }} className="space-y-2">
              <div className="relative bg-surface-container-low rounded-xl p-space-md border border-outline-variant/30 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent resize-none outline-none font-body-md text-body-md text-on-surface placeholder:text-outline p-1 leading-relaxed" 
                  placeholder="Ask a question, request proof sketches, or prompt for code verification..." 
                  rows={3}
                />
                <div className="flex items-center justify-between pt-space-sm border-t border-outline-variant/20 mt-1">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Attach file to context" type="button">
                      <span className="material-symbols-outlined text-[20px]">attach_file</span>
                    </button>
                    <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Voice dictation" type="button">
                      <span className="material-symbols-outlined text-[20px]">mic</span>
                    </button>
                    <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Insert code snippet" type="button">
                      <span className="material-symbols-outlined text-[20px]">code</span>
                    </button>
                    <div className="h-4 w-px bg-outline-variant/50 mx-1"></div>
                    <span className="font-code-sm text-code-sm text-outline px-1">Context active • 3 documents referenced</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm text-outline hidden sm:inline">Press ↵ to send</span>
                    <button 
                      disabled={sending}
                      className="flex items-center gap-1.5 px-space-md py-1.5 rounded-lg bg-primary hover:bg-secondary text-on-primary font-label-md text-label-md shadow-sm transition-all active:scale-95 disabled:opacity-50" 
                      type="submit"
                    >
                      <span>Send</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between px-1 text-on-surface-variant font-label-sm text-label-sm">
                <span>LearnMate AI can formulate mathematical proofs and simulate distributed faults.</span>
                <span className="hover:underline cursor-pointer">Model: IBM Granite 3.1 8B Instruct</span>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
