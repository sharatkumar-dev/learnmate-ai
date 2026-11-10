import { useState } from 'react';

export function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div className="h-16 max-w-7xl mx-auto px-gutter flex items-center justify-between"><a className="flex items-center gap-space-xs group" data-path="landing-page" href="#"><div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary shadow-sm"><span className="material-symbols-outlined text-[20px]">terminal</span></div><div className="flex items-center"><span className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Learn</span><span className="font-headline-sm text-headline-sm text-primary tracking-tight">Mate</span><span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm uppercase tracking-wider">AI</span></div></a><nav className="hidden lg:flex items-center gap-space-sm" data-active-classes="bg-surface-container text-primary font-semibold rounded-lg"><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" data-path="features" href="#">Features</a><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" data-path="curriculum" href="#">Curriculum</a><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" data-path="methodology" href="#">Methodology</a><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" data-path="testimonials" href="#">Testimonials</a><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" data-path="faq" href="#">FAQ</a></nav><div className="flex items-center gap-space-sm"><a className="px-space-md py-space-sm font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors" href="/signup" data-route="sign-up">Sign In</a><a className="px-space-md py-space-sm font-label-md text-label-md bg-primary-container text-on-primary rounded-lg shadow-sm hover:bg-secondary transition-all active:scale-[0.99] flex items-center gap-1.5" data-path="sign-up" href="/signup" data-route="sign-up"><span>Start Learning Free</span><span className="material-symbols-outlined text-[16px]">arrow_forward</span></a><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main className="w-full pt-16 bg-surface flex-1"><div className="flex flex-col w-full">

<div className="relative w-full overflow-hidden">
<div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-gradient-to-b from-primary-container/15 via-secondary/5 to-transparent blur-3xl rounded-full pointer-events-none"></div>

<section className="relative max-w-7xl mx-auto px-gutter pt-space-lg pb-space-xl lg:pb-32 flex flex-col items-center text-center">

<a className="inline-flex items-center gap-space-xs px-3 py-1.5 rounded-full bg-surface-container-high text-primary hover:bg-surface-container-highest transition-colors group mb-space-md shadow-sm" data-path="curriculum" href="#">
<span className="inline-block w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
<span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">v2.4 Engine Live</span>
<span className="text-outline text-label-sm">·</span>
<span className="font-label-md text-label-md text-on-surface-variant group-hover:text-on-surface transition-colors">Autonomous Learning Graphs · 100% Free Public Beta</span>
<span className="material-symbols-outlined text-[14px] text-primary group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
</a>

<h1 className="font-display-lg text-display-lg-mobile lg:text-display-lg text-on-surface max-w-4xl tracking-tight leading-tight lg:leading-[52px]">
        Master Complex Engineering Domains with <span className="text-primary-container">AI-Calibrated</span> Learning
      </h1>
<p className="mt-space-md font-body-lg text-body-lg text-on-surface-variant max-w-2xl text-center">
        LearnMate replaces fragmented tutorials with a dynamic, DAG-based curriculum that adapts in real time to your code submissions, mental models, and knowledge gaps.
      </p>

<div className="mt-space-lg flex flex-col sm:flex-row items-center gap-space-sm w-full sm:w-auto">
<a className="w-full sm:w-auto px-space-lg py-space-sm bg-primary-container text-on-primary font-label-md text-label-md rounded-lg shadow-md hover:bg-secondary transition-all active:scale-[0.99] flex items-center justify-center gap-2" data-path="sign-up" href="/signup" data-route="sign-up">
<span>Start Learning Free</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
<a className="w-full sm:w-auto px-space-lg py-space-sm bg-surface-container-lowest text-on-surface font-label-md text-label-md rounded-lg shadow-sm hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2" href="#curriculum-showcase">
<span className="material-symbols-outlined text-[18px] text-primary">account_tree</span>
<span>Explore Interactive Curriculum</span>
</a>
</div>

<div className="mt-space-xl flex flex-col items-center gap-space-sm">
<p className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
          Trusted by 42,000+ senior engineers from top engineering teams
        </p>
<div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12 opacity-80 pt-1">
<div className="flex items-center gap-1.5 font-headline-sm text-headline-sm tracking-tight text-on-surface-variant font-bold">
<span className="material-symbols-outlined text-primary text-[20px]">insights</span> DATADOG
          </div>
<div className="flex items-center gap-1.5 font-headline-sm text-headline-sm tracking-tight text-on-surface-variant font-bold">
<span className="material-symbols-outlined text-primary text-[20px]">payments</span> Stripe
          </div>
<div className="flex items-center gap-1.5 font-headline-sm text-headline-sm tracking-tight text-on-surface-variant font-bold">
<span className="material-symbols-outlined text-primary text-[20px]">cloud_done</span> Cloudflare
          </div>
<div className="flex items-center gap-1.5 font-headline-sm text-headline-sm tracking-tight text-on-surface-variant font-bold">
<span className="material-symbols-outlined text-primary text-[20px]">brush</span> Figma
          </div>
<div className="flex items-center gap-1.5 font-headline-sm text-headline-sm tracking-tight text-on-surface-variant font-bold">
<span className="material-symbols-outlined text-primary text-[20px]">reorder</span> Linear
          </div>
</div>
</div>

<div className="w-full mt-space-xl rounded-xl bg-surface-container-lowest shadow-xl p-space-sm md:p-space-md lg:p-space-lg text-left">

