import type { ChatCompletionMessage } from '@/services/openai';

import {
  FEEDBACK_FORMAT_INSTRUCTION,
  getInterviewerSystemPrompt,
  NEXT_QUESTION_USER_MESSAGE,
  QUESTION_FORMAT_INSTRUCTION,
} from './interview-prompts';
import type { InterviewMessage, InterviewScenarioId } from '../types';

function formatQuestionForApi(message: Extract<InterviewMessage, { kind: 'question' }>): string {
  return `## Question\n${message.question}`;
}

function formatFeedbackForApi(message: Extract<InterviewMessage, { kind: 'feedback' }>): string {
  const parts = [
    message.grammarCorrection ? `## Grammar\n${message.grammarCorrection}` : '',
    message.betterAnswer ? `## Better Answer\n${message.betterAnswer}` : '',
    message.vocabulary.length > 0
      ? `## Vocabulary\n${message.vocabulary.join(', ')}`
      : '',
  ].filter(Boolean);

  return parts.join('\n\n');
}

function formatAssistantForApi(message: Extract<InterviewMessage, { role: 'assistant' }>): string {
  if (message.isError) return '';
  if (message.kind === 'question') return formatQuestionForApi(message);
  return formatFeedbackForApi(message);
}

export function buildQuestionApiMessages(
  scenarioId: InterviewScenarioId,
  history: InterviewMessage[],
  isFirstQuestion: boolean,
): ChatCompletionMessage[] {
  const messages: ChatCompletionMessage[] = [
    { role: 'system', content: getInterviewerSystemPrompt(scenarioId) },
  ];

  for (const msg of history) {
    if (msg.role === 'user') {
      messages.push({ role: 'user', content: msg.content });
      continue;
    }

    const content = formatAssistantForApi(msg);
    if (content.trim()) {
      messages.push({ role: 'assistant', content });
    }
  }

  if (isFirstQuestion) {
    messages.push({
      role: 'user',
      content: `Start the interview. ${QUESTION_FORMAT_INSTRUCTION}`,
    });
  } else {
    messages.push({
      role: 'user',
      content: `${NEXT_QUESTION_USER_MESSAGE}\n\n${QUESTION_FORMAT_INSTRUCTION}`,
    });
  }

  return messages;
}

export function buildFeedbackApiMessages(
  scenarioId: InterviewScenarioId,
  history: InterviewMessage[],
  userAnswer: string,
): ChatCompletionMessage[] {
  const messages: ChatCompletionMessage[] = [
    { role: 'system', content: getInterviewerSystemPrompt(scenarioId) },
  ];

  for (const msg of history) {
    if (msg.role === 'user') {
      messages.push({ role: 'user', content: msg.content });
      continue;
    }

    const content = formatAssistantForApi(msg);
    if (content.trim()) {
      messages.push({ role: 'assistant', content });
    }
  }

  messages.push({ role: 'user', content: userAnswer });
  messages.push({ role: 'user', content: FEEDBACK_FORMAT_INSTRUCTION });

  return messages;
}
