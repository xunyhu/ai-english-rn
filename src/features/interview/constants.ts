import type { InterviewScenario } from './types';

export const INTERVIEW_SCENARIOS: InterviewScenario[] = [
  {
    id: 'react',
    label: 'React',
    description: 'Hooks, rendering, and component design',
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    description: 'Core language and async patterns',
  },
  {
    id: 'system-design',
    label: 'System Design',
    description: 'Basic architecture and trade-offs',
  },
  {
    id: 'self-intro',
    label: 'Self Intro',
    description: 'Tell me about yourself',
  },
];

export const INTERVIEW_COPY = {
  headerTitle: 'AI Interview',
  headerSubtitle: 'Practice technical interviews in English',
  scenarioLabel: 'Choose a scenario',
  inputPlaceholder: 'Type your answer in English…',
  nextQuestionLabel: 'Next question',
  sendLabel: 'Send',
  emptyTitle: 'Pick a scenario to begin',
  emptyDescription:
    'The AI interviewer will ask questions and give feedback on your English and technical answers.',
  interviewerLabel: 'Interviewer',
  youLabel: 'You',
  grammarLabel: 'Grammar',
  betterAnswerLabel: 'Better answer',
  vocabularyLabel: 'Vocabulary',
  streamingLabel: 'Thinking…',
  errorDismissLabel: 'Dismiss',
  waitingForAnswer: 'Answer the question above, then tap send.',
} as const;