<div className="flex flex-wrap items-center justify-between pb-space-sm mb-space-md gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-lg">
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-full bg-error"></span>
<span className="w-3 h-3 rounded-full bg-secondary-fixed-dim"></span>
<span className="w-3 h-3 rounded-full bg-surface-variant"></span>
<span className="ml-2 font-code-sm text-code-sm text-on-surface-variant">learnmate://sandbox/distributed-systems/raft-election.rs</span>
</div>
<div className="flex items-center gap-space-md">
<span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary bg-surface-container-high px-2 py-0.5 rounded-full font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span> Calibrated Real-Time
            </span>
<span className="font-code-sm text-code-sm text-on-surface-variant">Retention Score: <strong className="text-on-surface font-semibold">94.2%</strong></span>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">

<div className="lg:col-span-5 bg-surface-container-low rounded-lg p-space-md flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-space-sm">
<span className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-1.5">
<span className="material-symbols-outlined text-primary text-[18px]">hub</span>
                  Active DAG Path
                </span>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Level 4 / Master</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                Dynamic dependency node graph generated from your initial diagnostic on Distributed State Machines.
              </p>

<div className="space-y-space-sm">

<div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-lowest shadow-sm">
<div className="w-7 h-7 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[16px]">check</span>
</div>
<div className="flex-1 min-w-0">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-headline-sm text-on-surface">Linearizability &amp; Clocks</span>
<span className="font-code-sm text-code-sm text-primary font-semibold">100%</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant truncate block">Lamport timestamps, Vector clocks, Partial orders</span>
</div>
</div>

<div className="w-0.5 h-3 bg-primary-container ml-4 -my-1"></div>

<div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-high shadow-md">
<div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 animate-pulse">
<span className="material-symbols-outlined text-[16px]">bolt</span>
</div>
<div className="flex-1 min-w-0">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-headline-sm text-primary font-bold">Raft Consensus Algorithm</span>
<span className="font-label-sm text-label-sm uppercase bg-primary-container text-on-primary px-1.5 py-0.5 rounded font-semibold">Live</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant truncate block">Leader election, Log replication &amp; Split brain</span>
</div>
</div>

<div className="w-0.5 h-3 bg-outline-variant ml-4 -my-1"></div>

<div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-lowest opacity-85">
<div className="w-7 h-7 rounded-full bg-surface-variant text-on-surface flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[16px]">lock_open</span>
</div>
<div className="flex-1 min-w-0">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-headline-sm text-on-surface">Byzantine Fault Tolerance</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">Prerequisite Met</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant truncate block">PBFT, Quorum intersection, Sybil resistance</span>
</div>
</div>
</div>
</div>

<div className="mt-space-md pt-space-sm">
<div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-1">
<span>Distributed Systems Track Progression</span>
<span className="font-semibold text-on-surface">68% Completed</span>
</div>
<div className="w-full h-2 rounded-full bg-surface-variant overflow-hidden">
<div className="h-full bg-primary-container rounded-full" style={{"width":"68%"}}></div>
</div>
</div>
</div>

<div className="lg:col-span-7 flex flex-col gap-space-sm">

<div className="bg-inverse-surface rounded-lg p-space-md text-inverse-on-surface font-code-sm text-code-sm overflow-x-auto shadow-inner">
<div className="flex justify-between items-center pb-2 mb-2 opacity-75">
<span className="text-surface-variant font-mono">src/consensus/election.rs</span>
<span className="text-secondary-fixed">Rust 1.78</span>
</div>
<pre className="leading-relaxed"><code><span className="text-outline-variant">// Invariant: Only one leader per term</span>
<span className="text-secondary-fixed">pub async fn</span> <span className="text-surface-bright font-bold">start_election</span>(&amp;<span className="text-secondary-fixed">mut self</span>) -&gt; Result&lt;Role, ConsensusError&gt; &#123;
    <span className="text-secondary-fixed">self</span>.current_term += <span className="text-tertiary-fixed">1</span>;
    <span className="text-secondary-fixed">self</span>.voted_for = <span className="text-surface-variant">Some</span>(<span className="text-secondary-fixed">self</span>.node_id);
    <span className="text-secondary-fixed">let</span> mut votes_received = <span className="text-tertiary-fixed">1</span>;

    <span className="text-outline-variant">// Broadcast RequestVote RPCs in parallel</span>
    <span className="text-secondary-fixed">for</span> peer <span className="text-secondary-fixed">in</span> &amp;<span className="text-secondary-fixed">self</span>.peers &#123;
        <span className="text-secondary-fixed">if</span> <span className="text-secondary-fixed">let</span> <span className="text-surface-variant">Ok</span>(vote) = peer.request_vote(<span className="text-secondary-fixed">self</span>.current_term).<span className="text-secondary-fixed">await</span> &#123;
            <span className="text-secondary-fixed">if</span> vote.term &gt; <span className="text-secondary-fixed">self</span>.current_term &#123;
                <span className="text-secondary-fixed">self</span>.step_down(vote.term);
                <span className="text-secondary-fixed">return</span> <span className="text-surface-variant">Ok</span>(Role::Follower);
            &#125;
        &#125;
    &#125;
&#125;</code></pre>
</div>

