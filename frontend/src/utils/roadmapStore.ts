import { recordActivity } from './dashboardStore';

export type ModuleDifficulty = 'Foundational' | 'Intermediate' | 'Advanced';
export type ModuleStatus = 'completed' | 'in-progress' | 'unlocked' | 'locked';
export type ModuleDomain = 'concurrency' | 'consensus' | 'storage' | 'fault-tolerance';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface RoadmapModule {
  id: string;
  code: string;
  title: string;
  description: string;
  domain: ModuleDomain;
  domainLabel: string;
  difficulty: ModuleDifficulty;
  estimatedHours: number;
  status: ModuleStatus;
  progressPct: number;
  prereqs: string[];
  bookmarked: boolean;
  keyConcepts: string[];
  intuitionSummary: string;
  diagramType: 'quorum' | 'pipeline' | 'ring' | 'crdt' | 'memory';
  quizQuestions: QuizQuestion[];
}

export interface RoadmapStage {
  id: string;
  order: number;
  stageNumber: string;
  title: string;
  subtitle: string;
  status: ModuleStatus;
  progressPct: number;
  modules: RoadmapModule[];
}

export interface RoadmapTrack {
  id: string;
  title: string;
  targetRole: string;
  trackCode: string;
  description: string;
  totalHours: number;
  estimatedWeeks: number;
  stages: RoadmapStage[];
  adaptedNote?: string;
}

const ROADMAP_STORAGE_KEY = 'learnmate_roadmap_data';
const ACTIVE_TRACK_KEY = 'learnmate_active_roadmap_track';

// ─────────────────────────────────────────────
// Default Track Generators
// ─────────────────────────────────────────────

