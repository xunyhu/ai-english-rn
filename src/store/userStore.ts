import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { zustandStorage } from './storage';

export type UserProfile = {
  displayName: string;
  favoriteSentenceIds: string[];
};

export type UserStoreState = UserProfile;

export type UserStoreActions = {
  setDisplayName: (name: string) => void;
  toggleFavoriteSentence: (id: string) => void;
  isFavoriteSentence: (id: string) => boolean;
  reset: () => void;
};

export type UserStore = UserStoreState & UserStoreActions;

const initialState: UserStoreState = {
  displayName: 'Learner',
  favoriteSentenceIds: [],
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setDisplayName: (name) => set({ displayName: name.trim() || 'Learner' }),

      toggleFavoriteSentence: (id) => {
        const current = get().favoriteSentenceIds;
        const exists = current.includes(id);
        set({
          favoriteSentenceIds: exists
            ? current.filter((item) => item !== id)
            : [...current, id],
        });
      },

      isFavoriteSentence: (id) => get().favoriteSentenceIds.includes(id),

      reset: () => set(initialState),
    }),
    {
      name: 'user-store',
      storage: zustandStorage,
      partialize: (state) => ({
        displayName: state.displayName,
        favoriteSentenceIds: state.favoriteSentenceIds,
      }),
    },
  ),
);
