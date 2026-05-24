import { KeyboardAvoidingView, Platform } from 'react-native';

import { ScreenLayout } from '@/components';

import type { INTERVIEW_COPY } from '../constants';
import type { InterviewMessage, InterviewScenario, InterviewScenarioId } from '../types';
import { ChatErrorBanner } from './ChatErrorBanner';
import { InterviewChatInput } from './InterviewChatInput';
import { InterviewMessageList } from './InterviewMessageList';
import { NextQuestionButton } from './NextQuestionButton';
import { ScenarioPicker } from './ScenarioPicker';

type InterviewCopy = typeof INTERVIEW_COPY;

type InterviewScreenViewProps = {
  copy: InterviewCopy;
  scenarios: InterviewScenario[];
  activeScenario?: InterviewScenario;
  scenarioId: InterviewScenarioId | null;
  messages: InterviewMessage[];
  inputText: string;
  isLoading: boolean;
  error: string | null;
  canSend: boolean;
  canAskNextQuestion: boolean;
  setInputText: (text: string) => void;
  onSelectScenario: (id: InterviewScenarioId) => void;
  onSend: () => void;
  onNextQuestion: () => void;
  onDismissError: () => void;
};

export function InterviewScreenView({
  copy,
  scenarios,
  activeScenario,
  scenarioId,
  messages,
  inputText,
  isLoading,
  error,
  canSend,
  canAskNextQuestion,
  setInputText,
  onSelectScenario,
  onSend,
  onNextQuestion,
  onDismissError,
}: InterviewScreenViewProps) {
  const subtitle = activeScenario
    ? `${copy.headerSubtitle} · ${activeScenario.label}`
    : copy.headerSubtitle;

  return (
    <ScreenLayout title={copy.headerTitle} subtitle={subtitle} edges={['top']}>
      <ScenarioPicker
        copy={copy}
        scenarios={scenarios}
        activeScenarioId={scenarioId}
        disabled={isLoading}
        onSelect={onSelectScenario}
      />
      {error ? (
        <ChatErrorBanner
          message={error}
          dismissLabel={copy.errorDismissLabel}
          onDismiss={onDismissError}
        />
      ) : null}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        <InterviewMessageList messages={messages} hasScenario={scenarioId != null} />
        {canAskNextQuestion ? (
          <NextQuestionButton label={copy.nextQuestionLabel} onPress={onNextQuestion} />
        ) : null}
        {scenarioId ? (
          <InterviewChatInput
            value={inputText}
            placeholder={copy.inputPlaceholder}
            canSend={canSend}
            isStreaming={isLoading}
            onChangeText={setInputText}
            onSend={onSend}
          />
        ) : null}
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}
