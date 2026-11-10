export function Settings() {
  return (
    <>
      <div className="flex flex-col w-full pb-16">

<div className="relative w-full">
<div className="absolute -top-6 left-1/4 w-96 h-48 bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
<div className="absolute -top-10 right-10 w-72 h-44 bg-surface-container-high/60 rounded-full blur-2xl pointer-events-none -z-10"></div>
</div>

<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
<div>
<div className="flex items-center gap-2 mb-1"><span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Workspace</span><span className="text-outline-variant">/</span><span className="font-label-sm text-label-sm text-primary font-medium">Settings &amp; Preferences</span></div>
<h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Settings &amp; Preferences</h1>
<p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1">Manage your account credentials, AI companion parameters, notification cadences, and system integrations.</p>
</div>

<div className="flex items-center gap-space-sm bg-surface-container-lowest shadow-sm rounded-xl px-space-md py-2 self-start md:self-auto"><span className="relative flex h-2 w-2"><span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span></span><span className="font-label-md text-label-md text-on-surface font-medium">Cloud Sync Active</span></div>
</div>

<div className="w-full bg-surface-container-lowest shadow-sm rounded-xl p-1.5 mb-space-xl overflow-x-auto">
<div className="flex items-center gap-1 min-w-max">
<button className="flex items-center gap-2 px-space-md py-2 rounded-lg bg-surface-container text-primary font-label-md text-label-md transition-all">
<span className="material-symbols-outlined text-[18px]">badge</span>
<span>General &amp; Profile</span>
</button>
<button className="flex items-center gap-2 px-space-md py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-label-md text-label-md transition-all">
<span className="material-symbols-outlined text-[18px]">neurology</span>
<span>AI Companion &amp; Model</span>
</button>
<button className="flex items-center gap-2 px-space-md py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-label-md text-label-md transition-all">
<span className="material-symbols-outlined text-[18px]">pace</span>
<span>Goals &amp; Cadence</span>
</button>
<button className="flex items-center gap-2 px-space-md py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-label-md text-label-md transition-all">
<span className="material-symbols-outlined text-[18px]">notifications_active</span>
<span>Notifications</span>
</button>

<button className="flex items-center gap-2 px-space-md py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-label-md text-label-md transition-all">
<span className="material-symbols-outlined text-[18px]">cable</span>
<span>API &amp; Integrations</span>
</button>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">

<div className="lg:col-span-8 space-y-space-lg">

<section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
<div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-low/40 -mx-space-lg -mt-space-lg p-space-lg rounded-t-xl">
<div className="flex items-center gap-3">
<div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[20px]">person</span>
</div>
<div>
<h2 className="font-headline-sm text-headline-sm text-on-surface">Profile &amp; Account Overview</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">Update your public persona, technical domains, and linked VCS accounts.</p>
</div>
</div>
<span className="font-code-sm text-code-sm px-2.5 py-1 rounded bg-surface-container text-primary font-medium">Public ID: #ALX-8902</span>
</div>

<div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md mb-space-lg bg-surface-container-low p-space-md rounded-xl">
<div className="relative group">
<img className="w-20 h-20 rounded-xl object-cover shadow-sm ring-2 ring-surface-container-lowest" data-alt="Editorial portrait of Alex Rivera, a focused Latino software engineer in his early thirties with neat dark hair and a modern charcoal minimal collar shirt, clean soft daylight studio lighting, sharp focus on eyes, contemporary tech aesthetic, muted slate and cool violet palette." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXpXrboKZ3t3zyTfpdX2qdG5qJKRnB0Yr0ev8TDWomCidH9kNXTTvFrBR0L4L3XJEjDzIFkUZuy12j8RfG2NUuulFupU9kxglD4pQF5rb6oQGDGjvd_u3MIVxFzcROxqaOwWxuucO9g8smwJ6siyhE8j8Qof5xdYrM-YUdFflXM4mN02JmHbSl9K8Xet4L6K_nCFwFTvYydAYOrwwnRMtYZygDussufkJfzrum1axk" />
<div className="absolute inset-0 bg-inverse-surface/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
<span className="material-symbols-outlined text-inverse-on-surface text-[20px]">photo_camera</span>
</div>
</div>
<div className="flex-1 min-w-0">
<div className="flex items-center gap-2 mb-1">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Alex Rivera</h3>
<span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">Community Member</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">alex.rivera@distributed-core.io</p>
<p className="font-code-sm text-code-sm text-outline mt-1">Joined March 2023 • 348 Study Hours Logged</p>
</div>
<div className="flex items-center gap-2">
<button className="px-space-md py-1.5 rounded-lg bg-surface-container-lowest shadow-sm hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all" type="button">
              Change Photo
            </button>
<button className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/30 transition-all" title="Remove Avatar" type="button">
<span className="material-symbols-outlined text-[20px]">delete</span>
</button>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
<div className="space-y-1.5">
<label className="font-label-md text-label-md text-on-surface font-medium flex items-center justify-between">
<span>Full Name</span>
<span className="font-label-sm text-label-sm text-outline">Visible to mentors</span>
</label>
<input className="w-full px-space-md py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner" type="text" defaultValue="Alex Rivera" />
</div>
<div className="space-y-1.5">
<label className="font-label-md text-label-md text-on-surface font-medium flex items-center justify-between">
<span>Professional Role</span>
<span className="font-label-sm text-label-sm text-primary">Track Tailored</span>
</label>
<input className="w-full px-space-md py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner" type="text" defaultValue="Senior Distributed Systems Engineer" />
</div>
<div className="space-y-1.5">
<label className="font-label-md text-label-md text-on-surface font-medium">Primary Contact Email</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">mail</span>
<input className="w-full pl-10 pr- space-md py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner" type="email" defaultValue="alex.rivera@distributed-core.io" />
</div>
</div>
<div className="space-y-1.5">
<label className="font-label-md text-label-md text-on-surface font-medium">Timezone &amp; Spaced Cadence Sync</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">schedule</span>
<select className="w-full pl-10 pr-space-md py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary appearance-none cursor-pointer shadow-inner">
<option defaultValue="UTC-08:00">UTC-08:00 (Pacific Time - Los Angeles)</option>
<option>UTC-05:00 (Eastern Time - New York)</option>
<option>UTC+00:00 (Greenwich Mean Time - London)</option>
<option>UTC+01:00 (Central European Time - Berlin)</option>
<option>UTC+09:00 (Japan Standard Time - Tokyo)</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-2.5 text-[18px] text-outline pointer-events-none">unfold_more</span>
</div>
</div>
</div>

<div className="mt-space-lg pt-space-md">
<p className="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-space-sm font-semibold">Repository &amp; Portfolio Verification</p>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
<div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-md bg-inverse-surface text-inverse-on-surface flex items-center justify-center font-code-sm text-code-sm font-bold">GH</div>
<div>
<p className="font-label-md text-label-md text-on-surface font-medium leading-tight">github.com/arivera-kernel</p>
<p className="font-label-sm text-label-sm text-primary flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">check_circle</span> Linked &amp; verified
                  </p>
</div>
</div>
<button className="font-label-sm text-label-sm text-outline hover:text-on-surface px-2 py-1 rounded bg-surface-container-lowest">Disconnect</button>
</div>
<div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-md bg-secondary-container text-on-secondary-container flex items-center justify-center font-code-sm text-code-sm font-bold">GL</div>
<div>
<p className="font-label-md text-label-md text-on-surface font-medium leading-tight">gitlab.com/alex-rivera-ops</p>
<p className="font-label-sm text-label-sm text-primary flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">check_circle</span> Active runner
                  </p>
</div>
</div>
<button className="font-label-sm text-label-sm text-outline hover:text-on-surface px-2 py-1 rounded bg-surface-container-lowest">Disconnect</button>
</div>
</div>
</div>
</section>

<section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg relative overflow-hidden">
<div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-container/10 rounded-full blur-2xl pointer-events-none"></div>
<div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-low/40 -mx-space-lg -mt-space-lg p-space-lg rounded-t-xl">
<div className="flex items-center gap-3">
<div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
<span className="material-symbols-outlined text-[20px]">smart_toy</span>
</div>
<div>
<h2 className="font-headline-sm text-headline-sm text-on-surface">AI Companion Calibration &amp; Engine</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">Fine-tune the reasoning behavior, cognitive depth, and context retrieval boundaries.</p>
</div>
</div>
<span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-code-sm text-code-sm">LLM Orchestration: v4</span>
</div>

<div className="space-y-space-sm mb-space-lg">
<label className="font-label-md text-label-md text-on-surface font-medium block">Inference Engine Backing</label>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">

<label className="relative flex flex-col p-space-md rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-all group">
<input defaultChecked className="peer sr-only" name="ai-model" type="radio" defaultValue="claude" />
<div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-surface-container-high peer-checked:bg-primary-container peer-checked:ring-4 peer-checked:ring-primary-fixed flex items-center justify-center transition-all">
<span className="material-symbols-outlined text-[10px] text-on-primary opacity-0 peer-checked:opacity-100">check</span>
</div>
<span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider mb-1">Recommended</span>
<p className="font-headline-sm text-headline-sm text-on-surface">Claude 3.5 Sonnet</p>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">High-fidelity code refactoring &amp; nuanced architectural feedback.</p>
<div className="mt-3 pt-2 flex items-center gap-1.5 font-code-sm text-code-sm text-outline">
<span className="material-symbols-outlined text-[14px]">speed</span> 32ms t/s
              </div>
</label>

<label className="relative flex flex-col p-space-md rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-all group">
<input className="peer sr-only" name="ai-model" type="radio" defaultValue="gpt4o" />
<div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-surface-container-high peer-checked:bg-primary-container peer-checked:ring-4 peer-checked:ring-primary-fixed flex items-center justify-center transition-all">
<span className="material-symbols-outlined text-[10px] text-on-primary opacity-0 peer-checked:opacity-100">check</span>
</div>
<span className="font-label-sm text-label-sm text-outline uppercase font-semibold tracking-wider mb-1">Generalist</span>
<p className="font-headline-sm text-headline-sm text-on-surface">GPT-4o Multimodal</p>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Ultra-rapid explanations, diagrams generation, and voice pairing.</p>
<div className="mt-3 pt-2 flex items-center gap-1.5 font-code-sm text-code-sm text-outline">
<span className="material-symbols-outlined text-[14px]">speed</span> 48ms t/s
              </div>
</label>

<label className="relative flex flex-col p-space-md rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-all group">
<input className="peer sr-only" name="ai-model" type="radio" defaultValue="deepseek" />
<div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-surface-container-high peer-checked:bg-primary-container peer-checked:ring-4 peer-checked:ring-primary-fixed flex items-center justify-center transition-all">
<span className="material-symbols-outlined text-[10px] text-on-primary opacity-0 peer-checked:opacity-100">check</span>
</div>
<span className="font-label-sm text-label-sm text-secondary uppercase font-semibold tracking-wider mb-1">Reasoning Pure</span>
<p className="font-headline-sm text-headline-sm text-on-surface">DeepSeek R1</p>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Deep chain-of-thought mathematical proof and algorithm traces.</p>
<div className="mt-3 pt-2 flex items-center gap-1.5 font-code-sm text-code-sm text-outline">
<span className="material-symbols-outlined text-[14px]">psychology</span> 8k CoT tok
              </div>
</label>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg mb-space-lg pt-2">

<div className="space-y-space-xs bg-surface-container-low p-space-md rounded-xl">
<div className="flex items-center justify-between">
<label className="font-label-md text-label-md text-on-surface font-medium">Cognitive Mode</label>
<span className="font-label-sm text-label-sm text-primary font-semibold">Active: Socratic</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Dictates whether the assistant guides with questions or provides direct implementation snippets.</p>
<div className="grid grid-cols-2 gap-1 p-1 bg-surface-container rounded-lg mt-space-sm">
<button className="py-2 px-3 rounded-md bg-surface-container-lowest text-primary font-label-md text-label-md shadow-sm transition-all flex items-center justify-center gap-1.5" type="button">
<span className="material-symbols-outlined text-[16px]">help_center</span>
<span>Socratic Guidance</span>
</button>
<button className="py-2 px-3 rounded-md text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all flex items-center justify-center gap-1.5" type="button">
<span className="material-symbols-outlined text-[16px]">bolt</span>
<span>Direct Solutions</span>
</button>
</div>
</div>

<div className="space-y-space-xs bg-surface-container-low p-space-md rounded-xl flex flex-col justify-between">
<div>
<div className="flex items-center justify-between">
<label className="font-label-md text-label-md text-on-surface font-medium">Context Window Retention</label>
<span className="font-code-sm text-code-sm px-2 py-0.5 rounded bg-surface-container text-primary font-bold">64k Tokens</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Maximum memory depth cached from previous roadmap milestones.</p>
</div>
<div className="pt-3">
<input className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary-container" max="128" min="8" type="range" defaultValue="64" />
<div className="flex justify-between font-code-sm text-code-sm text-outline mt-1.5">
<span>8k (Session only)</span>
<span>64k (Recommended)</span>
<span>128k (Max)</span>
</div>
</div>
</div>
</div>

<div className="space-y-1.5">
<div className="flex items-center justify-between">
<label className="font-label-md text-label-md text-on-surface font-medium flex items-center gap-1.5">
<span>System Prompt Personality Directive</span>
<span className="material-symbols-outlined text-[16px] text-outline" title="Inject custom behavior rules">info</span>
</label>
<span className="font-code-sm text-code-sm text-outline">184 / 1000 chars</span>
</div>
<textarea className="w-full px-space-md py- space-sm rounded-lg bg-surface-container-low text-on-surface font-code-sm text-code-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner resize-none leading-relaxed" rows={3} defaultValue={`You are an expert distributed systems staff architect. When critiquing code, focus on memory-safety, raft consensus subtleties, p99 tail-latencies, and failover states before syntax.`}></textarea>
</div>
</section>

<section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
<div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-low/40 -mx-space-lg -mt-space-lg p-space-lg rounded-t-xl">
<div className="flex items-center gap-3">
<div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[20px]">timelapse</span>
</div>
<div>
<h2 className="font-headline-sm text-headline-sm text-on-surface">Learning &amp; Spaced Repetition Preferences</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">Calibrate retention algorithms based on the Ebbinghaus forgetting curve.</p>
</div>
</div>
<span className="font-code-sm text-code-sm text-outline">FSRS-4.5 Algorithm</span>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md mb-space-md">

<div className="space-y-1.5">
<label className="font-label-md text-label-md text-on-surface font-medium">Target Weekly Study Commitment</label>
<div className="relative flex items-center">
<input className="w-full pl-space-md pr-16 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner" type="number" defaultValue="8" />
<span className="absolute right-4 font-label-md text-label-md text-outline font-medium">hrs / wk</span>
</div>
<p className="font-body-sm text-body-sm text-outline">Paces dynamic curriculum modules to match 1.1 hrs/day.</p>
</div>

<div className="space-y-1.5">
<label className="font-label-md text-label-md text-on-surface font-medium">Daily Flashcard Queue Maximum</label>
<div className="relative flex items-center">
<input className="w-full pl-space-md pr-20 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner" type="number" defaultValue="15" />
<span className="absolute right-4 font-label-md text-label-md text-outline font-medium">cards / day</span>
</div>
<p className="font-body-sm text-body-sm text-outline">Prevents cognitive overload during high-stress sprint cycles.</p>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-2">

<div className="space-y-2">
<label className="font-label-md text-label-md text-on-surface font-medium">Retention Threshold Sensitivity</label>
<div className="grid grid-cols-3 gap-2">
<button className="font-label-sm text-label-sm text-error hover:underline" data-route="learnmate-landing-page" >Revoke</button>
<button className="font-label-sm text-label-sm text-error hover:underline" data-route="learnmate-landing-page" >Revoke</button>
<button className="font-label-sm text-label-sm text-error hover:underline" data-route="learnmate-landing-page" >Revoke</button>
</div>
</div>

<div className="space-y-2">
<label className="font-label-md text-label-md text-on-surface font-medium">Preferred Coding Sandbox Engine</label>
<div className="flex items-center gap-2 flex-wrap">
<span className="px-3 py-1.5 rounded-lg bg-surface-container text-primary font-code-sm text-code-sm font-semibold flex items-center gap-1.5 cursor-pointer">
<span className="w-2 h-2 rounded-full bg-primary"></span> Rust (1.78)
              </span>
<span className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-code-sm text-code-sm cursor-pointer transition-colors">
                Go (1.22)
              </span>
<span className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-code-sm text-code-sm cursor-pointer transition-colors">
                Python (3.12)
              </span>
<span className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-code-sm text-code-sm cursor-pointer transition-colors">
                TypeScript (5.4)
              </span>
</div>
</div>
</div>
</section>

<section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
<div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-low/40 -mx-space-lg -mt-space-lg p-space-lg rounded-t-xl">
<div className="flex items-center gap-3">
<div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[20px]">shield</span>
</div>
<div>
<h2 className="font-headline-sm text-headline-sm text-on-surface">Security &amp; Authentication</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">Multi-factor tokens, session tracking, and password verification.</p>
</div>
</div>
<span className="px-2.5 py-0.5 rounded-full bg-error-container/40 text-on-surface font-label-sm text-label-sm font-medium">SOC-2 Type II</span>
</div>
<div className="space-y-space-md">

<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30"><div><div className="flex items-center gap-2"><p className="font-label-md text-label-md text-on-surface font-semibold">Account Password</p><span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-code-sm text-code-sm">Encrypted (Argon2)</span></div><p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Last updated 4 months ago via Apple Keychain prompt.</p></div><div className="flex items-center gap-2 self-start sm:self-auto shrink-0"><button className="px-space-md py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 hover:bg-surface-container hover:text-primary text-on-surface font-label-md text-label-md font-medium transition-all shadow-sm flex items-center gap-1.5 group" title="Send a secure reset link to alex.rivera@distributed-core.io" type="button"><span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary transition-colors">key</span><span>Reset Password</span></button></div></div>

<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30"><div className="flex items-start gap-3"><div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed mt-0.5 shrink-0"><span className="material-symbols-outlined text-[18px]">verified_user</span></div><div><div className="flex items-center gap-2"><p className="font-label-md text-label-md text-on-surface font-semibold">Two-Factor Authentication (2FA)</p><span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">check</span>Enabled</span></div><p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">TOTP Authenticator application (1Password / Google Auth) verified.</p></div></div><div className="flex items-center gap-2 self-start sm:self-auto shrink-0"><button className="px-space-md py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 hover:bg-surface-container hover:text-primary text-on-surface font-label-md text-label-md font-medium transition-all shadow-sm flex items-center gap-1.5 group" title="Generate new secret key or change authentication app" type="button"><span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary transition-colors">sync_alt</span><span>Reconfigure</span></button></div></div>

<div className="pt-2">
<div className="flex items-center justify-between mb-space-sm"><p className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Active Authorized Sessions</p><button type="button" data-route="learnmate-landing-page"  className="font-label-sm text-label-sm text-error hover:underline flex items-center gap-1 font-semibold"><span className="material-symbols-outlined text-[16px]">logout</span>Log Out of All Sessions</button></div>
<div className="space-y-2">
<div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-[20px] text-primary">laptop_mac</span>
<div>
<p className="font-label-md text-label-md text-on-surface font-medium">Chrome on macOS Sequoia (Apple Silicon)</p>
<p className="font-code-sm text-code-sm text-outline">San Francisco, USA • 192.168.1.104 • <span className="text-primary font-semibold">Current Session</span></p>
</div>
</div>
<div className="flex items-center gap-3"><span className="font-code-sm text-code-sm text-outline">Active now</span><button type="button" data-route="learnmate-landing-page"  className="font-label-sm text-label-sm text-outline hover:text-error px-2 py-1 rounded bg-surface-container-lowest border border-outline-variant/30 hover:border-error transition-all flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">logout</span>Sign Out</button></div>
</div>
<div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-[20px] text-outline">phone_iphone</span>
<div>
<p className="font-label-md text-label-md text-on-surface font-medium">LearnMate iOS App v2.4</p>
<p className="font-code-sm text-code-sm text-outline">San Francisco, USA • Last active 2 hours ago</p>
</div>
</div>
<button className="font-label-sm text-label-sm text-error hover:underline" data-route="learnmate-landing-page" >Revoke</button>
</div>
</div>
</div>
</div>
</section>
</div>

<div className="lg:col-span-4 space-y-space-lg">



<section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
<div className="flex items-center justify-between mb-space-sm">
<div>
<p className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Memory Curve Stability</p>
<h4 className="font-headline-sm text-headline-sm text-on-surface">94.2% Estimated</h4>
</div>
<span className="material-symbols-outlined text-[24px] text-primary">insights</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">Based on your last 340 flashcard recalls across Distributed Systems topics.</p>

<div className="w-full h-24 bg-surface-container-low rounded-lg p-2 flex items-end justify-center relative overflow-hidden">
<svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 280 80">
<defs>
<linearGradient id="curveGrad" x1="0%" x2="0%" y1="0%" y2="100%">
<stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3"></stop>
<stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0"></stop>
</linearGradient>
</defs>
<path d="M0,60 Q35,20 70,35 T140,25 T210,15 T280,10 L280,80 L0,80 Z" fill="url(#curveGrad)"></path>
<path d="M0,60 Q35,20 70,35 T140,25 T210,15 T280,10" fill="none" stroke="#3525cd" strokeWidth="2.5"></path>

<circle cx="280" cy="10" fill="#3525cd" r="3.5"></circle>
</svg>
</div>
<div className="grid grid-cols-2 gap-2 mt-space-md pt-space-sm bg-surface-container-low/50 -mx-space-lg -mb-space-lg p-space-md rounded-b-xl">
<div>
<p className="font-code-sm text-code-sm text-outline">Streak Retention</p>
<p className="font-headline-sm text-headline-sm text-on-surface">14 Consecutive</p>
</div>
<div>
<p className="font-code-sm text-code-sm text-outline">Forgotten Items</p>
<p className="font-headline-sm text-headline-sm text-error">3 Pending</p>
</div>
</div>
</section>

<section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg space-y-space-md"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary"><span className="material-symbols-outlined text-[18px]">folder_data</span></div><div><h4 className="font-headline-sm text-headline-sm text-on-surface">Offline &amp; Cached Data</h4><p className="font-code-sm text-code-sm text-outline">12.4 MB stored locally</p></div></div><p className="font-body-sm text-body-sm text-on-surface-variant">Personal study notes, flashcard review history, and cached curriculum modules are safely stored on this device.</p><div className="flex items-center justify-between pt-2"><button className="font-label-sm text-label-sm text-primary hover:underline font-semibold flex items-center gap-1" type="button"><span className="material-symbols-outlined text-[14px]">download</span> Export Data Backup</button><button className="font-label-sm text-label-sm text-on-surface-variant hover:text-error hover:underline font-semibold flex items-center gap-1 transition-colors" type="button"><span className="material-symbols-outlined text-[14px]">delete_outline</span> Clear Cached Data</button></div></section>
</div>
</div>

<div className="sticky bottom-6 mt-space-xl z-30 w-full"><div id="settings-save-toast" className="hidden max-w-md mx-auto mb-3 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-xl shadow-xl flex items-center justify-between gap-3 text-body-sm transition-all"><div className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-secondary-fixed">task_alt</span><span className="font-medium">Modifications saved successfully!</span></div><button type="button"  className="text-outline hover:text-inverse-on-surface"><span className="material-symbols-outlined text-[16px]">close</span></button></div>
<div className="bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl shadow-xl p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md max-w-4xl mx-auto ring-1 ring-outline-variant/30">
<div className="flex items-center gap-space-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[20px] text-primary">check_circle</span>
<span className="font-body-sm text-body-sm">
          All modifications are verified and staged locally.
        </span>
<span className="hidden md:inline font-code-sm text-code-sm text-outline">• Autosaved 14s ago</span>
</div>
<div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
<a href="{{DATA:SCREEN:SCREEN_2}}" className="px-space-lg py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-all inline-flex items-center justify-center">Cancel</a>
<button className="px-space-xl py-2.5 rounded-lg bg-primary-container hover:bg-secondary text-on-primary font-label-md text-label-md font-semibold transition-all shadow-md active:scale-95 flex items-center gap-2" id="save-changes-btn"  type="button">
<span className="material-symbols-outlined text-[18px]">save</span>
<span>Save Changes</span>
</button>
</div>
</div>
</div>
</div>

    </>
  );
}
