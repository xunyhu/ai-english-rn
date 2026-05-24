import { Text } from 'react-native';

import { AppCard, LoadingView } from '@/components';

import type { SHADOWING_COPY } from '../constants';
import type { ShadowingSentence } from '../types';

type ShadowingCopy = typeof SHADOWING_COPY;

type SentenceCardProps = {
  copy: ShadowingCopy;
  sentence?: ShadowingSentence;
  isLoading: boolean;
};

export function SentenceCard({ copy, sentence, isLoading }: SentenceCardProps) {
  return (
    <AppCard variant="accent" title={copy.sentenceLabel}>
      {isLoading ? (
        <LoadingView size="small" message={copy.streamingLabel} />
      ) : sentence ? (
        <>
          <Text className="text-lg font-medium leading-7 text-neutral-100">{sentence.english}</Text>
          <Text className="mt-3 text-base leading-6 text-neutral-500">{sentence.chinese}</Text>
        </>
      ) : (
        <Text className="text-sm text-neutral-500">Unable to load sentence.</Text>
      )}
    </AppCard>
  );
}
