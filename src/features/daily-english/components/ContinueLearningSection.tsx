import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';

import { AppCard, SectionHeader } from '@/components';

import type { ContinueLearning } from '../types';

type ContinueLearningSectionProps = {
  title: string;
  item: ContinueLearning;
  onContinue: () => void;
};

export function ContinueLearningSection({ title, item, onContinue }: ContinueLearningSectionProps) {
  return (
    <View className="mt-6">
      <SectionHeader title={title} />
      <Pressable onPress={onContinue} className="active:opacity-90">
        <AppCard>
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-base font-semibold text-neutral-100">{item.title}</Text>
              <Text className="mt-1 text-sm text-neutral-500">{item.subtitle}</Text>
            </View>
            <View className="h-10 w-10 items-center justify-center rounded-full bg-neutral-800">
              <SymbolView
                name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                tintColor="#a3a3a3"
                size={16}
              />
            </View>
          </View>

          <View className="mt-4">
            <View className="h-2 overflow-hidden rounded-full bg-neutral-800">
              <View
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${item.progressPercent}%` }}
              />
            </View>
            <Text className="mt-2 text-xs text-neutral-500">{item.progressPercent}% complete</Text>
          </View>
        </AppCard>
      </Pressable>
    </View>
  );
}