<div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm">
<div className="flex items-start gap-3">
<div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[18px]">psychology</span>
</div>
<div className="space-y-1">
<div className="flex items-center gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface">LearnMate Engine Note</span>
<span className="font-label-sm text-label-sm bg-surface-container text-primary px-2 py-0.5 rounded-full font-semibold">AST Invariant Detection</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                    Notice line 9: if a candidate receives votes from a stale network partition, what prevents an asynchronous heartbeat race condition? Revisit the <strong className="text-on-surface">Majority Quorum Verification</strong> proof before committing state.
                  </p>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
</div>

<section className="w-full bg-surface-container-low py-space-xl lg:py-28">
<div className="max-w-7xl mx-auto px-gutter">

<div className="max-w-2xl mb-space-xl">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">Pedagogical Paradigm</span>
<h2 className="font-headline-xl text-headline-xl-mobile lg:text-headline-xl text-on-surface mt-space-xs tracking-tight">
          Engineered for Deep Retention, Not Passive Consumption
        </h2>
<p className="font-body-lg text-body-lg text-on-surface-variant mt-space-xs">
          Traditional courses serve static 40-hour video playlists that evaporate in 3 weeks. LearnMate operates as a dialectic sparring partner tailored to your cognitive threshold.
        </p>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">

<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div>
<div className="w-12 h-12 rounded-lg bg-surface-container-high text-primary flex items-center justify-center mb-space-md">
<span className="material-symbols-outlined text-[26px]">account_tree</span>
</div>
<h3 className="font-headline-lg text-headline-lg text-on-surface">Adaptive Knowledge Graphs</h3>
<p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
              Curriculums are directed acyclic graphs (DAGs), not linear tracks. When you stumble on distributed consensus, the engine dynamically constructs sub-paths for state machines and vector clocks before moving forward.
            </p>
</div>
<div className="mt-space-lg pt-space-sm bg-surface-container rounded-lg p-space-sm">
<div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
<span>Graph Node Calibration</span>
<span className="text-primary font-semibold font-code-sm">Dynamic DAG</span>
</div>
</div>
</div>

<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div>
<div className="w-12 h-12 rounded-lg bg-surface-container-high text-primary flex items-center justify-center mb-space-md">
<span className="material-symbols-outlined text-[26px]">terminal</span>
</div>
<h3 className="font-headline-lg text-headline-lg text-on-surface">Context-Aware AI Tutor</h3>
<p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
              Unlike generic chatbots that paste code solutions, LearnMate analyzes your Abstract Syntax Tree, points out race conditions, asks Socratic counter-questions, and verifies invariant proofs.
            </p>
</div>
<div className="mt-space-lg pt-space-sm bg-surface-container rounded-lg p-space-sm">
<div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
<span>AST Diagnostic Engine</span>
<span className="text-primary font-semibold font-code-sm">Non-Generative Help</span>
</div>
</div>
</div>

<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div>
<div className="w-12 h-12 rounded-lg bg-surface-container-high text-primary flex items-center justify-center mb-space-md">
<span className="material-symbols-outlined text-[26px]">history_edu</span>
</div>
<h3 className="font-headline-lg text-headline-lg text-on-surface">Spaced Retrieval Engine</h3>
<p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
              Mathematical Ebbinghaus decay tracking schedules target micro-challenges at the exact threshold before a concept fades from synaptic memory. You permanently retain what you learn.
            </p>
</div>
<div className="mt-space-lg pt-space-sm bg-surface-container rounded-lg p-space-sm">
<div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
<span>Memory Decay Half-Life</span>
<span className="text-primary font-semibold font-code-sm">SuperMemo SM-2</span>
</div>
</div>
</div>
</div>
</div>
</section>

<section className="w-full py-space-xl lg:py-28 bg-surface" id="curriculum-showcase">
<div className="max-w-7xl mx-auto px-gutter">
<div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
<div>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">Specialized Tracks</span>
<h2 className="font-headline-xl text-headline-xl-mobile lg:text-headline-xl text-on-surface mt-space-xs tracking-tight">
            Curriculums Designed for Principal-Track Engineers
          </h2>
<p className="font-body-lg text-body-lg text-on-surface-variant mt-space-xs max-w-xl">
            Zero beginner toy projects. Build production-grade consensus engines, low-level compilers, and distributed stores from first principles.
          </p>
</div>
<a className="inline-flex items-center gap-1.5 font-label-md text-label-md text-primary hover:underline font-semibold self-start md:self-auto" data-path="curriculum" href="#">
<span>View All 16 Available Tracks</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>

<div className="flex overflow-x-auto gap-space-xs pb-space-sm mb-space-lg no-scrollbar">
<button className="px-space-md py-space-xs rounded-lg font-label-md text-label-md bg-surface-container-high text-primary font-semibold shadow-sm shrink-0 flex items-center gap-2" id="tab-btn-dist">
<span className="material-symbols-outlined text-[18px]">dns</span>
          Distributed Systems &amp; Consensus
        </button>
<button className="px-space-md py-space-xs rounded-lg font-label-md text-label-md bg-surface-container-low text-on-surface-variant hover:text-on-surface shrink-0 flex items-center gap-2 transition-colors" id="tab-btn-sys">
<span className="material-symbols-outlined text-[18px]">memory</span>
          Systems Architecture &amp; C++
        </button>
<button className="px-space-md py-space-xs rounded-lg font-label-md text-label-md bg-surface-container-low text-on-surface-variant hover:text-on-surface shrink-0 flex items-center gap-2 transition-colors" id="tab-btn-ai">
<span className="material-symbols-outlined text-[18px]">neurology</span>
          Production LLM Infrastructure
        </button>
