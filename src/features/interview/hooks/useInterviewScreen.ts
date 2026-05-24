import { INTERVIEW_COPY, INTERVIEW_SCENARIOS } from '../constants';
import { useInterviewActions } from './useInterviewActions';
import {
  selectCanAskNextQuestion,
  selectCanSendAnswer,
  useInterviewStore,
} from '../store/interview-store';

export function useInterviewScreen() {
  const scenarioId = useInterviewStore((state) => state.scenarioId);
  const messages = useInterviewStore((state) => state.messages);
  const inputText = useInterviewStore((state) => state.inputText);
  const isStreaming = useInterviewStore((state) => state.isStreaming);
  const error = useInterviewStore((state) => state.error);
  const canSend = useInterviewStore(selectCanSendAnswer);
  const canAskNextQuestion = useInterviewStore(selectCanAskNextQuestion);
  const setInputText = useInterviewStore((state) => state.setInputText);
  const { selectScenario, sendAnswer, askNextQuestion, dismissError } = useInterviewActions();

  const activeScenario = INTERVIEW_SCENARIOS.find((s) => s.id === scenarioId);

  return {
    copy: INTERVIEW_COPY,
    scenarios: INTERVIEW_SCENARIOS,
    activeScenario,
    scenarioId,
    messages,
    inputText,
    isStreaming,
    isLoading: isStreaming,
    error,
    canSend,
    canAskNextQuestion,
    setInputText,
    onSelectScenario: selectScenario,
    onSend: sendAnswer,
    onNextQuestion: askNextQuestion,
    onDismissError: dismissError,
  };
}
