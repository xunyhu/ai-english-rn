import { create } from 'zustand';

import type { ShadowingPhase, ShadowingResult } from '../types';

type ShadowingState = {
  phase: ShadowingPhase;
  result: ShadowingResult | null;
  error: string | null;
  setPhase: (phase: ShadowingPhase) => void;
  setResult: (result: ShadowingResult | null) => void;
  setError: (error: string | null) => void;
  resetSession: () => void;
};

export const useShadowingStore = create<ShadowingState>((set) => ({
  phase: 'loading',
  result: null,
  error: null,

  setPhase: (phase) => set({ phase }),

  setResult: (result) => set({ result, phase: result ? 'result' : 'practice' }),

  setError: (error) => set({ error }),

  resetSession: () =>
    set({
      phase: 'practice',
      result: null,
      error: null,
    }),
}));