<button className="px-space-md py-space-xs rounded-lg font-label-md text-label-md bg-surface-container-low text-on-surface-variant hover:text-on-surface shrink-0 flex items-center gap-2 transition-colors" id="tab-btn-db">
<span className="material-symbols-outlined text-[18px]">database</span>
          High-Throughput Storage Engines
        </button>
</div>

<div className="bg-surface-container-lowest rounded-xl p-space-lg lg:p-space-xl shadow-lg">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">

<div className="lg:col-span-7 flex flex-col justify-between">
<div>
<div className="flex flex-wrap items-center gap-space-xs mb-space-sm">
<span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold uppercase tracking-wider">Advanced</span>
<span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">28 Estimated Hours</span>
<span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">Rust / Go Execution</span>
</div>
<h3 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                Distributed Consensus, Replicated State Machines &amp; Fault Tolerance
              </h3>
<p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
                Implement a battle-tested Raft implementation conforming strictly to Diego Ongaro’s Stanford doctoral thesis. Handle log compaction, asynchronous heartbeats, split votes under simulated packet dropouts, and multi-datacenter quorum failovers.
              </p>

<div className="mt-space-lg space-y-space-xs">
<div className="flex items-center gap-space-sm font-body-sm text-body-sm text-on-surface">
<span className="material-symbols-outlined text-primary text-[18px]">verified</span>
<span>Module 1: Atomic Broadcast, Total Order, and Lamport Clock Proofs</span>
</div>
<div className="flex items-center gap-space-sm font-body-sm text-body-sm text-on-surface">
<span className="material-symbols-outlined text-primary text-[18px]">verified</span>
<span>Module 2: Building Raft Consensus Engine with Network Fault Injection</span>
</div>
<div className="flex items-center gap-space-sm font-body-sm text-body-sm text-on-surface">
<span className="material-symbols-outlined text-primary text-[18px]">verified</span>
<span>Module 3: Multi-Paxos Invariants and Viewstamped Replication Protocols</span>
</div>
<div className="flex items-center gap-space-sm font-body-sm text-body-sm text-on-surface">
<span className="material-symbols-outlined text-primary text-[18px]">verified</span>
<span>Module 4: Byzantine Agreement &amp; Gossip Protocol Convergence Rates</span>
</div>
</div>
</div>

<div className="mt-space-lg pt-space-md flex flex-wrap items-center gap-space-md">
<a className="px-space-md py-space-sm bg-primary-container text-on-primary font-label-md text-label-md rounded-lg shadow-sm hover:bg-secondary transition-all flex items-center gap-2" data-path="sign-up" href="/signup" data-route="sign-up">
<span>Enroll in This Track (Free)</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
<span className="font-body-sm text-body-sm text-on-surface-variant">Includes 12 diagnostic sandboxes &amp; verified peer completion credential</span>
</div>
</div>

<div className="lg:col-span-5 bg-surface-container-low p-space-lg rounded-xl flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-space-md">
<span className="font-headline-sm text-headline-sm text-on-surface">Track Analytics</span>
<span className="font-code-sm text-code-sm text-primary font-semibold">14,820 Active Engineers</span>
</div>

<div className="space-y-space-md">
<div>
<div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-1">
<span>Average Concept Retention (90-Day Audit)</span>
<span className="font-semibold text-on-surface">91.4%</span>
</div>

<div className="w-full h-3 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-primary-container rounded-full" style={{"width":"91.4%"}}></div>
</div>
</div>

<div className="p-space-sm bg-surface-container-lowest rounded-lg shadow-sm">
<div className="flex justify-between items-center text-label-sm font-label-sm text-on-surface-variant mb-2">
<span>Memory Decay Curve vs LearnMate Spaced Model</span>
<span className="text-primary font-semibold">LearnMate Curve (+210%)</span>
</div>
<svg className="w-full h-24 text-primary" fill="none" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">

<path d="M10 20 C 50 65, 150 75, 290 75" stroke="#777587" strokeDasharray="4 4" strokeWidth="2"></path>

<path d="M10 20 C 40 40, 60 50, 70 50 L 70 20 C 110 38, 140 45, 150 45 L 150 18 C 200 30, 240 35, 290 32" stroke="currentColor" strokeWidth="2.5"></path>

<circle cx="70" cy="20" fill="currentColor" r="3"></circle>
<circle cx="150" cy="18" fill="currentColor" r="3"></circle>
<circle cx="290" cy="32" fill="currentColor" r="3"></circle>
</svg>
<div className="flex justify-between font-code-sm text-code-sm text-outline mt-1">
<span>Day 1</span>
<span>Day 7</span>
<span>Day 30</span>
<span>Day 90</span>
</div>
</div>
</div>
</div>

<div className="mt-space-md pt-space-sm">
<p className="font-body-sm text-body-sm text-on-surface-variant italic">
                “The consensus track untangled Paxos proofs that 3 different books failed to demystify. The AST race condition feedback saved me days.”
              </p>
<div className="mt-2 flex items-center gap-2">
<div className="w-6 h-6 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm flex items-center justify-center font-bold">
                  SK
                </div>
<span className="font-label-sm text-label-sm font-semibold text-on-surface">Staff Engineer, Observability Infrastructure</span>
</div>
</div>
</div>
</div>
</div>
</div>
</section>

