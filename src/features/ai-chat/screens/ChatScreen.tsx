import { memo, useEffect } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

import { ScreenLayout } from '@/components';
import { useAudioStore } from '@/store/audioStore';
import { selectCanSendChat, useChatStore } from '@/store/chatStore';

import { ChatErrorBanner } from '../components/ChatErrorBanner';
import { ChatInput } from '../components/ChatInput';
import { ChatMessageList } from '../components/ChatMessageList';
import { CHAT_COPY } from '../constants';
import { useChatActions } from '../hooks/useChatActions';
import { useMessageSpeechPlay } from '../hooks/useMessageSpeechPlay';

const ChatMessageListContainer = memo(function ChatMessageListContainer() {
  const messages = useChatStore((state) => state.messages);
  const onPlayMessageAudio = useMessageSpeechPlay();

  return <ChatMessageList messages={messages} onPlayMessageAudio={onPlayMessageAudio} />;
});

const ChatInputContainer = memo(function ChatInputContainer() {
  const inputText = useChatStore((state) => state.inputText);
  const isStreaming = useChatStore((state) => state.isStreaming);
  const canSend = useChatStore(selectCanSendChat);
  const setInputText = useChatStore((state) => state.setInputText);
  const { sendMessage } = useChatActions();

  return (
    <ChatInput
      value={inputText}
      placeholder={CHAT_COPY.inputPlaceholder}
      canSend={canSend}
      isStreaming={isStreaming}
      onChangeText={setInputText}
      onSend={sendMessage}
    />
  );
});

const ChatErrorBanners = memo(function ChatErrorBanners() {
  const error = useChatStore((state) => state.error);
  const speechError = useAudioStore((state) => state.error);
  const clearSpeechError = useAudioStore((state) => state.clearError);
  const { dismissError } = useChatActions();

  if (!error && !speechError) return null;

  return (
    <>
      {error ? (
        <ChatErrorBanner
          message={error}
          dismissLabel={CHAT_COPY.errorDismissLabel}
          onDismiss={dismissError}
        />
      ) : null}
      {speechError && !error ? (
        <ChatErrorBanner
          message={speechError}
          dismissLabel={CHAT_COPY.errorDismissLabel}
          onDismiss={clearSpeechError}
        />
      ) : null}
    </>
  );
});

export function ChatScreen() {
  useEffect(() => {
    return () => {
      useAudioStore.getState().stop();
    };
  }, []);

  return (
    <ScreenLayout title={CHAT_COPY.headerTitle} subtitle={CHAT_COPY.headerSubtitle} edges={['top']}>
      <ChatErrorBanners />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        <ChatMessageListContainer />
        <ChatInputContainer />
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}
