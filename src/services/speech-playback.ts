import { AudioModule, setAudioModeAsync } from 'expo-audio';
import * as Speech from 'expo-speech';
import type { AudioPlayer } from 'expo-audio/build/AudioModule.types';

import { OpenAIServiceError } from './openai';
import { fetchSpeechAudioUri, TTSServiceError } from './tts';

export type SpeechCallbacks = {
  onLoading: () => void;
  onPlaying: () => void;
  onStopped: () => void;
  onError: (message: string) => void;
};

let activePlayer: AudioPlayer | null = null;
let statusListener: { remove: () => void } | null = null;
let audioModeReady = false;

async function ensureAudioMode(): Promise<void> {
  if (audioModeReady) return;
  await setAudioModeAsync({
    playsInSilentMode: true,
    interruptionMode: 'duckOthers',
  });
  audioModeReady = true;
}

function cleanupPlayer(): void {
  statusListener?.remove();
  statusListener = null;
  activePlayer?.pause();
  activePlayer?.remove();
  activePlayer = null;
}

function playWithExpoSpeech(text: string, callbacks: SpeechCallbacks): void {
  Speech.stop();
  Speech.speak(text, {
    language: 'en-US',
    onStart: callbacks.onPlaying,
    onDone: callbacks.onStopped,
    onStopped: callbacks.onStopped,
    onError: () => callbacks.onError('Speech playback failed.'),
  });
}

function playWithAudioFile(uri: string, callbacks: SpeechCallbacks): void {
  cleanupPlayer();
  Speech.stop();

  const player = new AudioModule.AudioPlayer({ uri }, 250, false, 0);
  activePlayer = player;

  statusListener = player.addListener('playbackStatusUpdate', (status) => {
    if (status.didJustFinish) {
      cleanupPlayer();
      callbacks.onStopped();
    }
    if (status.error) {
      cleanupPlayer();
      callbacks.onError(status.error);
    }
  });

  player.play();
  callbacks.onPlaying();
}

export function stopSpeech(): void {
  Speech.stop();
  cleanupPlayer();
}

export async function playEnglishSpeech(
  cacheKey: string,
  text: string,
  callbacks: SpeechCallbacks,
): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) {
    callbacks.onError('No English text to play.');
    return;
  }

  callbacks.onLoading();
  await ensureAudioMode();

  try {
    const uri = await fetchSpeechAudioUri(trimmed, cacheKey);
    playWithAudioFile(uri, callbacks);
  } catch (error) {
    if (error instanceof OpenAIServiceError || error instanceof TTSServiceError) {
      try {
        playWithExpoSpeech(trimmed, callbacks);
        return;
      } catch {
        callbacks.onError(error.message);
        return;
      }
    }

    if (error instanceof Error) {
      callbacks.onError(error.message);
      return;
    }

    callbacks.onError('Unable to play audio.');
  }
}
