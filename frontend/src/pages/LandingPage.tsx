import { useState } from 'react';

type TrackKey = 'dist' | 'sys' | 'ai' | 'db';

interface TrackData {
  id: TrackKey;
  tabLabel: string;
  tabIcon: string;
  level: string;
  hours: string;
  stack: string;
  title: string;
  description: string;
  activeEngineers: string;
  retentionScore: string;
  modules: string[];
}

const TRACKS_DATA: Record<TrackKey, TrackData> = {
  dist: {
    id: 'dist',
    tabLabel: 'Distributed Systems & Consensus',
    tabIcon: 'dns',
    level: 'Advanced',
    hours: '28 Estimated Hours',
    stack: 'Rust / Go Execution',
    title: 'Distributed Consensus, Replicated State Machines & Fault Tolerance',
    description:
      'Implement a battle-tested Raft implementation conforming strictly to Diego Ongaro’s Stanford doctoral thesis. Handle log compaction, asynchronous heartbeats, split votes under simulated packet dropouts, and multi-datacenter quorum failovers.',
    activeEngineers: '14,820 Active Engineers',
    retentionScore: '91.4%',
    modules: [
      'Module 1: Atomic Broadcast, Total Order, and Lamport Clock Proofs',
      'Module 2: Building Raft Consensus Engine with Network Fault Injection',
      'Module 3: Multi-Paxos Invariants and Viewstamped Replication Protocols',
      'Module 4: Byzantine Agreement & Gossip Protocol Convergence Rates',
    ],
  },
  sys: {
    id: 'sys',
    tabLabel: 'Systems Architecture & C++',
    tabIcon: 'memory',
    level: 'Principal',
    hours: '34 Estimated Hours',
    stack: 'C++20 / x86 & ARM Assembly',
    title: 'Low-Level Systems: C++20 Memory Models, SIMD & Cache Line Alignment',
    description:
      'Master sequential consistency, acquire-release semantics, and relaxed memory orderings across contemporary CPU microarchitectures. Construct lock-free wait-free ring buffers and SIMD-vectorized string scanners.',
    activeEngineers: '11,430 Active Engineers',
    retentionScore: '93.8%',
    modules: [
      'Module 1: Hardware Memory Architectures, False Sharing & Cache Invalidation',
      'Module 2: C++20 std::atomic Orderings and Hardware Store Buffers',
      'Module 3: Zero-Copy Lockless Ring Buffers with ABA Prevention',
      'Module 4: AVX-512 & ARM Neon Vectorization for Data Serialization',
    ],
  },
  ai: {
    id: 'ai',
    tabLabel: 'Production LLM Infrastructure',
    tabIcon: 'neurology',
    level: 'Advanced',
    hours: '24 Estimated Hours',
    stack: 'PyTorch / Triton / CUDA',
    title: 'Production LLMOps: vLLM PagedAttention, KV-Cache & Quantization Kernels',
    description:
      'Design modern GPU serving runtimes from first principles. Implement non-contiguous virtual memory allocation for transformer key-value caches (PagedAttention), continuous batching, and FP8/INT4 weight quantization kernels.',
    activeEngineers: '18,910 Active Engineers',
    retentionScore: '94.2%',
    modules: [
      'Module 1: Transformer Inference Bottlenecks & KV Cache Memory Profiling',
      'Module 2: PagedAttention Implementation with Virtual Memory Page Tables',
      'Module 3: Continuous Request Batching & Chunked Prefill Schedulers',
      'Module 4: Writing Custom Triton Kernels for AWQ & FP8 Matrix Multiplications',
    ],
  },
  db: {
    id: 'db',
    tabLabel: 'High-Throughput Storage Engines',
    tabIcon: 'database',
    level: 'Master',
    hours: '30 Estimated Hours',
    stack: 'Rust / C++ / io_uring',
    title: 'LSM-Trees, B-Trees & Write-Ahead Logs in Storage Engine Design',
    description:
      'Build an industrial embedded storage engine resembling RocksDB and SQLite. Write asynchronous write-ahead logs using io_uring, implement Leveled Compaction strategies, and optimize Bloom filters for prefix seeks.',
    activeEngineers: '9,740 Active Engineers',
    retentionScore: '92.6%',
    modules: [
      'Module 1: Durability Guarantees with Write-Ahead Logging & fsync Semantics',
      'Module 2: MemTable Concurrency: Lock-Free SkipLists vs MassTree',
      'Module 3: SSTable Encoding, Block Cache Locality & Block-Based Bloom Filters',
      'Module 4: Leveled vs Size-Tiered Compaction Under Write Amplification Limits',
    ],
  },
};

