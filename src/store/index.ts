export {
  useChatStore,
  selectCanSendChat,
  type ChatStore,
  type ChatStoreActions,
  type ChatStoreState,
} from './chatStore';

export {
  useUserStore,
  type UserProfile,
  type UserStore,
  type UserStoreActions,
  type UserStoreState,
} from './userStore';

export {
  useAudioStore,
  selectAudioState,
  selectShadowingAudioActive,
  selectShadowingIsLoading,
  selectShadowingIsPlaying,
  type AudioScope,
  type AudioStatus,
  type AudioStore,
  type AudioStoreActions,
  type AudioStoreState,
  type PlayAudioParams,
} from './audioStore';

export {
  useProgressStore,
  recordFeatureActivity,
  type ProgressStore,
  type ProgressStoreActions,
  type ProgressStoreState,
} from './progressStore';

export {
  useSettingsStore,
  type AppSettings,
  type SettingsStore,
  type SettingsStoreActions,
  type SettingsStoreState,
} from './settingsStore';

/** @deprecated Use useUserStore */
export { useUserStore as useAppStore } from './userStore';
