import { View } from 'react-native';

import { AppCard, LoadingView } from '@/components';

export function HomeScreenSkeleton() {
  return (
    <View className="gap-4">
      <View className="h-20 rounded-2xl bg-neutral-900" />
      <AppCard className="h-48 items-center justify-center">
        <LoadingView className="py-0" />
      </AppCard>
      <AppCard className="h-28" />
      <View className="h-24 flex-row gap-3">
        <View className="flex-1 rounded-2xl border border-neutral-800 bg-neutral-900" />
        <View className="flex-1 rounded-2xl border border-neutral-800 bg-neutral-900" />
        <View className="flex-1 rounded-2xl border border-neutral-800 bg-neutral-900" />
      </View>
      <AppCard className="h-36" />
    </View>
  );
}
