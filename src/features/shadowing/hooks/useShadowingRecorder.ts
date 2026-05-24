import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useCallback, useState } from 'react';

export function useShadowingRecorder() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 200);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const startRecording = useCallback(async (): Promise<boolean> => {
    setPermissionError(null);

    const { granted } = await requestRecordingPermissionsAsync();
    if (!granted) {
      setPermissionError('Microphone permission is required to record.');
      return false;
    }

    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
      interruptionMode: 'duckOthers',
    });

    await recorder.prepareToRecordAsync();
    recorder.record();
    return true;
  }, [recorder]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    await recorder.stop();
    return recorder.uri;
  }, [recorder]);

  const clearPermissionError = useCallback(() => setPermissionError(null), []);

  return {
    isRecording: recorderState.isRecording,
    recordingDurationMs: recorderState.durationMillis,
    startRecording,
    stopRecording,
    permissionError,
    clearPermissionError,
  };
}
