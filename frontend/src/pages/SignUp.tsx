import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTrajectory, setSelectedTrajectory] = useState('Distributed Systems');
  const [fullName, setFullName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex.rivera@engineering.io');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/onboarding');
  };

  const trajectories = ['Distributed Systems', 'Cloud & DevOps', 'ML Systems', 'Full-Stack Eng'];

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-center items-center px-space-md py-space-xl">
      <main className="w-full max-w-md mx-auto">
        <div className="flex flex-col w-full">
          <div className="relative w-full overflow-hidden rounded-xl bg-surface-container-lowest p-space-md sm:p-space-lg shadow-xl shadow-surface-container-high/40">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-secondary-fixed/40 blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col space-y-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs cursor-pointer" onClick={() => navigate('/')}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-on-primary shadow-sm">
                    <span className="material-symbols-outlined text-headline-sm">terminal</span>
                  </div>
                  <span className="font-headline-md text-headline-md tracking-tight text-on-surface">
                    Learn<span className="text-primary-container">Mate</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-surface-container px-2.5 py-0.5 text-on-surface-variant font-code-sm text-code-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-container animate-pulse" />
                  <span>v2.4</span>
                </div>
              </div>

              <div className="space-y-1">
                <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">
                  Engineered for mastery.
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Master complex engineering systems with AI-guided rigor, memory graphs, and interactive runtimes.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-space-xs pt-1">
                <button
                  type="button"
                  onClick={() => navigate('/onboarding')}
                  className="group flex items-center justify-center gap-2 rounded-lg bg-surface-container-low px-space-sm py-2.5 text-on-surface font-label-md text-label-md transition-all hover:bg-surface-container active:scale-[0.99] cursor-pointer"
                >
                  <svg className="h-4 w-4 fill-current text-on-surface" viewBox="0 0 24 24">
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
                  onClick={() => navigate('/onboarding')}
                  className="group flex items-center justify-center gap-2 rounded-lg bg-surface-container-low px-space-sm py-2.5 text-on-surface font-label-md text-label-md transition-all hover:bg-surface-container active:scale-[0.99] cursor-pointer"
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
                <span className="absolute left-1/2 -translate-x-1/2 bg-surface-container-lowest px-3 font-code-sm text-code-sm text-tertiary">
                  or sign up with work email
                </span>
              </div>

              <form className="space-y-space-sm" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full rounded-lg bg-surface-container-low px-3 py-2 text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary font-body-md text-body-md transition-all"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-headline-sm text-outline pointer-events-none">
                      person
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Work Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.rivera@engineering.io"
                      className="w-full rounded-lg bg-surface-container-low px-3 py-2 text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary font-body-md text-body-md transition-all"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-headline-sm text-outline pointer-events-none">
                      alternate_email
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                      Security Key / Password
                    </label>
                    <span className="font-code-sm text-code-sm text-primary font-medium">
                      Secure strength
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters + symbols"
                      className="w-full rounded-lg bg-surface-container-low px-3 py-2 pr-10 text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary font-body-md text-body-md transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2 text-on-surface-variant hover:text-on-surface cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-headline-sm">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                    <div className="h-1 rounded-full bg-primary-container" />
                    <div className="h-1 rounded-full bg-primary-container" />
                    <div className="h-1 rounded-full bg-primary-container" />
                    <div className="h-1 rounded-full bg-surface-container-high" />
                  </div>
                  <p className="font-label-sm text-label-sm text-outline flex items-center gap-1">
                    <span className="material-symbols-outlined text-code-sm text-primary">
                      verified
                    </span>
                    <span>Contains 8+ chars, 1 digit &amp; 1 specialized symbol</span>
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
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
                              ? 'bg-primary-container text-on-primary shadow-sm'
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

                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mt-0.5 h-4 w-4 rounded accent-primary-container cursor-pointer"
                    />
                    <span className="font-body-sm text-body-sm text-on-surface-variant leading-snug group-hover:text-on-surface transition-colors">
                      Send curated weekly architecture deep dives &amp; spaced-repetition retention challenges.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-space-md py-3 font-label-md text-label-md text-on-primary shadow-md shadow-primary/20 hover:bg-primary-container active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span>Create LearnMate Account</span>
                  <span className="material-symbols-outlined text-headline-sm">arrow_forward</span>
                </button>

                <p className="font-label-sm text-label-sm text-outline text-center px-space-xs">
                  By signing up, you agree to our{' '}
                  <a className="text-on-surface underline hover:text-primary transition-colors" href="#">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a className="text-on-surface underline hover:text-primary transition-colors" href="#">
                    Privacy Policy
                  </a>.
                </p>
              </form>

              <div className="rounded-lg bg-surface-container-low p-space-sm space-y-2 mt-1">
                <div className="flex items-center gap-space-xs">
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    alt="Elena Chen portrait"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzWhUsfuvesEbpIHxXqgoPwUxdQePuFoY-iyWqVa6NuQYT9xPbaumn_t2SF8P41s_y6Ni0TaptUhxia1AiQJL20GsE-iC91doypRKmEdkC78JNsjsMIE0sqY0Y7CQlk4h-f8DdYUVJpT9OT2OU59NdArDzzvwEXysyJSKLoXZpHdGPq46jOm5dwGNdBevVN9VNW1F4GiiiwMON3jyDVnbLYUKUIJtwC9VU-EJJWpL4"
                  />
                  <div>
                    <div className="font-label-md text-label-md text-on-surface font-medium leading-none">
                      Elena Chen
                    </div>
                    <div className="font-label-sm text-label-sm text-outline">
                      Staff Infra Engineer @ Stripe
                    </div>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                  "The interactive memory maps and live consensus simulation gave our incoming tech leads a 3x retention boost compared to passive documentation."
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span
                    className="material-symbols-outlined text-label-md text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    award_star
                  </span>
                  <span className="font-code-sm text-code-sm text-on-surface-variant">
                    Trusted by 14,000+ senior engineers globally
                  </span>
                </div>
              </div>

              <div className="pt-1 text-center">
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Already have an engineering seat?
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="font-label-md text-label-md text-primary hover:text-primary-container ml-1 font-semibold transition-colors cursor-pointer"
                >
                  Sign in →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