<section className="w-full py-space-xl lg:py-28 bg-surface-container-low">
<div className="max-w-7xl mx-auto px-gutter space-y-24">

<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
<div className="lg:col-span-6 space-y-space-md">
<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold uppercase tracking-wider">
            Pillar 01 · Dialectic Intelligence
          </div>
<h2 className="font-headline-xl text-headline-xl-mobile lg:text-headline-xl text-on-surface tracking-tight">
            An AI Mentor That Challenges Invariants, Never Simply Giving Away Answers
          </h2>
<p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Most LLM coding tools build mental atrophy by auto-completing code. LearnMate’s learning companion uses Socratic questioning to evaluate your mental models, guiding you to locate memory leaks, deadlock vulnerabilities, and distributed synchronization traps on your own.
          </p>
<ul className="space-y-space-xs font-body-md text-body-md text-on-surface">
<li className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
<span>Evaluates runtime memory usage and cache locality in your solutions</span>
</li>
<li className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
<span>Generates pathological stress-test cases to break weak assumptions</span>
</li>
<li className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
<span>Integrates directly with your browser sandbox CLI with instant feedback</span>
</li>
</ul>
</div>
<div className="lg:col-span-6 bg-surface-container-lowest p-space-lg rounded-xl shadow-lg">
<div className="space-y-space-sm">
<div className="p-space-sm rounded-lg bg-surface-container-low text-on-surface text-body-sm font-body-sm">
<strong className="font-semibold text-primary block mb-1">Your Submission:</strong>
<code className="font-code-sm text-code-sm block text-on-surface bg-surface-container-lowest p-2 rounded">
                if votes &gt; (nodes.len() / 2) &#123; self.state = State::Leader; &#125;
              </code>
</div>
<div className="p-space-sm rounded-lg bg-surface-container text-on-surface text-body-sm font-body-sm">
<div className="flex items-center gap-2 mb-1">
<span className="material-symbols-outlined text-primary text-[18px]">terminal</span>
<span className="font-semibold text-on-surface">Mentor Dialectic Probe</span>
</div>
<p className="text-on-surface-variant">
                Suppose a network partition splits 5 nodes into partitions &#123;A, B&#125; and &#123;C, D, E&#125;. If node A and node C both trigger an election simultaneously at term T, how does integer division guarantee uniqueness if a node drops out during the vote tally?
              </p>
<div className="mt-2 flex gap-2">
<span className="font-label-sm text-label-sm bg-surface-container-highest px-2 py-0.5 rounded text-primary font-semibold">Invariant #4 Checked</span>
<span className="font-label-sm text-label-sm bg-surface-container-highest px-2 py-0.5 rounded text-on-surface-variant">Quorum Size Strict Check</span>
</div>
</div>
</div>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
<div className="lg:col-span-6 lg:order-2 space-y-space-md">
<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold uppercase tracking-wider">
            Pillar 02 · Cognitive Science
          </div>
<h2 className="font-headline-xl text-headline-xl-mobile lg:text-headline-xl text-on-surface tracking-tight">
            Retention Heatmaps Engineered with Ebbinghaus Spacing Algorithms
          </h2>
<p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Every technical architecture concept you master is logged into your personal cognitive matrix. When a high-leverage concept approaches predicted recall decay, LearnMate injects a 3-minute diagnostic sprint into your dashboard to solidify synaptic pathways.
          </p>
<div className="grid grid-cols-2 gap-space-sm pt-2">
<div className="p-space-sm bg-surface-container-lowest rounded-lg shadow-sm">
<span className="font-headline-lg text-headline-lg text-primary font-bold">89%</span>
<span className="block font-body-sm text-body-sm text-on-surface-variant">Course Completion Rate (vs 12% industry baseline)</span>
</div>
<div className="p-space-sm bg-surface-container-lowest rounded-lg shadow-sm">
<span className="font-headline-lg text-headline-lg text-primary font-bold">3.4x</span>
<span className="block font-body-sm text-body-sm text-on-surface-variant">Long-Term Retention after 6 Months</span>
</div>
</div>
</div>
<div className="lg:col-span-6 lg:order-1 bg-surface-container-lowest p-space-lg rounded-xl shadow-lg">
<div className="flex items-center justify-between mb-space-md">
<span className="font-headline-sm text-headline-sm text-on-surface">Synaptic Retention Matrix</span>
<span className="font-code-sm text-code-sm text-primary font-semibold">Active Streak: 41 Days</span>
</div>

<div className="space-y-2">
<div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
<span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
</div>
<div className="grid grid-cols-7 gap-1.5">
<div className="h-6 rounded bg-primary-container"></div>
<div className="h-6 rounded bg-primary-container"></div>
<div className="h-6 rounded bg-surface-variant"></div>
<div className="h-6 rounded bg-primary-container"></div>
<div className="h-6 rounded bg-primary-container"></div>
<div className="h-6 rounded bg-primary-container"></div>
<div className="h-6 rounded bg-primary-container"></div>
<div className="h-6 rounded bg-primary-container"></div>
<div className="h-6 rounded bg-primary-container"></div>
<div className="h-6 rounded bg-primary-container"></div>
<div className="h-6 rounded bg-surface-variant"></div>
<div className="h-6 rounded bg-primary-container"></div>
<div className="h-6 rounded bg-primary-container"></div>
<div className="h-6 rounded bg-primary-container"></div>
<div className="h-6 rounded bg-primary-container"></div>
<div className="h-6 rounded bg-primary-container"></div>
<div className="h-6 rounded bg-primary-container"></div>
<div className="h-6 rounded bg-primary-container"></div>
<div className="h-6 rounded bg-primary-container"></div>
<div className="h-6 rounded bg-surface-container-high"></div>
<div className="h-6 rounded bg-primary-container"></div>
</div>
</div>

