import { KeyboardAvoidingView, Platform } from 'react-native';

import { ScreenLayout } from '@/components';

import type { CHAT_COPY } from '../constants';
import type { ChatMessage } from '../types';
import { ChatErrorBanner } from './ChatErrorBanner';
import { ChatInput } from './ChatInput';
import { ChatMessageList } from './ChatMessageList';

type ChatCopy = typeof CHAT_COPY;

type ChatScreenViewProps = {
  copy: ChatCopy;
  messages: ChatMessage[];
  inputText: string;
  isLoading: boolean;
  error: string | null;
  speechError: string | null;
  canSend: boolean;
  setInputText: (text: string) => void;
  onSend: () => void;
  onDismissError: () => void;
  clearSpeechError: () => void;
  onPlayMessageAudio: (messageId: string, text: string) => void;
};

export function ChatScreenView({
  copy,
  messages,
  inputText,
  isLoading,
  error,
  speechError,
  canSend,
  setInputText,
  onSend,
  onDismissError,
  clearSpeechError,
  onPlayMessageAudio,
}: ChatScreenViewProps) {
  return (
    <ScreenLayout title={copy.headerTitle} subtitle={copy.headerSubtitle} edges={['top']}>
      {error ? (
        <ChatErrorBanner
          message={error}
          dismissLabel={copy.errorDismissLabel}
          onDismiss={onDismissError}
        />
      ) : null}
      {speechError && !error ? (
        <ChatErrorBanner
          message={speechError}
          dismissLabel={copy.errorDismissLabel}
          onDismiss={clearSpeechError}
        />
      ) : null}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        <ChatMessageList messages={messages} onPlayMessageAudio={onPlayMessageAudio} />
        <ChatInput
          value={inputText}
          placeholder={copy.inputPlaceholder}
          canSend={canSend}
          isStreaming={isLoading}
          onChangeText={setInputText}
          onSend={onSend}
        />
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}