function createDistributedSystemsTrack(): RoadmapTrack {
  return {
    id: 'distributed-systems',
    title: 'Distributed Systems & Cloud-Native Architecture',
    targetRole: 'Distributed Systems Staff Engineer',
    trackCode: 'SYSTEMS-TRACK-v4.2',
    description: 'Master consensus algorithms, non-blocking asynchronous event engines, distributed storage engines, and chaos verification.',
    totalHours: 42,
    estimatedWeeks: 10,
    stages: [
      {
        id: 'stage-1',
        order: 1,
        stageNumber: 'STAGE 01',
        title: 'Foundations of Concurrency & Interprocess I/O',
        subtitle: 'Hardware memory barriers, non-blocking event loops, and asynchronous socket multiplexing.',
        status: 'completed',
        progressPct: 100,
        modules: [
          {
            id: 'mod-101',
            code: 'MOD-101',
            title: 'Memory Models & Atomic Operations',
            description: 'Volatile registers, CAS instructions, CPU cache coherency (MESI), and happens-before semantics across multicore architectures.',
            domain: 'concurrency',
            domainLabel: '#concurrency',
            difficulty: 'Foundational',
            estimatedHours: 3.5,
            status: 'completed',
            progressPct: 100,
            prereqs: ['C/Rust Basics', 'OS Virtual Memory', 'x86 Assembly Memory Ordering'],
            bookmarked: false,
            keyConcepts: ['CAS (Compare-And-Swap)', 'MESI Coherence Protocol', 'Sequential Consistency', 'Acquire-Release Semantics'],
            intuitionSummary: 'Hardware caches can reorder memory writes unless explicit acquire-release barriers are issued. Lock-free data structures depend on CPU CAS primitives to guarantee progress without thread suspension.',
            diagramType: 'memory',
            quizQuestions: [
              {
                id: 'q101-1',
                question: 'What does an Acquire barrier guarantee in modern processor memory models?',
                options: [
                  'Subsequent memory reads/writes cannot be reordered before this acquire operation',
                  'Prior memory operations cannot be reordered after this operation',
                  'Forces all cores to synchronously flush their L1 cache to DRAM',
                  'Acquires an OS mutex mutex lock on the memory page'
                ],
                correctIndex: 0,
                explanation: 'Acquire semantics ensure that no subsequent memory operations can be speculatively moved ahead of the acquire barrier.'
              },
              {
                id: 'q101-2',
                question: 'Which CPU cache state in the MESI protocol indicates a dirty cache line exclusive to the core?',
                options: ['Shared (S)', 'Invalid (I)', 'Modified (M)', 'Exclusive (E)'],
                correctIndex: 2,
                explanation: 'In the MESI protocol, the Modified state indicates that the cache line is dirty (has been modified) and exists exclusively in this processor cache.'
              },
              {
                id: 'q101-3',
                question: 'Why are Compare-And-Swap (CAS) loops prone to the ABA problem?',
                options: [
                  'Because the value changed to B and back to A without the reading thread detecting intermediate state',
                  'Because CAS instructions fail on symmetric multiprocessors',
                  'Because memory pointers wrap around 64-bit boundaries',
                  'Because atomic registers lock the bus indefinitely'
                ],
                correctIndex: 0,
                explanation: 'The ABA problem occurs when a thread reads value A, is preempted, another thread changes A to B and back to A, causing the original CAS to succeed even though state has mutated.'
              },
              {
                id: 'q101-4',
                question: 'What is the primary difference between a spinlock and a ticket lock?',
                options: [
                  'Ticket locks ensure FIFO fairness and prevent thread starvation',
                  'Spinlocks always yield CPU quanta to the kernel scheduler',
                  'Ticket locks do not use atomic primitives',
                  'Spinlocks require hardware transactional memory'
                ],
                correctIndex: 0,
                explanation: 'Ticket locks assign an arrival ticket to each thread, granting the lock strictly in FIFO sequence to avoid starvation under heavy contention.'
              },
              {
                id: 'q101-5',
                question: 'What does "Lock-Free" formally guarantee in concurrent algorithm classification?',
                options: [
                  'At least one thread is guaranteed to make system-wide progress in a bounded number of steps',
                  'Every single thread makes guaranteed progress in bounded time (wait-free)',
                  'No locks or mutexes exist in the operating system kernel',
                  'The program can never experience a deadlock or livelock under any scheduler'
                ],
                correctIndex: 0,
                explanation: 'Lock-freedom guarantees system-wide progress: at least one process makes progress, preventing deadlocks though individual threads could starve.'
              }
            ]
          },
          {
            id: 'mod-102',
            code: 'MOD-102',
            title: 'Event Loops & Epoll Multiplexing',
            description: 'Kernel event notification facilities (epoll, kqueue, io_uring), edge-triggered notifications, and non-blocking TCP server architectures.',
            domain: 'concurrency',
            domainLabel: '#networking',
            difficulty: 'Intermediate',
            estimatedHours: 4.0,
            status: 'completed',
            progressPct: 100,
            prereqs: ['POSIX Sockets', 'File Descriptors', 'TCP 3-Way Handshake'],
            bookmarked: false,
            keyConcepts: ['Edge-Triggered vs Level-Triggered', 'Epoll RB-Tree', 'Reactor Pattern', 'Zero-Copy sys_splice'],
            intuitionSummary: 'Epoll achieves O(1) event readiness by leveraging kernel wait queues and an active ready-list, eliminating the O(N) linear descriptor scanning of legacy select/poll.',
            diagramType: 'pipeline',
            quizQuestions: [
              {
                id: 'q102-1',
                question: 'Why must non-blocking file descriptors be used with Edge-Triggered (EPOLLET) epoll?',
                options: [
                  'Because a read() call that drains until EAGAIN would otherwise block the entire reactor thread',
                  'Because edge-triggered mode does not support TCP sockets',
                  'Because the kernel drops packets if blocking sockets are registered',
                  'Because epoll_wait fails with EINVAL on blocking descriptors'
                ],
                correctIndex: 0,
                explanation: 'In Edge-Triggered mode, readiness is signaled only upon state transition; consumers must loop read() until EAGAIN, which would hang on blocking sockets.'
              },
              {
                id: 'q102-2',
                question: 'What kernel data structure does Linux epoll use to store registered file descriptors?',
                options: ['Red-Black Tree', 'Hash Map', 'Circular Ring Buffer', 'Linked List'],
                correctIndex: 0,
                explanation: 'Linux epoll uses a Red-Black tree to index monitored file descriptors by (fd, file pointer), ensuring O(log N) addition and deletion.'
              },
              {
                id: 'q102-3',
                question: 'What problem does the EPOLLEXCLUSIVE flag solve in multi-worker web servers?',
                options: [
                  'Thundering Herd problem when waking worker processes on accept()',
                  'Memory leaks in user-space buffer pools',
                  'TCP SYN flood denial of service attacks',
                  'Deadlocks in epoll_ctl calls'
                ],
                correctIndex: 0,
                explanation: 'EPOLLEXCLUSIVE prevents thundering herd wakeups by waking only a single worker from epoll_wait when a connection arrives.'
              },
              {
                id: 'q102-4',
                question: 'How does io_uring fundamentally improve on epoll for high-throughput I/O?',
                options: [
                  'By sharing submission and completion ring buffers in kernel-user memory, minimizing syscall overhead',
                  'By removing TCP checksum verification in hardware',
                  'By executing socket handlers directly in BIOS firmware',
                  'By disabling memory paging for network packets'
                ],
                correctIndex: 0,
                explanation: 'io_uring uses zero-syscall shared memory ring buffers (SQ and CQ) between userspace and kernel, batching asynchronous requests without context switches.'
              },
              {
                id: 'q102-5',
                question: 'What is the primary role of the Reactor design pattern in network engines?',
                options: [
                  'Demultiplexing incoming I/O events and dispatching them synchronously to registered event handlers',
                  'Spawning a new OS process for each TCP connection',
                  'Encrypting TLS payloads with symmetric AES-GCM ciphers',
                  'Buffering disk writes in an append-only log'
                ],
                correctIndex: 0,
                explanation: 'The Reactor pattern uses a single event loop to wait for readiness events across many sockets and dispatches them to non-blocking handlers.'
              }
            ]
          }
        ]
      },
      {
        id: 'stage-2',
        order: 2,
        stageNumber: 'STAGE 02',
        title: 'Consensus, Log Replication & State Machines',
        subtitle: 'Fault-tolerant distributed agreement, leader election, and atomic broadcast across unreliable networks.',
        status: 'in-progress',
        progressPct: 65,
        modules: [
          {
            id: 'mod-201',
            code: 'MOD-201',
            title: 'Raft Consensus Algorithm: Leader Election & Quorums',
            description: 'Raft decomposes consensus into explicit subproblems: leader election, log replication, and safety. Leaders manage client requests and commit entries once acknowledged by a strict majority.',
            domain: 'consensus',
            domainLabel: '#consensus',
            difficulty: 'Advanced',
            estimatedHours: 4.5,
            status: 'in-progress',
            progressPct: 80,
            prereqs: ['RPC Basics (gRPC)', 'TCP/IP Handshake & Buffering', 'State Machines'],
            bookmarked: true,
            keyConcepts: ['Split-Vote Mitigation with Jitter', 'Term Invariant', 'Log Matching Property', 'Leader Completeness'],
            intuitionSummary: 'Raft guarantees safety through a single invariant: logs never flow from follower to leader, and leaders never overwrite their own logs. Split votes are avoided by randomizing candidate election timeouts.',
            diagramType: 'quorum',
            quizQuestions: [
              {
                id: 'q201-1',
                question: 'Why does Raft randomize election timeouts (e.g. between 150ms and 300ms)?',
                options: [
                  'To prevent split votes where multiple candidates split the quorum equally',
                  'To avoid clock drift in atomic hardware timers',
                  'To allow followers to flush logs to persistent SSD storage',
                  'To prioritize candidates with the longest network uptime'
                ],
                correctIndex: 0,
                explanation: 'Randomized timeouts desynchronize election attempts, ensuring one candidate usually times out first and captures majority quorum votes before peers trigger elections.'
              },
              {
                id: 'q201-2',
                question: 'What is the "Leader Completeness" property in Raft?',
                options: [
                  'If a log entry is committed in a given term, that entry will be present in the logs of leaders for all higher terms',
                  'The leader must store the entire history of all client queries in memory',
                  'Followers cannot reject any log entry proposed by a leader with an equal term',
                  'Every node in the cluster must successfully acknowledge a heartbeat before log compaction'
                ],
                correctIndex: 0,
                explanation: 'Leader Completeness guarantees that any entry committed in term T will be present in the logs of all subsequent leaders with term > T, ensuring linearizability.'
              },
              {
                id: 'q201-3',
                question: 'Under what condition does a Raft voter grant its vote to a candidate in RequestVote RPC?',
                options: [
                  'Candidate has current or higher term, voter has not voted in this term, and candidate log is at least as up-to-date as voter',
                  'Candidate has the highest IP address in the cluster configuration',
                  'Candidate responds to ping RPCs with sub-millisecond round trip time',
                  'Candidate has already committed more than 50% of outstanding log indexes'
                ],
                correctIndex: 0,
                explanation: 'Raft election safety requires comparing (lastLogTerm, lastLogIndex); a voter denies votes if the candidate log is less up-to-date than its own.'
              },
              {
                id: 'q201-4',
                question: 'What happens in Raft when a network partition isolates an old leader with a minority of nodes?',
                options: [
                  'The minority leader cannot commit client writes, while the majority partition elects a new leader with an incremented term',
                  'Both partitions continue committing conflicting writes simultaneously',
                  'The cluster enters a permanent unrecoverable deadlock',
                  'The old leader unilaterally deletes uncommitted log entries and halts'
                ],
                correctIndex: 0,
                explanation: 'Because the minority cannot reach a quorum (e.g. 2 of 5 nodes), its AppendEntries RPCs fail to achieve majority, preventing stale commits.'
              },
              {
                id: 'q201-5',
                question: 'How does Raft safely compact log history to prevent unbounded disk growth?',
                options: [
                  'Each node independently creates a point-in-time state machine snapshot and discards committed entries up to that index',
                  'The leader deletes logs from followers after 24 hours of inactivity',
                  'Entries are compressed using gzip without saving state machine state',
                  'All nodes reboot simultaneously to clear log buffers'
                ],
                correctIndex: 0,
                explanation: 'Snapshotting allows nodes to write their deterministic state machine state to disk, discarding preceding log entries and using InstallSnapshot RPC to catch up lagging nodes.'
              }
            ]
          },
          {
            id: 'mod-202',
            code: 'MOD-202',
            title: 'Multi-Paxos & Leaseholders: Optimizing Round-Trip Latency',
            description: 'Multi-Paxos amortizes Phase 1 (Prepare/Promise) by electing a stable master node for a prolonged lease duration, enabling single round-trip distributed consensus across geo-distributed replicas.',
            domain: 'consensus',
            domainLabel: '#consensus',
            difficulty: 'Advanced',
            estimatedHours: 3.8,
            status: 'unlocked',
            progressPct: 0,
            prereqs: ['Basic Paxos Invariant', 'Epoch Numbers', 'Two-Phase Commit'],
            bookmarked: false,
            keyConcepts: ['Prepare/Promise Phase Amortization', 'Leader Leases', 'Pipelined Proposals', 'Reconciliation Protocols'],
            intuitionSummary: 'Basic Paxos requires two full round-trips for every committed value. Multi-Paxos executes Phase 1 once per leader epoch, collapsing steady-state commits to Phase 2 (Accept/Accepted) in a single RTT.',
            diagramType: 'quorum',
            quizQuestions: [
              {
                id: 'q202-1',
                question: 'How does Multi-Paxos achieve 1-RTT commits during steady state?',
                options: [
                  'By skipping Phase 1 (Prepare/Promise) once a stable leader has been established for the epoch',
                  'By sending client writes directly via UDP without waiting for acknowledgements',
                  'By relying on synchronized GPS atomic clocks instead of quorum votes',
                  'By removing the acceptor role from replica nodes'
                ],
                correctIndex: 0,
                explanation: 'Once a leader obtains promises for all subsequent log instances via a single Phase 1 exchange, it can directly issue Phase 2 (Accept/Accepted) for successive entries.'
              },
              {
                id: 'q202-2',
                question: 'What is a "Lease" in Paxos-based distributed databases (e.g. Spanner or CockroachDB)?',
                options: [
                  'A time-bounded grant of leader authority allowing local linearizable reads without running consensus',
                  'A cloud hosting contract for dedicated virtual machines',
                  'A temporary lock on a specific relational database table',
                  'A mechanism for encrypting log entries over WAN connections'
                ],
                correctIndex: 0,
                explanation: 'Leader leases guarantee that during the lease duration, no other node can be elected leader, allowing the leaseholder to serve read requests locally with linearizability.'
              },
              {
                id: 'q202-3',
                question: 'What happens in Multi-Paxos when two nodes simultaneously believe they are the leader (dueling leaders)?',
                options: [
                  'They repeatedly preempt each other with higher proposal numbers in Phase 1, causing livelock without progress',
                  'The cluster permanently loses data consistency',
                  'Both proposals are atomically merged together into a single log entry',
                  'The node with lower latency automatically wins without voting'
                ],
                correctIndex: 0,
                explanation: 'Without leader election or randomized backoff, two proposers can alternate issuing higher prepare numbers, preempting each other before either can complete Phase 2 (livelock).'
              },
              {
                id: 'q202-4',
                question: 'Why must Paxos acceptors persist their highest promised and accepted proposal numbers on durable storage?',
                options: [
                  'To avoid violating safety invariants if an acceptor crashes and restarts after acknowledging a proposal',
                  'To benchmark disk write IOPS for telemetry metrics',
                  'To ensure followers can stream binary logs to external read replicas',
                  'To comply with relational SQL ACID durability constraints'
                ],
                correctIndex: 0,
                explanation: 'If an acceptor forgot its promise after rebooting, it could accept a lower proposal number, allowing two different values to be chosen for the same instance.'
              },
              {
                id: 'q202-5',
                question: 'How does Flexible Paxos modify classical quorum requirements?',
                options: [
                  'By proving that Phase 1 and Phase 2 quorums only need to intersect, allowing small Phase 2 quorums for faster writes',
                  'By allowing 1 node to constitute a quorum during network partitions',
                  'By replacing majority voting with proof-of-work mining',
                  'By eliminating Phase 2 entirely for write operations'
                ],
                correctIndex: 0,
                explanation: 'Flexible Paxos observes that safety only requires Q1 and Q2 quorums to share at least one node (Q1 ∩ Q2 ≠ ∅), so write quorums can be smaller (e.g. 2 nodes) if read quorums are larger.'
              }
            ]
          }
        ]
      },
      {
        id: 'stage-3',
        order: 3,
        stageNumber: 'STAGE 03',
        title: 'Distributed Storage & Partition Strategies',
        subtitle: 'Consistent hashing, log-structured merge trees (LSM), SSTables, and high-throughput write path optimization.',
        status: 'unlocked',
        progressPct: 0,
        modules: [
          {
            id: 'mod-301',
            code: 'MOD-301',
            title: 'Consistent Hashing & Virtual Nodes',
            description: 'Hash ring partitioning, minimizing key rebalancing overhead on cluster topology mutations, and virtual node distribution to prevent hotspots.',
            domain: 'storage',
            domainLabel: '#storage',
            difficulty: 'Intermediate',
            estimatedHours: 4.0,
            status: 'unlocked',
            progressPct: 0,
            prereqs: ['Hashing Functions (Murmur3)', 'Binary Search Trees', 'Replication Topologies'],
            bookmarked: false,
            keyConcepts: ['Ring Topology', 'Virtual Nodes (v-nodes)', 'Rebalancing Cost O(K/N)', 'Token Ranges'],
            intuitionSummary: 'Classical modulo hashing redistributes nearly 100% of keys when cluster size changes. Consistent hashing maps keys and nodes to a circular hash ring, moving only K/N keys when a node joins or leaves.',
            diagramType: 'ring',
            quizQuestions: [
              {
                id: 'q301-1',
                question: 'What fraction of keys must be moved when a node is added to a cluster of N nodes using consistent hashing?',
                options: ['Approximately 1 / (N + 1) of all keys', '100% of all keys', 'Exactly 50% of all keys', 'None of the keys'],
                correctIndex: 0,
                explanation: 'With consistent hashing, adding a node only takes over key ranges from immediate neighbors, rebalancing roughly K / (N + 1) keys instead of reshaping the entire table.'
              },
              {
                id: 'q301-2',
                question: 'Why are Virtual Nodes (v-nodes) crucial in production Dynamo-style databases?',
                options: [
                  'They distribute non-uniform keys evenly across physical machines according to hardware capacity',
                  'They encrypt keys before hashing to prevent rainbow table attacks',
                  'They replace disk storage with virtual kernel memory',
                  'They enable synchronous multi-master transactions'
                ],
                correctIndex: 0,
                explanation: 'Assigning hundreds of virtual tokens per physical machine prevents statistical clustering, ensuring uniform load distribution and proportional capacity allocation.'
              },
              {
                id: 'q301-3',
                question: 'In a distributed hash ring with replication factor RF=3, which nodes store a given key?',
                options: [
                  'The first node encountered clockwise on the ring, plus the next two distinct physical successors',
                  'Any three randomly selected nodes in the entire data center',
                  'All nodes that share the same IP subnet',
                  'The single coordinator node that accepted the write'
                ],
                correctIndex: 0,
                explanation: 'Keys are hashed to a point on the ring; the coordinator routes replicas to the node owning that range and its subsequent distinct physical successors clockwise on the ring.'
              },
              {
                id: 'q301-4',
                question: 'What is "Sloppy Quorum" with Hinted Handoff in Dynamo-style systems?',
                options: [
                  'Temporary storage of writes on non-preference nodes when primary replicas are unreachable, to be forwarded later',
                  'Quorums that accept writes without checking consistency',
                  'An asynchronous Paxos implementation that ignores minority nodes',
                  'A protocol that discards writes if the client disconnects'
                ],
                correctIndex: 0,
                explanation: 'Sloppy quorums maintain write availability during partitions: if designated replicas are down, writes are stored temporarily on healthy nodes with hints to hand them off when primaries recover.'
              },
              {
                id: 'q301-5',
                question: 'Which hash function is commonly preferred for consistent hash rings due to speed and uniform distribution?',
                options: ['MurmurHash3 or CityHash', 'MD5', 'SHA-256', 'CRC32'],
                correctIndex: 0,
                explanation: 'Non-cryptographic hash functions like MurmurHash3 provide exceptional dispersion uniformity with sub-nanosecond hashing throughput per key.'
              }
            ]
          },
          {
            id: 'mod-302',
            code: 'MOD-302',
            title: 'LSM-Trees & SSTable Storage Engines',
            description: 'Log-Structured Merge-Trees: append-only commit logs, in-memory Memtables, immutable SSTables, Bloom filters, and leveled compaction mechanics.',
            domain: 'storage',
            domainLabel: '#storage',
            difficulty: 'Advanced',
            estimatedHours: 4.2,
            status: 'unlocked',
            progressPct: 0,
            prereqs: ['B-Trees vs LSM Trade-offs', 'Sequential vs Random I/O', 'Memory Mapped Files'],
            bookmarked: false,
            keyConcepts: ['Write Amplification', 'Leveled Compaction', 'Bloom Filter Optimization', 'Memtable Flush'],
            intuitionSummary: 'LSM-trees convert random disk writes into sequential disk appends by buffering writes in memory (Memtable) and flushing sorted, immutable runs (SSTables) to disk, optimized via Bloom filters for rapid point lookups.',
            diagramType: 'pipeline',
            quizQuestions: [
              {
                id: 'q302-1',
                question: 'Why do LSM-trees deliver significantly higher write throughput than B+ trees on magnetic and SSD storage?',
                options: [
                  'They convert random in-place writes into sequential append-only writes to disk',
                  'They bypass the operating system filesystem completely',
                  'They do not maintain indexes on secondary columns',
                  'They eliminate crash-recovery write-ahead logs'
                ],
                correctIndex: 0,
                explanation: 'B+ trees require random in-place leaf updates, whereas LSM trees batch writes in a RAM memtable and write immutable sequential SSTables to storage.'
              },
              {
                id: 'q302-2',
                question: 'What role does a Bloom filter play in an SSTable storage engine during a point query read()?',
                options: [
                  'It quickly tests if a key is definitely NOT present in an SSTable, preventing unnecessary disk I/O',
                  'It decompresses LZ4 blocks before parsing key values',
                  'It sorts keys in lexicographical order in memory',
                  'It guarantees that duplicate records are eliminated during compaction'
                ],
                correctIndex: 0,
                explanation: 'Bloom filters have no false negatives: if the filter says the key is absent, the engine can skip reading that SSTable from disk entirely.'
              },
              {
                id: 'q302-3',
                question: 'What is "Write Amplification" in LSM storage engines?',
                options: [
                  'The ratio of bytes written to underlying storage relative to bytes submitted in user write queries',
                  'The amplification of write signals over differential network cables',
                  'The multiplication of writes during distributed replication',
                  'The CPU overhead of calculating CRC32 checksums on disk blocks'
                ],
                correctIndex: 0,
                explanation: 'Write amplification measures how many times the same byte of data is rewritten to disk during background merge and compaction passes throughout its lifecycle.'
              },
              {
                id: 'q302-4',
                question: 'How does an LSM engine handle key deletion (e.g. DELETE FROM table WHERE key = X)?',
                options: [
                  'By writing a "tombstone" record marking the key as deleted, which purges the key during later compaction',
                  'By rewriting all SSTables on disk immediately',
                  'By overwriting the key bytes on disk with zero bytes',
                  'By throwing an error if the key is already committed to SSTable'
                ],
                correctIndex: 0,
                explanation: 'LSM trees never overwrite in place; deletions append a tombstone marker that hides older versions of the key until compaction merges and garbage-collects both.'
              },
              {
                id: 'q302-5',
                question: 'What is the key trade-off between Size-Tiered Compaction (STCS) and Leveled Compaction (LCS)?',
                options: [
                  'Leveled compaction minimizes read amplification and disk footprint at the cost of higher write amplification',
                  'Size-tiered compaction eliminates write amplification completely',
                  'Leveled compaction requires all SSTables to fit in system RAM',
                  'Size-tiered compaction does not support point lookups'
                ],
                correctIndex: 0,
                explanation: 'Leveled Compaction divides storage into exponential levels with non-overlapping keys per level, dramatically lowering space and read amplification at the cost of rewriting files repeatedly.'
              }
            ]
          }
        ]
      },
      {
        id: 'stage-4',
        order: 4,
        stageNumber: 'STAGE 04',
        title: 'High Availability, Split-Brain & Chaos Verification',
        subtitle: 'Partition injection, Jepsen verification, Vector Clocks, and Conflict-Free Replicated Data Types (CRDTs).',
        status: 'locked',
        progressPct: 0,
        modules: [
          {
            id: 'mod-401',
            code: 'MOD-401',
            title: 'Jepsen Analysis & Partition Injection',
            description: 'Automated fault injection, simulating asymmetric network partitions, clock skew, process pauses (SIGSTOP/SIGCONT), and validating linearizability with Knossos.',
            domain: 'fault-tolerance',
            domainLabel: '#fault-tolerance',
            difficulty: 'Advanced',
            estimatedHours: 5.0,
            status: 'locked',
            progressPct: 0,
            prereqs: ['Stage 03 Completion', 'Linearizability Invariants', 'iptables / iproute2'],
            bookmarked: false,
            keyConcepts: ['Knossos Verification', 'Asymmetric Network Partitions', 'Clock Skew Faults', 'Strict Serializable Checks'],
            intuitionSummary: 'Testing distributed systems under clean network conditions hides race conditions. Jepsen actively fractures the network with iptables while checking operations against formal linearizability models.',
            diagramType: 'crdt',
            quizQuestions: [
              {
                id: 'q401-1',
                question: 'What formal consistency guarantee does Knossos test in Jepsen executions?',
                options: [
                  'Linearizability (every read observes the most recent completed write in real time)',
                  'Eventual Consistency without ordering bounds',
                  'Read-uncommitted transactional isolation',
                  'ACID durability on single-node SQLite databases'
                ],
                correctIndex: 0,
                explanation: 'Linearizability requires all operations to appear to execute atomically at a specific point in time between their invocation and response.'
              },
              {
                id: 'q401-2',
                question: 'What failure mode occurs when a garbage collection pause (SIGSTOP) freezes an elected leader past its lease expiration?',
                options: [
                  'A new leader is elected while the old leader awakens and executes stale client writes without knowing its lease expired',
                  'The cluster automatically restarts the JVM garbage collector',
                  'All follower nodes immediately terminate with fatal panic',
                  'The network interface card resets its IP address'
                ],
                correctIndex: 0,
                explanation: 'If a node pauses for longer than its lease, another node takes over; when the frozen node awakens, it may execute writes assuming it is still the leader (split-brain).'
              },
              {
                id: 'q401-3',
                question: 'How do asymmetric network partitions differ from symmetric partitions in Jepsen tests?',
                options: [
                  'Node A can send packets to Node B, but Node B cannot send packets back to Node A',
                  'Packets are corrupted with inverted bits',
                  'The entire data center loses external internet connectivity',
                  'All nodes can communicate bidirectionally with zero latency'
                ],
                correctIndex: 0,
                explanation: 'In asymmetric partitions, communication is unidirectional or non-transitive (A talks to B, B talks to C, but A cannot talk to C), stressing consensus vote logic.'
              },
              {
                id: 'q401-4',
                question: 'What is the role of TrueTime in Google Cloud Spanner for cross-datacenter linearizability?',
                options: [
                  'It bounds clock uncertainty using GPS and atomic clocks, guaranteeing commit wait intervals without distributed locks',
                  'It synchronizes node clocks via standard NTP servers over public internet',
                  'It disables consensus voting for international transactions',
                  'It accelerates CPU clock frequencies during high load'
                ],
                correctIndex: 0,
                explanation: 'TrueTime returns a time interval [earliest, latest] with guaranteed bounds; transactions wait out the uncertainty interval (commit wait) to enforce linearizable order.'
              },
              {
                id: 'q401-5',
                question: 'What does the CAP theorem state regarding network partitions in distributed storage?',
                options: [
                  'When a network partition occurs, a system must choose between Consistency (linearizability) or Availability',
                  'A distributed database can achieve Consistency, Availability, and Partition Tolerance simultaneously',
                  'Network partitions can be completely prevented with redundant fiber links',
                  'Consistency is only achievable on single-threaded CPUs'
                ],
                correctIndex: 0,
                explanation: 'Because physical network partitions are unavoidable in distributed systems, a partitioned cluster must either reject writes (Consistent) or accept diverged writes (Available).'
              }
            ]
          },
          {
            id: 'mod-402',
            code: 'MOD-402',
            title: 'Vector Clocks & CRDT Convergence',
            description: 'State-based (CvRDT) and operation-based (CmRDT) conflict-free replicated data types, causal ordering with vector clocks, and join-semilattices.',
            domain: 'fault-tolerance',
            domainLabel: '#fault-tolerance',
            difficulty: 'Advanced',
            estimatedHours: 4.5,
            status: 'locked',
            progressPct: 0,
            prereqs: ['Vector Clock Arithmetic', 'Partial Order Relations', 'Join-Semilattices'],
            bookmarked: false,
            keyConcepts: ['Join-Semilattice LUB', 'PN-Counters & Observed-Remove Sets', 'Causal Histories', 'Concurrent Mutation Merging'],
            intuitionSummary: 'CRDTs guarantee that replicas that have received the same set of updates will arrive at the exact same state, regardless of the order or network routing of message delivery.',
            diagramType: 'crdt',
            quizQuestions: [
              {
                id: 'q402-1',
                question: 'What mathematical structure must a state-based CRDT (CvRDT) merge function form?',
                options: [
                  'A Join-Semilattice with a Commutative, Associative, and Idempotent merge operator',
                  'A non-commutative monoid',
                  'A strictly ordered linear sequence',
                  'A directed acyclic graph without root nodes'
                ],
                correctIndex: 0,
                explanation: 'Associativity, commutativity, and idempotence ensure that updates can arrive in any order, be duplicated, and still converge deterministically.'
              },
              {
                id: 'q402-2',
                question: 'How do Vector Clocks detect concurrent conflicting writes between two replicas?',
                options: [
                  'Neither vector clock dominates the other: VC1 has an element greater than VC2, and VC2 has an element greater than VC1',
                  'Both vector clocks have identical scalar values',
                  'One vector clock was created by a leader node',
                  'The wall-clock timestamps differ by more than 100 milliseconds'
                ],
                correctIndex: 0,
                explanation: 'Two events are concurrent if neither causally preceded the other, meaning neither vector clock is component-wise strictly less than or equal to the other.'
              },
              {
                id: 'q402-3',
                question: 'What problem does an Observed-Remove Set (OR-Set) solve in CRDT design?',
                options: [
                  'Allows adding and removing elements repeatedly without deleted elements resurrecting upon merge',
                  'Limits the total number of items in a set to 1,000',
                  'Encrypts set elements with asymmetric keys',
                  'Forces all set operations to run through a Paxos leader'
                ],
                correctIndex: 0,
                explanation: 'OR-Sets tag each addition with a unique tag (UUID); removals only delete existing observed tags, preventing concurrent adds from being lost.'
              },
              {
                id: 'q402-4',
                question: 'What is the trade-off of state-based CRDTs (CvRDT) versus operation-based CRDTs (CmRDT)?',
                options: [
                  'CvRDT transmits entire state objects (higher bandwidth), whereas CmRDT transmits lightweight operations but requires reliable causal transport',
                  'CvRDT cannot handle concurrent mutations',
                  'CmRDT only works on single-core processors',
                  'CvRDT requires synchronized atomic hardware clocks'
                ],
                correctIndex: 0,
                explanation: 'CvRDTs send full state and can tolerate packet loss and out-of-order delivery, while CmRDTs send small operations but depend on the messaging layer delivering operations causally.'
              },
              {
                id: 'q402-5',
                question: 'Why is "Last-Write-Wins" (LWW-Element-Set) considered an imperfect conflict resolution strategy?',
                options: [
                  'Clock skew can cause newer updates to be overwritten by older updates generated on nodes with fast clocks',
                  'LWW requires 100% CPU utilization on all replicas',
                  'LWW cannot delete elements once added',
                  'LWW breaks network sockets on Linux kernels'
                ],
                correctIndex: 0,
                explanation: 'LWW relies on physical system clocks; if node clocks drift, an older concurrent write with an inflated timestamp will silently discard a truly newer operation.'
              }
            ]
          }
        ]
      }
    ]
  };
}

