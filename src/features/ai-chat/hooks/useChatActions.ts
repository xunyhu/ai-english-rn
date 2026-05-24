import { useCallback, useRef } from 'react';

import { getErrorMessage } from '@/lib/errors';
import { parseTutorResponse, streamChatCompletion } from '@/services/openai';
import { recordFeatureActivity } from '@/store/progressStore';

import { buildApiMessages } from '../lib/build-api-messages';
import { useChatStore } from '../store/chat-store';

export function useChatActions() {
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async () => {
    const state = useChatStore.getState();
    const trimmed = state.inputText.trim();
    if (!trimmed || state.isStreaming) return;

    const {
      messages,
      addUserMessage,
      addAssistantPlaceholder,
      updateAssistantMessage,
      setInputText,
      setIsStreaming,
      setError,
      clearError,
    } = state;

    clearError();
    setIsStreaming(true);
    setInputText('');

    const history = messages;
    addUserMessage(trimmed);
    const assistant = addAssistantPlaceholder();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const apiMessages = buildApiMessages(history, trimmed);

      const fullContent = await streamChatCompletion({
        messages: apiMessages,
        signal: controller.signal,
        onDelta: (_accumulated, parsed) => {
          updateAssistantMessage(assistant.id, {
            english: parsed.english,
            chinese: parsed.chinese,
            grammarCorrection: parsed.grammarCorrection,
            vocabulary: parsed.vocabulary,
            isStreaming: true,
            isError: false,
          });
        },
      });

      const final = parseTutorResponse(fullContent);

      updateAssistantMessage(assistant.id, {
        ...final,
        isStreaming: false,
        isError: false,
      });

      recordFeatureActivity(
        '/chat',
        { title: 'AI Chat', subtitle: 'Continue your tutor conversation', progressPercent: 50 },
        { minutes: 2, words: final.vocabulary.length },
      );
    } catch (error) {
      if (controller.signal.aborted) return;

      const message = getErrorMessage(error);

      setError(message);
      updateAssistantMessage(assistant.id, {
        english: message,
        chinese: '',
        grammarCorrection: '',
        vocabulary: [],
        isStreaming: false,
        isError: true,
      });
    } finally {
      if (!controller.signal.aborted) {
        setIsStreaming(false);
      }
      abortControllerRef.current = null;
    }
  }, []);

  const cancelStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    useChatStore.getState().setIsStreaming(false);
  }, []);

  const dismissError = useCallback(() => {
    useChatStore.getState().clearError();
  }, []);

  return { sendMessage, cancelStreaming, dismissError };
}
