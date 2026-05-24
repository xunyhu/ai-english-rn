import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ContinueLearning, StudyProgress } from '@/features/daily-english/types';

import { zustandStorage } from './storage';

type ActivityRoute = ContinueLearning['route'];

type LastActivity = {
  route: ActivityRoute;
  title: string;
  subtitle: string;
  progressPercent: number;
};

export type ProgressStoreState = {
  minutesToday: number;
  activityDate: string;
  streakDays: number;
  lastStreakDate: string;
  wordsLearned: number;
  weeklyGoalMinutes: number;
  lastActivity: LastActivity | null;
};

export type ProgressStoreActions = {
  recordPractice: (options?: { minutes?: number; words?: number }) => void;
  setLastActivity: (activity: LastActivity) => void;
  getStudyProgress: () => StudyProgress;
  getContinueLearning: () => ContinueLearning;
  reset: () => void;
};

export type ProgressStore = ProgressStoreState & ProgressStoreActions;

const DEFAULT_CONTINUE: ContinueLearning = {
  id: 'continue-chat',
  title: 'AI Chat',
  subtitle: 'Start a conversation with your tutor',
  progressPercent: 0,
  route: '/chat',
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function rollDailyMinutes(state: ProgressStoreState): ProgressStoreState {
  const today = todayKey();
  if (state.activityDate === today) return state;
  return { ...state, activityDate: today, minutesToday: 0 };
}

function updateStreak(state: ProgressStoreState): Pick<ProgressStoreState, 'streakDays' | 'lastStreakDate'> {
  const today = todayKey();
  if (state.lastStreakDate === today) {
    return { streakDays: state.streakDays, lastStreakDate: state.lastStreakDate };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  if (state.lastStreakDate === yesterdayKey) {
    return { streakDays: state.streakDays + 1, lastStreakDate: today };
  }

  return { streakDays: 1, lastStreakDate: today };
}

const initialState: ProgressStoreState = {
  minutesToday: 0,
  activityDate: todayKey(),
  streakDays: 0,
  lastStreakDate: '',
  wordsLearned: 0,
  weeklyGoalMinutes: 30,
  lastActivity: null,
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      recordPractice: (options) => {
        const minutes = options?.minutes ?? 1;
        const words = options?.words ?? 0;

        set((state) => {
          const rolled = rollDailyMinutes(state);
          const streak = updateStreak(rolled);

          return {
            ...rolled,
            ...streak,
            minutesToday: rolled.minutesToday + minutes,
            wordsLearned: rolled.wordsLearned + words,
          };
        });
      },

      setLastActivity: (activity) => set({ lastActivity: activity }),

      getStudyProgress: () => {
        const current = get();
        const state = rollDailyMinutes(current);
        if (state.activityDate !== current.activityDate || state.minutesToday !== current.minutesToday) {
          set(state);
        }

        const weeklyProgressPercent = Math.min(
          100,
          Math.round((state.minutesToday / state.weeklyGoalMinutes) * 100),
        );

        return {
          streakDays: state.streakDays,
          wordsLearned: state.wordsLearned,
          minutesToday: state.minutesToday,
          weeklyGoalMinutes: state.weeklyGoalMinutes,
          weeklyProgressPercent,
        };
      },

      getContinueLearning: () => {
        const { lastActivity } = get();
        if (!lastActivity) return DEFAULT_CONTINUE;

        return {
          id: `continue-${lastActivity.route}`,
          title: lastActivity.title,
          subtitle: lastActivity.subtitle,
          progressPercent: lastActivity.progressPercent,
          route: lastActivity.route,
        };
      },

      reset: () => set(initialState),
    }),
    {
      name: 'progress-store',
      storage: zustandStorage,
    },
  ),
);

export function recordFeatureActivity(
  route: ActivityRoute,
  meta: { title: string; subtitle: string; progressPercent?: number },
  practice?: { minutes?: number; words?: number },
): void {
  const store = useProgressStore.getState();
  store.setLastActivity({
    route,
    title: meta.title,
    subtitle: meta.subtitle,
    progressPercent: meta.progressPercent ?? 0,
  });
  if (practice) {
    store.recordPractice(practice);
  }
}