function createRustKernelTrack(): RoadmapTrack {
  return {
    id: 'rust-kernel',
    title: 'Rust Systems Programming & Kernel Architecture',
    targetRole: 'Rust Systems & Kernel Architect',
    trackCode: 'RUST-TRACK-v2.1',
    description: 'Master ownership semantics, lock-free concurrency, asynchronous runtimes with Tokio, zero-copy socket I/O, and eBPF kernel tracing.',
    totalHours: 38,
    estimatedWeeks: 8,
    stages: [
      {
        id: 'rust-stage-1',
        order: 1,
        stageNumber: 'STAGE 01',
        title: 'Ownership, Unsafe Invariants & Memory Layout',
        subtitle: 'Borrow checker mechanics, interior mutability, and zero-cost abstractions.',
        status: 'completed',
        progressPct: 100,
        modules: [
          {
            id: 'rust-101',
            code: 'RUST-101',
            title: 'Ownership, Lifetimes & Variance',
            description: 'Subtyping and variance in Rust lifetimes, non-lexical lifetimes, and Pin/Unpin guarantees.',
            domain: 'concurrency',
            domainLabel: '#memory',
            difficulty: 'Foundational',
            estimatedHours: 3.5,
            status: 'completed',
            progressPct: 100,
            prereqs: ['C Memory Pointers', 'RAII Principles'],
            bookmarked: false,
            keyConcepts: ['Covariance vs Contravariance', 'Pinning Self-Referential Structs', 'Drop Check'],
            intuitionSummary: 'Rust enforces memory safety at compile-time by proving that references never outlive the data they borrow, eliminating dangling pointers without runtime garbage collection.',
            diagramType: 'memory',
            quizQuestions: [
              {
                id: 'rq101-1',
                question: 'Why does a self-referential struct in Rust require `Pin<&mut T>`?',
                options: [
                  'To prevent the struct from being moved in memory, which would invalidate internal pointers',
                  'To allow multiple mutable references simultaneously',
                  'To bypass the borrow checker at compile time',
                  'To allocate the struct in kernel memory'
                ],
                correctIndex: 0,
                explanation: 'Moving a self-referential struct relocates its fields while internal pointers continue pointing to the old memory address, causing memory corruption unless pinned.'
              },
              {
                id: 'rq101-2',
                question: 'What is the variance of `&\'a T` over `T` in Rust?',
                options: ['Covariant', 'Contravariant', 'Invariant', 'Bivariant'],
                correctIndex: 0,
                explanation: 'Shared references are covariant over their referent type T: if Sub is a subtype of Super, then &\'a Sub is a subtype of &\'a Super.'
              },
              {
                id: 'rq101-3',
                question: 'What does `UnsafeCell<T>` uniquely provide in Rust standard library?',
                options: [
                  'The only legal primitive for interior mutability through shared references in safe code',
                  'Hardware-accelerated SIMD vectorization',
                  'Automatic garbage collection of heap objects',
                  'Thread-safe atomic swapping across CPU cores'
                ],
                correctIndex: 0,
                explanation: 'UnsafeCell<T> is the foundational building block for interior mutability (used by Cell, RefCell, and Mutex), telling the compiler that data behind a shared pointer may mutate.'
              },
              {
                id: 'rq101-4',
                question: 'What guarantee does the `Send` trait provide for a type T?',
                options: [
                  'Ownership of T can be safely transferred across thread boundaries',
                  'T can be safely referenced concurrently by multiple threads (&T is thread-safe)',
                  'T can be serialized into JSON packets',
                  'T is allocated in persistent non-volatile RAM'
                ],
                correctIndex: 0,
                explanation: 'Send indicates ownership transfer across threads is safe. Sync indicates shared references (&T) are safe across threads.'
              },
              {
                id: 'rq101-5',
                question: 'Why is `Rc<T>` not marked as `Send` in Rust?',
                options: [
                  'Its reference count uses non-atomic increments which would cause data races across threads',
                  'It uses too much memory for thread stacks',
                  'Operating systems do not permit shared pointers in threads',
                  'It implements the Drop trait synchronously'
                ],
                correctIndex: 0,
                explanation: 'Rc<T> uses regular integers for reference counting; concurrent clones on multiple threads would race on refcount mutation. Arc<T> uses atomic increments.'
              }
            ]
          }
        ]
      },
      {
        id: 'rust-stage-2',
        order: 2,
        stageNumber: 'STAGE 02',
        title: 'Asynchronous Tokio Runtimes & io_uring',
        subtitle: 'Cooperative task scheduling, reactor engines, and non-blocking sockets in Rust.',
        status: 'in-progress',
        progressPct: 50,
        modules: [
          {
            id: 'rust-201',
            code: 'RUST-201',
            title: 'Tokio Multithreaded Work-Stealing Runtime',
            description: 'Task green-threads, work-stealing schedulers, cooperative polling with Futures, and epoll driver integration.',
            domain: 'concurrency',
            domainLabel: '#async',
            difficulty: 'Intermediate',
            estimatedHours: 4.5,
            status: 'in-progress',
            progressPct: 60,
            prereqs: ['RUST-101', 'Future & Poll Traits'],
            bookmarked: true,
            keyConcepts: ['Cooperative Multitasking', 'Work-Stealing Deques', 'Async Waker Mechanics', 'Yielding Points'],
            intuitionSummary: 'Rust async functions compile into state machine enums. Tokio tasks poll futures cooperatively on worker threads, re-queuing suspended tasks when their Waker is signaled.',
            diagramType: 'pipeline',
            quizQuestions: [
              {
                id: 'rq201-1',
                question: 'What does a Rust `Future::poll(cx)` return when the operation cannot complete immediately?',
                options: ['Poll::Pending', 'Poll::Ready(None)', 'Result::Err(WouldBlock)', 'false'],
                correctIndex: 0,
                explanation: 'A future returns Poll::Pending and registers cx.waker() with the underlying source (e.g. socket) so the runtime can wake the task when ready.'
              },
              {
                id: 'rq201-2',
                question: 'Why is calling `std::thread::sleep` fatal inside a Tokio async task?',
                options: [
                  'It blocks the OS worker thread, preventing other concurrent tasks on that thread from running',
                  'It raises a compile-time lifetime error',
                  'It deallocates the task stack memory',
                  'It triggers an immediate SIGKILL kernel signal'
                ],
                correctIndex: 0,
                explanation: 'Blocking calls stall the entire OS worker thread, halting all co-scheduled tasks. Non-blocking `tokio::time::sleep` should be awaited instead.'
              },
              {
                id: 'rq201-3',
                question: 'How does Tokio work-stealing balance tasks across CPU cores?',
                options: [
                  'Idle worker threads steal tasks from the tail of busier worker thread run queues',
                  'A single central mutex queue dispatches tasks to workers',
                  'Tasks are round-robined by hardware interrupts',
                  'Tasks are never moved once spawned on a worker thread'
                ],
                correctIndex: 0,
                explanation: 'Each worker thread maintains a lock-free local run queue; idle workers steal batches of tasks from the tail of overloaded peers.'
              },
              {
                id: 'rq201-4',
                question: 'What is the purpose of `tokio::task::spawn_blocking`?',
                options: [
                  'Offloads synchronous CPU-heavy or blocking filesystem operations to a dedicated thread pool',
                  'Spawns tasks that cannot be cancelled',
                  'Blocks the current process until child tasks exit',
                  'Prevents other tasks from writing to stdout'
                ],
                correctIndex: 0,
                explanation: 'spawn_blocking runs synchronous blocking operations on a dedicated thread pool sized for blocking tasks, keeping the async reactor workers responsive.'
              },
              {
                id: 'rq201-5',
                question: 'How do Rust zero-cost futures avoid heap allocations during async execution?',
                options: [
                  'The compiler generates a single flat state machine enum holding all local variables across await points',
                  'All futures are executed directly in CPU cache registers',
                  'Futures allocate their state in operating system kernel space',
                  'Rust futures do not preserve local variables across yield points'
                ],
                correctIndex: 0,
                explanation: 'Async/await transforms the function into a state machine enum; all local variables live inside the enum fields, sized and known at compile time.'
              }
            ]
          }
        ]
      }
    ]
  };
}

