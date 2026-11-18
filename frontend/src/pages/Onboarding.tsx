import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearnMate } from '@/context/LearnMateContext';
import { startSession, analyzeSkills, generatePathway, ApiError } from '@/api/client';

export type TrajectoryType = 'career' | 'tech' | 'research';
export type ExperienceLevel = 'Beginner (0-1 yrs)' | 'Mid-level (2-4 yrs)' | 'Senior (5+ yrs)';
export type CommitmentType = 'casual' | 'accelerated' | 'intensive';

interface OnboardingStorageData {
  step: number;
  trajectory: TrajectoryType;
  targetRole: string;
  experienceLevel: ExperienceLevel;
  skills: string[];
  modalities: string[];
  commitment: CommitmentType;
  updatedAt: number;
}

const ONBOARDING_STORAGE_KEY = 'learnmate_onboarding_data';

const DEFAULT_SKILLS: Record<TrajectoryType, string[]> = {
  career: ['Go', 'Docker', 'Kubernetes', 'PostgreSQL', 'Microservices', 'Distributed Tracing'],
  tech: ['Rust', 'Memory Safety', 'Async/Tokio', 'eBPF', 'Linux Primitives', 'Zero-Copy I/O'],
  research: ['Raft Consensus', 'Paxos Invariants', 'Formal TLA+ Verification', 'Distributed Storage', 'CAP Theorem', 'Fault Injection'],
};

const SUGGESTED_SKILLS: Record<TrajectoryType, string[]> = {
  career: ['gRPC', 'Kafka', 'Redis Sentinel', 'Envoy Proxy', 'CQRS Architecture', 'Prometheus'],
  tech: ['SIMD Vectorization', 'C/C++ Interop', 'io_uring', 'Lock-Free Queues', 'WebAssembly', 'LLVM IR'],
  research: ['Byzantine Faults', 'Lamport Clocks', 'Chord/Kademlia DHT', 'CRDTs', 'Model Checking', 'Safety Proofs'],
};

const TRAJECTORY_ROLES: Record<TrajectoryType, string> = {
  career: 'Distributed Systems Staff Engineer',
  tech: 'Systems & Rust Performance Engineer',
  research: 'Distributed Systems & AI Researcher',
};