<div className="mt-space-md p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[20px]">notifications_active</span>
<span className="font-body-sm text-body-sm text-on-surface font-medium">Memory Alert: Lamport Invariant Review Due</span>
</div>
<a className="font-label-sm text-label-sm px-2.5 py-1 bg-primary text-on-primary rounded font-semibold hover:bg-primary-container transition-colors" data-path="curriculum" href="#">
              Review (2m)
            </a>
</div>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
<div className="lg:col-span-6 space-y-space-md">
<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold uppercase tracking-wider">
            Pillar 03 · Original Literature
          </div>
<h2 className="font-headline-xl text-headline-xl-mobile lg:text-headline-xl text-on-surface tracking-tight">
            Learn from Foundational RFCs and Systems Whitepapers
          </h2>
<p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Master the canonical literature of modern computation. LearnMate enriches original papers—from Google’s Spanner and DynamoDB to Kafka and the Raft doctoral thesis—with interactive inline runnable proofs, margin annotations, and AST execution widgets.
          </p>
<div className="flex items-center gap-space-md pt-2">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[20px]">library_books</span>
<span className="font-body-sm text-body-sm font-semibold text-on-surface">180+ Annotated Whitepapers</span>
</div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[20px]">play_circle</span>
<span className="font-body-sm text-body-sm font-semibold text-on-surface">Runnable Simulation Proofs</span>
</div>
</div>
</div>
<div className="lg:col-span-6 bg-surface-container-lowest p-space-lg rounded-xl shadow-lg space-y-space-sm">

<div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between hover:bg-surface-container transition-colors">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded bg-primary-container text-on-primary flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[20px]">article</span>
</div>
<div>
<h4 className="font-headline-sm text-headline-sm text-on-surface">In Search of an Understandable Consensus Algorithm</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Diego Ongaro &amp; John Ousterhout (Stanford University)</p>
</div>
</div>
<span className="font-code-sm text-code-sm text-primary font-semibold">Raft (2014)</span>
</div>

<div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between hover:bg-surface-container transition-colors">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded bg-secondary-container text-on-secondary flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[20px]">article</span>
</div>
<div>
<h4 className="font-headline-sm text-headline-sm text-on-surface">Spanner: Google’s Globally-Distributed Database</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Corbett et al. (Google Inc.)</p>
</div>
</div>
<span className="font-code-sm text-code-sm text-primary font-semibold">TrueTime (2012)</span>
</div>

<div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between hover:bg-surface-container transition-colors">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded bg-surface-container-highest text-primary flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[20px]">article</span>
</div>
<div>
<h4 className="font-headline-sm text-headline-sm text-on-surface">Dynamo: Amazon’s Highly Available Key-value Store</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">DeCandia et al. (Amazon)</p>
</div>
</div>
<span className="font-code-sm text-code-sm text-primary font-semibold">SLA Quorum (2007)</span>
</div>
</div>
</div>
</div>
</section>

<section className="w-full py-space-xl lg:py-28 bg-surface">
<div className="max-w-7xl mx-auto px-gutter">

<div className="text-center max-w-3xl mx-auto mb-space-xl">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">Engineered Peer Reviews</span>
<h2 className="font-headline-xl text-headline-xl-mobile lg:text-headline-xl text-on-surface mt-space-xs tracking-tight">
          How Senior Engineers Use LearnMate to Leap Domains
        </h2>
<p className="font-body-lg text-body-lg text-on-surface-variant mt-space-xs">
          Read verified feedback from Principal Engineers, Engineering Managers, and Tech Leads.
        </p>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">

<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col justify-between">
<div>
<div className="flex items-center gap-1 text-primary mb-space-sm">
<span className="material-symbols-outlined text-[18px]">star</span>
<span className="material-symbols-outlined text-[18px]">star</span>
<span className="material-symbols-outlined text-[18px]">star</span>
<span className="material-symbols-outlined text-[18px]">star</span>
<span className="material-symbols-outlined text-[18px]">star</span>
</div>
<p className="font-body-md text-body-md text-on-surface leading-relaxed">
              “We were designing a distributed ledger infrastructure at Stripe and needed our backend team to internalize Paxos and Byzantine Fault Tolerance quickly. LearnMate condensed what would have taken months of dense reading into 3 weeks of crisp interactive proofs.”
            </p>
</div>
<div className="mt-space-lg pt-space-sm flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">
              AL
            </div>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface">Alexei Levin</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Staff Infrastructure Engineer · Stripe</div>
</div>
</div>
</div>

<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col justify-between">
<div>
<div className="flex items-center gap-1 text-primary mb-space-sm">
<span className="material-symbols-outlined text-[18px]">star</span>
<span className="material-symbols-outlined text-[18px]">star</span>
<span className="material-symbols-outlined text-[18px]">star</span>
<span className="material-symbols-outlined text-[18px]">star</span>
<span className="material-symbols-outlined text-[18px]">star</span>
</div>
<p className="font-body-md text-body-md text-on-surface leading-relaxed">
              “The AI companion is shockingly good. When I wrote an inefficient lockless ring buffer in C++, it didn’t just suggest the fix; it pointed out the exact x86 memory reordering instruction that would cause an invalid read on ARM CPUs. Pure craft.”
            </p>
