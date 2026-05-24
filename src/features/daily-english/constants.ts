import type { QuickEntry } from './types';

export const QUICK_ENTRIES: QuickEntry[] = [
  {
    id: 'chat',
    label: 'AI Chat',
    description: 'Talk with your tutor',
    route: '/chat',
    icon: { ios: 'bubble.left.and.bubble.right', android: 'chat', web: 'chat' },
  },
  {
    id: 'shadowing',
    label: 'Shadowing',
    description: 'Listen and repeat',
    route: '/shadowing',
    icon: { ios: 'waveform', android: 'graphic_eq', web: 'graphic_eq' },
  },
  {
    id: 'interview',
    label: 'Interview',
    description: 'Tech interviews',
    route: '/interview',
    icon: { ios: 'person.2', android: 'groups', web: 'groups' },
  },
];

export const HOME_COPY = {
  dailyEnglishLabel: 'Daily English',
  continueLearningTitle: 'Continue learning',
  quickEntryTitle: 'Quick start',
  studyProgressTitle: 'Your progress',
  playAudioLabel: 'Play',
  playingAudioLabel: 'Playing…',
  favoriteLabel: 'Favorite',
  minutesLabel: 'min today',
  streakLabel: 'day streak',
  wordsLabel: 'words',
  weeklyGoalLabel: 'Weekly goal',
} as const;

export const PROFILE_SCREEN = {
  title: 'Profile',
  description: 'Account and learning preferences.',
  placeholder: 'Settings and account options are coming soon.',
} as const;