function createFormalVerificationTrack(): RoadmapTrack {
  return {
    id: 'formal-verification',
    title: 'Formal Verification & Consensus Safety Research',
    targetRole: 'Formal Verification & Consensus Researcher',
    trackCode: 'RESEARCH-TRACK-v1.4',
    description: 'Master TLA+ specification, safety and liveness invariants, model checking with TLC, and Byzantine Fault Tolerant (BFT) consensus proofs.',
    totalHours: 45,
    estimatedWeeks: 12,
    stages: [
      {
        id: 'formal-stage-1',
        order: 1,
        stageNumber: 'STAGE 01',
        title: 'TLA+ State Machine Specifications & Invariants',
        subtitle: 'Formal temporal logic, state transitions, inductive invariants, and safety proofs.',
        status: 'in-progress',
        progressPct: 40,
        modules: [
          {
            id: 'formal-101',
            code: 'FORMAL-101',
            title: 'TLA+ Model Checking & Safety Invariants',
            description: 'Specifying concurrent protocols in TLA+, verifying type invariants, state space exploration with TLC, and counterexample replay.',
            domain: 'consensus',
            domainLabel: '#verification',
            difficulty: 'Advanced',
            estimatedHours: 5.0,
            status: 'in-progress',
            progressPct: 75,
            prereqs: ['First-Order Logic', 'Set Theory', 'State Transitions'],
            bookmarked: true,
            keyConcepts: ['Inductive Invariants', 'Temporal Operators (Box, Diamond)', 'Stuttering Invariance', 'TLC State Graphs'],
            intuitionSummary: 'TLA+ describes systems as mathematical state transition graphs. The TLC model checker exhaustively traverses all reachable states to prove that bad states can never happen (Safety).',
            diagramType: 'quorum',
            quizQuestions: [
              {
                id: 'fq101-1',
                question: 'In TLA+, what is the difference between a Safety property and a Liveness property?',
                options: [
                  'Safety says bad things never happen; Liveness says good things eventually happen',
                  'Safety is verified at runtime; Liveness is proven at compile time',
                  'Safety applies to networks; Liveness applies to disk storage',
                  'Safety requires clocks; Liveness works without clocks'
                ],
                correctIndex: 0,
                explanation: 'Leslie Lamport defines Safety as "something bad never happens" (violable in finite steps), and Liveness as "something good eventually happens" (violable in infinite traces).'
              },
              {
                id: 'fq101-2',
                question: 'What does the primed variable `x\'` represent in a TLA+ action formula?',
                options: [
                  'The value of variable x in the next state after the transition',
                  'The pointer address of variable x in memory',
                  'A mathematical derivative of x with respect to time',
                  'A private variable inaccessible outside the module'
                ],
                correctIndex: 0,
                explanation: 'Unprimed variables represent values in the current state; primed variables (x\') specify their value in the successor state.'
              },
              {
                id: 'fq101-3',
                question: 'What is "Stuttering Invariance" in TLA+ specifications?',
                options: [
                  'The specification allows transitions where no monitored variables change, enabling seamless refinement',
                  'The model checker ignores network latency fluctuations',
                  'The state machine freezes when an invariant is violated',
                  'Threads retry failed atomic CAS operations indefinitely'
                ],
                correctIndex: 0,
                explanation: 'Stuttering steps (where state remains unchanged) ensure that high-level specifications remain valid when refined by lower-level implementations with intermediate steps.'
              },
              {
                id: 'fq101-4',
                question: 'Why is an "Inductive Invariant" required for deductive safety proofs?',
                options: [
                  'The invariant holds initially and is preserved by every legal action step without assuming full execution history',
                  'It guarantees that model checking completes in linear time O(N)',
                  'It proves that the program terminates on all inputs',
                  'It verifies that hardware registers do not overheat'
                ],
                correctIndex: 0,
                explanation: 'An invariant Inv is inductive if Init => Inv and Inv /\\ [Next]_vars => Inv\', making safety self-contained without needing to trace prior state histories.'
              },
              {
                id: 'fq101-5',
                question: 'What limitation does the TLC model checker face on large state spaces?',
                options: [
                  'State space explosion: reachable states grow exponentially with the number of processes, requiring symmetry sets or abstraction',
                  'TLC can only check deterministic single-threaded programs',
                  'TLC does not support set theory operations',
                  'TLC can only run on 32-bit operating systems'
                ],
                correctIndex: 0,
                explanation: 'State space explosion is the fundamental challenge; model checking must bound parameters (e.g. 3 nodes, 2 messages) or use symmetry sets to keep state space tractable.'
              }
            ]
          }
        ]
      }
    ]
  };
}

