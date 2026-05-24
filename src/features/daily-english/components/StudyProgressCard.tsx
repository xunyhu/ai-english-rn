import { Text, View } from 'react-native';

import { AppCard, SectionHeader } from '@/components';

import type { StudyProgress } from '../types';

type StudyProgressCardProps = {
  title: string;
  progress: StudyProgress;
  minutesLabel: string;
  streakLabel: string;
  wordsLabel: string;
  weeklyGoalLabel: string;
};

function StatItem({ value, label }: { value: string | number; label: string }) {
  return (
    <View className="flex-1 items-center">
      <Text className="text-xl font-semibold text-neutral-100">{value}</Text>
      <Text className="mt-1 text-xs text-neutral-500">{label}</Text>
    </View>
  );
}

export function StudyProgressCard({
  title,
  progress,
  minutesLabel,
  streakLabel,
  wordsLabel,
  weeklyGoalLabel,
}: StudyProgressCardProps) {
  return (
    <View className="mt-6">
      <SectionHeader title={title} />
      <AppCard>
        <View className="flex-row">
          <StatItem value={progress.minutesToday} label={minutesLabel} />
          <View className="w-px bg-neutral-800" />
          <StatItem value={progress.streakDays} label={streakLabel} />
          <View className="w-px bg-neutral-800" />
          <StatItem value={progress.wordsLearned} label={wordsLabel} />
        </View>

        <View className="mt-5">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-sm text-neutral-500">{weeklyGoalLabel}</Text>
            <Text className="text-sm font-medium text-emerald-400">
              {progress.minutesToday}/{progress.weeklyGoalMinutes} min
            </Text>
          </View>
          <View className="h-2 overflow-hidden rounded-full bg-neutral-800">
            <View
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${progress.weeklyProgressPercent}%` }}
            />
          </View>
        </View>
      </AppCard>
    </View>
  );
}
