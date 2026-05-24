import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { zustandStorage } from './storage';

export type AppSettings = {
  playbackSpeed: number;
  autoPlayResponses: boolean;
  showChineseTranslation: boolean;
  hapticsEnabled: boolean;
};

export type SettingsStoreState = AppSettings;

export type SettingsStoreActions = {
  setPlaybackSpeed: (speed: number) => void;
  setAutoPlayResponses: (enabled: boolean) => void;
  setShowChineseTranslation: (enabled: boolean) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  reset: () => void;
};

export type SettingsStore = SettingsStoreState & SettingsStoreActions;

const initialState: SettingsStoreState = {
  playbackSpeed: 1,
  autoPlayResponses: false,
  showChineseTranslation: true,
  hapticsEnabled: true,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...initialState,

      setPlaybackSpeed: (speed) =>
        set({ playbackSpeed: Math.min(2, Math.max(0.5, speed)) }),

      setAutoPlayResponses: (enabled) => set({ autoPlayResponses: enabled }),

      setShowChineseTranslation: (enabled) => set({ showChineseTranslation: enabled }),

      setHapticsEnabled: (enabled) => set({ hapticsEnabled: enabled }),

      reset: () => set(initialState),
    }),
    {
      name: 'settings-store',
      storage: zustandStorage,
    },
  ),
);