const BRAND_PARTNERS = [
  {
    name: 'Datadog',
    svgPath:
      'M19.57 17.04l-1.997-1.316-1.665 2.782-1.937-.567-1.706 2.604.087.82 9.274-1.71-.538-5.794zm-8.649-2.498l1.488-.204c.241.108.409.15.697.223.45.117.97.23 1.741-.16.18-.088.553-.43.704-.625l6.096-1.106.622 7.527-10.444 1.882zm11.325-2.712l-.602.115L20.488 0 .789 2.285l2.427 19.693 2.306-.334c-.184-.263-.471-.581-.96-.989-.68-.564-.44-1.522-.039-2.127.53-1.022 3.26-2.322 3.106-3.956-.056-.594-.15-1.368-.702-1.898-.02.22.017.432.017.432s-.227-.289-.34-.683c-.112-.15-.2-.199-.319-.4-.085.233-.073.503-.073.503s-.186-.437-.216-.807c-.11.166-.137.48-.137.48s-.241-.69-.186-1.062c-.11-.323-.436-.965-.343-2.424.6.421 1.924.321 2.44-.439.171-.251.288-.939-.086-2.293-.24-.868-.835-2.16-1.066-2.651l-.028.02c.122.395.374 1.223.47 1.625.293 1.218.372 1.642.234 2.204-.116.488-.397.808-1.107 1.165-.71.358-1.653-.514-1.713-.562-.69-.55-1.224-1.447-1.284-1.883-.062-.477.275-.763.445-1.153-.243.07-.514.192-.514.192s.323-.334.722-.624c.165-.109.262-.178.436-.323a9.762 9.762 0 0 0-.456.003s.42-.227.855-.392c-.318-.014-.623-.003-.623-.003s.937-.419 1.678-.727c.509-.208 1.006-.147 1.286.257.367.53.752.817 1.569.996.501-.223.653-.337 1.284-.509.554-.61.99-.688.99-.688s-.216.198-.274.51c.314-.249.66-.455.66-.455s-.134.164-.259.426l.03.043c.366-.22.797-.394.797-.394s-.123.156-.268.358c.277-.002.838.012 1.056.037 1.285.028 1.552-1.374 2.045-1.55.618-.22.894-.353 1.947.68.903.888 1.609 2.477 1.259 2.833-.294.295-.874-.115-1.516-.916a3.466 3.466 0 0 1-.716-1.562 1.533 1.533 0 0 0-.497-.85s.23.51.23.96c0 .246.03 1.165.424 1.68-.039.076-.057.374-.1.43-.458-.554-1.443-.95-1.604-1.067.544.445 1.793 1.468 2.273 2.449.453.927.186 1.777.416 1.997.065.063.976 1.197 1.15 1.767.306.994.019 2.038-.381 2.685l-1.117.174c-.163-.045-.273-.068-.42-.153.08-.143.241-.5.243-.572l-.063-.111c-.348.492-.93.97-1.414 1.245-.633.359-1.363.304-1.838.156-1.348-.415-2.623-1.327-2.93-1.566 0 0-.01.191.048.234.34.383 1.119 1.077 1.872 1.56l-1.605.177.759 5.908c-.337.048-.39.071-.757.124-.325-1.147-.946-1.895-1.624-2.332-.599-.384-1.424-.47-2.214-.314l-.05.059a2.851 2.851 0 0 1 1.863.444c.654.413 1.181 1.481 1.375 2.124.248.822.42 1.7-.248 2.632-.476.662-1.864 1.028-2.986.237.3.481.705.876 1.25.95.809.11 1.577-.03 2.106-.574.452-.464.69-1.434.628-2.456l.714-.104.258 1.834 11.827-1.424zM15.05 6.848c-.034.075-.085.125-.007.37l.004.014.013.032.032.073c.14.287.295.558.552.696.067-.011.136-.019.207-.023.242-.01.395.028.492.08.009-.048.01-.119.005-.222-.018-.364.072-.982-.626-1.308-.264-.122-.634-.084-.757.068a.302.302 0 0 1 .058.013c.186.066.06.13.027.207m1.958 3.392c-.092-.05-.52-.03-.821.005-.574.068-1.193.267-1.328.372-.247.191-.135.523.047.66.511.382.96.638 1.432.575.29-.038.546-.497.728-.914.124-.288.124-.598-.058-.698m-5.077-2.942c.162-.154-.805-.355-1.556.156-.554.378-.571 1.187-.041 1.646.053.046.096.078.137.104a4.77 4.77 0 0 1 1.396-.412c.113-.125.243-.345.21-.745-.044-.542-.455-.456-.146-.749',
  },
  {
    name: 'Stripe',
    svgPath:
      'M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z',
  },
  {
    name: 'Cloudflare',
    svgPath:
      'M16.5088 16.8447c.1475-.5068.0908-.9707-.1553-1.3154-.2246-.3164-.6045-.499-1.0615-.5205l-8.6592-.1123a.1559.1559 0 0 1-.1333-.0713c-.0283-.042-.0351-.0986-.021-.1553.0278-.084.1123-.1484.2036-.1562l8.7359-.1123c1.0351-.0489 2.1601-.8868 2.5537-1.9136l.499-1.3013c.0215-.0561.0293-.1128.0147-.168-.5625-2.5463-2.835-4.4453-5.5499-4.4453-2.5039 0-4.6284 1.6177-5.3876 3.8614-.4927-.3658-1.1187-.5625-1.794-.499-1.2026.119-2.1665 1.083-2.2861 2.2856-.0283.31-.0069.6128.0635.894C1.5683 13.171 0 14.7754 0 16.752c0 .1748.0142.3515.0352.5273.0141.083.0844.1475.1689.1475h15.9814c.0909 0 .1758-.0645.2032-.1553l.12-.4268zm2.7568-5.5634c-.0771 0-.1611 0-.2383.0112-.0566 0-.1054.0415-.127.0976l-.3378 1.1744c-.1475.5068-.0918.9707.1543 1.3164.2256.3164.6055.498 1.0625.5195l1.8437.1133c.0557 0 .1055.0263.1329.0703.0283.043.0351.1074.0214.1562-.0283.084-.1132.1485-.204.1553l-1.921.1123c-1.041.0488-2.1582.8867-2.5527 1.914l-.1406.3585c-.0283.0713.0215.1416.0986.1416h6.5977c.0771 0 .1474-.0489.169-.126.1122-.4082.1757-.837.1757-1.2803 0-2.6025-2.125-4.727-4.7344-4.727',
  },
  {
    name: 'Figma',
    svgPath:
      'M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z',
  },
  {
    name: 'Linear',
    svgPath:
      'M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z',
  },
  {
    name: 'Netflix',
    svgPath:
      'm5.398 0 8.348 23.602c2.346.059 4.856.398 4.856.398L10.113 0H5.398zm8.489 0v9.172l4.715 13.33V0h-4.715zM5.398 1.5V24c1.873-.225 2.81-.312 4.715-.398V14.83L5.398 1.5z',
  },
  {
    name: 'Uber',
    svgPath:
      'M0 7.97v4.958c0 1.867 1.302 3.101 3 3.101.826 0 1.562-.316 2.094-.87v.736H6.27V7.97H5.082v4.888c0 1.257-.85 2.106-1.947 2.106-1.11 0-1.946-.827-1.946-2.106V7.971H0zm7.44 0v7.925h1.13v-.725c.521.532 1.257.86 2.06.86a3.006 3.006 0 0 0 3.034-3.01 3.01 3.01 0 0 0-3.033-3.024 2.86 2.86 0 0 0-2.049.861V7.971H7.439zm9.869 2.038c-1.687 0-2.965 1.37-2.965 3 0 1.72 1.334 3.01 3.066 3.01 1.053 0 1.913-.463 2.49-1.233l-.826-.611c-.43.577-.996.847-1.664.847-.973 0-1.753-.7-1.912-1.64h4.697v-.373c0-1.72-1.222-3-2.886-3zm6.295.068c-.634 0-1.098.294-1.381.758v-.713h-1.131v5.774h1.142V12.61c0-.894.544-1.47 1.291-1.47H24v-1.065h-.396zm-6.319.928c.85 0 1.564.588 1.756 1.47H15.52c.203-.882.916-1.47 1.765-1.47zm-6.732.012c1.086 0 1.98.883 1.98 2.004a1.993 1.993 0 0 1-1.98 2.001A1.989 1.989 0 0 1 8.56 13.02a1.99 1.99 0 0 1 1.992-2.004z',
  },
  {
    name: 'Snowflake',
    svgPath:
      'M24 3.459c0 .646-.418 1.18-1.141 1.18-.723 0-1.142-.534-1.142-1.18 0-.647.419-1.18 1.142-1.18.723 0 1.141.533 1.141 1.18zm-.228 0c0-.533-.38-.951-.913-.951s-.913.38-.913.95c0 .533.38.952.913.952.57 0 .913-.419.913-.951zm-1.37-.533h.495c.266 0 .456.152.456.38 0 .153-.076.229-.19.305l.19.266v.038h-.266l-.19-.266h-.229v.266h-.266zm.495.228h-.229v.267h.229c.114 0 .152-.038.152-.114.038-.077-.038-.153-.152-.153zM7.602 12.4c.038-.151.076-.304.076-.456 0-.114-.038-.228-.038-.342-.114-.343-.304-.647-.646-.838l-4.87-2.777c-.685-.38-1.56-.152-1.94.533-.381.685-.153 1.56.532 1.94l2.701 1.56-2.701 1.56c-.685.38-.913 1.256-.533 1.94.38.685 1.256.914 1.94.533l4.832-2.777c.343-.267.571-.533.647-.876zm1.332 2.626c-.266-.038-.57.038-.837.19l-4.832 2.777c-.685.38-.913 1.256-.532 1.94.38.686 1.255.914 1.94.533l2.701-1.56v3.12c0 .8.647 1.408 1.446 1.408.799 0 1.407-.647 1.407-1.408v-5.592c0-.761-.57-1.37-1.293-1.408zm4.946-6.088c.266.038.57-.038.837-.19l4.832-2.777c.685-.38.913-1.256.532-1.94-.38-.686-1.255-.914-1.94-.533l-2.701 1.56V1.975c0-.799-.647-1.408-1.446-1.408-.799 0-1.446.609-1.446 1.408V7.53c0 .76.609 1.37 1.332 1.407zM3.265 5.97l4.832 2.777c.266.152.533.19.837.19.723-.038 1.331-.684 1.331-1.407V1.975c0-.799-.646-1.408-1.407-1.408-.799 0-1.446.647-1.446 1.408v3.12l-2.701-1.56c-.685-.38-1.56-.152-1.94.533-.419.646-.19 1.521.494 1.902zm9.093 6.011a.412.412 0 00-.114-.266l-.57-.571a.346.346 0 00-.267-.114.412.412 0 00-.266.114l-.571.57a.411.411 0 00-.114.267c0 .076.038.19.114.267l.57.57a.345.345 0 00.267.114c.076 0 .19-.038.266-.114l.571-.57a.412.412 0 00.114-.267zm1.598.533L11.94 14.53c-.039.038-.153.114-.229.114h-.608a.411.411 0 01-.267-.114L8.82 12.514a.408.408 0 01-.076-.229v-.608c0-.076.038-.19.114-.267l2.016-2.016a.41.41 0 01.267-.114h.608a.41.41 0 01.267.114l2.016 2.016a.347.347 0 01.114.267v.608c-.076.077-.114.19-.19.229zm5.593 5.44l-4.832-2.777c-.266-.152-.57-.19-.837-.152-.723.038-1.332.684-1.332 1.408v5.554c0 .8.647 1.408 1.408 1.408.799 0 1.446-.647 1.446-1.408v-3.12l2.7 1.56c.686.38 1.561.152 1.941-.533.419-.646.19-1.521-.494-1.94zm2.549-7.533l-2.701 1.56 2.7 1.56c.686.38.914 1.256.533 1.94-.38.685-1.255.913-1.94.533l-4.832-2.778a1.644 1.644 0 01-.647-.798c-.037-.153-.076-.305-.076-.457 0-.114.039-.228.039-.342.114-.343.342-.647.646-.837l4.832-2.778c.685-.38 1.56-.152 1.94.533.457.609.19 1.484-.494 1.864',
  },
];

