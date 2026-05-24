import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';

import { AppButton, AppCard } from '@/components';

import type { DailyEnglish } from '../types';

type DailyEnglishCardProps = {
  label: string;
  sentence: DailyEnglish;
  playLabel: string;
  playingLabel: string;
  favoriteLabel: string;
  isPlaying: boolean;
  isPlayLoading?: boolean;
  isFavorited: boolean;
  onPlayAudio: () => void;
  onToggleFavorite: () => void;
};

export function DailyEnglishCard({
  label,
  sentence,
  playLabel,
  playingLabel,
  favoriteLabel,
  isPlaying,
  isPlayLoading = false,
  isFavorited,
  onPlayAudio,
  onToggleFavorite,
}: DailyEnglishCardProps) {
  return (
    <AppCard variant="accent">
      <View className="mb-3 flex-row items-center justify-between">
        <View className="rounded-full bg-emerald-500/15 px-3 py-1">
          <Text className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
            {label}
          </Text>
        </View>
        <Text className="text-xs text-neutral-500">Today</Text>
      </View>

      <Text className="text-lg font-medium leading-7 text-neutral-100">{sentence.english}</Text>
      <Text className="mt-3 text-base leading-6 text-neutral-500">{sentence.chinese}</Text>

      <View className="mt-5 flex-row items-center gap-3">
        <AppButton
          label={isPlaying || isPlayLoading ? playingLabel : playLabel}
          onPress={onPlayAudio}
          variant="primary"
          loading={isPlayLoading}
          disabled={isPlaying || isPlayLoading}
          icon={{
            ios: 'play.fill',
            android: 'play_arrow',
            web: 'play_arrow',
          }}
          className="flex-1"
        />
        <Pressable
          onPress={onToggleFavorite}
          accessibilityLabel={favoriteLabel}
          className={`h-12 w-12 items-center justify-center rounded-xl border active:opacity-80 ${
            isFavorited
              ? 'border-rose-500/50 bg-rose-500/15'
              : 'border-neutral-800 bg-neutral-800'
          }`}>
          <SymbolView
            name={{
              ios: isFavorited ? 'heart.fill' : 'heart',
              android: isFavorited ? 'favorite' : 'favorite_border',
              web: isFavorited ? 'favorite' : 'favorite_border',
            }}
            tintColor={isFavorited ? '#f43f5e' : '#a3a3a3'}
            size={20}
          />
        </Pressable>
      </View>
    </AppCard>
  );
}
