import { memo, useMemo } from 'react';

import { AudioPlayer, ChatBubble } from '@/components';

import type { CHAT_COPY } from '../constants';
import {
  buildAiMessageSections,
  getAiMessageBubbleState,
} from '../lib/build-ai-message-sections';
import type { AiChatMessage } from '../types';

type ChatCopy = typeof CHAT_COPY;

type AiMessageBubbleProps = {
  message: AiChatMessage;
  copy: ChatCopy;
  isSpeechPlaying: boolean;
  isSpeechLoading: boolean;
  hasPlayedSpeech: boolean;
  onPlayAudio: () => void;
};

function AiMessageBubbleComponent({
  message,
  copy,
  isSpeechPlaying,
  isSpeechLoading,
  hasPlayedSpeech,
  onPlayAudio,
}: AiMessageBubbleProps) {
  const { isError, showThinking, canPlayAudio } = useMemo(
    () => getAiMessageBubbleState(message),
    [message],
  );

  const sections = useMemo(
    () => (showThinking ? [] : buildAiMessageSections(message, copy)),
    [message, copy, showThinking],
  );

  return (
    <ChatBubble
      variant={isError ? 'error' : 'assistant'}
      isStreaming={showThinking || (message.isStreaming && !isError)}
      streamingLabel={copy.streamingLabel}
      sections={sections}
      footer={
        canPlayAudio ? (
          <AudioPlayer
            playLabel={copy.playAudioLabel}
            playingLabel={copy.playingAudioLabel}
            loadingLabel={copy.loadingAudioLabel}
            replayLabel={copy.replayAudioLabel}
            isPlaying={isSpeechPlaying}
            isLoading={isSpeechLoading}
            hasPlayed={hasPlayedSpeech}
            onPress={onPlayAudio}
          />
        ) : undefined
      }>
      {!showThinking ? message.english : undefined}
    </ChatBubble>
  );
}

function arePropsEqual(prev: AiMessageBubbleProps, next: AiMessageBubbleProps): boolean {
  return (
    prev.message === next.message &&
    prev.copy === next.copy &&
    prev.isSpeechPlaying === next.isSpeechPlaying &&
    prev.isSpeechLoading === next.isSpeechLoading &&
    prev.hasPlayedSpeech === next.hasPlayedSpeech &&
    prev.onPlayAudio === next.onPlayAudio
  );
}

export const AiMessageBubble = memo(AiMessageBubbleComponent, arePropsEqual);