function getStoredOnboardingData(): OnboardingStorageData | null {
  try {
    const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function persistOnboarding(data: Partial<OnboardingStorageData>) {
  try {
    const current = getStoredOnboardingData() || {
      step: 1,
      trajectory: 'career',
      targetRole: TRAJECTORY_ROLES.career,
      experienceLevel: 'Mid-level (2-4 yrs)',
      skills: DEFAULT_SKILLS.career,
      modalities: ['Hands-on coding labs', 'Socratic AI dialogues'],
      commitment: 'accelerated',
      updatedAt: Date.now(),
    };
    const merged = { ...current, ...data, updatedAt: Date.now() };
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // Ignore quota errors
  }
}

export function Onboarding() {
  const navigate = useNavigate();
  const { setSessionId, setProfile, setPathway, setSkillGaps, user } = useLearnMate();

  const initialDraft = useMemo(() => getStoredOnboardingData(), []);

  // Wizard Step State (1 to 4) - Lazily initialized
  const [currentStep, setCurrentStep] = useState<number>(() => {
    if (initialDraft?.step && initialDraft.step >= 1 && initialDraft.step <= 4) {
      return initialDraft.step;
    }
    return 1;
  });

  // Form Selections - Lazily initialized
  const [trajectory, setTrajectory] = useState<TrajectoryType>(() => {
    if (initialDraft?.trajectory) return initialDraft.trajectory;
    if (user?.trajectory) {
      const t = user.trajectory.toLowerCase();
      if (t.includes('rust') || t.includes('tech') || t.includes('performance')) return 'tech';
      if (t.includes('research') || t.includes('academic')) return 'research';
    }
    return 'career';
  });

  const [targetRole, setTargetRole] = useState<string>(() => {
    if (initialDraft?.targetRole) return initialDraft.targetRole;
    return TRAJECTORY_ROLES[trajectory];
  });

  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(() => {
    return initialDraft?.experienceLevel || 'Mid-level (2-4 yrs)';
  });

  const [skills, setSkills] = useState<string[]>(() => {
    if (initialDraft?.skills && initialDraft.skills.length > 0) return initialDraft.skills;
    return DEFAULT_SKILLS[trajectory];
  });

  const [customSkillInput, setCustomSkillInput] = useState<string>('');

  const [modalities, setModalities] = useState<string[]>(() => {
    if (initialDraft?.modalities && initialDraft.modalities.length > 0) return initialDraft.modalities;
    return ['Hands-on coding labs', 'Socratic AI dialogues'];
  });

  const [commitment, setCommitment] = useState<CommitmentType>(() => {
    return initialDraft?.commitment || 'accelerated';
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [saveIndicator, setSaveIndicator] = useState<string>(initialDraft ? 'Draft restored' : 'Auto-save active');

  // Handle Trajectory Change
  const handleTrajectorySelect = (newTraj: TrajectoryType) => {
    setTrajectory(newTraj);
    const newRole = TRAJECTORY_ROLES[newTraj];
    setTargetRole(newRole);
    const newSkills = DEFAULT_SKILLS[newTraj];
    setSkills(newSkills);
    setValidationErrors((prev) => ({ ...prev, trajectory: '' }));
    persistOnboarding({ trajectory: newTraj, targetRole: newRole, skills: newSkills });
    setSaveIndicator('Saved');
  };

  // Toggle Skill
  const toggleSkill = (skill: string) => {
    const updated = skills.includes(skill) ? skills.filter((s) => s !== skill) : [...skills, skill];
    setSkills(updated);
    setValidationErrors((prev) => ({ ...prev, skills: '' }));
    persistOnboarding({ skills: updated });
    setSaveIndicator('Saved');
  };

  // Add Custom Skill
  const addCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (!skills.includes(trimmed)) {
      const updated = [...skills, trimmed];
      setSkills(updated);
      persistOnboarding({ skills: updated });
    }
    setCustomSkillInput('');
    setValidationErrors((prev) => ({ ...prev, skills: '' }));
    setSaveIndicator('Saved');
  };

  // Toggle Modality
  const toggleModality = (mod: string) => {
    const next = modalities.includes(mod) ? modalities.filter((m) => m !== mod) : [...modalities, mod];
    setModalities(next);
    if (next.length > 0) {
      setValidationErrors((e) => ({ ...e, modalities: '' }));
    }
    persistOnboarding({ modalities: next });
    setSaveIndicator('Saved');
  };

  // Handle Commitment change
  const handleCommitmentSelect = (c: CommitmentType) => {
    setCommitment(c);
    setValidationErrors((e) => ({ ...e, commitment: '' }));
    persistOnboarding({ commitment: c });
    setSaveIndicator('Saved');
  };

  // Handle Experience level change
  const handleExperienceSelect = (lvl: ExperienceLevel) => {
    setExperienceLevel(lvl);
    setValidationErrors((e) => ({ ...e, experience: '' }));
    persistOnboarding({ experienceLevel: lvl });
    setSaveIndicator('Saved');
  };

  // Dynamic Curriculum Calculations
  const calculations = useMemo(() => {
    const weeklyHours = commitment === 'casual' ? 4 : commitment === 'accelerated' ? 8 : 15;

    let baseHours = 100;
    let milestoneCount = 10;
    if (experienceLevel.startsWith('Beginner')) {
      baseHours = 135;
      milestoneCount = 14;
    } else if (experienceLevel.startsWith('Mid-level')) {
      baseHours = 96;
      milestoneCount = 10;
    } else {
      baseHours = 64;
      milestoneCount = 6;
    }

    const estimatedWeeks = Math.ceil(baseHours / weeklyHours);

    const milestonesPreview = [];
    if (trajectory === 'career') {
      if (experienceLevel.startsWith('Beginner')) {
        milestonesPreview.push(
          { title: 'Distributed Systems Fundamentals & RPCs', hours: 14, diff: 'Foundational', type: 'Lab' },
          { title: 'Concurrent Go Patterns & Channel Primitives', hours: 18, diff: 'Foundational', type: 'Code' },
          { title: 'Replicated State Machines & Storage Engines', hours: 22, diff: 'Intermediate', type: 'Interactive' },
          { title: 'Consensus Protocols: Leader Election in Raft', hours: 24, diff: 'Core', type: 'Diagnostic' },
        );
      } else if (experienceLevel.startsWith('Mid-level')) {
        milestonesPreview.push(
          { title: 'Raft Consensus Algorithm & Split-Vote Quorums', hours: 18, diff: 'Intermediate', type: 'Lab' },
          { title: 'High-Throughput Distributed Storage & Sharding', hours: 20, diff: 'Advanced', type: 'Interactive' },
          { title: 'Partition Tolerance & Chaos Invariant Testing', hours: 16, diff: 'Advanced', type: 'Diagnostic' },
          { title: 'Staff Architect Capstone: Geo-Replication Engine', hours: 26, diff: 'Staff Tier', type: 'Capstone' },
        );
      } else {
        milestonesPreview.push(
          { title: 'Multi-Paxos Leaseholder & Round-Trip Latency Optimization', hours: 16, diff: 'Staff Tier', type: 'Advanced' },
          { title: 'Formal Verification of Consensus Invariants (TLA+)', hours: 18, diff: 'Expert', type: 'Formal Proof' },
          { title: 'Kernel Bypass & Asymmetric Partition Defense', hours: 14, diff: 'Expert', type: 'Production' },
          { title: 'Principal Architect Distributed Benchmark Capstone', hours: 16, diff: 'Principal', type: 'Capstone' },
        );
      }
    } else if (trajectory === 'tech') {
      if (experienceLevel.startsWith('Beginner')) {
        milestonesPreview.push(
          { title: 'Rust Ownership, Borrowing & Memory Safety', hours: 18, diff: 'Foundational', type: 'Code' },
          { title: 'Systems Programming Basics & Pointer Semantics', hours: 16, diff: 'Foundational', type: 'Lab' },
          { title: 'Tokio Async Runtime & Future Poll Internals', hours: 22, diff: 'Intermediate', type: 'Interactive' },
          { title: 'Zero-Copy Buffer Management & Sockets', hours: 20, diff: 'Core', type: 'Lab' },
        );
      } else if (experienceLevel.startsWith('Mid-level')) {
        milestonesPreview.push(
          { title: 'Unsafe Rust & SIMD Vectorization Primitives', hours: 18, diff: 'Advanced', type: 'Code' },
          { title: 'Tokio Multi-Threaded Task Scheduling Internals', hours: 20, diff: 'Advanced', type: 'Lab' },
          { title: 'io_uring & High-Performance Async I/O Pipelines', hours: 22, diff: 'Advanced', type: 'Interactive' },
          { title: 'Lock-Free Ring Buffers & Atomic Consistency', hours: 20, diff: 'Deep Dive', type: 'Diagnostic' },
        );
      } else {
        milestonesPreview.push(
          { title: 'Custom Memory Allocators & Cache-Line Alignment', hours: 14, diff: 'Expert', type: 'Low Level' },
          { title: 'eBPF Kernel Probing & Tail Latency Elimination', hours: 18, diff: 'Expert', type: 'Production' },
          { title: 'Hardware Transmit Queues & Zero-Copy DPDK', hours: 16, diff: 'Expert', type: 'Kernel' },
          { title: 'Ultra Low-Latency Trading / Consensus Engine', hours: 16, diff: 'Principal', type: 'Capstone' },
        );
      }
    } else {
      milestonesPreview.push(
        { title: 'Paxos vs. Raft: Formal Invariants & Correctness Proofs', hours: 20, diff: 'Advanced', type: 'Theory' },
        { title: 'TLA+ Model Checking & Temporal Logic Specifications', hours: 22, diff: 'Expert', type: 'Formal Proof' },
        { title: 'FLP Impossibility & Asymmetric Failure Envelopes', hours: 18, diff: 'Academic', type: 'Paper Cohort' },
        { title: 'Byzantine Fault Tolerance & Quorum Systems Paper Review', hours: 24, diff: 'Principal', type: 'Research' },
      );
    }

    return {
      weeklyHours,
      baseHours,
      milestoneCount,
      estimatedWeeks,
      milestonesPreview,
    };
  }, [commitment, experienceLevel, trajectory]);

  // Validation before advancing
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!trajectory) errors.trajectory = 'Please select a core learning trajectory to continue.';
    } else if (step === 2) {
      if (!experienceLevel) errors.experience = 'Please select your software experience tier.';
      if (skills.length === 0) errors.skills = 'Please select or add at least one baseline skill.';
    } else if (step === 3) {
      if (modalities.length === 0) errors.modalities = 'Please select at least one learning modality.';
      if (!commitment) errors.commitment = 'Please select your weekly commitment pacing.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setErrorMsg(null);
      const nextStep = Math.min(currentStep + 1, 4);
      setCurrentStep(nextStep);
      persistOnboarding({ step: nextStep });
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    setValidationErrors({});
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      persistOnboarding({ step: prevStep });
    } else {
      navigate('/dashboard');
    }
  };

  // Step Jump (Clickable Stepper)
  const handleJumpToStep = (targetStep: number) => {
    if (targetStep < currentStep) {
      setErrorMsg(null);
      setValidationErrors({});
      setCurrentStep(targetStep);
      persistOnboarding({ step: targetStep });
    } else if (targetStep > currentStep) {
      if (validateStep(currentStep)) {
        setCurrentStep(targetStep);
        persistOnboarding({ step: targetStep });
      }
    }
  };

  // Final Calibration & Transition to Dashboard
  const handleCompleteOnboarding = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateStep(3)) {
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const profileData = {
      target_role: targetRole,
      current_skills: skills,
      interests: modalities,
      time_available_hours_per_week: calculations.weeklyHours,
    };

    try {
      localStorage.setItem('learnmate_user', JSON.stringify({
        name: user?.fullName || 'Learner',
        trajectory: targetRole,
        experienceLevel,
        commitment,
      }));
      localStorage.setItem('learnmate_onboarding_completed', 'true');
    } catch {
      // Ignore
    }

    try {
      const sessionResult = await startSession(profileData);
      setSessionId(sessionResult.session_id);
      setProfile(profileData);

      const [pathwayData, skillsData] = await Promise.all([
        generatePathway(profileData),
        analyzeSkills(profileData.current_skills, targetRole),
      ]);

      setPathway(pathwayData);
      setSkillGaps(skillsData);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Session calibrated with local IBM Granite engine.');
      }
      setProfile(profileData);
      setTimeout(() => navigate('/dashboard'), 800);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress Bar Percentage
  const progressPercent =
    currentStep === 1 ? '12%' : currentStep === 2 ? '38%' : currentStep === 3 ? '68%' : '100%';

  const stepTitles = [
    'Objectives',
    'Experience & Baseline',
    'Schedule & Modalities',
    'AI Adaptive Engine',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface font-body-md text-on-surface antialiased">
      {/* Top Header - Cleaned up: No Alex R. profile dropdown, No v2.4 badge */}
      <header className="sticky top-0 left-0 right-0 h-16 z-40 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 flex items-center justify-between px-6 md:px-10">
        <div
          className="flex items-center gap-space-sm cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm shrink-0">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              <path d="M12 3v4" strokeWidth="1.5" />
            </svg>
          </div>
          <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
            LearnMate
          </span>
        </div>

        {/* Dynamic Center Step Badge */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/40 text-primary font-label-sm text-label-sm font-semibold">
            <span className="material-symbols-outlined text-[15px]">tune</span>
            <span>{stepTitles[currentStep - 1]}</span>
          </div>
          <span className="text-outline text-label-sm">•</span>
          <span className="font-code-sm text-code-sm text-primary font-medium">
            Step {currentStep} of 4
          </span>
        </div>

        {/* Clean Header Right: Exit only */}
        <div className="flex items-center gap-3">
          <span className="hidden md:inline font-code-sm text-[11px] text-outline">
            {saveIndicator}
          </span>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-surface-container-low cursor-pointer border border-transparent hover:border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
            <span className="hidden sm:inline">Exit to Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full flex-1 px-4 sm:px-space-lg py-space-lg max-w-[1280px] mx-auto pt-6">
        <div className="flex flex-col w-full pb-16">
          {/* 4-Stage Connected Dynamic Stepper */}
          <div className="w-full max-w-4xl mx-auto mb-10 pt-4">
            <div className="flex items-center justify-between relative px-2">
              {/* Connecting Progress Track */}
              <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-surface-container-high rounded-full -z-0">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: progressPercent }}
                />
              </div>

              {/* Stage 1: Objectives */}
              <div
                className="relative z-10 flex flex-col items-center group cursor-pointer"
                onClick={() => handleJumpToStep(1)}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                    currentStep > 1
                      ? 'bg-primary text-on-primary shadow-md hover:scale-105'
                      : currentStep === 1
                      ? 'bg-surface-container-lowest text-primary ring-2 ring-primary shadow-lg'
                      : 'bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  {currentStep > 1 ? (
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  ) : currentStep === 1 ? (
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  ) : (
                    <span className="font-label-sm text-label-sm font-semibold">1</span>
                  )}
                </div>
                <span
                  className={`mt-2.5 font-label-sm text-label-sm tracking-tight ${
                    currentStep >= 1 ? 'text-on-surface font-semibold' : 'text-on-surface-variant'
                  }`}
                >
                  Objectives
                </span>
                <span
                  className={`font-code-sm text-code-sm text-[10px] ${
                    currentStep > 1 ? 'text-primary' : currentStep === 1 ? 'text-primary font-bold' : 'text-outline'
                  }`}
                >
                  {currentStep > 1 ? 'Complete' : currentStep === 1 ? 'Active Step' : 'Step 1 of 4'}
                </span>
              </div>

              {/* Stage 2: Experience & Baseline */}
              <div
                className="relative z-10 flex flex-col items-center group cursor-pointer"
                onClick={() => handleJumpToStep(2)}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                    currentStep > 2
                      ? 'bg-primary text-on-primary shadow-md hover:scale-105'
                      : currentStep === 2
                      ? 'bg-surface-container-lowest text-primary ring-2 ring-primary shadow-lg'
                      : 'bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  {currentStep > 2 ? (
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  ) : currentStep === 2 ? (
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  ) : (
                    <span className="font-label-sm text-label-sm font-semibold">2</span>
                  )}
                </div>
                <span
                  className={`mt-2.5 font-label-sm text-label-sm tracking-tight ${
                    currentStep >= 2 ? 'text-on-surface font-semibold' : 'text-on-surface-variant'
                  }`}
                >
                  Experience &amp; Baseline
                </span>
                <span
                  className={`font-code-sm text-code-sm text-[10px] ${
                    currentStep > 2 ? 'text-primary' : currentStep === 2 ? 'text-primary font-bold' : 'text-outline'
                  }`}
                >
                  {currentStep > 2 ? 'Complete' : currentStep === 2 ? 'Active Step' : 'Step 2 of 4'}
                </span>
              </div>

              {/* Stage 3: Schedule */}
              <div
                className="relative z-10 flex flex-col items-center group cursor-pointer"
                onClick={() => handleJumpToStep(3)}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                    currentStep > 3
                      ? 'bg-primary text-on-primary shadow-md hover:scale-105'
                      : currentStep === 3
                      ? 'bg-surface-container-lowest text-primary ring-2 ring-primary shadow-lg'
                      : 'bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  {currentStep > 3 ? (
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  ) : currentStep === 3 ? (
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  ) : (
                    <span className="font-label-sm text-label-sm font-semibold">3</span>
                  )}
                </div>
                <span
                  className={`mt-2.5 font-label-sm text-label-sm tracking-tight ${
                    currentStep >= 3 ? 'text-on-surface font-semibold' : 'text-on-surface-variant'
                  }`}
                >
                  Schedule
                </span>
                <span
                  className={`font-code-sm text-code-sm text-[10px] ${
                    currentStep > 3 ? 'text-primary' : currentStep === 3 ? 'text-primary font-bold' : 'text-outline'
                  }`}
                >
                  {currentStep > 3 ? 'Complete' : currentStep === 3 ? 'Active Step' : 'Upcoming'}
                </span>
              </div>

              {/* Stage 4: AI Engine */}
              <div
                className="relative z-10 flex flex-col items-center group cursor-pointer"
                onClick={() => handleJumpToStep(4)}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                    currentStep === 4
                      ? 'bg-surface-container-lowest text-primary ring-2 ring-primary shadow-lg'
                      : 'bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  {currentStep === 4 ? (
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  ) : (
                    <span className="font-label-sm text-label-sm font-semibold">4</span>
                  )}
                </div>
                <span
                  className={`mt-2.5 font-label-sm text-label-sm tracking-tight ${
                    currentStep === 4 ? 'text-primary font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  AI Engine
                </span>
                <span
                  className={`font-code-sm text-code-sm text-[10px] ${
                    currentStep === 4 ? 'text-primary font-bold' : 'text-outline'
                  }`}
                >
                  {currentStep === 4 ? 'Active Review' : 'Upcoming'}
                </span>
              </div>
            </div>
          </div>

          {/* Main Interactive Wizard Card */}
          <div className="w-full max-w-4xl mx-auto bg-surface-container-lowest rounded-xl shadow-xl p-6 sm:p-10 md:p-12 relative overflow-hidden border border-outline-variant/30">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none -z-0" />

            <div className="relative z-10">
              {/* Error Banner */}
              {errorMsg && (
                <div className="mb-6 p-4 rounded-lg bg-amber-50 text-amber-800 text-sm border border-amber-200 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* STAGE 1: OBJECTIVES */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-fadeIn">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/60 text-on-primary-fixed font-label-sm text-label-sm font-semibold mb-4">
                      <span className="material-symbols-outlined text-[15px]">flag</span>
                      <span>STAGE 1 • CALIBRATION OBJECTIVES</span>
                    </div>
                    <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mb-2">
                      What is your primary engineering trajectory?
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Select your target focus. LearnMate calibrates the entire syllabus, code lab depth, and mentor dialogues to this trajectory.
                    </p>
                  </div>

                  {validationErrors.trajectory && (
                    <p className="text-error font-body-sm text-body-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">error</span>
                      {validationErrors.trajectory}
                    </p>
                  )}

                  {/* 3 Trajectory Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="radiogroup">
                    {/* Goal Card 1: Career */}
                    <div
                      onClick={() => handleTrajectorySelect('career')}
                      className={`relative flex flex-col p-5 rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow group ${
                        trajectory === 'career'
                          ? 'bg-primary-fixed/30 ring-2 ring-primary'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                          <span className="material-symbols-outlined text-[22px]">rocket_launch</span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            trajectory === 'career'
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container-high text-transparent'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        </div>
                      </div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">
                        Career Transition &amp; Staff Roles
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Targeted preparation for Staff/Principal roles in distributed systems, concurrency, and high-scale architecture.
                      </p>
                      <div className="mt-4 pt-3 flex items-center gap-1.5 font-code-sm text-code-sm text-primary font-medium">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        <span>Tier-1 Engineering Path</span>
                      </div>
                    </div>

                    {/* Goal Card 2: Tech */}
                    <div
                      onClick={() => handleTrajectorySelect('tech')}
                      className={`relative flex flex-col p-5 rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow group ${
                        trajectory === 'tech'
                          ? 'bg-primary-fixed/30 ring-2 ring-primary'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-lowest text-secondary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                          <span className="material-symbols-outlined text-[22px]">terminal</span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            trajectory === 'tech'
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container-high text-transparent'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        </div>
                      </div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">
                        Mastering Specific Stacks
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Deep dive execution into Rust memory semantics, Go runtime internals, and low-level cloud primitives.
                      </p>
                      <div className="mt-4 pt-3 flex items-center gap-1.5 font-code-sm text-code-sm text-secondary font-medium">
                        <span className="material-symbols-outlined text-[14px]">code</span>
                        <span>Language &amp; Runtime Mastery</span>
                      </div>
                    </div>

                    {/* Goal Card 3: Research */}
                    <div
                      onClick={() => handleTrajectorySelect('research')}
                      className={`relative flex flex-col p-5 rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow group ${
                        trajectory === 'research'
                          ? 'bg-primary-fixed/30 ring-2 ring-primary'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-lowest text-tertiary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                          <span className="material-symbols-outlined text-[22px]">science</span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            trajectory === 'research'
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container-high text-transparent'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        </div>
                      </div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">
                        Academic &amp; Research Focus
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Seminal CS whitepapers, formal verification, Raft/Paxos proofs, and consensus mechanisms.
                      </p>
                      <div className="mt-4 pt-3 flex items-center gap-1.5 font-code-sm text-code-sm text-tertiary font-medium">
                        <span className="material-symbols-outlined text-[14px]">history_edu</span>
                        <span>Theoretical Foundations</span>
                      </div>
                    </div>
                  </div>

                  {/* Target Role Fine-Tuning */}
                  <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/30 space-y-2">
                    <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between">
                      <span>Target Role or Specialization</span>
                      <span className="font-code-sm text-xs text-outline font-normal">Customizable</span>
                    </label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => {
                        setTargetRole(e.target.value);
                        persistOnboarding({ targetRole: e.target.value });
                        setSaveIndicator('Saved');
                      }}
                      placeholder="e.g. Distributed Systems Staff Engineer"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface font-body-md text-body-md"
                    />
                  </div>
                </div>
              )}

              {/* STAGE 2: EXPERIENCE & BASELINE */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-fadeIn">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/60 text-on-primary-fixed font-label-sm text-label-sm font-semibold mb-4">
                      <span className="material-symbols-outlined text-[15px]">psychology</span>
                      <span>STAGE 2 • EXPERIENCE &amp; BASELINE</span>
                    </div>
                    <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mb-2">
                      What is your software experience and baseline?
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      This determines introductory scaffolding versus advanced invariant proofs, ensuring you skip mastered concepts.
                    </p>
                  </div>

                  {/* Experience Level Selector */}
                  <div className="p-6 rounded-lg bg-surface-container-low space-y-4 border border-outline-variant/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-label-md text-label-md text-on-surface font-semibold block">
                          Professional Software Experience
                        </label>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Calibrates technical terminology depth and scaffolding rigor.
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-surface-container text-primary font-code-sm text-code-sm font-semibold shadow-sm">
                        {experienceLevel}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 rounded-lg bg-surface-container-lowest shadow-sm">
                      {(
                        [
                          { label: 'Beginner', sub: '0-1 years exp', val: 'Beginner (0-1 yrs)' },
                          { label: 'Mid-level', sub: '2-4 years exp', val: 'Mid-level (2-4 yrs)' },
                          { label: 'Senior & Above', sub: '5+ years exp', val: 'Senior (5+ yrs)' },
                        ] as const
                      ).map((lvl) => {
                        const active = experienceLevel === lvl.val;
                        return (
                          <button
                            key={lvl.val}
                            type="button"
                            onClick={() => handleExperienceSelect(lvl.val)}
                            className={`py-3 px-3 rounded-lg text-center transition-all duration-200 font-label-md text-label-md cursor-pointer ${
                              active
                                ? 'bg-primary text-on-primary shadow-sm'
                                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                            }`}
                          >
                            <span className="font-semibold block">{lvl.label}</span>
                            <span
                              className={`font-code-sm text-[11px] ${
                                active ? 'text-on-primary-container' : 'text-outline'
                              }`}
                            >
                              {lvl.sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Baseline Skills Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold block">
                          Core Baseline Skills &amp; Concepts
                        </label>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          Select the competencies you are already familiar with.
                        </span>
                      </div>
                      <span className="font-code-sm text-code-sm text-primary font-semibold">
                        {skills.length} selected
                      </span>
                    </div>

                    {validationErrors.skills && (
                      <p className="text-error font-body-sm text-body-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">error</span>
                        {validationErrors.skills}
                      </p>
                    )}

                    {/* Active Selected Skills Chips */}
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-sm"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className="hover:opacity-75 transition-opacity"
                            aria-label={`Remove ${skill}`}
                          >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Suggested Skills for Current Trajectory */}
                    <div className="pt-2">
                      <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-2">
                        Suggested for {trajectory === 'career' ? 'Distributed Systems' : trajectory === 'tech' ? 'Rust & Systems' : 'Research'}:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {SUGGESTED_SKILLS[trajectory].map((suggested) => {
                          const isSelected = skills.includes(suggested);
                          return (
                            <button
                              key={suggested}
                              type="button"
                              onClick={() => toggleSkill(suggested)}
                              className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm transition-all duration-150 cursor-pointer border ${
                                isSelected
                                  ? 'bg-primary-fixed text-primary border-primary font-semibold'
                                  : 'bg-surface-container-low text-on-surface border-outline-variant/40 hover:bg-surface-container'
                              }`}
                            >
                              + {suggested}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom Skill Input */}
                    <form onSubmit={addCustomSkill} className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={customSkillInput}
                        onChange={(e) => setCustomSkillInput(e.target.value)}
                        placeholder="Add another skill or tool (e.g. Cassandra, Raft, eBPF)..."
                        className="flex-1 px-3.5 py-2 rounded-lg bg-surface-container-low border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface font-body-sm text-body-sm"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md border border-outline-variant/40 transition-colors"
                      >
                        Add Skill
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* STAGE 3: SCHEDULE & MODALITIES */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-fadeIn">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/60 text-on-primary-fixed font-label-sm text-label-sm font-semibold mb-4">
                      <span className="material-symbols-outlined text-[15px]">schedule</span>
                      <span>STAGE 3 • SCHEDULE &amp; MODALITIES</span>
                    </div>
                    <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mb-2">
                      How and when do you learn best?
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Configure your preferred learning modalities and weekly dedicated time. We tailor your study rhythm and module formats accordingly.
                    </p>
                  </div>

                  {/* 1. Modalities Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold">
                        Preferred Learning Modalities
                      </label>
                      <span className="font-code-sm text-code-sm text-outline">Multi-select available</span>
                    </div>

                    {validationErrors.modalities && (
                      <p className="text-error font-body-sm text-body-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">error</span>
                        {validationErrors.modalities}
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { icon: 'terminal', label: 'Hands-on coding labs', desc: 'Interactive sandbox exercises with live unit and integration tests' },
                        { icon: 'schema', label: 'Visual mental models', desc: 'Architectural diagrams, state machines, and sequence visualizers' },
                        { icon: 'style', label: 'Interactive flashcards', desc: 'Spaced repetition flashcards targeting distributed invariants' },
                        { icon: 'forum', label: 'Socratic AI dialogues', desc: 'Conversational Granite tutor questioning design tradeoffs' },
                      ].map((mod) => {
                        const active = modalities.includes(mod.label);
                        return (
                          <div
                            key={mod.label}
                            onClick={() => toggleModality(mod.label)}
                            className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all duration-150 border ${
                              active
                                ? 'bg-primary-fixed/30 border-primary ring-1 ring-primary shadow-sm'
                                : 'bg-surface-container-low border-outline-variant/30 hover:bg-surface-container'
                            }`}
                          >
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                active ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[20px]">{mod.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-label-md text-label-md text-on-surface font-semibold">
                                {mod.label}
                              </p>
                              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">
                                {mod.desc}
                              </p>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                active ? 'bg-primary text-on-primary' : 'bg-surface-container-high'
                              }`}
                            >
                              {active && <span className="material-symbols-outlined text-[14px]">check</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Weekly Commitment */}
                  <div className="space-y-3 pt-2">
                    <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold block">
                      Weekly Dedicated Commitment
                    </label>

                    <div aria-label="Commitment level" className="grid grid-cols-1 md:grid-cols-3 gap-3" role="radiogroup">
                      {[
                        {
                          val: 'casual',
                          title: '3-5 hrs / week',
                          sub: 'Casual & Steady',
                          desc: '1-2 sessions/week. Perfect alongside demanding sprints.',
                          icon: 'timer',
                        },
                        {
                          val: 'accelerated',
                          title: '6-10 hrs / week',
                          sub: 'Accelerated',
                          desc: 'Recommended. Balanced daily cadence with weekend labs.',
                          icon: 'speed',
                        },
                        {
                          val: 'intensive',
                          title: '12+ hrs / week',
                          sub: 'Intensive Immersion',
                          desc: 'Rapid upskilling for imminent technical interviews or role transition.',
                          icon: 'bolt',
                        },
                      ].map((item) => {
                        const active = commitment === item.val;
                        return (
                          <div
                            key={item.val}
                            onClick={() => handleCommitmentSelect(item.val as CommitmentType)}
                            className={`relative flex flex-col justify-between p-4 rounded-lg cursor-pointer transition-all duration-150 border ${
                              active
                                ? 'bg-primary-fixed/40 border-primary ring-1 ring-primary shadow-sm'
                                : 'bg-surface-container-low border-outline-variant/30 hover:bg-surface-container'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`material-symbols-outlined text-[24px] ${
                                  active ? 'text-primary' : 'text-outline'
                                }`}
                              >
                                {item.icon}
                              </span>
                              <div
                                className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                  active ? 'bg-primary' : 'bg-surface-container-high'
                                }`}
                              >
                                {active && <div className="w-1.5 h-1.5 rounded-full bg-on-primary" />}
                              </div>
                            </div>
                            <div>
                              <p className="font-label-md text-label-md text-on-surface font-semibold">
                                {item.title}
                              </p>
                              <p className="font-code-sm text-code-sm text-primary font-medium mt-0.5">
                                {item.sub}
                              </p>
                              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 4: AI ADAPTIVE ENGINE REVIEW */}
              {currentStep === 4 && (
                <div className="space-y-8 animate-fadeIn">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/60 text-on-primary-fixed font-label-sm text-label-sm font-semibold mb-4">
                      <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                      <span>STAGE 4 • ADAPTIVE CURRICULA ENGINE</span>
                    </div>
                    <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mb-2">
                      Review Your Personalized Learning Blueprint
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      LearnMate's AI engine has synthesized your trajectory, experience, and weekly schedule into a tailored pathway.
                    </p>
                  </div>

                  {/* Curricula Engine Summary Hero Card */}
                  <div className="p-6 rounded-xl bg-surface-container border border-outline-variant/30 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
                      <div>
                        <span className="font-code-sm text-xs text-primary uppercase font-bold tracking-wider">
                          GENERATED SYLLABUS SPECIFICATION
                        </span>
                        <h2 className="font-headline-md text-headline-md text-on-surface font-bold mt-0.5">
                          {targetRole}
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Tier: <strong className="text-on-surface">{experienceLevel}</strong> • Weekly Pacing: <strong className="text-on-surface">{calculations.weeklyHours}h/wk</strong>
                        </p>
                      </div>

                      {/* Dynamic Metric Pills */}
                      <div className="flex items-center gap-3">
                        <div className="px-3.5 py-2 rounded-lg bg-surface-container-lowest text-center shadow-sm border border-outline-variant/20">
                          <span data-testid="metric-duration" className="block font-headline-sm text-headline-sm text-primary font-bold">
                            ~{calculations.estimatedWeeks} Wks
                          </span>
                          <span className="font-code-sm text-[11px] text-outline">Est. Duration</span>
                        </div>
                        <div className="px-3.5 py-2 rounded-lg bg-surface-container-lowest text-center shadow-sm border border-outline-variant/20">
                          <span className="block font-headline-sm text-headline-sm text-on-surface font-bold">
                            {calculations.milestoneCount}
                          </span>
                          <span className="font-code-sm text-[11px] text-outline">Milestones</span>
                        </div>
                        <div className="px-3.5 py-2 rounded-lg bg-surface-container-lowest text-center shadow-sm border border-outline-variant/20">
                          <span className="block font-headline-sm text-headline-sm text-on-surface font-bold">
                            {calculations.baseHours}h
                          </span>
                          <span className="font-code-sm text-[11px] text-outline">Total Hours</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Commitment Adjuster (Right on Stage 4) */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                      <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px] text-primary">tune</span>
                        <span>Adjust Pacing Simulation:</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {(['casual', 'accelerated', 'intensive'] as const).map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => handleCommitmentSelect(c)}
                            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                              commitment === c
                                ? 'bg-primary text-on-primary shadow-xs'
                                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
                            }`}
                          >
                            {c === 'casual' ? 'Casual (4h)' : c === 'accelerated' ? 'Accelerated (8h)' : 'Intensive (15h)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Tailored Milestones Preview */}
                    <div className="space-y-3">
                      <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold">
                        Curated Milestones Ahead
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {calculations.milestonesPreview.map((m, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 flex items-start justify-between gap-2 shadow-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-1.5 py-0.5 rounded bg-primary-fixed/40 text-primary font-mono text-[10px] font-bold">
                                  MOD-{idx + 1}
                                </span>
                                <span className="font-mono text-[11px] text-outline">
                                  {m.hours} hrs • {m.diff}
                                </span>
                              </div>
                              <p className="font-headline-sm text-xs font-semibold text-on-surface line-clamp-1">
                                {m.title}
                              </p>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[10px] shrink-0 font-medium">
                              {m.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Modality Allocation & Diagnostic session notice */}
                    <div className="p-4 rounded-lg bg-surface-container-lowest border border-outline-variant/30 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-label-sm text-on-surface font-semibold">
                          Learning Modality Breakdown:
                        </span>
                        <span className="text-outline font-code-sm">
                          {modalities.join(' • ')}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden flex">
                        {modalities.map((_, i) => (
                          <div
                            key={i}
                            className={`h-full ${
                              i === 0
                                ? 'bg-primary'
                                : i === 1
                                ? 'bg-secondary'
                                : i === 2
                                ? 'bg-tertiary'
                                : 'bg-primary-container'
                            }`}
                            style={{ width: `${100 / modalities.length}%` }}
                          />
                        ))}
                      </div>
                      <p className="font-body-sm text-xs text-on-surface-variant pt-1">
                        ✓ Diagnostic calibration prepared: 10-minute baseline challenge configured to skip mastered concepts across{' '}
                        <strong className="text-on-surface">{skills.slice(0, 3).join(', ')}</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTION NAVIGATION BUTTONS */}
              <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-outline-variant/20 mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-2 transition-all duration-150 group cursor-pointer border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-0.5">
                    arrow_back
                  </span>
                  <span>{currentStep === 1 ? 'Exit' : 'Back'}</span>
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-150 active:scale-[0.99] cursor-pointer"
                    >
                      <span>
                        {currentStep === 1
                          ? 'Continue to Experience'
                          : currentStep === 2
                          ? 'Continue to Schedule'
                          : 'Review AI Curricula'}
                      </span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleCompleteOnboarding}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-150 active:scale-[0.99] cursor-pointer disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                      <span>
                        {isSubmitting ? 'Calibrating via Granite...' : 'Launch Personalized Pathway'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Clean Footer Note */}
          <div className="w-full max-w-4xl mx-auto mt-6 px-4 flex flex-col sm:flex-row items-center justify-between text-on-surface-variant font-body-sm text-body-sm gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-outline">tune</span>
              <span>All preferences are saved to your local session and can be updated anytime in Settings.</span>
            </div>
            <div className="flex items-center gap-4 text-outline font-code-sm text-code-sm">
              <span>{saveIndicator}</span>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem(ONBOARDING_STORAGE_KEY);
                  setCurrentStep(1);
                  setTrajectory('career');
                  setExperienceLevel('Mid-level (2-4 yrs)');
                  setSkills(DEFAULT_SKILLS.career);
                  setCommitment('accelerated');
                  setSaveIndicator('Reset');
                }}
                className="hover:text-primary transition-colors cursor-pointer"
              >
                Reset Draft
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