</div>
<div className="mt-space-lg pt-space-sm flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold">
              MV
            </div>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface">Maya Verma</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Principal Systems Architect · Cloudflare</div>
</div>
</div>
</div>

<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col justify-between">
<div>
<div className="flex items-center gap-1 text-primary mb-space-sm">
<span className="material-symbols-outlined text-[18px]">star</span>
<span className="material-symbols-outlined text-[18px]">star</span>
<span className="material-symbols-outlined text-[18px]">star</span>
<span className="material-symbols-outlined text-[18px]">star</span>
<span className="material-symbols-outlined text-[18px]">star</span>
</div>
<p className="font-body-md text-body-md text-on-surface leading-relaxed">
              “The spaced repetition retention tracker is what sets LearnMate light years apart. I took the LLMOps &amp; Quantization track 4 months ago and I still remember vLLM PagedAttention details effortlessly because of the scheduled micro-sparks.”
            </p>
</div>
<div className="mt-space-lg pt-space-sm flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold">
              DC
            </div>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface">David Chen</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Lead AI Platform Engineer · Datadog</div>
</div>
</div>
</div>
</div>
</div>
</section>

<section className="w-full py-space-xl lg:py-28 bg-surface-container-low">
<div className="max-w-4xl mx-auto px-gutter">
<div className="text-center mb-space-xl">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">Questions &amp; Clarity</span>
<h2 className="font-headline-xl text-headline-xl-mobile lg:text-headline-xl text-on-surface mt-space-xs tracking-tight">
          Frequently Asked Questions
        </h2>
<p className="font-body-lg text-body-lg text-on-surface-variant mt-space-xs">
          Everything you need to know about our pedagogy, beta access, and technical setup.
        </p>
</div>

<div className="space-y-space-sm" id="faq-container">

<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm transition-all">
<button className="w-full flex items-center justify-between text-left font-headline-sm text-headline-sm text-on-surface focus:outline-none" onClick={() => toggleFaq(0)}>
<span>Is LearnMate really completely free for individual learners?</span>
<span className="material-symbols-outlined text-on-surface-variant transform transition-transform">expand_more</span>
</button>
<div className="mt-space-sm font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Yes. All individual self-directed tracks, sandboxes, AI companion turns, and spaced repetition engines are 100% free during our public beta. In the future, we will offer dedicated enterprise workspaces with private team tracks and SSO, while individual learning remains free forever.
          </div>
</div>

<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm transition-all">
<button className="w-full flex items-center justify-between text-left font-headline-sm text-headline-sm text-on-surface focus:outline-none" onClick={() => toggleFaq(1)}>
<span>How does the AI calibration detect my specific knowledge gaps?</span>
<span className="material-symbols-outlined text-on-surface-variant transform transition-transform">expand_more</span>
</button>
<div className="mt-space-sm font-body-md text-body-md text-on-surface-variant leading-relaxed">
            When you enter a track, you can run a 6-minute diagnostic coding scenario. LearnMate’s AST parser and invariant checking evaluate not just whether tests pass, but how you handle edge cases, synchronization invariants, memory allocations, and algorithmic complexity. It maps your competency directly into our DAG.
          </div>
</div>

<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm transition-all">
<button className="w-full flex items-center justify-between text-left font-headline-sm text-headline-sm text-on-surface focus:outline-none" onClick={() => toggleFaq(2)}>
<span>How does LearnMate compare to video courses like Coursera or Udemy?</span>
<span className="material-symbols-outlined text-on-surface-variant transform transition-transform">expand_more</span>
</button>
<div className="mt-space-sm font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Video courses are non-interactive broadcast media with average completion rates under 12%. LearnMate is an active retrieval system: every concept involves code execution, architecture diagramming, and real-time dialectic critique. You build working systems from commit zero.
          </div>
</div>

<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm transition-all">
<button className="w-full flex items-center justify-between text-left font-headline-sm text-headline-sm text-on-surface focus:outline-none" onClick={() => toggleFaq(3)}>
<span>Can I export my completed roadmaps and code implementations?</span>
<span className="material-symbols-outlined text-on-surface-variant transform transition-transform">expand_more</span>
</button>
<div className="mt-space-sm font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Absolutely. Every track builds toward a full production repository (e.g., a runnable Raft consensus engine in Rust or a vectorized KV store in C++). You can sync your implementations directly to your GitHub account with a single click.
          </div>
</div>
</div>
</div>
</section>

<section className="w-full py-space-xl lg:py-28 bg-surface">
<div className="max-w-7xl mx-auto px-gutter">
<div className="relative overflow-hidden rounded-2xl bg-inverse-surface text-inverse-on-surface p-space-xl lg:p-24 shadow-2xl flex flex-col items-center text-center">

<div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl pointer-events-none"></div>
<span className="relative px-3 py-1 rounded-full bg-surface-container-high/10 text-primary-fixed font-label-sm text-label-sm uppercase tracking-wider font-semibold mb-space-sm">
          No Credit Card Required · Full Free Access
        </span>