const FAQS = [
  {
    question: 'Is LearnMate really completely free for individual learners?',
    answer:
      'Yes. All individual self-directed tracks, sandboxes, AI companion turns, and spaced repetition engines are 100% free during our public beta. In the future, we will offer dedicated enterprise workspaces with private team tracks and SSO, while individual learning remains free forever.',
  },
  {
    question: 'How does the AI calibration detect my specific knowledge gaps?',
    answer:
      'When you enter a track, you can run a 6-minute diagnostic coding scenario. LearnMate’s AST parser and invariant checking evaluate not just whether tests pass, but how you handle edge cases, synchronization invariants, memory allocations, and algorithmic complexity. It maps your competency directly into our DAG.',
  },
  {
    question: 'How does LearnMate compare to video courses like Coursera or Udemy?',
    answer:
      'Video courses are non-interactive broadcast media with average completion rates under 12%. LearnMate is an active retrieval system: every concept involves code execution, architecture diagramming, and real-time dialectic critique. You build working systems from commit zero.',
  },
  {
    question: 'Can I export my completed roadmaps and code implementations?',
    answer:
      'Absolutely. Every track builds toward a full production repository (e.g., a runnable Raft consensus engine in Rust or a vectorized KV store in C++). You can sync your implementations directly to your GitHub account with a single click.',
  },
];

