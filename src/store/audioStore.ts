import { create } from 'zustand';

import { playEnglishSpeech, stopSpeech } from '@/services/speech-playback';

export type AudioScope = 'chat' | 'shadowing' | 'daily-english';

export type AudioStatus = 'idle' | 'loading' | 'playing';

export type PlayAudioParams = {
  id: string;
  text: string;
  scope: AudioScope;
  cacheKey?: string;
};

export type AudioStoreState = {
  activeId: string | null;
  scope: AudioScope | null;
  status: AudioStatus;
  error: string | null;
  playedIds: string[];
};

export type AudioStoreActions = {
  play: (params: PlayAudioParams) => Promise<void>;
  stop: () => void;
  clearError: () => void;
  markPlayed: (id: string) => void;
  reset: () => void;
};

export type AudioStore = AudioStoreState & AudioStoreActions;

const initialState: AudioStoreState = {
  activeId: null,
  scope: null,
  status: 'idle',
  error: null,
  playedIds: [],
};

export const useAudioStore = create<AudioStore>((set, get) => ({
  ...initialState,

  play: async ({ id, text, scope, cacheKey }) => {
    const state = get();

    if (state.status === 'loading' && state.activeId === id && state.scope === scope) {
      return;
    }

    if (state.status === 'playing' && state.activeId === id && state.scope === scope) {
      stopSpeech();
      set({ activeId: null, scope: null, status: 'idle' });
      return;
    }

    stopSpeech();
    set({ activeId: id, scope, status: 'loading', error: null });

    await playEnglishSpeech(cacheKey ?? id, text, {
      onLoading: () => {
        set({ activeId: id, scope, status: 'loading' });
      },
      onPlaying: () => {
        set({ activeId: id, scope, status: 'playing' });
      },
      onStopped: () => {
        const playedIds = get().playedIds.includes(id)
          ? get().playedIds
          : [...get().playedIds, id];
        set({ activeId: null, scope: null, status: 'idle', playedIds });
      },
      onError: (message) => {
        set({
          activeId: null,
          scope: null,
          status: 'idle',
          error: message,
        });
      },
    });
  },

  stop: () => {
    stopSpeech();
    set({ activeId: null, scope: null, status: 'idle' });
  },

  clearError: () => set({ error: null }),

  markPlayed: (id) => {
    if (get().playedIds.includes(id)) return;
    set({ playedIds: [...get().playedIds, id] });
  },

  reset: () => {
    stopSpeech();
    set(initialState);
  },
}));

export function selectAudioState(id: string, scope: AudioScope) {
  return (state: AudioStore) => {
    const isMatch = state.activeId === id && state.scope === scope;
    return {
      isLoading: isMatch && state.status === 'loading',
      isPlaying: isMatch && state.status === 'playing',
      hasPlayed: state.playedIds.includes(id),
    };
  };
}

export function selectShadowingAudioActive(state: AudioStore) {
  return (
    state.scope === 'shadowing' &&
    (state.status === 'loading' || state.status === 'playing')
  );
}

export function selectShadowingIsPlaying(state: AudioStore) {
  return state.scope === 'shadowing' && state.status === 'playing';
}

export function selectShadowingIsLoading(state: AudioStore) {
  return state.scope === 'shadowing' && state.status === 'loading';
}