// ─────────────────────────────────────────────
// Storage & State Management
// ─────────────────────────────────────────────

export function getRoadmapData(trajectory = ''): RoadmapTrack {
  const activeTrackId = getActiveTrackId();
  try {
    const raw = localStorage.getItem(ROADMAP_STORAGE_KEY);
    if (raw) {
      const storedTracks: Record<string, RoadmapTrack> = JSON.parse(raw);
      if (storedTracks[activeTrackId]) {
        return storedTracks[activeTrackId];
      }
    }
  } catch {
    // Fallback
  }

  // Generate initial tracks
  const dist = createDistributedSystemsTrack();
  const rust = createRustKernelTrack();
  const formal = createFormalVerificationTrack();

  const tracks: Record<string, RoadmapTrack> = {
    'distributed-systems': dist,
    'rust-kernel': rust,
    'formal-verification': formal,
  };

  try {
    localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(tracks));
  } catch {
    // Ignore
  }

  // Match trajectory if explicitly specified
  if (trajectory.includes('Rust') || trajectory.includes('kernel')) {
    setActiveTrackId('rust-kernel');
    return rust;
  }
  if (trajectory.includes('research') || trajectory.includes('Formal') || trajectory.includes('verification')) {
    setActiveTrackId('formal-verification');
    return formal;
  }

  return tracks[activeTrackId] || dist;
}

