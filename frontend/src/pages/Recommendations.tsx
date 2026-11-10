export function Recommendations() {
  return (
    <div className="flex flex-col w-full pb-space-xl">

<div className="relative w-full">
<div className="absolute -top-10 -right-12 w-96 h-96 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
<div className="absolute top-48 -left-20 w-80 h-80 bg-secondary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10"></div>

<div className="flex flex-col gap-space-lg mb-space-xl">

<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
<div>
<div className="flex items-center gap-space-sm mb-space-xs">
<span className="font-code-sm text-code-sm uppercase tracking-wider text-primary font-medium bg-primary-fixed/60 px-2 py-0.5 rounded-full">Directory // 04</span>
<span className="text-outline text-body-sm">•</span>
<span className="font-label-sm text-label-sm text-on-surface-variant tracking-wide">348 Peer-Reviewed Nodes</span>
</div>
<h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Curated Resource Library</h1>
<p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-2xl">
            Distilled technical literature, interactive memory simulators, and hyper-annotated whitepapers tuned for master-level systems engineering.
          </p>
</div>

<div className="flex items-center gap-3 bg-surface-container-low px-space-md py-space-sm rounded-xl shadow-sm self-start md:self-auto">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
<span className="font-code-sm text-code-sm text-on-surface-variant font-medium">Synced w/ ArXiv &amp; GitHub</span>
</div>
<div className="w-px h-4 bg-outline-variant/50"></div>
<span className="font-label-sm text-label-sm text-primary font-bold">14 New This Week</span>
</div>
</div>

<div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center gap-space-sm">
<div className="relative flex-1 flex items-center">
<span className="material-symbols-outlined absolute left-space-md text-outline pointer-events-none text-[20px]">search</span>
<input className="w-full pl-11 pr-space-md py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Filter by title, author, format, or architectural pattern..." type="text" />
<span className="hidden sm:inline-block absolute right-3 px-1.5 py-0.5 rounded bg-surface-container font-code-sm text-code-sm text-on-surface-variant">⌘F</span>
</div>
<div className="flex items-center gap-space-sm flex-wrap sm:flex-nowrap">

<div className="relative flex items-center">
<label className="sr-only" htmlFor="sort-select">Sort by</label>
<div className="flex items-center gap-2 px-space-md py-2.5 bg-surface-container-low rounded-lg text-on-surface hover:bg-surface-container transition-colors cursor-pointer w-full sm:w-auto justify-between">
<span className="material-symbols-outlined text-outline text-[18px]">swap_vert</span>
<select className="bg-transparent font-label-md text-label-md text-on-surface focus:outline-none cursor-pointer pr-4 appearance-none" id="sort-select">
<option value="highest">Highest Rated (★)</option>
<option value="recent">Recently Added</option>
<option value="time-asc">Estimated Time (Asc)</option>
<option value="time-desc">Estimated Time (Desc)</option>
</select>
<span className="material-symbols-outlined text-outline text-[16px] -ml-3 pointer-events-none">expand_more</span>
</div>
</div>

<button className="px-space-md py-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg font-label-md text-label-md flex items-center gap-1.5 transition-colors">
<span className="material-symbols-outlined text-[18px] text-outline">tune</span>
<span>Refine</span>
</button>
</div>
</div>

<div className="flex items-center gap-2 overflow-x-auto pb-1 text-nowrap scrollbar-none">
<button className="px-3.5 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm shadow-sm transition-transform active:scale-95 flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px]">view_comfy</span>
<span>All Nodes</span>
<span className="bg-primary-container text-on-primary-container px-1.5 py-0.2 rounded-full font-code-sm text-[10px]">348</span>
</button>
<button className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-sm text-label-sm transition-all shadow-sm flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-secondary">terminal</span>
<span>Interactive Labs</span>
<span className="text-outline font-code-sm text-[11px]">84</span>
</button>
<button className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-sm text-label-sm transition-all shadow-sm flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-tertiary">article</span>
<span>Research Papers</span>
<span className="text-outline font-code-sm text-[11px]">112</span>
</button>
<button className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-sm text-label-sm transition-all shadow-sm flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-primary">smart_display</span>
<span>Video Walkthroughs</span>
<span className="text-outline font-code-sm text-[11px]">65</span>
</button>
<button className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-sm text-label-sm transition-all shadow-sm flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-secondary">code_blocks</span>
<span>Code Sandboxes</span>
<span className="text-outline font-code-sm text-[11px]">53</span>
</button>
<button className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-sm text-label-sm transition-all shadow-sm flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-tertiary">quick_reference_all</span>
<span>Cheat Sheets</span>
<span className="text-outline font-code-sm text-[11px]">34</span>
</button>
</div>

<div className="flex items-center gap-2 overflow-x-auto text-nowrap">
<span className="font-code-sm text-code-sm text-outline uppercase tracking-wider pl-1">Domains:</span>
<button className="px-2.5 py-1 rounded-md bg-surface-container text-primary font-label-sm text-label-sm hover:bg-surface-container-high transition-colors">Distributed Systems</button>
<button className="px-2.5 py-1 rounded-md bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-sm text-label-sm transition-colors">System Design</button>
<button className="px-2.5 py-1 rounded-md bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-sm text-label-sm transition-colors">Concurrency</button>
<button className="px-2.5 py-1 rounded-md bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-sm text-label-sm transition-colors">Database Internals</button>
<button className="px-2.5 py-1 rounded-md bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-sm text-label-sm transition-colors">Rust</button>
<button className="px-2.5 py-1 rounded-md bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-sm text-label-sm transition-colors">Go</button>
</div>
</div>

<div className="mb-space-xl">
<div className="flex items-center justify-between mb-space-md">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[22px]">auto_stories</span>
<h2 className="font-headline-md text-headline-md text-on-surface tracking-tight">Curated Staff Collections</h2>
<span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm">Curator Picks</span>
</div>
<div className="flex items-center gap-1">
<button className="p-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container shadow-sm transition-colors" title="Previous collection">
<span className="material-symbols-outlined text-[20px]">chevron_left</span>
</button>
<button className="p-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container shadow-sm transition-colors" title="Next collection">
<span className="material-symbols-outlined text-[20px]">chevron_right</span>
</button>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">

<div className="group relative rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between p-space-lg">
<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
<div>
<div className="flex items-center justify-between gap-2 mb-space-sm">
<span className="font-code-sm text-code-sm text-primary uppercase font-bold tracking-wider">Annotated Masterwork</span>
<span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm">Staff Pick</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors mb-2">
              The Google Spanner Paper: Annotated Edition
            </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 mb-space-md">
              Complete line-by-line marginalia decoding TrueTime API, GPS clock synchronization uncertainties, and multi-version distributed concurrency.
            </p>
</div>
<div className="pt-space-md bg-surface-container-low/40 -mx-space-lg -mb-space-lg px-space-lg pb-space-md flex items-center justify-between">
<div className="flex items-center gap-2">
<div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center font-code-sm text-code-sm font-bold text-on-primary-fixed">
                JC
              </div>
<span className="font-body-sm text-body-sm text-on-surface font-medium truncate">Dr. James Corbett et al.</span>
</div>
<span className="font-label-sm text-label-sm text-primary font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Examine <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</span>
</div>
</div>

<div className="group relative rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between p-space-lg">
<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary-container"></div>
<div>
<div className="flex items-center justify-between gap-2 mb-space-sm">
<span className="font-code-sm text-code-sm text-secondary uppercase font-bold tracking-wider">Simulation Suite</span>
<span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">WASM Enabled</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-secondary transition-colors mb-2">
              Essential Systems Interactive Sandboxes
            </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 mb-space-md">
              Seven micro-simulators simulating network partitions, split-brain conditions, gossip protocols, and Raft leader elections directly in browser runtime.
            </p>
</div>
<div className="pt-space-md bg-surface-container-low/40 -mx-space-lg -mb-space-lg px-space-lg pb-space-md flex items-center justify-between">
<div className="flex items-center gap-2">
<div className="w-7 h-7 rounded-full bg-secondary-fixed flex items-center justify-center font-code-sm text-code-sm font-bold text-on-secondary-fixed">
                LM
              </div>
<span className="font-body-sm text-body-sm text-on-surface font-medium truncate">LearnMate Systems Lab</span>
</div>
<span className="font-label-sm text-label-sm text-secondary font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Launch <span className="material-symbols-outlined text-[16px]">play_arrow</span>
</span>
</div>
</div>

<div className="group relative rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between p-space-lg">
<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-tertiary-container to-primary"></div>
<div>
<div className="flex items-center justify-between gap-2 mb-space-sm">
<span className="font-code-sm text-code-sm text-tertiary uppercase font-bold tracking-wider">Curriculum Companion</span>
<span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm">Academic Rigor</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors mb-2">
              MIT 6.824 Lecture Breakdown &amp; Code Companion
            </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 mb-space-md">
              Comprehensive breakdowns of Robert Morris's flagship distributed engineering syllabus with runnable Go tests and failure injection harnesses.
            </p>
</div>
<div className="pt-space-md bg-surface-container-low/40 -mx-space-lg -mb-space-lg px-space-lg pb-space-md flex items-center justify-between">
<div className="flex items-center gap-2">
<div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center font-code-sm text-code-sm font-bold text-on-surface">
                RM
              </div>
<span className="font-body-sm text-body-sm text-on-surface font-medium truncate">Prof. Robert Morris + PDOS</span>
</div>
<span className="font-label-sm text-label-sm text-tertiary font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Explore <span className="material-symbols-outlined text-[16px]">library_books</span>
</span>
</div>
</div>
</div>
</div>

<div className="flex items-center justify-between mb-space-md">
<div className="flex items-center gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface">Directory Index</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">(Showing 6 indexed masterworks)</span>
</div>
<div className="flex items-center gap-3">
<span className="font-code-sm text-code-sm text-outline">View: Density Grid</span>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">

<article className="group bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
<div>

<div className="relative w-full h-36 rounded-lg bg-surface-container-low mb-space-md overflow-hidden flex items-center justify-center"><div className="absolute inset-0 bg-gradient-to-r from-primary-fixed/20 to-secondary-fixed/30 opacity-70"></div><svg className="w-full h-full p-3 opacity-90 relative z-10" fill="none" viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="raftGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4f46e5"></stop><stop offset="100%" stopColor="#3525cd"></stop></linearGradient><radialGradient id="leaderGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#c3c0ff" stopOpacity="0.6"></stop><stop offset="100%" stopColor="#4f46e5" stopOpacity="0"></stop></radialGradient></defs><line x1="60" y1="60" x2="160" y2="36" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6"></line><line x1="160" y1="36" x2="260" y2="60" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6"></line><line x1="60" y1="60" x2="160" y2="92" stroke="#c7c4d8" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5"></line><line x1="260" y1="60" x2="160" y2="92" stroke="#c7c4d8" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5"></line><circle cx="160" cy="36" r="26" fill="url(#leaderGlow)"></circle><circle cx="160" cy="36" r="16" fill="url(#raftGrad)"></circle><text x="160" y="39" fill="#ffffff" fontSize="8.5" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle" letterSpacing="0.05em">LEADER</text><text x="160" y="47" fill="#dad7ff" fontSize="7" fontFamily="JetBrains Mono" textAnchor="middle">Term 14</text><circle cx="60" cy="60" r="14" fill="#ffffff" stroke="#4f46e5" strokeWidth="2"></circle><text x="60" y="63" fill="#3525cd" fontSize="8" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">n1:Fol</text><circle cx="260" cy="60" r="14" fill="#ffffff" stroke="#4f46e5" strokeWidth="2"></circle><text x="260" y="63" fill="#3525cd" fontSize="8" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">n2:Fol</text><circle cx="160" cy="92" r="12" fill="#ffffff" stroke="#777587" strokeWidth="1.5"></circle><text x="160" y="95" fill="#464555" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">n3:Can</text><rect x="225" y="16" width="75" height="20" rx="10" fill="#ffffff" stroke="#c7c4d8" strokeWidth="0.75" opacity="0.95"></rect><text x="262" y="29" fill="#4648d4" fontSize="7.5" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">● Heartbeat 48ms</text></svg><div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm shadow-sm"><span className="material-symbols-outlined text-secondary text-[14px]">terminal</span><span className="font-code-sm text-[11px] text-on-surface font-medium">Interactive Lab</span></div><button className="absolute top-2 right-2 p-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-primary hover:bg-surface-container-lowest shadow-sm transition-colors" title="Remove bookmark"><span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span></button></div>

<div className="flex items-center gap-2 mb-2 flex-wrap">
<span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-secondary font-semibold">Expert</span>
<span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[14px] text-outline">schedule</span> 45 min lab
            </span>
<span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface">
<span className="text-secondary font-bold">★ 4.95</span>
<span className="text-outline font-code-sm text-[11px]">(512)</span>
</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors leading-snug mb-1.5">
            Raft Consensus Failure Injection Simulator
          </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-space-md">
            Step through split-vote states, simulate Byzantine drop rates, and re-elect nodes in a deterministic event loop sandbox.
          </p>

<div className="flex items-center gap-2 mb-space-md">
<img className="w-5 h-5 rounded-full object-cover" data-alt="Close up editorial portrait photograph of an engineer smiling thoughtfully against a clean neutral studio backdrop with soft diffused lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBo8Sxr_k9sAVws7sL75jpKxs0Yqxw4Jg8QWVIH_JLUU4df6szq8as7fZtcXU9lhPlqBASJKW5atgwMvlQlbylwm4Z9kgsrySpcSG6Xhmcv-l6hZ4YeawxFnHUz9RTCOnpRc5saZsJvP6u1qoeAZerzVN9CsnjsUiu43gF4bMG5bQZmqQvyBbt4OV_u3_4BtVCwbffeT8sUrjppqLed4TJf4MRyWE7m7EGcVkBFH0L-" />
<span className="font-label-sm text-label-sm text-on-surface-variant truncate">Heidi Howard, Cambridge Systems</span>
</div>
</div>

<div className="pt-space-sm bg-surface-container-low/30 -mx-space-lg -mb-space-lg px-space-lg pb-space-md">
<div className="flex items-center justify-between mb-2">
<span className="font-code-sm text-code-sm text-on-surface-variant">Status: In Progress</span>
<span className="font-code-sm text-code-sm text-primary font-bold">80% Done</span>
</div>
<div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden mb-space-md">
<div className="h-full bg-primary rounded-full" style={{ width: '80%' }}></div>
</div>
<div className="flex items-center gap-2">
<a className="flex-1 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md text-center transition-all shadow-sm" href="#">
              Resume Lab
            </a>
<button className="p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors shadow-sm" title="Inspect node details">
<span className="material-symbols-outlined text-[18px]">info</span>
</button>
</div>
</div>
</article>

<article className="group bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
<div>

<div className="relative w-full h-36 rounded-lg bg-surface-container-low mb-space-md overflow-hidden flex items-center justify-center"><div className="absolute inset-0 bg-surface-container-low/40"></div><svg className="w-full h-full p-2 opacity-90 relative z-10" fill="none" viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg"><circle cx="160" cy="60" r="42" stroke="#c7c4d8" strokeWidth="1.5" strokeDasharray="4 3"></circle><circle cx="160" cy="60" r="42" stroke="#4648d4" strokeWidth="2.5" strokeDasharray="70 200" strokeLinecap="round"></circle><circle cx="160" cy="18" r="6" fill="#4648d4"></circle><text x="160" y="11" fill="#4648d4" fontSize="7.5" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">Token A (R1)</text><circle cx="198" cy="42" r="5" fill="#6063ee"></circle><text x="234" y="44" fill="#464555" fontSize="7" fontFamily="JetBrains Mono" textAnchor="middle">Token B (vnode)</text><circle cx="192" cy="86" r="6" fill="#4648d4"></circle><text x="228" y="92" fill="#4648d4" fontSize="7.5" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">Token C (R2)</text><circle cx="128" cy="86" r="5" fill="#6063ee"></circle><text x="92" y="92" fill="#464555" fontSize="7" fontFamily="JetBrains Mono" textAnchor="middle">Token D (vnode)</text><circle cx="122" cy="42" r="6" fill="#4648d4"></circle><text x="86" y="44" fill="#4648d4" fontSize="7.5" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">Token E (R3)</text><rect x="136" y="50" width="48" height="20" rx="4" fill="#ffffff" stroke="#c7c4d8" strokeWidth="1"></rect><text x="160" y="63" fill="#131b2e" fontSize="8" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">N=3, W=2</text></svg><div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm shadow-sm"><span className="material-symbols-outlined text-tertiary text-[14px]">article</span><span className="font-code-sm text-[11px] text-on-surface font-medium">Annotated PDF</span></div><button className="absolute top-2 right-2 p-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-outline hover:text-primary hover:bg-surface-container-lowest shadow-sm transition-colors" title="Bookmark"><span className="material-symbols-outlined text-[18px]">bookmark_border</span></button></div>
<div className="flex items-center gap-2 mb-2 flex-wrap">
<span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-tertiary font-semibold">Intermediate</span>
<span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[14px] text-outline">schedule</span> 30 min read
            </span>
<span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface">
<span className="text-secondary font-bold">★ 4.88</span>
<span className="text-outline font-code-sm text-[11px]">(280)</span>
</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors leading-snug mb-1.5">
            Dynamo: Amazon's Highly Available Key-Value Store
          </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-space-md">
            Critical analysis of consistent hashing rings, sloppy quorums, vector clocks, and hinted handoff mechanisms under network drops.
          </p>
<div className="flex items-center gap-2 mb-space-md">
<img className="w-5 h-5 rounded-full object-cover" data-alt="Professional corporate headshot of a software researcher with neutral lighting against an architectural slate background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuQ2Y5ttrlmAeAU8UoU24QKvvxet-851sfvJxUYxNRbuWnw3bCpY3ep28Fq6TLLWlrHIUTakOGhWhe_Fg53MBvyzP59nv1d1FL563yi3O9QNcDwrTpvsIJJFlAPybeEt9SJ1ZTGiRLChV4_It2QOfhlFDyfhJd1ZdSJiFbMK-_WmLr7X764XMliP-redoK4Ur13ZSor8jnQbPXycuKo-YlIYoVCfi-wVf4WE4HE2O_" />
<span className="font-label-sm text-label-sm text-on-surface-variant truncate">Giuseppe DeCandia et al.</span>
</div>
</div>
<div className="pt-space-sm bg-surface-container-low/30 -mx-space-lg -mb-space-lg px-space-lg pb-space-md">
<div className="flex items-center justify-between mb-2">
<span className="font-code-sm text-code-sm text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-secondary text-[14px]">check_circle</span> Read fully
            </span>
<span className="font-code-sm text-code-sm text-secondary font-bold">Completed</span>
</div>
<div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden mb-space-md">
<div className="h-full bg-secondary rounded-full" style={{ width: '100%' }}></div>
</div>
<div className="flex items-center gap-2">
<a className="flex-1 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-label-md text-label-md text-center transition-all" href="#">
              Review Notes
            </a>
<button className="p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors shadow-sm" title="Share paper">
<span className="material-symbols-outlined text-[18px]">share</span>
</button>
</div>
</div>
</article>

<article className="group bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
<div>

<div className="relative w-full h-36 rounded-lg bg-surface-container-low mb-space-md overflow-hidden flex items-center justify-center"><div className="absolute inset-0 bg-surface-container-low/40"></div><svg className="w-full h-full p-3 opacity-90 relative z-10" fill="none" viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg"><rect x="24" y="20" width="62" height="28" rx="4" fill="#eaedff" stroke="#4f46e5" strokeWidth="1.5"></rect><text x="55" y="33" fill="#3525cd" fontSize="7.5" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">MemTable</text><text x="55" y="42" fill="#464555" fontSize="6.5" fontFamily="JetBrains Mono" textAnchor="middle">RAM (SkipList)</text><path d="M88 34L116 34" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="2 2" markerEnd="url(#arrow)"></path><rect x="118" y="16" width="86" height="36" rx="4" fill="#ffffff" stroke="#c7c4d8" strokeWidth="1"></rect><rect x="122" y="20" width="78" height="12" rx="2" fill="#f2f3ff"></rect><text x="161" y="29" fill="#131b2e" fontSize="7" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">L0 SSTable [4MB]</text><rect x="122" y="35" width="78" height="12" rx="2" fill="#f2f3ff"></rect><text x="161" y="44" fill="#131b2e" fontSize="7" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">L0 SSTable [4MB]</text><path d="M161 54L161 68" stroke="#ba1a1a" strokeWidth="1.5" strokeDasharray="2 2"></path><rect x="100" y="70" width="122" height="34" rx="4" fill="#dae2fd" stroke="#4648d4" strokeWidth="1.2"></rect><text x="161" y="82" fill="#07006c" fontSize="7.5" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">L1 Compaction [64MB]</text><text x="161" y="93" fill="#2f2ebe" fontSize="7" fontFamily="JetBrains Mono" textAnchor="middle">Bloom Filter Rate 99.4%</text><rect x="234" y="32" width="66" height="44" rx="4" fill="#ffffff" stroke="#c7c4d8" strokeWidth="0.8"></rect><text x="267" y="46" fill="#131b2e" fontSize="7" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">B-Tree</text><line x1="242" y1="52" x2="292" y2="52" stroke="#c7c4d8" strokeWidth="0.8"></line><text x="267" y="62" fill="#ba1a1a" fontSize="6.5" fontFamily="JetBrains Mono" textAnchor="middle">Write Amp: 24x</text><text x="267" y="70" fill="#3525cd" fontSize="6.5" fontFamily="JetBrains Mono" textAnchor="middle">LSM Amp: 4.2x</text></svg><div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm shadow-sm"><span className="material-symbols-outlined text-primary text-[14px]">smart_display</span><span className="font-code-sm text-[11px] text-on-surface font-medium">4K Walkthrough</span></div><button className="absolute top-2 right-2 p-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-outline hover:text-primary hover:bg-surface-container-lowest shadow-sm transition-colors" title="Bookmark"><span className="material-symbols-outlined text-[18px]">bookmark_border</span></button></div>
<div className="flex items-center gap-2 mb-2 flex-wrap">
<span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-semibold">Foundational</span>
<span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[14px] text-outline">schedule</span> 18 min
            </span>
<span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface">
<span className="text-secondary font-bold">★ 4.92</span>
<span className="text-outline font-code-sm text-[11px]">(621)</span>
</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors leading-snug mb-1.5">
            LSM Trees vs B-Trees: The IO Cost Landscape
          </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-space-md">
            Visualizing disk seek amortizations, write amplification factors, compaction algorithms, and Bloom filter index lookup speeds.
          </p>
<div className="flex items-center gap-2 mb-space-md">
<img className="w-5 h-5 rounded-full object-cover" data-alt="Portrait of an educational presenter against an uncluttered dark grey background with warm key lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmnxRosHNa4ITV9KxcKEAbjt_JIcuDNmEXOZewxHhJciLcrXshAyI260R8dGy7BbKki1OVN6YTz8rNOOT6hFr9-iWHK0DMlJ6An5aCp_MSZ7s1StMwN0XR5WVMPn1vWxK8S-rm-JiytgP9Kuv6mDMEocuvz93b7DeRrbNBQpTtN-vBAlbUSARRjydKkBc-I3pDkPET3Ula1OCJyLN5xLPO_icPQM0TUfBTtrZfn5T8" />
<span className="font-label-sm text-label-sm text-on-surface-variant truncate">Martin Kleppmann (Guest Session)</span>
</div>
</div>
<div className="pt-space-sm bg-surface-container-low/30 -mx-space-lg -mb-space-lg px-space-lg pb-space-md">
<div className="flex items-center justify-between mb-2">
<span className="font-code-sm text-code-sm text-outline">Status: Not started</span>
<span className="font-code-sm text-code-sm text-outline font-medium">0%</span>
</div>
<div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden mb-space-md">
<div className="h-full bg-outline-variant rounded-full" style={{ width: '0%' }}></div>
</div>
<div className="flex items-center gap-2">
<a className="flex-1 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md text-center transition-all shadow-sm" href="#">
              Watch Session
            </a>
<button className="p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors shadow-sm" title="Preview transcript">
<span className="material-symbols-outlined text-[18px]">subtitles</span>
</button>
</div>
</div>
</article>

<article className="group bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
<div>

<div className="relative w-full h-36 rounded-lg bg-surface-container-low mb-space-md overflow-hidden flex items-center justify-center font-code-sm text-code-sm text-outline p-4 select-none"><div className="w-full bg-surface-container-lowest/90 p-2.5 rounded-lg border border-outline-variant/40 shadow-sm relative z-10 flex flex-col justify-between h-[85%]"><div className="flex items-center justify-between pb-1 border-b border-outline-variant/30 text-[10px]"><span className="text-secondary font-bold font-code-sm">crossbeam::epoch::Atomic</span><span className="px-1.5 py-0.2 rounded bg-surface-container-high text-primary font-code-sm text-[9px] font-semibold">AcqRel</span></div><div className="font-code-sm text-[11px] leading-relaxed py-1"><div className="text-on-surface truncate"><span className="text-primary font-semibold">let</span> tail = <span className="text-secondary font-semibold">self</span>.tail.load(Acquire, &amp;guard);</div><div className="text-on-surface-variant text-[10px] truncate"><span className="text-outline">// CAS eliminates ABA hazard</span></div><div className="text-secondary text-[10.5px] truncate font-semibold">tail.compare_exchange(curr, next, Release)?</div></div></div><div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm shadow-sm"><span className="material-symbols-outlined text-secondary text-[14px]">code_blocks</span><span className="font-code-sm text-[11px] text-on-surface font-medium">Rust Sandbox</span></div><button className="absolute top-2 right-2 p-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-primary hover:bg-surface-container-lowest shadow-sm transition-colors" title="Bookmarked"><span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span></button></div>
<div className="flex items-center gap-2 mb-2 flex-wrap">
<span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-secondary font-semibold">Expert</span>
<span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[14px] text-outline">schedule</span> 50 min
            </span>
<span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface">
<span className="text-secondary font-bold">★ 4.97</span>
<span className="text-outline font-code-sm text-[11px]">(403)</span>
</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors leading-snug mb-1.5">
            Lock-Free Michael-Scott Queue in Safe Rust
          </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-space-md">
            Confronting the ABA problem using epoch-based memory reclamation (Crossbeam), atomic pointers, and relaxed cache synchronizations.
          </p>
<div className="flex items-center gap-2 mb-space-md">
<div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center font-code-sm text-[9px] text-on-secondary font-bold">RS</div>
<span className="font-label-sm text-label-sm text-on-surface-variant truncate">Mara Bos, Rust Core Team</span>
</div>
</div>
<div className="pt-space-sm bg-surface-container-low/30 -mx-space-lg -mb-space-lg px-space-lg pb-space-md">
<div className="flex items-center justify-between mb-2">
<span className="font-code-sm text-code-sm text-on-surface-variant">Status: In Progress</span>
<span className="font-code-sm text-code-sm text-primary font-bold">35% Done</span>
</div>
<div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden mb-space-md">
<div className="h-full bg-primary rounded-full" style={{ width: '35%' }}></div>
</div>
<div className="flex items-center gap-2">
<a className="flex-1 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md text-center transition-all shadow-sm" href="#">
              Open Cargo Workspace
            </a>
<button className="p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors shadow-sm" title="Fork Sandbox">
<span className="material-symbols-outlined text-[18px]">fork_right</span>
</button>
</div>
</div>
</article>

<article className="group bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
<div>

<div className="relative w-full h-36 rounded-lg bg-surface-container-low mb-space-md overflow-hidden flex items-center justify-center">
<svg className="w-full h-full p-4 opacity-75" fill="none" viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg">
<rect className="fill-surface-container-high stroke-outline" height="60" rx="3" strokeWidth="1" width="60" x="40" y="30"></rect>
<text className="fill-on-surface-variant font-code-sm text-[11px] font-bold" textAnchor="middle" x="70" y="65">CAP</text>
<rect className="fill-surface-container-high stroke-outline" height="60" rx="3" strokeWidth="1" width="60" x="120" y="30"></rect>
<text className="fill-on-surface-variant font-code-sm text-[11px] font-bold" textAnchor="middle" x="150" y="65">PACELC</text>
<rect className="fill-surface-container-high stroke-outline" height="60" rx="3" strokeWidth="1" width="60" x="200" y="30"></rect>
<text className="fill-on-surface-variant font-code-sm text-[11px] font-bold" textAnchor="middle" x="230" y="65">BASE</text>
</svg>
<div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm shadow-sm">
<span className="material-symbols-outlined text-tertiary text-[14px]">quick_reference_all</span>
<span className="font-code-sm text-[11px] text-on-surface font-medium">Cheat Sheet</span>
</div>
<button className="absolute top-2 right-2 p-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-outline hover:text-primary hover:bg-surface-container-lowest shadow-sm transition-colors" title="Bookmark">
<span className="material-symbols-outlined text-[18px]">bookmark_border</span>
</button>
</div>
<div className="flex items-center gap-2 mb-2 flex-wrap">
<span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-tertiary font-semibold">Intermediate</span>
<span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[14px] text-outline">schedule</span> 12 min reference
            </span>
<span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface">
<span className="text-secondary font-bold">★ 4.90</span>
<span className="text-outline font-code-sm text-[11px]">(890)</span>
</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors leading-snug mb-1.5">
            Distributed Systems Trade-off Matrix (PACELC)
          </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-space-md">
            A high-density side-by-side comparison of Cassandra, CockroachDB, MongoDB, DynamoDB, and VoltDB under real-world partition scenarios.
          </p>
<div className="flex items-center gap-2 mb-space-md">
<div className="w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center font-code-sm text-[9px] text-on-surface font-bold">DS</div>
<span className="font-label-sm text-label-sm text-on-surface-variant truncate">Daniel Abadi &amp; LearnMate Staff</span>
</div>
</div>
<div className="pt-space-sm bg-surface-container-low/30 -mx-space-lg -mb-space-lg px-space-lg pb-space-md">
<div className="flex items-center justify-between mb-2">
<span className="font-code-sm text-code-sm text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-secondary text-[14px]">check_circle</span> In Offline Vault
            </span>
<span className="font-code-sm text-code-sm text-secondary font-bold">Archived</span>
</div>
<div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden mb-space-md">
<div className="h-full bg-secondary rounded-full" style={{ width: '100%' }}></div>
</div>
<div className="flex items-center gap-2">
<a className="flex-1 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-label-md text-label-md text-center transition-all" href="#">
              Export SVG / PDF
            </a>
<button className="p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors shadow-sm" title="Copy Markdown table">
<span className="material-symbols-outlined text-[18px]">content_copy</span>
</button>
</div>
</div>
</article>

<article className="group bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
<div>

<div className="relative w-full h-36 rounded-lg bg-surface-container-low mb-space-md overflow-hidden flex items-center justify-center">
<svg className="w-full h-full p-4 opacity-80" fill="none" viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg">
<circle className="stroke-primary" cx="150" cy="60" r="42" strokeDasharray="4 2" strokeWidth="2"></circle>
<circle className="fill-primary" cx="150" cy="18" r="7"></circle>
<circle className="fill-secondary" cx="192" cy="60" r="7"></circle>
<circle className="fill-tertiary" cx="150" cy="102" r="7"></circle>
<circle className="fill-primary-container" cx="108" cy="60" r="7"></circle>
<path className="stroke-error" d="M120 40 L180 80" strokeWidth="1.5"></path>
<text className="fill-error font-code-sm text-[9px] font-bold" x="215" y="105">Partition A/B</text>
</svg>
<div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm shadow-sm">
<span className="material-symbols-outlined text-secondary text-[14px]">terminal</span>
<span className="font-code-sm text-[11px] text-on-surface font-medium">Interactive Lab</span>
</div>
<button className="absolute top-2 right-2 p-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-outline hover:text-primary hover:bg-surface-container-lowest shadow-sm transition-colors" title="Bookmark">
<span className="material-symbols-outlined text-[18px]">bookmark_border</span>
</button>
</div>
<div className="flex items-center gap-2 mb-2 flex-wrap">
<span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-secondary font-semibold">Expert</span>
<span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[14px] text-outline">schedule</span> 40 min lab
            </span>
<span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface">
<span className="text-secondary font-bold">★ 4.98</span>
<span className="text-outline font-code-sm text-[11px]">(318)</span>
</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors leading-snug mb-1.5">
            Distributed Vector Clocks &amp; Conflict Resolution
          </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-space-md">
            Execute manual causal history reconciliations, sibling generation in Riak-style storage, and deterministic LWW merge strategies.
          </p>
<div className="flex items-center gap-2 mb-space-md">
<img className="w-5 h-5 rounded-full object-cover" data-alt="High resolution clean portrait of a young computer scientist with glasses looking thoughtfully at the camera." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFuCT12W5MXsm145m_bkBtnIUrEc0xGZtIK4L9nG1kx-Pai_Blw8HnfHJYMbIO6_jltKhIc8g4UBdL8mSjuz16x6ZVtmfuyjbWbXaFrPwtBU6nsq184QMZTrQMLsEO_jSUq5F-taTqXNG-PMF66Bu7Ye4-WMhM0NfeyNqQcFS7exu6kxawp1HxZr2yJuqrENPRe-f93jm4WEDJKcMxXkpy9cs8xAKwtzgOWmm2cQOC" />
<span className="font-label-sm text-label-sm text-on-surface-variant truncate">Leslie Lamport Research Group</span>
</div>
</div>
<div className="pt-space-sm bg-surface-container-low/30 -mx-space-lg -mb-space-lg px-space-lg pb-space-md">
<div className="flex items-center justify-between mb-2">
<span className="font-code-sm text-code-sm text-outline">Status: Ready to start</span>
<span className="font-code-sm text-code-sm text-outline font-medium">0%</span>
</div>
<div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden mb-space-md">
<div className="h-full bg-outline-variant rounded-full" style={{ width: '0%' }}></div>
</div>
<div className="flex items-center gap-2">
<a className="flex-1 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md text-center transition-all shadow-sm" href="#">
              Start Simulation
            </a>
<button className="p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors shadow-sm" title="View Prerequisites">
<span className="material-symbols-outlined text-[18px]">checklist</span>
</button>
</div>
</div>
</article>
</div>

<div className="mt-space-xl flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-lg bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
<div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
<span>Showing <strong className="text-on-surface">1 - 6</strong> of 348 curated items</span>
<span className="text-outline">•</span>
<span className="font-code-sm text-code-sm">Page 1 of 58</span>
</div>
<div className="flex items-center gap-1.5">
<button className="px-3 py-1.5 rounded-lg bg-surface-container text-outline cursor-not-allowed font-label-sm text-label-sm flex items-center gap-1" disabled>
<span className="material-symbols-outlined text-[16px]">west</span>
<span>Previous</span>
</button>
<button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-semibold">1</button>
<button className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm">2</button>
<button className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm">3</button>
<span className="px-1 text-outline font-code-sm">...</span>
<button className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm">58</button>
<button className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm flex items-center gap-1 transition-colors">
<span>Next</span>
<span className="material-symbols-outlined text-[16px]">east</span>
</button>
</div>
</div>
</div>

<div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3 pointer-events-none">

<div className="pointer-events-auto hidden w-80 bg-surface-container-lowest rounded-xl shadow-xl p-space-md transition-all flex flex-col gap-3" id="quick-drawer">
<div className="flex items-center justify-between pb-2">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[20px]">sticky_note_2</span>
<h4 className="font-headline-sm text-headline-sm text-on-surface">Scratchpad &amp; Saves</h4>
</div>
<button className="text-outline hover:text-on-surface p-1 rounded transition-colors" id="close-drawer">
<span className="material-symbols-outlined text-[18px]">close</span>
</button>
</div>

<div className="space-y-2">
<span className="font-code-sm text-[11px] text-outline uppercase tracking-wider font-semibold">Pinned For Tonight</span>
<div className="p-2 rounded-lg bg-surface-container-low flex items-center justify-between hover:bg-surface-container transition-colors cursor-pointer">
<div className="min-w-0 pr-2">
<p className="font-label-sm text-label-sm text-on-surface truncate">Raft Failure Simulator</p>
<p className="font-code-sm text-[10px] text-primary">Lab • 80% finished</p>
</div>
<span className="material-symbols-outlined text-[16px] text-outline">arrow_outward</span>
</div>
<div className="p-2 rounded-lg bg-surface-container-low flex items-center justify-between hover:bg-surface-container transition-colors cursor-pointer">
<div className="min-w-0 pr-2">
<p className="font-label-sm text-label-sm text-on-surface truncate">Lock-Free MS-Queue</p>
<p className="font-code-sm text-[10px] text-secondary">Rust • 35% finished</p>
</div>
<span className="material-symbols-outlined text-[16px] text-outline">arrow_outward</span>
</div>
</div>

<div className="mt-1">
<label className="font-code-sm text-[11px] text-outline uppercase tracking-wider font-semibold block mb-1" htmlFor="scratchpad">Quick Note</label>
<textarea className="w-full p-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary resize-none" id="scratchpad" placeholder="Jot down a question, invariant, or reminder..." rows={3}></textarea>
</div>
<button className="w-full py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm hover:bg-primary-container transition-colors">
        Save to Workspace Docs
      </button>
</div>

<button aria-label="Open Quick Notes and Bookmarks Drawer" className="pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-full bg-on-background text-surface-container-lowest shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 group" id="toggle-drawer">
<span className="material-symbols-outlined text-[20px] text-primary-fixed group-hover:rotate-12 transition-transform">edit_note</span>
<span className="font-label-md text-label-md font-semibold tracking-wide">Quick Notes (2)</span>
<span className="w-2 h-2 rounded-full bg-primary-fixed animate-ping"></span>
</button>
</div>


</div>
  );
}
