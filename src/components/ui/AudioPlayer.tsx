import { SymbolView } from 'expo-symbols';
import { Pressable, Text } from 'react-native';

import { LoadingRow } from './LoadingView';

type AudioPlayerProps = {
  playLabel: string;
  playingLabel: string;
  loadingLabel: string;
  replayLabel: string;
  isPlaying: boolean;
  isLoading: boolean;
  hasPlayed: boolean;
  onPress: () => void;
  className?: string;
};

export function AudioPlayer({
  playLabel,
  playingLabel,
  loadingLabel,
  replayLabel,
  isPlaying,
  isLoading,
  hasPlayed,
  onPress,
  className = '',
}: AudioPlayerProps) {
  const label = isLoading
    ? loadingLabel
    : isPlaying
      ? playingLabel
      : hasPlayed
        ? replayLabel
        : playLabel;

  if (isLoading) {
    return (
      <Pressable
        disabled
        className={`mt-3 self-start rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 ${className}`.trim()}>
        <LoadingRow label={label} />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      className={`mt-3 flex-row items-center gap-2 self-start rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 active:opacity-80 ${className}`.trim()}>
      <SymbolView
        name={{
          ios: isPlaying ? 'pause.fill' : 'speaker.wave.2.fill',
          android: isPlaying ? 'pause' : 'volume_up',
          web: isPlaying ? 'pause' : 'volume_up',
        }}
        tintColor="#34d399"
        size={16}
      />
      <Text className="text-sm font-medium text-emerald-400">{label}</Text>
    </Pressable>
  );
}
