export type InterviewScenarioId =
  | 'react'
  | 'javascript'
  | 'system-design'
  | 'self-intro';

export type InterviewScenario = {
  id: InterviewScenarioId;
  label: string;
  description: string;
};

export type UserInterviewMessage = {
  id: string;
  role: 'user';
  content: string;
  createdAt: number;
};

export type QuestionInterviewMessage = {
  id: string;
  role: 'assistant';
  kind: 'question';
  question: string;
  createdAt: number;
  isStreaming: boolean;
  isError?: boolean;
};

export type FeedbackInterviewMessage = {
  id: string;
  role: 'assistant';
  kind: 'feedback';
  grammarCorrection: string;
  betterAnswer: string;
  vocabulary: string[];
  createdAt: number;
  isStreaming: boolean;
  isError?: boolean;
};

export type InterviewMessage =
  | UserInterviewMessage
  | QuestionInterviewMessage
  | FeedbackInterviewMessage;

export type InterviewQuestionResponse = {
  question: string;
};

export type InterviewFeedbackResponse = {
  grammarCorrection: string;
  betterAnswer: string;
  vocabulary: string[];
};
