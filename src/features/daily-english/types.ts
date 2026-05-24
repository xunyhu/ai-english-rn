import type { SymbolViewProps } from 'expo-symbols';

export type DailyEnglish = {
  id: string;
  english: string;
  chinese: string;
};

export type ContinueLearning = {
  id: string;
  title: string;
  subtitle: string;
  progressPercent: number;
  route: '/shadowing' | '/chat' | '/interview';
};

export type QuickEntry = {
  id: string;
  label: string;
  description: string;
  route: '/chat' | '/shadowing' | '/interview';
  icon: SymbolViewProps['name'];
};

export type StudyProgress = {
  streakDays: number;
  wordsLearned: number;
  minutesToday: number;
  weeklyGoalMinutes: number;
  weeklyProgressPercent: number;
};

export type WelcomeInfo = {
  greeting: string;
  displayName: string;
  subtitle: string;
};
