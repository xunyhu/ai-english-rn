import { memo } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

import { ScreenLayout } from '@/components';

import { ChatErrorBanner } from '../components/ChatErrorBanner';
import { InterviewChatInput } from '../components/InterviewChatInput';
import { InterviewMessageList } from '../components/InterviewMessageList';
import { NextQuestionButton } from '../components/NextQuestionButton';
import { ScenarioPicker } from '../components/ScenarioPicker';
import { INTERVIEW_COPY, INTERVIEW_SCENARIOS } from '../constants';
import { useInterviewActions } from '../hooks/useInterviewActions';
import {
  selectCanAskNextQuestion,
  selectCanSendAnswer,
  useInterviewStore,
} from '../store/interview-store';

const InterviewMessageListContainer = memo(function InterviewMessageListContainer() {
  const messages = useInterviewStore((state) => state.messages);
  const scenarioId = useInterviewStore((state) => state.scenarioId);

  return <InterviewMessageList messages={messages} hasScenario={scenarioId != null} />;
});

const InterviewInputArea = memo(function InterviewInputArea() {
  const scenarioId = useInterviewStore((state) => state.scenarioId);
  const inputText = useInterviewStore((state) => state.inputText);
  const isStreaming = useInterviewStore((state) => state.isStreaming);
  const canSend = useInterviewStore(selectCanSendAnswer);
  const canAskNextQuestion = useInterviewStore(selectCanAskNextQuestion);
  const setInputText = useInterviewStore((state) => state.setInputText);
  const { sendAnswer, askNextQuestion } = useInterviewActions();

  if (!scenarioId) return null;

  return (
    <>
      {canAskNextQuestion ? (
        <NextQuestionButton label={INTERVIEW_COPY.nextQuestionLabel} onPress={askNextQuestion} />
      ) : null}
      <InterviewChatInput
        value={inputText}
        placeholder={INTERVIEW_COPY.inputPlaceholder}
        canSend={canSend}
        isStreaming={isStreaming}
        onChangeText={setInputText}
        onSend={sendAnswer}
      />
    </>
  );
});

const InterviewScenarioSection = memo(function InterviewScenarioSection() {
  const scenarioId = useInterviewStore((state) => state.scenarioId);
  const isStreaming = useInterviewStore((state) => state.isStreaming);
  const { selectScenario } = useInterviewActions();

  return (
    <ScenarioPicker
      copy={INTERVIEW_COPY}
      scenarios={INTERVIEW_SCENARIOS}
      activeScenarioId={scenarioId}
      disabled={isStreaming}
      onSelect={selectScenario}
    />
  );
});

const InterviewErrorBanner = memo(function InterviewErrorBanner() {
  const error = useInterviewStore((state) => state.error);
  const { dismissError } = useInterviewActions();

  if (!error) return null;

  return (
    <ChatErrorBanner
      message={error}
      dismissLabel={INTERVIEW_COPY.errorDismissLabel}
      onDismiss={dismissError}
    />
  );
});

export function InterviewScreen() {
  const scenarioId = useInterviewStore((state) => state.scenarioId);
  const activeScenario = INTERVIEW_SCENARIOS.find((s) => s.id === scenarioId);
  const subtitle = activeScenario
    ? `${INTERVIEW_COPY.headerSubtitle} · ${activeScenario.label}`
    : INTERVIEW_COPY.headerSubtitle;

  return (
    <ScreenLayout title={INTERVIEW_COPY.headerTitle} subtitle={subtitle} edges={['top']}>
      <InterviewScenarioSection />
      <InterviewErrorBanner />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        <InterviewMessageListContainer />
        <InterviewInputArea />
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}
