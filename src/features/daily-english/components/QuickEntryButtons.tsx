import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';

import { AppCard, SectionHeader } from '@/components';

import type { QuickEntry } from '../types';

type QuickEntryButtonsProps = {
  title: string;
  entries: QuickEntry[];
  onPressEntry: (route: QuickEntry['route']) => void;
};

export function QuickEntryButtons({ title, entries, onPressEntry }: QuickEntryButtonsProps) {
  return (
    <View className="mt-6">
      <SectionHeader title={title} />
      <View className="flex-row gap-3">
        {entries.map((entry) => (
          <Pressable
            key={entry.id}
            onPress={() => onPressEntry(entry.route)}
            className="flex-1 active:opacity-90">
            <AppCard className="items-center px-2 py-4" contentClassName="items-center">
              <View className="mb-2 h-10 w-10 items-center justify-center rounded-xl bg-neutral-800">
                <SymbolView name={entry.icon} tintColor="#34d399" size={20} />
              </View>
              <Text className="text-center text-xs font-semibold text-neutral-100">{entry.label}</Text>
              <Text className="mt-1 text-center text-[10px] leading-3 text-neutral-500">
                {entry.description}
              </Text>
            </AppCard>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
