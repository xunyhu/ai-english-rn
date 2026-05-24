import type { InterviewFeedbackResponse, InterviewQuestionResponse } from '../types';

function extractSection(text: string, sectionName: string): string {
  const pattern = new RegExp(
    `##\\s*${sectionName}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`,
    'i',
  );
  const match = text.match(pattern);
  return match?.[1]?.trim() ?? '';
}

export function parseInterviewQuestion(content: string): InterviewQuestionResponse {
  const question = extractSection(content, 'Question');
  if (question) return { question };

  const trimmed = content.trim();
  return { question: trimmed || 'Could you introduce yourself and your recent project experience?' };
}

export function parseInterviewFeedback(content: string): InterviewFeedbackResponse {
  const grammarCorrection = extractSection(content, 'Grammar');
  const betterAnswer = extractSection(content, 'Better Answer');
  const vocabularyRaw = extractSection(content, 'Vocabulary');

  const vocabulary = vocabularyRaw
    ? vocabularyRaw
        .split(/[,，、\n]/)
        .map((word) => word.trim().replace(/^[-•]\s*/, ''))
        .filter(Boolean)
    : [];

  if (!grammarCorrection && !betterAnswer && vocabulary.length === 0 && content.trim()) {
    return {
      grammarCorrection: '',
      betterAnswer: content.trim(),
      vocabulary: [],
    };
  }

  return {
    grammarCorrection,
    betterAnswer,
    vocabulary,
  };
}
