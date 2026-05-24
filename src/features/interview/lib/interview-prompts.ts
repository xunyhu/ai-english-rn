import type { InterviewScenarioId } from '../types';

const SCENARIO_FOCUS: Record<InterviewScenarioId, string> = {
  react: 'React.js interviews (hooks, state, performance, component design, testing)',
  javascript:
    'JavaScript interviews (closures, prototypes, async/await, event loop, ES6+ features)',
  'system-design':
    'basic system design interviews (scalability, APIs, databases, caching, trade-offs) at a junior-to-mid level',
  'self-intro':
    'self-introduction and behavioral interviews for software engineers',
};

export function getInterviewerSystemPrompt(scenarioId: InterviewScenarioId): string {
  const focus = SCENARIO_FOCUS[scenarioId];

  return `You are a friendly but professional technical interviewer conducting ${focus}.
The candidate is a Chinese programmer practicing English for job interviews.

Rules:
- Ask one question at a time.
- Keep questions realistic for tech interviews.
- Use clear, natural English at B1-B2 level.
- Do not answer your own questions.`;
}

export const QUESTION_FORMAT_INSTRUCTION = `Ask exactly ONE new interview question.

Respond using exactly this format:
## Question
[Your interview question in English]`;

export const FEEDBACK_FORMAT_INSTRUCTION = `The candidate just answered your interview question.
Provide feedback to help them improve their English and interview performance.

Respond using exactly this format:
## Grammar
[Grammar corrections and tips based on their answer]

## Better Answer
[A stronger example answer in English they could use in a real interview]

## Vocabulary
[Comma-separated useful words or phrases for this topic]`;

export const NEXT_QUESTION_USER_MESSAGE =
  'Please ask the next interview question. Use the required format.';