export function saveRoadmapData(track: RoadmapTrack): void {
  try {
    const raw = localStorage.getItem(ROADMAP_STORAGE_KEY);
    const tracks: Record<string, RoadmapTrack> = raw ? JSON.parse(raw) : {};
    tracks[track.id] = track;
    localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(tracks));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('learnmate_roadmap_updated', { detail: track }));
    }
  } catch {
    // Ignore
  }
}

export function getActiveTrackId(): string {
  try {
    const stored = localStorage.getItem(ACTIVE_TRACK_KEY);
    if (stored) return stored;
  } catch {
    // Ignore
  }
  return 'distributed-systems';
}

export function setActiveTrackId(trackId: string): void {
  try {
    localStorage.setItem(ACTIVE_TRACK_KEY, trackId);
  } catch {
    // Ignore
  }
}

export function getAllTracks(): { id: string; title: string; role: string; code: string }[] {
  return [
    {
      id: 'distributed-systems',
      title: 'Distributed Systems & Cloud-Native Architecture',
      role: 'Distributed Systems Staff Engineer',
      code: 'SYSTEMS-TRACK-v4.2',
    },
    {
      id: 'rust-kernel',
      title: 'Rust Systems Programming & Kernel Architecture',
      role: 'Rust Systems & Kernel Architect',
      code: 'RUST-TRACK-v2.1',
    },
    {
      id: 'formal-verification',
      title: 'Formal Verification & Consensus Safety Research',
      role: 'Formal Verification & Consensus Researcher',
      code: 'RESEARCH-TRACK-v1.4',
    },
  ];
}

