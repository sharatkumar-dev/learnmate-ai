import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type {
  LearnerProfile,
  Pathway,
  ProgressState,
  RecommendationList,
  SkillGapReport,
  ChatMessage,
} from '@/types/index';

export interface AuthUser {
  fullName: string;
  email: string;
  trajectory?: string;
  token?: string;
}

export interface StoredAccount {
  fullName: string;
  email: string;
  password: string;
  trajectory: string;
}

export interface LearnMateContextValue {
  sessionId: string | null;
  profile: LearnerProfile | null;
  pathway: Pathway | null;
  skillGaps: SkillGapReport | null;
  recommendations: RecommendationList | null;
  progress: ProgressState;
  chatHistory: ChatMessage[];
  isMockMode: boolean;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setSessionId: (id: string) => void;
  setProfile: (p: LearnerProfile) => void;
  setPathway: (p: Pathway) => void;
  setSkillGaps: (s: SkillGapReport) => void;
  setRecommendations: (r: RecommendationList) => void;
  setProgress: (p: ProgressState) => void;
  addChatMessage: (m: ChatMessage) => void;
  signUpUser: (fullName: string, email: string, password: string, trajectory: string) => { success: boolean; error?: string };
  signInUser: (email: string, password: string) => { success: boolean; error?: string };
  updateUserProfile: (updates: Partial<AuthUser>) => void;
  updateStoredPassword: (currentPassword: string, newPassword: string) => { success: boolean; error?: string };
  signOut: () => void;
}

const LearnMateContext = createContext<LearnMateContextValue | null>(null);

const SESSION_KEY = 'learnmate_session_id';
const AUTH_KEY = 'learnmate_auth';
const ACCOUNTS_KEY = 'learnmate_accounts';

function getStoredAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function LearnMateProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionIdState] = useState<string | null>(
    () => sessionStorage.getItem(SESSION_KEY),
  );
  const [user, setUser] = useState<AuthUser | null>(getStoredAuthUser);
  const [profile, setProfileState] = useState<LearnerProfile | null>(null);
  const [pathway, setPathwayState] = useState<Pathway | null>(null);
  const [skillGaps, setSkillGapsState] = useState<SkillGapReport | null>(null);
  const [recommendations, setRecommendationsState] =
    useState<RecommendationList | null>(null);
  const [progress, setProgressState] = useState<ProgressState>({
    milestones: [],
    completed: [],
  });
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const isAuthenticated = !!user;

  const isMockMode =
    (pathway?._mock ?? false) ||
    (skillGaps?._mock ?? false) ||
    (recommendations?._mock ?? false);

  const setSessionId = useCallback((id: string) => {
    sessionStorage.setItem(SESSION_KEY, id);
    setSessionIdState(id);
  }, []);

  const setProfile = useCallback((p: LearnerProfile) => {
    setProfileState(p);
  }, []);

  const setPathway = useCallback((p: Pathway) => {
    setPathwayState(p);
  }, []);

  const setSkillGaps = useCallback((s: SkillGapReport) => {
    setSkillGapsState(s);
  }, []);

  const setRecommendations = useCallback((r: RecommendationList) => {
    setRecommendationsState(r);
  }, []);

  const setProgress = useCallback((p: ProgressState) => {
    setProgressState(p);
  }, []);

  const addChatMessage = useCallback((m: ChatMessage) => {
    setChatHistory((prev) => [...prev, m]);
  }, []);

  const signUpUser = useCallback(
    (fullName: string, email: string, password: string, trajectory: string) => {
      const normalizedEmail = email.trim().toLowerCase();
      const accounts = getStoredAccounts();

      if (accounts.some((acc) => acc.email === normalizedEmail)) {
        return {
          success: false,
          error: 'An account with this email already exists. Please sign in instead.',
        };
      }

      const newAccount: StoredAccount = {
        fullName: fullName.trim(),
        email: normalizedEmail,
        password,
        trajectory,
      };

      accounts.push(newAccount);
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));

      const authUser: AuthUser = {
        fullName: newAccount.fullName,
        email: newAccount.email,
        trajectory: newAccount.trajectory,
        token: 'auth_' + Math.random().toString(36).substring(2),
      };

      localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
      localStorage.setItem(
        'learnmate_user',
        JSON.stringify({ name: authUser.fullName, trajectory: authUser.trajectory }),
      );
      setUser(authUser);

      return { success: true };
    },
    [],
  );

  const signInUser = useCallback((email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const accounts = getStoredAccounts();

    const account = accounts.find((acc) => acc.email === normalizedEmail);
    if (!account) {
      return {
        success: false,
        error: 'No account found with this email. Please sign up first.',
      };
    }

    if (account.password !== password) {
      return {
        success: false,
        error: 'Incorrect password. Please verify your credentials and try again.',
      };
    }

    const authUser: AuthUser = {
      fullName: account.fullName,
      email: account.email,
      trajectory: account.trajectory,
      token: 'auth_' + Math.random().toString(36).substring(2),
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
    localStorage.setItem(
      'learnmate_user',
      JSON.stringify({ name: authUser.fullName, trajectory: authUser.trajectory }),
    );
    setUser(authUser);

    return { success: true };
  }, []);

  const updateUserProfile = useCallback((updates: Partial<AuthUser>) => {
    setUser((prev) => {
      const updated: AuthUser = {
        fullName: updates.fullName ?? prev?.fullName ?? 'Learner',
        email: updates.email ?? prev?.email ?? '',
        trajectory: updates.trajectory ?? prev?.trajectory ?? 'Staff Systems Engineer',
        token: prev?.token || 'auth_token',
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
      localStorage.setItem(
        'learnmate_user',
        JSON.stringify({ name: updated.fullName, trajectory: updated.trajectory }),
      );

      // Sync with stored accounts if existing email matches
      const accounts = getStoredAccounts();
      const currentEmail = prev?.email?.toLowerCase();
      const idx = accounts.findIndex((a) => a.email.toLowerCase() === currentEmail);
      if (idx !== -1) {
        accounts[idx] = {
          ...accounts[idx],
          fullName: updated.fullName,
          email: updated.email.toLowerCase(),
          trajectory: updated.trajectory || accounts[idx].trajectory,
        };
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      }
      return updated;
    });
  }, []);

  const updateStoredPassword = useCallback(
    (currentPassword: string, newPassword: string) => {
      if (!user) {
        return { success: false, error: 'User is not authenticated.' };
      }
      const accounts = getStoredAccounts();
      const idx = accounts.findIndex(
        (a) => a.email.toLowerCase() === user.email.toLowerCase(),
      );
      if (idx === -1) {
        return { success: false, error: 'User account not found.' };
      }
      if (accounts[idx].password !== currentPassword) {
        return { success: false, error: 'Incorrect current password.' };
      }
      if (newPassword.length < 6) {
        return { success: false, error: 'New password must be at least 6 characters.' };
      }
      accounts[idx].password = newPassword;
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      return { success: true };
    },
    [user],
  );

  const signOut = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem('learnmate_user');
    setUser(null);
    setSessionIdState(null);
    setProfileState(null);
    setPathwayState(null);
    setSkillGapsState(null);
    setRecommendationsState(null);
    setProgressState({
      milestones: [],
      completed: [],
    });
    setChatHistory([]);
  }, []);

  return (
    <LearnMateContext.Provider
      value={{
        sessionId,
        profile,
        pathway,
        skillGaps,
        recommendations,
        progress,
        chatHistory,
        isMockMode,
        user,
        isAuthenticated,
        setSessionId,
        setProfile,
        setPathway,
        setSkillGaps,
        setRecommendations,
        setProgress,
        addChatMessage,
        signUpUser,
        signInUser,
        updateUserProfile,
        updateStoredPassword,
        signOut,
      }}
    >
      {children}
    </LearnMateContext.Provider>
  );
}

export function useLearnMate(): LearnMateContextValue {
  const ctx = useContext(LearnMateContext);
  if (!ctx) {
    throw new Error('useLearnMate must be used within a LearnMateProvider');
  }
  return ctx;
}
