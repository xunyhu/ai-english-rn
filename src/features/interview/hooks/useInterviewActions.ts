import { useCallback, useRef } from 'react';

import { getErrorMessage } from '@/lib/errors';
import { streamCompletion } from '@/services/openai';
import { recordFeatureActivity } from '@/store/progressStore';

import {
  buildFeedbackApiMessages,
  buildQuestionApiMessages,
} from '../lib/build-api-messages';
import {
  parseInterviewFeedback,
  parseInterviewQuestion,
} from '../lib/parse-interview-response';
import { useInterviewStore } from '../store/interview-store';
import type { InterviewScenarioId } from '../types';

export function useInterviewActions() {
  const abortControllerRef = useRef<AbortController | null>(null);

  const runQuestionRequest = useCallback(
    async (scenarioId: InterviewScenarioId, isFirstQuestion: boolean) => {
      const state = useInterviewStore.getState();
      const {
        messages,
        addQuestionPlaceholder,
        updateQuestionMessage,
        setIsStreaming,
        setError,
        clearError,
      } = state;

      clearError();
      setIsStreaming(true);

      const question = addQuestionPlaceholder();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const apiMessages = buildQuestionApiMessages(scenarioId, messages, isFirstQuestion);

        const fullContent = await streamCompletion({
          messages: apiMessages,
          signal: controller.signal,
          parse: parseInterviewQuestion,
          onDelta: (_accumulated, parsed) => {
            updateQuestionMessage(question.id, {
              question: parsed.question,
              isStreaming: true,
              isError: false,
            });
          },
        });

        const final = parseInterviewQuestion(fullContent);
        updateQuestionMessage(question.id, {
          question: final.question,
          isStreaming: false,
          isError: false,
        });
      } catch (error) {
        if (controller.signal.aborted) return;

        const message = getErrorMessage(error, 'Failed to load question. Please try again.');

        setError(message);
        updateQuestionMessage(question.id, {
          question: message,
          isStreaming: false,
          isError: true,
        });
      } finally {
        if (!controller.signal.aborted) {
          setIsStreaming(false);
        }
        abortControllerRef.current = null;
      }
    },
    [],
  );

  const selectScenario = useCallback(
    async (scenarioId: InterviewScenarioId) => {
      abortControllerRef.current?.abort();
      const { setScenarioId, resetInterview } = useInterviewStore.getState();
      setScenarioId(scenarioId);
      resetInterview();
      await runQuestionRequest(scenarioId, true);
    },
    [runQuestionRequest],
  );

  const sendAnswer = useCallback(async () => {
    const state = useInterviewStore.getState();
    const trimmed = state.inputText.trim();
    if (!trimmed || state.isStreaming || !state.scenarioId) return;

    const last = state.messages[state.messages.length - 1];
    if (last?.role !== 'assistant' || last.kind !== 'question') return;

    const {
      scenarioId,
      messages,
      addUserMessage,
      addFeedbackPlaceholder,
      updateFeedbackMessage,
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
    const feedback = addFeedbackPlaceholder();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const apiMessages = buildFeedbackApiMessages(scenarioId, history, trimmed);

      const fullContent = await streamCompletion({
        messages: apiMessages,
        signal: controller.signal,
        parse: parseInterviewFeedback,
        onDelta: (_accumulated, parsed) => {
          updateFeedbackMessage(feedback.id, {
            grammarCorrection: parsed.grammarCorrection,
            betterAnswer: parsed.betterAnswer,
            vocabulary: parsed.vocabulary,
            isStreaming: true,
            isError: false,
          });
        },
      });

      const final = parseInterviewFeedback(fullContent);
      updateFeedbackMessage(feedback.id, {
        ...final,
        isStreaming: false,
        isError: false,
      });

      recordFeatureActivity(
        '/interview',
        {
          title: 'Interview',
          subtitle: 'Practice technical interviews in English',
          progressPercent: 60,
        },
        { minutes: 2, words: final.vocabulary.length },
      );
    } catch (error) {
      if (controller.signal.aborted) return;

      const message = getErrorMessage(error, 'Failed to get feedback. Please try again.');

      setError(message);
      updateFeedbackMessage(feedback.id, {
        grammarCorrection: '',
        betterAnswer: message,
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

  const askNextQuestion = useCallback(async () => {
    const { scenarioId, isStreaming } = useInterviewStore.getState();
    if (!scenarioId || isStreaming) return;

    const last = useInterviewStore.getState().messages.at(-1);
    if (last?.role !== 'assistant' || last.kind !== 'feedback') return;

    await runQuestionRequest(scenarioId, false);
  }, [runQuestionRequest]);

  const dismissError = useCallback(() => {
    useInterviewStore.getState().clearError();
  }, []);

  return {
    selectScenario,
    sendAnswer,
    askNextQuestion,
    dismissError,
  };
}
