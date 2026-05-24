import { AppButton, AppButtonRow } from '@/components';

import type { SHADOWING_COPY } from '../constants';

type ShadowingCopy = typeof SHADOWING_COPY;

type ShadowingControlsProps = {
  copy: ShadowingCopy;
  isPlaying: boolean;
  isPlayLoading: boolean;
  isRecording: boolean;
  isEvaluating: boolean;
  canPlay: boolean;
  canRecord: boolean;
  onPlay: () => void;
  onToggleRecord: () => void;
};

export function ShadowingControls({
  copy,
  isPlaying,
  isPlayLoading,
  isRecording,
  isEvaluating,
  canPlay,
  canRecord,
  onPlay,
  onToggleRecord,
}: ShadowingControlsProps) {
  const playLabel = isPlayLoading
    ? copy.loadingAudioLabel
    : isPlaying
      ? copy.playingLabel
      : copy.playLabel;

  const recordLabel = isEvaluating
    ? copy.evaluatingLabel
    : isRecording
      ? copy.recordingLabel
      : copy.recordLabel;

  return (
    <AppButtonRow className="mt-5">
      <AppButton
        label={playLabel}
        onPress={onPlay}
        variant="primary"
        fullWidth
        disabled={!canPlay || isEvaluating}
        loading={isPlayLoading}
        icon={{
          ios: isPlaying ? 'pause.fill' : 'play.fill',
          android: isPlaying ? 'pause' : 'play_arrow',
          web: isPlaying ? 'pause' : 'play_arrow',
        }}
        className="flex-1"
      />
      <AppButton
        label={recordLabel}
        onPress={onToggleRecord}
        variant={isRecording ? 'danger' : 'secondary'}
        fullWidth
        disabled={!canRecord && !isRecording && !isEvaluating}
        loading={isEvaluating}
        icon={{
          ios: isRecording ? 'stop.fill' : 'mic.fill',
          android: isRecording ? 'stop' : 'mic',
          web: isRecording ? 'stop' : 'mic',
        }}
        className="flex-1"
      />
    </AppButtonRow>
  );
}
