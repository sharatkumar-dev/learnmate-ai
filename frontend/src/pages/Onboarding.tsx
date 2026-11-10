import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearnMate } from '@/context/LearnMateContext';
import { startSession, analyzeSkills, generatePathway, ApiError } from '@/api/client';

type TrajectoryType = 'career' | 'tech' | 'research';
type ExperienceLevel = 'Beginner (0-1 yrs)' | 'Mid-level (2-4 yrs)' | 'Senior (5+ yrs)';
type CommitmentType = 'casual' | 'accelerated' | 'intensive';

export function Onboarding() {
  const navigate = useNavigate();
  const { setSessionId, setProfile, setPathway, setSkillGaps } = useLearnMate();

  const [trajectory, setTrajectory] = useState<TrajectoryType>('career');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Mid-level (2-4 yrs)');
  const [modalities, setModalities] = useState<string[]>([
    'Hands-on coding labs',
    'Socratic AI dialogues',
  ]);
  const [commitment, setCommitment] = useState<CommitmentType>('accelerated');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleModality = (mod: string) => {
    setModalities((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod],
    );
  };

  const handleContinue = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const targetRole =
      trajectory === 'career'
        ? 'Distributed Systems Staff Engineer'
        : trajectory === 'tech'
        ? 'Systems & Rust Performance Engineer'
        : 'Distributed Systems & AI Researcher';

    const hoursPerWeek =
      commitment === 'casual' ? 4 : commitment === 'accelerated' ? 8 : 15;

    const profileData = {
      target_role: targetRole,
      current_skills: ['Go', 'Docker', 'REST APIs', 'PostgreSQL'],
      interests: modalities,
      time_available_hours_per_week: hoursPerWeek,
    };

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
        setErrorMsg('Failed to initialize session. Transitioning with local profile.');
      }
      setProfile(profileData);
      setTimeout(() => navigate('/dashboard'), 800);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface font-body-md text-on-surface antialiased">
      {/* Top Header matching Stitch */}
      <header className="sticky top-0 left-0 right-0 h-16 z-40 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 flex items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-space-sm cursor-pointer" onClick={() => navigate('/dashboard')}>
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
          <span className="px-space-xs py-0.5 rounded-full bg-surface-container text-on-surface-variant font-code-sm text-code-sm border border-outline-variant/40 ml-1">
            v2.4
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/40 text-primary font-label-sm text-label-sm font-semibold">
            <span className="material-symbols-outlined text-[15px]">tune</span>
            <span>Calibration Setup</span>
          </div>
          <span className="text-outline text-label-sm">•</span>
          <span className="font-code-sm text-code-sm text-primary font-medium">Step 2 of 4</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm transition-colors px-2.5 py-1.5 rounded-lg hover:bg-surface-container-low cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
            <span className="hidden sm:inline">Exit to Dashboard</span>
          </button>
          <div className="h-5 w-[1px] bg-outline-variant/40" />
          <div className="flex items-center gap-2">
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-outline-variant/40"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVMlySAvthLBnT02K-Y39Sn3Zwboj8jDxUos2n5AUipsMS4QEEaQTWOmkAdCjGY90T6HB-aGpRS--3AhvWsgKfT3J-PaiAbfsXkMGnpAEKrXoRoqSBAJViWI2uuOJTUM5fQMIGhtsD-sojp57rvahNFXa5RzQCQF97e4G7jpHIu1TcE3twOoXV1MB9HfKCONu_DGq1bU2CjDAbEdKBP5QtrCaWbmgTr1RaYVKtYJ7G"
            />
            <span className="hidden lg:inline font-label-md text-label-md text-on-surface font-medium">
              Alex R.
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full flex-1 px-space-lg py-space-lg max-w-[1280px] mx-auto pt-6">
        <div className="flex flex-col w-full pb-16">
          {/* Stepper Header Section */}
          <div className="w-full max-w-4xl mx-auto mb-10 pt-4">
            <div className="flex items-center justify-between relative px-2">
              <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-surface-container-high rounded-full -z-0">
                <div className="h-full bg-primary rounded-full transition-all duration-500 w-[38%]" />
              </div>

              {/* Step 1: Completed */}
              <div className="relative z-10 flex flex-col items-center group cursor-pointer" onClick={() => navigate('/signup')}>
                <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                </div>
                <span className="mt-2.5 font-label-sm text-label-sm text-on-surface font-semibold tracking-tight">
                  Objectives
                </span>
                <span className="font-code-sm text-code-sm text-primary font-medium text-[10px]">
                  Complete
                </span>
              </div>

              {/* Step 2: Active */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-surface-container-lowest text-primary shadow-lg flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                </div>
                <span className="mt-2.5 font-label-sm text-label-sm text-primary font-bold tracking-tight">
                  Experience &amp; Baseline
                </span>
                <span className="font-code-sm text-code-sm text-primary font-medium text-[10px]">
                  Step 2 of 4
                </span>
              </div>

              {/* Step 3: Upcoming */}
              <div className="relative z-10 flex flex-col items-center opacity-60">
                <div className="w-9 h-9 rounded-full bg-surface-container-low text-on-surface-variant flex items-center justify-center shadow-sm">
                  <span className="font-label-sm text-label-sm font-semibold">3</span>
                </div>
                <span className="mt-2.5 font-label-sm text-label-sm text-on-surface-variant font-medium tracking-tight">
                  Schedule
                </span>
                <span className="font-code-sm text-code-sm text-outline text-[10px]">Upcoming</span>
              </div>

              {/* Step 4: Upcoming */}
              <div className="relative z-10 flex flex-col items-center opacity-60">
                <div className="w-9 h-9 rounded-full bg-surface-container-low text-on-surface-variant flex items-center justify-center shadow-sm">
                  <span className="font-label-sm text-label-sm font-semibold">4</span>
                </div>
                <span className="mt-2.5 font-label-sm text-label-sm text-on-surface-variant font-medium tracking-tight">
                  AI Engine
                </span>
                <span className="font-code-sm text-code-sm text-outline text-[10px]">Upcoming</span>
              </div>
            </div>
          </div>

          {/* Main Wizard Card */}
          <div className="w-full max-w-4xl mx-auto bg-surface-container-lowest rounded-xl shadow-xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none -z-0" />
            <div className="relative z-10">
              <div className="max-w-2xl mb-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/60 text-on-primary-fixed font-label-sm text-label-sm font-semibold mb-4">
                  <span className="material-symbols-outlined text-[15px]">psychology</span>
                  <span>CALIBRATION PROTOCOL</span>
                </div>
                <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mb-2">
                  What is your primary goal and current proficiency level?
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  LearnMate's AI engine tailors your curriculum, pacing, and diagnostic challenges to match your exact starting baseline and professional targets.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 rounded-lg bg-amber-50 text-amber-800 text-sm border border-amber-200">
                  {errorMsg}
                </div>
              )}

              <form className="space-y-10" onSubmit={handleContinue}>
                {/* 1. Core Learning Trajectory */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold">
                      1. Core Learning Trajectory
                    </label>
                    <span className="font-code-sm text-code-sm text-outline">Select one option</span>
                  </div>
                  <div aria-label="Learning Trajectory" className="grid grid-cols-1 md:grid-cols-3 gap-4" role="radiogroup">
                    {/* Goal Card 1: Career */}
                    <div
                      onClick={() => setTrajectory('career')}
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
                      onClick={() => setTrajectory('tech')}
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
                      <div className="mt-4 pt-3 flex items-center gap-1.5 font-code-sm text-code-sm text-on-surface-variant font-medium">
                        <span className="material-symbols-outlined text-[14px]">code</span>
                        <span>Language &amp; Runtime Mastery</span>
                      </div>
                    </div>

                    {/* Goal Card 3: Research */}
                    <div
                      onClick={() => setTrajectory('research')}
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
                      <div className="mt-4 pt-3 flex items-center gap-1.5 font-code-sm text-code-sm text-on-surface-variant font-medium">
                        <span className="material-symbols-outlined text-[14px]">history_edu</span>
                        <span>Theoretical Foundations</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Professional Software Experience */}
                <div className="p-6 rounded-lg bg-surface-container-low space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-label-md text-label-md text-on-surface font-semibold block">
                        2. Professional Software Experience
                      </label>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Determines the depth of technical terminology and introductory scaffolding in your modules.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-surface-container text-primary font-code-sm text-code-sm font-semibold shadow-sm">
                      {experienceLevel}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 p-1.5 rounded-lg bg-surface-container-lowest shadow-sm">
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
                          onClick={() => setExperienceLevel(lvl.val)}
                          className={`py-2.5 px-3 rounded text-center transition-all duration-200 font-label-md text-label-md cursor-pointer ${
                            active
                              ? 'bg-primary text-on-primary shadow-sm'
                              : 'text-on-surface-variant hover:text-on-surface'
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

                {/* 3. Preferred Learning Modalities */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold">
                      3. Preferred Learning Modalities
                    </label>
                    <span className="font-code-sm text-code-sm text-outline">Multi-select available</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { icon: 'terminal', label: 'Hands-on coding labs' },
                      { icon: 'schema', label: 'Visual mental models' },
                      { icon: 'style', label: 'Interactive flashcards' },
                      { icon: 'forum', label: 'Socratic AI dialogues' },
                    ].map((mod) => {
                      const active = modalities.includes(mod.label);
                      return (
                        <button
                          key={mod.label}
                          type="button"
                          onClick={() => toggleModality(mod.label)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-label-md text-label-md shadow-sm transition-all duration-150 cursor-pointer ${
                            active
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">{mod.icon}</span>
                          <span>{mod.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Weekly Dedicated Commitment */}
                <div className="space-y-3">
                  <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold">
                    4. Weekly Dedicated Commitment
                  </label>
                  <div aria-label="Commitment level" className="grid grid-cols-1 md:grid-cols-3 gap-3" role="radiogroup">
                    {[
                      { val: 'casual', title: '3-5 hrs / week', sub: 'Casual & Steady', icon: 'timer' },
                      { val: 'accelerated', title: '6-10 hrs / week', sub: 'Accelerated', icon: 'speed' },
                      { val: 'intensive', title: '12+ hrs / week', sub: 'Intensive Immersion', icon: 'bolt' },
                    ].map((item) => {
                      const active = commitment === item.val;
                      return (
                        <div
                          key={item.val}
                          onClick={() => setCommitment(item.val as CommitmentType)}
                          className={`relative flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-150 shadow-sm ${
                            active
                              ? 'bg-primary-fixed/40 ring-1 ring-primary'
                              : 'bg-surface-container-low hover:bg-surface-container'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`material-symbols-outlined text-[22px] ${
                                active ? 'text-primary' : 'text-outline'
                              }`}
                            >
                              {item.icon}
                            </span>
                            <div>
                              <p className="font-label-md text-label-md text-on-surface font-semibold">
                                {item.title}
                              </p>
                              <p className="font-body-sm text-body-sm text-on-surface-variant">
                                {item.sub}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              active ? 'bg-primary' : 'bg-surface-container-high'
                            }`}
                          >
                            {active && <div className="w-1.5 h-1.5 rounded-full bg-on-primary" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Adaptive Curricula Engine Summary */}
                <div className="p-5 rounded-lg bg-surface-container flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[24px] mt-0.5">
                      auto_awesome
                    </span>
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-0.5">
                        Adaptive Curricula Engine
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xl">
                        Based on your selections, we will compile{' '}
                        <span className="font-medium text-on-surface">14 targeted milestones</span> and prepare an initial 10-minute diagnostic session to skip mastered fundamentals.
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2 self-end md:self-auto">
                    <span className="px-2.5 py-1 rounded bg-surface-container-lowest text-on-surface font-code-sm text-code-sm shadow-sm">
                      Est. ~14 Weeks
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-2 transition-all duration-150 group cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-0.5">
                      arrow_back
                    </span>
                    <span>Back</span>
                  </button>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      className="px-4 py-2.5 rounded-lg hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors text-center cursor-pointer"
                    >
                      Skip to Dashboard
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-150 active:scale-[0.99] cursor-pointer disabled:opacity-50"
                    >
                      <span>{isSubmitting ? 'Calibrating via Granite...' : 'Continue to Dashboard'}</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Footer Note */}
          <div className="w-full max-w-4xl mx-auto mt-6 px-4 flex flex-col sm:flex-row items-center justify-between text-on-surface-variant font-body-sm text-body-sm gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-outline">tune</span>
              <span>You can retune baseline preferences or pause your roadmap anytime from Settings.</span>
            </div>
            <div className="flex items-center gap-4 text-outline font-code-sm text-code-sm">
              <span>Auto-saved 2s ago</span>
              <span>•</span>
              <a className="hover:text-primary transition-colors" href="#">
                Setup Documentation
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