<h2 className="relative font-display-lg text-display-lg-mobile lg:text-display-lg text-surface-bright max-w-3xl tracking-tight leading-tight lg:leading-[52px]">
          Accelerate Your Engineering Mastery Today
        </h2>
<p className="relative font-body-lg text-body-lg text-outline-variant max-w-xl mt-space-md">
          Join 42,000+ senior engineers building deep, resilient mental models through AI-calibrated knowledge graphs.
        </p>

<div className="relative mt-space-xl flex flex-col sm:flex-row items-center gap-space-sm w-full sm:w-auto">
<a className="w-full sm:w-auto px-8 py-3.5 bg-primary-container text-on-primary font-label-md text-label-md rounded-lg shadow-lg hover:bg-secondary transition-all active:scale-[0.99] flex items-center justify-center gap-2 font-semibold" data-path="sign-up" href="/signup" data-route="sign-up">
<span>Create Your Free Account</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
<a className="w-full sm:w-auto px-6 py-3.5 bg-surface-container-high/15 text-surface-bright font-label-md text-label-md rounded-lg hover:bg-surface-container-high/25 transition-colors flex items-center justify-center gap-2" data-path="curriculum" href="#">
<span>Browse Track Directory</span>
</a>
</div>
<div className="relative mt-space-lg flex items-center gap-space-md text-outline-variant font-label-sm text-label-sm">
<span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed"></span> Instant Access</span>
<span>·</span>
<span>Zero Installation Required</span>
<span>·</span>
<span>Browser Terminal Sandbox</span>
</div>
</div>
</div>
</section>


</div></main><footer className="w-full bg-surface-container-low text-on-surface-variant"><div className="max-w-7xl mx-auto px-gutter pt-space-xl pb-space-lg"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl pb-space-xl"><div className="lg:col-span-2 space-y-space-md"><div className="flex items-center gap-space-xs"><div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary"><span className="material-symbols-outlined text-[20px]">terminal</span></div><div className="flex items-center"><span className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Learn</span><span className="font-headline-sm text-headline-sm text-primary tracking-tight">Mate</span></div></div><p className="font-body-md text-body-md text-on-surface-variant max-w-sm">Adaptive, real-time AI mentoring engineered for senior software engineers, architects, and technical leaders.</p><div className="flex items-center gap-space-xs text-on-surface-variant"><div className="w-2 h-2 rounded-full bg-secondary"></div><span className="font-code-sm text-code-sm">Models synchronized with latest runtime APIs</span></div></div><div className="space-y-space-sm"><div className="font-headline-sm text-headline-sm text-on-surface">Product</div><ul className="space-y-space-xs font-body-sm text-body-sm"><li className="py-0.5"><a className="hover:text-on-surface transition-colors" data-path="features" href="#">Interactive Playground</a></li><li className="py-0.5"><a className="hover:text-on-surface transition-colors" data-path="curriculum" href="#">Track Catalog</a></li><li className="py-0.5"><a className="hover:text-on-surface transition-colors" data-path="methodology" href="#">Adaptive Engine</a></li><li className="py-0.5"><a className="hover:text-on-surface transition-colors" data-path="testimonials" href="#">Enterprise Reviews</a></li><li className="py-0.5"><a className="hover:text-on-surface transition-colors" data-path="faq" href="#">Learning FAQ</a></li></ul></div><div className="space-y-space-sm"><div className="font-headline-sm text-headline-sm text-on-surface">Engineering Tracks</div><ul className="space-y-space-xs font-body-sm text-body-sm"><li className="py-0.5"><a className="hover:text-on-surface transition-colors" data-path="curriculum" href="#">Distributed Systems</a></li><li className="py-0.5"><a className="hover:text-on-surface transition-colors" data-path="curriculum" href="#">Kubernetes &amp; Cloud Ops</a></li><li className="py-0.5"><a className="hover:text-on-surface transition-colors" data-path="curriculum" href="#">Rust Performance</a></li><li className="py-0.5"><a className="hover:text-on-surface transition-colors" data-path="curriculum" href="#">Generative AI &amp; LLMOps</a></li><li className="py-0.5"><a className="hover:text-on-surface transition-colors" data-path="curriculum" href="#">Compiler Architecture</a></li></ul></div><div className="space-y-space-sm"><div className="font-headline-sm text-headline-sm text-on-surface">Community &amp; Legal</div><ul className="space-y-space-xs font-body-sm text-body-sm"><li className="py-0.5"><a className="hover:text-on-surface transition-colors" data-path="terms-of-service" href="#">Terms of Service</a></li><li className="py-0.5"><a className="hover:text-on-surface transition-colors" data-path="privacy-policy" href="#">Privacy Policy</a></li><li className="py-0.5"><a className="hover:text-on-surface transition-colors" data-path="security" href="#">Security Standards</a></li><li className="py-0.5"><a className="hover:text-on-surface transition-colors" data-path="faq" href="#">Engineering Discord</a></li><li className="py-0.5"><a className="hover:text-on-surface transition-colors" data-path="faq" href="#">Open Source Kernels</a></li></ul></div></div><div className="pt-space-md flex flex-col md:flex-row items-center justify-between gap-space-sm font-label-sm text-label-sm text-on-surface-variant"><p>© 2025 LearnMate Inc. All engineering rights reserved.</p><div className="flex items-center gap-space-md"><span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>System Operational</span><span>v4.12-prod</span></div></div></div></footer>


    </div>
  );
}
