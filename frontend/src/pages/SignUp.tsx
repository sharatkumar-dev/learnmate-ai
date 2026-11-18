import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLearnMate } from '@/context/LearnMateContext';

type AuthMode = 'signup' | 'signin';

export function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUpUser, signInUser } = useLearnMate();

  const [mode, setMode] = useState<AuthMode>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTrajectory, setSelectedTrajectory] = useState('Distributed Systems');

  // Form inputs are strictly empty by default
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [receiveNewsletter, setReceiveNewsletter] = useState(true);

  // Errors and feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Dynamic Password Strength Evaluation
  const hasMinLength = password.length >= 8;
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password);
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);

  let strengthScore = 0;
  if (password.length > 0) {
    if (hasMinLength) strengthScore += 1;
    if (hasDigit) strengthScore += 1;
    if (hasSymbol) strengthScore += 1;
    if (hasMixedCase || password.length >= 12) strengthScore += 1;
    if (strengthScore === 0) strengthScore = 1; // At least weak if typed
  }

  const getStrengthMeta = () => {
    if (password.length === 0) {
      return {
        label: 'Enter password',
        labelColor: 'text-outline',
        barColor: 'bg-surface-container-high',
      };
    }
    switch (strengthScore) {
      case 1:
        return {
          label: 'Weak strength',
          labelColor: 'text-error',
          barColor: 'bg-error',
        };
      case 2:
        return {
          label: 'Fair strength',
          labelColor: 'text-amber-500',
          barColor: 'bg-amber-500',
        };
      case 3:
        return {
          label: 'Good strength',
          labelColor: 'text-primary',
          barColor: 'bg-primary',
        };
      case 4:
      default:
        return {
          label: 'Secure strength',
          labelColor: 'text-emerald-600',
          barColor: 'bg-emerald-600',
        };
    }
  };

  const strengthMeta = getStrengthMeta();

  const trajectories = ['Distributed Systems', 'Cloud & DevOps', 'ML Systems', 'Full-Stack Eng'];

  const validateForm = (): boolean => {
    setErrorMessage(null);

    // Common Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setErrorMessage('Work email is required.');
      return false;
    }
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }

    // Password presence check
    if (!password) {
      setErrorMessage('Password is required.');
      return false;
    }

    if (mode === 'signup') {
      if (!fullName.trim() || fullName.trim().length < 2) {
        setErrorMessage('Full name is required (minimum 2 characters).');
        return false;
      }
      if (!hasMinLength) {
        setErrorMessage('Password must be at least 8 characters long.');
        return false;
      }
      if (!hasDigit) {
        setErrorMessage('Password must contain at least 1 number (0-9).');
        return false;
      }
      if (!hasSymbol) {
        setErrorMessage('Password must contain at least 1 special symbol (e.g. !@#$%).');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      if (mode === 'signup') {
        const result = signUpUser(fullName, email, password, selectedTrajectory);
        if (!result.success) {
          setErrorMessage(result.error || 'Failed to register account.');
          setSubmitting(false);
          return;
        }
        // Successful registration redirects to onboarding
        navigate('/onboarding');
      } else {
        const result = signInUser(email, password);
        if (!result.success) {
          setErrorMessage(result.error || 'Invalid email or password.');
          setSubmitting(false);
          return;
        }
        // Successful sign-in redirects to dashboard (or return URL)
        const targetPath = (location.state as { from?: string })?.from || '/dashboard';
        navigate(targetPath);
      }
    } catch {
      setErrorMessage('An unexpected authentication error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-center items-center px-space-md py-space-xl">
      <main className="w-full max-w-md mx-auto">
        <div className="flex flex-col w-full">
          <div className="relative w-full overflow-hidden rounded-xl bg-surface-container-lowest p-space-md sm:p-space-lg shadow-xl shadow-surface-container-high/40 border border-border/40">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-secondary-fixed/40 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col space-y-space-md">
              {/* Header & Logo (v2.4 label removed) */}
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center gap-space-xs cursor-pointer group"
                  onClick={() => navigate('/')}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-on-primary shadow-sm group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-headline-sm">terminal</span>
                  </div>
                  <span className="font-headline-md text-headline-md tracking-tight text-on-surface">
                    Learn<span className="text-primary-container">Mate</span>
                  </span>
                </div>

                {/* Mode Selector Tabs */}
                <div className="flex items-center bg-surface-container-low p-1 rounded-lg border border-border/40">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMessage(null);
                    }}
                    className={`px-3 py-1 rounded-md font-label-sm text-label-sm font-semibold transition-all cursor-pointer ${
                      mode === 'signup'
                        ? 'bg-surface-container-lowest text-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMessage(null);
                    }}
                    className={`px-3 py-1 rounded-md font-label-sm text-label-sm font-semibold transition-all cursor-pointer ${
                      mode === 'signin'
                        ? 'bg-surface-container-lowest text-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Sign In
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">
                  {mode === 'signup' ? 'Engineered for mastery.' : 'Welcome back.'}
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {mode === 'signup'
                    ? 'Master complex engineering systems with AI-guided rigor, memory graphs, and interactive runtimes.'
                    : 'Sign in to access your calibrated engineering cockpit, active tracks, and memory retention graph.'}
                </p>
              </div>

              {/* Social Buttons (Disabled, No Redirection) */}
              <div className="grid grid-cols-2 gap-space-xs pt-1">
                <button
                  type="button"
                  disabled
                  title="Social sign-in coming soon"
                  className="group flex items-center justify-center gap-2 rounded-lg bg-surface-container-low px-space-sm py-2.5 text-on-surface-variant font-label-md text-label-md transition-all opacity-70 cursor-not-allowed border border-transparent"
                >
                  <svg className="h-4 w-4 fill-current text-on-surface-variant" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                  <span className="tracking-tight">GitHub</span>
                </button>

                <button
                  type="button"
                  disabled
                  title="Social sign-in coming soon"
                  className="group flex items-center justify-center gap-2 rounded-lg bg-surface-container-low px-space-sm py-2.5 text-on-surface-variant font-label-md text-label-md transition-all opacity-70 cursor-not-allowed border border-transparent"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.98 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="tracking-tight">Google</span>
                </button>
              </div>

              <div className="relative flex items-center py-1">
                <div className="w-full h-px bg-surface-container-high" />
                <span className="absolute left-1/2 -translate-x-1/2 bg-surface-container-lowest px-3 font-code-sm text-code-sm text-tertiary select-none">
                  {mode === 'signup' ? 'or sign up with work email' : 'or sign in with email'}
                </span>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="rounded-lg bg-error-container/20 border border-error/30 p-space-sm flex items-start gap-2 text-error animate-in fade-in duration-200">
                  <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
                  <span className="font-body-sm text-body-sm leading-tight font-medium">{errorMessage}</span>
                </div>
              )}

              {/* Main Auth Form */}
              <form className="space-y-space-sm" onSubmit={handleSubmit} noValidate>
                {/* Full Name Field (Sign Up Only, Empty by Default) */}
                {mode === 'signup' && (
                  <div className="space-y-1">
                    <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-medium">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Alex Rivera"
                        autoComplete="name"
                        className="w-full rounded-lg bg-surface-container-low px-3 py-2 text-on-surface placeholder:text-outline/70 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary font-body-md text-body-md transition-all border border-border/30"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-headline-sm text-outline pointer-events-none">
                        person
                      </span>
                    </div>
                  </div>
                )}

                {/* Email Field (Empty by Default) */}
                <div className="space-y-1">
                  <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-medium">
                    Work Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. alex.rivera@engineering.io"
                      autoComplete="email"
                      className="w-full rounded-lg bg-surface-container-low px-3 py-2 text-on-surface placeholder:text-outline/70 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary font-body-md text-body-md transition-all border border-border/30"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-headline-sm text-outline pointer-events-none">
                      alternate_email
                    </span>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-medium">
                      {mode === 'signup' ? 'Security Key / Password' : 'Password'}
                    </label>
                    {mode === 'signup' && (
                      <span className={`font-code-sm text-code-sm font-semibold transition-colors ${strengthMeta.labelColor}`}>
                        {strengthMeta.label}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === 'signup' ? 'Min. 8 characters + symbols' : 'Enter your account password'}
                      className="w-full rounded-lg bg-surface-container-low px-3 py-2 pr-10 text-on-surface placeholder:text-outline/70 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary font-body-md text-body-md transition-all border border-border/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2 text-on-surface-variant hover:text-on-surface cursor-pointer p-0.5 rounded focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <span className="material-symbols-outlined text-headline-sm">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>

                  {/* Dynamic Real-Time Password Strength Meter (Sign Up Only) */}
                  {mode === 'signup' && (
                    <div className="space-y-1.5 pt-0.5">
                      <div className="grid grid-cols-4 gap-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            strengthScore >= 1 ? strengthMeta.barColor : 'bg-surface-container-high'
                          }`}
                        />
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            strengthScore >= 2 ? strengthMeta.barColor : 'bg-surface-container-high'
                          }`}
                        />
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            strengthScore >= 3 ? strengthMeta.barColor : 'bg-surface-container-high'
                          }`}
                        />
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            strengthScore >= 4 ? strengthMeta.barColor : 'bg-surface-container-high'
                          }`}
                        />
                      </div>

                      {/* Dynamic Criteria Checklist */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-label-sm text-label-sm text-on-surface-variant pt-0.5">
                        <span className={`flex items-center gap-1 transition-colors ${hasMinLength ? 'text-emerald-600 font-medium' : 'text-outline'}`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {hasMinLength ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          8+ chars
                        </span>
                        <span className={`flex items-center gap-1 transition-colors ${hasDigit ? 'text-emerald-600 font-medium' : 'text-outline'}`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {hasDigit ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          1 digit
                        </span>
                        <span className={`flex items-center gap-1 transition-colors ${hasSymbol ? 'text-emerald-600 font-medium' : 'text-outline'}`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {hasSymbol ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          1 specialized symbol
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Trajectory Selection (Sign Up Only) */}
                {mode === 'signup' && (
                  <div className="space-y-1.5 pt-1">
                    <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-medium">
                      Engineering Trajectory
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {trajectories.map((traj) => {
                        const active = selectedTrajectory === traj;
                        return (
                          <button
                            key={traj}
                            type="button"
                            onClick={() => setSelectedTrajectory(traj)}
                            className={`text-left flex items-center justify-between px-3 py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                              active
                                ? 'bg-primary-container text-on-primary shadow-sm font-semibold'
                                : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                            }`}
                          >
                            <span>{traj}</span>
                            <span
                              className={`material-symbols-outlined text-label-md ${
                                active ? 'opacity-100' : 'opacity-0'
                              }`}
                            >
                              check_circle
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Weekly Dispatch Consent (Sign Up Only) */}
                {mode === 'signup' && (
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={receiveNewsletter}
                        onChange={(e) => setReceiveNewsletter(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded accent-primary-container cursor-pointer"
                      />
                      <span className="font-body-sm text-body-sm text-on-surface-variant leading-snug group-hover:text-on-surface transition-colors">
                        Send curated weekly architecture deep dives &amp; spaced-repetition retention challenges.
                      </span>
                    </label>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-space-md py-3 font-label-md text-label-md text-on-primary shadow-md shadow-primary/20 hover:bg-primary-container active:scale-[0.98] transition-all cursor-pointer font-semibold disabled:opacity-50"
                >
                  <span>{mode === 'signup' ? 'Create LearnMate Account' : 'Sign In to Cockpit'}</span>
                  <span className="material-symbols-outlined text-headline-sm">arrow_forward</span>
                </button>

                {mode === 'signup' && (
                  <p className="font-label-sm text-label-sm text-outline text-center px-space-xs pt-1">
                    By signing up, you agree to our{' '}
                    <a className="text-on-surface underline hover:text-primary transition-colors" href="#">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a className="text-on-surface underline hover:text-primary transition-colors" href="#">
                      Privacy Policy
                    </a>.
                  </p>
                )}
              </form>

              {/* Mode Toggle Footer (Replaces hardcoded Sign in navigate bypass) */}
              <div className="pt-2 text-center border-t border-border/40">
                {mode === 'signup' ? (
                  <div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Already have an engineering seat?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setErrorMessage(null);
                      }}
                      className="font-label-md text-label-md text-primary hover:text-primary-container ml-1 font-semibold transition-colors cursor-pointer"
                    >
                      Sign in →
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Need a new engineering account?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setErrorMessage(null);
                      }}
                      className="font-label-md text-label-md text-primary hover:text-primary-container ml-1 font-semibold transition-colors cursor-pointer"
                    >
                      Create account →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