export function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTrack, setActiveTrack] = useState<TrackKey>('dist');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const currentTrack = TRACKS_DATA[activeTrack];

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col" id="top">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface/85 backdrop-blur-xl border-b border-border/40 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="h-16 max-w-7xl mx-auto px-gutter flex items-center justify-between">
          <a
            className="flex items-center gap-space-xs group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">terminal</span>
            </div>
            <div className="flex items-center">
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Learn</span>
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight">Mate</span>
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                AI
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-space-sm">
            <a
              className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              href="#features"
            >
              Features
            </a>
            <a
              className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              href="#curriculum"
            >
              Curriculum
            </a>
            <a
              className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              href="#methodology"
            >
              Methodology
            </a>
            <a
              className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              href="#testimonials"
            >
              Testimonials
            </a>
            <a
              className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              href="#faq"
            >
              FAQ
            </a>
          </nav>

          {/* Top-Right CTAs: Simplified with Secondary Text Link + Single Primary CTA */}
          <div className="hidden sm:flex items-center gap-space-sm">
            <a
              className="px-space-md py-space-sm font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors font-medium rounded-lg hover:bg-surface-container-low"
              href="/signup"
            >
              Sign In
            </a>
            <a
              className="px-space-md py-space-sm font-label-md text-label-md bg-primary-container text-on-primary rounded-lg shadow-sm hover:bg-secondary transition-all active:scale-[0.98] flex items-center gap-1.5 font-semibold"
              href="/signup"
            >
              <span>Start Learning Free</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              className="px-3 py-1.5 font-label-sm text-label-sm bg-primary-container text-on-primary rounded-lg shadow-sm font-semibold"
              href="/signup"
            >
              Start Free
            </a>
            <button
              type="button"
              className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-surface-container-lowest border-b border-border shadow-lg px-gutter py-space-md space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-1">
              <a
                className="px-3 py-2 rounded-lg text-body-md text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                className="px-3 py-2 rounded-lg text-body-md text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                href="#curriculum"
                onClick={() => setMobileMenuOpen(false)}
              >
                Curriculum
              </a>
              <a
                className="px-3 py-2 rounded-lg text-body-md text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                href="#methodology"
                onClick={() => setMobileMenuOpen(false)}
              >
                Methodology
              </a>
              <a
                className="px-3 py-2 rounded-lg text-body-md text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </a>
              <a
                className="px-3 py-2 rounded-lg text-body-md text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
            </nav>
            <div className="pt-2 border-t border-border/60 flex flex-col gap-2">
              <a
                className="w-full text-center py-2 text-label-md font-medium text-on-surface-variant hover:text-primary transition-colors"
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </a>
              <a
                className="w-full py-2.5 bg-primary-container text-on-primary rounded-lg text-center font-label-md font-semibold shadow-sm flex items-center justify-center gap-1.5"
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Start Learning Free</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="w-full pt-16 bg-surface flex-1">
        <div className="flex flex-col w-full">
          {/* Hero Section */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-gradient-to-b from-primary-container/15 via-secondary/5 to-transparent blur-3xl rounded-full pointer-events-none" />

            <section className="relative max-w-7xl mx-auto px-gutter pt-space-lg pb-space-xl lg:pb-32 flex flex-col items-center text-center">
              {/* Release Announcement Pill */}
              <a
                className="inline-flex items-center gap-space-xs px-3 py-1.5 rounded-full bg-surface-container-high text-primary hover:bg-surface-container-highest transition-colors group mb-space-md shadow-sm"
                href="#curriculum"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-on-surface transition-colors">
                  Autonomous Learning Graphs · 100% Free Public Beta
                </span>
                <span className="material-symbols-outlined text-[14px] text-primary group-hover:translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
              </a>

              {/* Headline & Subtitle */}
              <h1 className="font-display-lg text-display-lg-mobile lg:text-display-lg text-on-surface max-w-4xl tracking-tight leading-tight lg:leading-[52px]">
                Master Complex Engineering Domains with{' '}
                <span className="text-primary-container">AI-Calibrated</span> Learning
              </h1>
              <p className="mt-space-md font-body-lg text-body-lg text-on-surface-variant max-w-2xl text-center">
                LearnMate replaces fragmented tutorials with a dynamic, DAG-based curriculum that adapts in real time to your code submissions, mental models, and knowledge gaps.
              </p>

              {/* Hero CTAs */}
              <div className="mt-space-lg flex flex-col sm:flex-row items-center gap-space-sm w-full sm:w-auto">
                <a
                  className="w-full sm:w-auto px-space-lg py-space-sm bg-primary-container text-on-primary font-label-md text-label-md rounded-lg shadow-md hover:bg-secondary transition-all active:scale-[0.98] flex items-center justify-center gap-2 font-semibold"
                  href="/signup"
                >
                  <span>Start Learning Free</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </a>
                <a
                  className="w-full sm:w-auto px-space-lg py-space-sm bg-surface-container-lowest text-on-surface font-label-md text-label-md rounded-lg shadow-sm hover:bg-surface-container-low transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-border/40"
                  href="#curriculum"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">account_tree</span>
                  <span>Explore Interactive Curriculum</span>
                </a>
              </div>

              {/* Rolling Brand Animation (Continuous Marquee) */}
              <div className="mt-space-xl flex flex-col items-center gap-space-sm w-full max-w-5xl">
                <p className="font-label-sm text-label-sm uppercase tracking-wider text-outline text-center">
                  Trusted by 42,000+ senior engineers from top engineering teams
                </p>
                <div className="relative w-full overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                  <div className="animate-marquee flex items-center gap-10 lg:gap-14">
                    {[...BRAND_PARTNERS, ...BRAND_PARTNERS].map((brand, idx) => (
                      <div
                        key={`${brand.name}-${idx}`}
                        className="group flex items-center gap-2.5 font-headline-sm text-headline-sm tracking-tight text-on-surface-variant hover:text-on-surface font-bold opacity-80 hover:opacity-100 transition-all shrink-0 cursor-default select-none"
                      >
                        <svg
                          role="img"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 text-primary shrink-0 transition-transform group-hover:scale-110"
                          aria-hidden="true"
                        >
                          <path d={brand.svgPath} />
                        </svg>
                        <span>{brand.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hero Platform Mockup / DAG Visualization */}
              <div className="w-full mt-space-xl rounded-xl bg-surface-container-lowest shadow-xl p-space-sm md:p-space-md lg:p-space-lg text-left border border-border/50">
                <div className="flex flex-wrap items-center justify-between pb-space-sm mb-space-md gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-error" />
                    <span className="w-3 h-3 rounded-full bg-secondary-fixed-dim" />
                    <span className="w-3 h-3 rounded-full bg-surface-variant" />
                    <span className="ml-2 font-code-sm text-code-sm text-on-surface-variant">
                      learnmate://sandbox/distributed-systems/raft-election.rs
                    </span>
                  </div>
                  <div className="flex items-center gap-space-md">
                    <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary bg-surface-container-high px-2 py-0.5 rounded-full font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-container" /> Calibrated Real-Time
                    </span>
                    <span className="font-code-sm text-code-sm text-on-surface-variant">
                      Retention Score: <strong className="text-on-surface font-semibold">94.2%</strong>
                    </span>
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
                        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                          Level 4 / Master
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                        Dynamic dependency node graph generated from your initial diagnostic on Distributed State Machines.
                      </p>

                      <div className="space-y-space-sm">
                        <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
                          <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[16px]">check</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-headline-sm text-headline-sm text-on-surface">Linearizability &amp; Clocks</span>
                              <span className="font-code-sm text-code-sm text-primary font-semibold">100%</span>
                            </div>
                            <span className="font-body-sm text-body-sm text-on-surface-variant truncate block">
                              Lamport timestamps, Vector clocks, Partial orders
                            </span>
                          </div>
                        </div>

                        <div className="w-0.5 h-3 bg-primary-container ml-4 -my-1" />

                        <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-high shadow-md">
                          <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 animate-pulse">
                            <span className="material-symbols-outlined text-[16px]">bolt</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-headline-sm text-headline-sm text-primary font-bold">Raft Consensus Algorithm</span>
                              <span className="font-label-sm text-label-sm uppercase bg-primary-container text-on-primary px-1.5 py-0.5 rounded font-semibold">
                                Live
                              </span>
                            </div>
                            <span className="font-body-sm text-body-sm text-on-surface-variant truncate block">
                              Leader election, Log replication &amp; Split brain
                            </span>
                          </div>
                        </div>

                        <div className="w-0.5 h-3 bg-outline-variant ml-4 -my-1" />

                        <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-lowest opacity-85">
                          <div className="w-7 h-7 rounded-full bg-surface-variant text-on-surface flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[16px]">lock_open</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-headline-sm text-headline-sm text-on-surface">Byzantine Fault Tolerance</span>
                              <span className="font-code-sm text-code-sm text-on-surface-variant">Prerequisite Met</span>
                            </div>
                            <span className="font-body-sm text-body-sm text-on-surface-variant truncate block">
                              PBFT, Quorum intersection, Sybil resistance
                            </span>
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
                        <div className="h-full bg-primary-container rounded-full" style={{ width: '68%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 flex flex-col gap-space-sm">
                    <div className="bg-inverse-surface rounded-lg p-space-md text-inverse-on-surface font-code-sm text-code-sm overflow-x-auto shadow-inner">
                      <div className="flex justify-between items-center pb-2 mb-2 opacity-75">
                        <span className="text-surface-variant font-mono">src/consensus/election.rs</span>
                        <span className="text-secondary-fixed">Rust 1.78</span>
                      </div>
                      <pre className="leading-relaxed">
                        <code>
                          <span className="text-outline-variant">// Invariant: Only one leader per term</span>{'\n'}
                          <span className="text-secondary-fixed">pub async fn</span>{' '}
                          <span className="text-surface-bright font-bold">start_election</span>(&amp;
                          <span className="text-secondary-fixed">mut self</span>) -&gt; Result&lt;Role, ConsensusError&gt; &#123;{'\n'}
                          {'    '}<span className="text-secondary-fixed">self</span>.current_term += <span className="text-tertiary-fixed">1</span>;{'\n'}
                          {'    '}<span className="text-secondary-fixed">self</span>.voted_for = <span className="text-surface-variant">Some</span>(<span className="text-secondary-fixed">self</span>.node_id);{'\n'}
                          {'    '}<span className="text-secondary-fixed">let</span> mut votes_received = <span className="text-tertiary-fixed">1</span>;{'\n'}
                          {'\n'}
                          {'    '}<span className="text-outline-variant">// Broadcast RequestVote RPCs in parallel</span>{'\n'}
                          {'    '}<span className="text-secondary-fixed">for</span> peer <span className="text-secondary-fixed">in</span> &amp;<span className="text-secondary-fixed">self</span>.peers &#123;{'\n'}
                          {'        '}<span className="text-secondary-fixed">if</span> <span className="text-secondary-fixed">let</span> <span className="text-surface-variant">Ok</span>(vote) = peer.request_vote(<span className="text-secondary-fixed">self</span>.current_term).<span className="text-secondary-fixed">await</span> &#123;{'\n'}
                          {'            '}<span className="text-secondary-fixed">if</span> vote.term &gt; <span className="text-secondary-fixed">self</span>.current_term &#123;{'\n'}
                          {'                '}<span className="text-secondary-fixed">self</span>.step_down(vote.term);{'\n'}
                          {'                '}<span className="text-secondary-fixed">return</span> <span className="text-surface-variant">Ok</span>(Role::Follower);{'\n'}
                          {'            '}&#125;{'\n'}
                          {'        '}&#125;{'\n'}
                          {'    '}&#125;{'\n'}
                          &#125;
                        </code>
                      </pre>
                    </div>

                    <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm border border-border/40">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">psychology</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-headline-sm text-headline-sm text-on-surface">LearnMate Engine Note</span>
                            <span className="font-label-sm text-label-sm bg-surface-container text-primary px-2 py-0.5 rounded-full font-semibold">
                              AST Invariant Detection
                            </span>
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

          {/* Features / Pedagogical Paradigm Section */}
          <section className="w-full bg-surface-container-low py-space-xl lg:py-28 scroll-mt-16" id="features">
            <div className="max-w-7xl mx-auto px-gutter">
              <div className="max-w-2xl mb-space-xl">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">
                  Pedagogical Paradigm
                </span>
                <h2 className="font-headline-xl text-headline-xl-mobile lg:text-headline-xl text-on-surface mt-space-xs tracking-tight">
                  Engineered for Deep Retention, Not Passive Consumption
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-xs">
                  Traditional courses serve static 40-hour video playlists that evaporate in 3 weeks. LearnMate operates as a dialectic sparring partner tailored to your cognitive threshold.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between border border-transparent hover:border-border/60">
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

                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between border border-transparent hover:border-border/60">
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

                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between border border-transparent hover:border-border/60">
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

          {/* Curriculum Section with Dynamic Track Switcher */}
          <section className="w-full py-space-xl lg:py-28 bg-surface scroll-mt-16" id="curriculum">
            <div className="max-w-7xl mx-auto px-gutter">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">
                    Specialized Tracks
                  </span>
                  <h2 className="font-headline-xl text-headline-xl-mobile lg:text-headline-xl text-on-surface mt-space-xs tracking-tight">
                    Curriculums Designed for Principal-Track Engineers
                  </h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-xs max-w-xl">
                    Zero beginner toy projects. Build production-grade consensus engines, low-level compilers, and distributed stores from first principles.
                  </p>
                </div>
                <a
                  className="inline-flex items-center gap-1.5 font-label-md text-label-md text-primary hover:underline font-semibold self-start md:self-auto group"
                  href="/signup"
                >
                  <span>View All 16 Available Tracks</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </a>
              </div>

              {/* Interactive Tabs */}
              <div className="flex overflow-x-auto gap-space-xs pb-space-sm mb-space-lg no-scrollbar">
                {(Object.keys(TRACKS_DATA) as TrackKey[]).map((key) => {
                  const track = TRACKS_DATA[key];
                  const isActive = activeTrack === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveTrack(key)}
                      className={`px-space-md py-space-xs rounded-lg font-label-md text-label-md shrink-0 flex items-center gap-2 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-surface-container-high text-primary font-semibold shadow-sm'
                          : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{track.tabIcon}</span>
                      <span>{track.tabLabel}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Track Display Card */}
              <div className="bg-surface-container-lowest rounded-xl p-space-lg lg:p-space-xl shadow-lg border border-border/40 transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-space-xs mb-space-sm">
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold uppercase tracking-wider">
                          {currentTrack.level}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                          {currentTrack.hours}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                          {currentTrack.stack}
                        </span>
                      </div>
                      <h3 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                        {currentTrack.title}
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
                        {currentTrack.description}
                      </p>

                      <div className="mt-space-lg space-y-space-xs">
                        {currentTrack.modules.map((mod, i) => (
                          <div key={i} className="flex items-center gap-space-sm font-body-sm text-body-sm text-on-surface">
                            <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                            <span>{mod}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-space-lg pt-space-md flex flex-wrap items-center gap-space-md">
                      <a
                        className="px-space-md py-space-sm bg-primary-container text-on-primary font-label-md text-label-md rounded-lg shadow-sm hover:bg-secondary transition-all active:scale-[0.98] flex items-center gap-2 font-semibold"
                        href="/signup"
                      >
                        <span>Enroll in This Track (Free)</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </a>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Includes 12 diagnostic sandboxes &amp; verified peer completion credential
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-surface-container-low p-space-lg rounded-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-space-md">
                        <span className="font-headline-sm text-headline-sm text-on-surface">Track Analytics</span>
                        <span className="font-code-sm text-code-sm text-primary font-semibold">
                          {currentTrack.activeEngineers}
                        </span>
                      </div>

                      <div className="space-y-space-md">
                        <div>
                          <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-1">
                            <span>Average Concept Retention (90-Day Audit)</span>
                            <span className="font-semibold text-on-surface">{currentTrack.retentionScore}</span>
                          </div>
                          <div className="w-full h-3 bg-surface-variant rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-container rounded-full transition-all duration-500"
                              style={{ width: currentTrack.retentionScore }}
                            />
                          </div>
                        </div>

                        <div className="p-space-sm bg-surface-container-lowest rounded-lg shadow-sm">
                          <div className="flex justify-between items-center text-label-sm font-label-sm text-on-surface-variant mb-2">
                            <span>Memory Decay Curve vs LearnMate Spaced Model</span>
                            <span className="text-primary font-semibold">LearnMate Curve (+210%)</span>
                          </div>
                          <svg className="w-full h-24 text-primary" fill="none" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 20 C 50 65, 150 75, 290 75" stroke="#777587" strokeDasharray="4 4" strokeWidth="2" />
                            <path
                              d="M10 20 C 40 40, 60 50, 70 50 L 70 20 C 110 38, 140 45, 150 45 L 150 18 C 200 30, 240 35, 290 32"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            />
                            <circle cx="70" cy="20" fill="currentColor" r="3" />
                            <circle cx="150" cy="18" fill="currentColor" r="3" />
                            <circle cx="290" cy="32" fill="currentColor" r="3" />
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
                        <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                          Staff Engineer, Observability Infrastructure
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Methodology / Two Pillars Section */}
          <section className="w-full py-space-xl lg:py-28 bg-surface-container-low scroll-mt-16" id="methodology">
            <div className="max-w-7xl mx-auto px-gutter space-y-24">
              {/* Pillar 01 */}
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
                <div className="lg:col-span-6 bg-surface-container-lowest p-space-lg rounded-xl shadow-lg border border-border/40 hover:shadow-xl transition-shadow">
                  <div className="space-y-space-sm">
                    <div className="p-space-sm rounded-lg bg-surface-container-low text-on-surface text-body-sm font-body-sm">
                      <strong className="font-semibold text-primary block mb-1">Your Submission:</strong>
                      <code className="font-code-sm text-code-sm block text-on-surface bg-surface-container-lowest p-2 rounded border border-border/30">
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
                        <span className="font-label-sm text-label-sm bg-surface-container-highest px-2 py-0.5 rounded text-primary font-semibold">
                          Invariant #4 Checked
                        </span>
                        <span className="font-label-sm text-label-sm bg-surface-container-highest px-2 py-0.5 rounded text-on-surface-variant">
                          Quorum Size Strict Check
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pillar 02 */}
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
                    <div className="p-space-sm bg-surface-container-lowest rounded-lg shadow-sm border border-border/40">
                      <span className="font-headline-lg text-headline-lg text-primary font-bold">89%</span>
                      <span className="block font-body-sm text-body-sm text-on-surface-variant">
                        Course Completion Rate (vs 12% industry baseline)
                      </span>
                    </div>
                    <div className="p-space-sm bg-surface-container-lowest rounded-lg shadow-sm border border-border/40">
                      <span className="font-headline-lg text-headline-lg text-primary font-bold">3.4x</span>
                      <span className="block font-body-sm text-body-sm text-on-surface-variant">
                        Long-Term Retention after 6 Months
                      </span>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-6 lg:order-1 bg-surface-container-lowest p-space-lg rounded-xl shadow-lg border border-border/40 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-space-md">
                    <span className="font-headline-sm text-headline-sm text-on-surface">Synaptic Retention Matrix</span>
                    <span className="font-code-sm text-code-sm text-primary font-semibold">Active Streak: 41 Days</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 pt-2">
                    {Array.from({ length: 28 }).map((_, i) => {
                      const intensities = [
                        'bg-surface-variant',
                        'bg-primary-container/30',
                        'bg-primary-container/60',
                        'bg-primary-container',
                      ];
                      const level = (i * 3 + 2) % 4;
                      return (
                        <div
                          key={i}
                          className={`h-7 rounded ${intensities[level]} transition-transform hover:scale-110 cursor-pointer`}
                          title={`Day ${i + 1}: ${level * 25 + 25}% Retention`}
                        />
                      );
                    })}
                  </div>
                  <div className="mt-space-md pt-space-xs flex justify-between items-center font-label-sm text-label-sm text-on-surface-variant">
                    <span>Weak Recall</span>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded bg-surface-variant" />
                      <span className="w-2.5 h-2.5 rounded bg-primary-container/30" />
                      <span className="w-2.5 h-2.5 rounded bg-primary-container/60" />
                      <span className="w-2.5 h-2.5 rounded bg-primary-container" />
                    </div>
                    <span>Permanent Synaptic Retention</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials / Peer Reviews Section */}
          <section className="w-full py-space-xl lg:py-28 bg-surface scroll-mt-16" id="testimonials">
            <div className="max-w-7xl mx-auto px-gutter">
              <div className="text-center max-w-3xl mx-auto mb-space-xl">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">
                  Engineered Peer Reviews
                </span>
                <h2 className="font-headline-xl text-headline-xl-mobile lg:text-headline-xl text-on-surface mt-space-xs tracking-tight">
                  How Senior Engineers Use LearnMate to Leap Domains
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-xs">
                  Read verified feedback from Principal Engineers, Engineering Managers, and Tech Leads.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between border border-transparent hover:border-border/60">
                  <div>
                    <div className="flex items-center gap-1 text-primary mb-space-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-[18px]">
                          star
                        </span>
                      ))}
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
                      <div className="font-body-sm text-body-sm text-on-surface-variant">
                        Staff Infrastructure Engineer · Stripe
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between border border-transparent hover:border-border/60">
                  <div>
                    <div className="flex items-center gap-1 text-primary mb-space-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-[18px]">
                          star
                        </span>
                      ))}
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
                      <div className="font-body-sm text-body-sm text-on-surface-variant">
                        Principal Systems Architect · Cloudflare
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between border border-transparent hover:border-border/60">
                  <div>
                    <div className="flex items-center gap-1 text-primary mb-space-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-[18px]">
                          star
                        </span>
                      ))}
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
                      <div className="font-body-sm text-body-sm text-on-surface-variant">
                        Lead AI Platform Engineer · Datadog
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Collapsible FAQ Accordion */}
          <section className="w-full py-space-xl lg:py-28 bg-surface-container-low scroll-mt-16" id="faq">
            <div className="max-w-4xl mx-auto px-gutter">
              <div className="text-center mb-space-xl">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">
                  Questions &amp; Clarity
                </span>
                <h2 className="font-headline-xl text-headline-xl-mobile lg:text-headline-xl text-on-surface mt-space-xs tracking-tight">
                  Frequently Asked Questions
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-xs">
                  Everything you need to know about our pedagogy, beta access, and technical setup.
                </p>
              </div>

              <div className="space-y-space-sm" id="faq-container">
                {FAQS.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className={`rounded-xl p-space-md shadow-sm transition-all duration-300 border ${
                        isOpen
                          ? 'bg-surface-container-lowest border-primary/20 shadow-md'
                          : 'bg-surface-container-lowest border-transparent hover:border-outline-variant/40'
                      }`}
                    >
                      <button
                        type="button"
                        className="w-full flex items-center justify-between text-left font-headline-sm text-headline-sm text-on-surface focus:outline-none cursor-pointer group select-none"
                        onClick={() => toggleFaq(idx)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${idx}`}
                      >
                        <span className="group-hover:text-primary transition-colors pr-4">{faq.question}</span>
                        <span
                          className={`material-symbols-outlined shrink-0 transform transition-transform duration-300 ${
                            isOpen ? 'rotate-180 text-primary' : 'text-on-surface-variant group-hover:text-on-surface'
                          }`}
                        >
                          expand_more
                        </span>
                      </button>
                      <div
                        id={`faq-answer-${idx}`}
                        className={`grid transition-all duration-300 ease-in-out ${
                          isOpen ? 'grid-rows-[1fr] opacity-100 mt-space-sm' : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden font-body-md text-body-md text-on-surface-variant leading-relaxed">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Bottom Pre-Footer CTA Banner */}
          <section className="w-full py-space-xl lg:py-28 bg-surface">
            <div className="max-w-7xl mx-auto px-gutter">
              <div className="relative overflow-hidden rounded-2xl bg-inverse-surface text-inverse-on-surface p-space-xl lg:p-24 shadow-2xl flex flex-col items-center text-center">
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl pointer-events-none" />
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
                  <a
                    className="w-full sm:w-auto px-8 py-3.5 bg-primary-container text-on-primary font-label-md text-label-md rounded-lg shadow-lg hover:bg-secondary transition-all active:scale-[0.98] flex items-center justify-center gap-2 font-semibold"
                    href="/signup"
                  >
                    <span>Create Your Free Account</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </a>
                  <a
                    className="w-full sm:w-auto px-6 py-3.5 bg-surface-container-high/15 text-surface-bright font-label-md text-label-md rounded-lg hover:bg-surface-container-high/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    href="#curriculum"
                  >
                    <span>Browse Track Directory</span>
                  </a>
                </div>
                <div className="relative mt-space-lg flex items-center gap-space-md text-outline-variant font-label-sm text-label-sm">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed" /> Instant Access
                  </span>
                  <span>·</span>
                  <span>Zero Installation Required</span>
                  <span>·</span>
                  <span>Browser Terminal Sandbox</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low text-on-surface-variant">
        <div className="max-w-7xl mx-auto px-gutter pt-space-xl pb-space-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl pb-space-xl">
            <div className="lg:col-span-2 space-y-space-md">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-[20px]">terminal</span>
                </div>
                <div className="flex items-center">
                  <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Learn</span>
                  <span className="font-headline-sm text-headline-sm text-primary tracking-tight">Mate</span>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                Adaptive, real-time AI mentoring engineered for senior software engineers, architects, and technical leaders.
              </p>
              <div className="flex items-center gap-space-xs text-on-surface-variant">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span className="font-code-sm text-code-sm">Models synchronized with latest runtime APIs</span>
              </div>
            </div>

            <div className="space-y-space-sm">
              <div className="font-headline-sm text-headline-sm text-on-surface">Product</div>
              <ul className="space-y-space-xs font-body-sm text-body-sm">
                <li className="py-0.5">
                  <a className="hover:text-on-surface transition-colors" href="#features">
                    Interactive Playground
                  </a>
                </li>
                <li className="py-0.5">
                  <a className="hover:text-on-surface transition-colors" href="#curriculum">
                    Track Catalog
                  </a>
                </li>
                <li className="py-0.5">
                  <a className="hover:text-on-surface transition-colors" href="#methodology">
                    Adaptive Engine
                  </a>
                </li>
                <li className="py-0.5">
                  <a className="hover:text-on-surface transition-colors" href="#testimonials">
                    Enterprise Reviews
                  </a>
                </li>
                <li className="py-0.5">
                  <a className="hover:text-on-surface transition-colors" href="#faq">
                    Learning FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-space-sm">
              <div className="font-headline-sm text-headline-sm text-on-surface">Engineering Tracks</div>
              <ul className="space-y-space-xs font-body-sm text-body-sm">
                <li className="py-0.5">
                  <a className="hover:text-on-surface transition-colors" href="#curriculum" onClick={() => setActiveTrack('dist')}>
                    Distributed Systems
                  </a>
                </li>
                <li className="py-0.5">
                  <a className="hover:text-on-surface transition-colors" href="#curriculum" onClick={() => setActiveTrack('sys')}>
                    Systems Architecture &amp; C++
                  </a>
                </li>
                <li className="py-0.5">
                  <a className="hover:text-on-surface transition-colors" href="#curriculum" onClick={() => setActiveTrack('ai')}>
                    Generative AI &amp; LLMOps
                  </a>
                </li>
                <li className="py-0.5">
                  <a className="hover:text-on-surface transition-colors" href="#curriculum" onClick={() => setActiveTrack('db')}>
                    Storage Engine Design
                  </a>
                </li>
                <li className="py-0.5">
                  <a className="hover:text-on-surface transition-colors" href="#curriculum">
                    Compiler Architecture
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-space-sm">
              <div className="font-headline-sm text-headline-sm text-on-surface">Community &amp; Legal</div>
              <ul className="space-y-space-xs font-body-sm text-body-sm">
                <li className="py-0.5">
                  <a className="hover:text-on-surface transition-colors" href="/signup">
                    Terms of Service
                  </a>
                </li>
                <li className="py-0.5">
                  <a className="hover:text-on-surface transition-colors" href="/signup">
                    Privacy Policy
                  </a>
                </li>
                <li className="py-0.5">
                  <a className="hover:text-on-surface transition-colors" href="/signup">
                    Security Standards
                  </a>
                </li>
                <li className="py-0.5">
                  <a className="hover:text-on-surface transition-colors" href="https://discord.com" target="_blank" rel="noreferrer">
                    Engineering Discord
                  </a>
                </li>
                <li className="py-0.5">
                  <a className="hover:text-on-surface transition-colors" href="https://github.com" target="_blank" rel="noreferrer">
                    Open Source Kernels
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-space-md flex flex-col md:flex-row items-center justify-between gap-space-sm font-label-sm text-label-sm text-on-surface-variant border-t border-border/40">
            <p>© 2025 LearnMate Inc. All engineering rights reserved.</p>
            <div className="flex items-center gap-space-md">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                System Operational
              </span>
              <span>v4.12-prod</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
