export type ShadowingSentence = {
  id: string;
  english: string;
  chinese: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

export type ShadowingResult = {
  accuracyScore: number;
  feedback: string;
};

export type ShadowingPhase = 'loading' | 'practice' | 'evaluating' | 'result';