// ─────────────────────────────────────────────
// Interactive Module Operations
// ─────────────────────────────────────────────

export function toggleModuleCompletion(_trackId: string, moduleId: string): { track: RoadmapTrack; completed: boolean } {
  const track = getRoadmapData();
  let isNowCompleted = false;

  for (const stage of track.stages) {
    for (const mod of stage.modules) {
      if (mod.id === moduleId) {
        if (mod.status === 'completed') {
          mod.status = 'in-progress';
          mod.progressPct = 50;
          isNowCompleted = false;
        } else {
          mod.status = 'completed';
          mod.progressPct = 100;
          isNowCompleted = true;
        }
        break;
      }
    }

    // Recalculate stage progress
    const completedCount = stage.modules.filter((m) => m.status === 'completed').length;
    const totalModules = stage.modules.length;
    stage.progressPct = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
    if (stage.progressPct === 100) {
      stage.status = 'completed';
    } else if (stage.progressPct > 0) {
      stage.status = 'in-progress';
    }
  }

  // Check if subsequent stages can unlock
  for (let i = 0; i < track.stages.length; i++) {
    if (i > 0 && track.stages[i - 1].status === 'completed' && track.stages[i].status === 'locked') {
      track.stages[i].status = 'unlocked';
      track.stages[i].modules.forEach((m) => {
        if (m.status === 'locked') m.status = 'unlocked';
      });
    }
  }

  saveRoadmapData(track);

  // If completed, record study activity to update weekly hours and sidebar in real time!
  if (isNowCompleted) {
    recordActivity(0.75);
  }

  return { track, completed: isNowCompleted };
}

