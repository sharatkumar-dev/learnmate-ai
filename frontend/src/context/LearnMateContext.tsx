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

interface LearnMateContextValue {
  sessionId: string | null;
  profile: LearnerProfile | null;
  pathway: Pathway | null;
  skillGaps: SkillGapReport | null;
  recommendations: RecommendationList | null;
  progress: ProgressState;
  chatHistory: ChatMessage[];
  isMockMode: boolean;
  setSessionId: (id: string) => void;
  setProfile: (p: LearnerProfile) => void;
  setPathway: (p: Pathway) => void;
  setSkillGaps: (s: SkillGapReport) => void;
  setRecommendations: (r: RecommendationList) => void;
  setProgress: (p: ProgressState) => void;
  addChatMessage: (m: ChatMessage) => void;
}

const LearnMateContext = createContext<LearnMateContextValue | null>(null);

const SESSION_KEY = 'learnmate_session_id';

export function LearnMateProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionIdState] = useState<string | null>(
    () => sessionStorage.getItem(SESSION_KEY),
  );
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
        setSessionId,
        setProfile,
        setPathway,
        setSkillGaps,
        setRecommendations,
        setProgress,
        addChatMessage,
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