export function toggleModuleBookmark(_trackId: string, moduleId: string): RoadmapTrack {
  const track = getRoadmapData();
  for (const stage of track.stages) {
    for (const mod of stage.modules) {
      if (mod.id === moduleId) {
        mod.bookmarked = !mod.bookmarked;
        break;
      }
    }
  }
  saveRoadmapData(track);
  return track;
}

export function submitQuizAnswers(
  _trackId: string,
  moduleId: string,
  userAnswers: Record<string, number>
): { passed: boolean; score: number; correctCount: number; totalCount: number; track: RoadmapTrack } {
  const track = getRoadmapData();
  let targetModule: RoadmapModule | null = null;

  for (const stage of track.stages) {
    for (const mod of stage.modules) {
      if (mod.id === moduleId) {
        targetModule = mod;
        break;
      }
    }
  }

  if (!targetModule) {
    return { passed: false, score: 0, correctCount: 0, totalCount: 0, track };
  }

  let correctCount = 0;
  const totalCount = targetModule.quizQuestions.length;

  targetModule.quizQuestions.forEach((q) => {
    if (userAnswers[q.id] === q.correctIndex) {
      correctCount += 1;
    }
  });

  const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const passed = score >= 80;

  if (passed && targetModule.status !== 'completed') {
    targetModule.status = 'completed';
    targetModule.progressPct = 100;

    // Recalculate parent stage
    for (const stage of track.stages) {
      const comp = stage.modules.filter((m) => m.status === 'completed').length;
      stage.progressPct = Math.round((comp / stage.modules.length) * 100);
      if (stage.progressPct === 100) stage.status = 'completed';
      else if (stage.progressPct > 0) stage.status = 'in-progress';
    }

    saveRoadmapData(track);
    recordActivity(1.0); // Reward 1.0 hour for mastering quiz assessment!
  }

  return { passed, score, correctCount, totalCount, track };
}

export function adaptRoadmapWithAi(_trackId: string, feedback: string): RoadmapTrack {
  const track = getRoadmapData();
  track.adaptedNote = `Adapted via AI: "${feedback}"`;

  // Dynamically personalize description and prioritize active modules
  track.description = `${track.description} (Refined with Granite: ${feedback.slice(0, 80)}...)`;
  saveRoadmapData(track);
  return track;
}

export function getOverallProgressPct(track: RoadmapTrack): number {
  const allModules = track.stages.flatMap((s) => s.modules);
  if (allModules.length === 0) return 0;
  const completed = allModules.filter((m) => m.status === 'completed').length;
  return Math.round((completed / allModules.length) * 100);
}
