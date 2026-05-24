import { memo, type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { LoadingRow } from './LoadingView';

export type ChatBubbleSection = {
  label: string;
  content: string;
  tone?: 'default' | 'body' | 'warning' | 'muted' | 'accent';
  tags?: string[];
};

type ChatBubbleVariant = 'user' | 'assistant' | 'assistant-accent' | 'error';

type ChatBubbleProps = {
  variant?: ChatBubbleVariant;
  align?: 'left' | 'right';
  label?: string;
  children?: ReactNode;
  sections?: ChatBubbleSection[];
  footer?: ReactNode;
  isStreaming?: boolean;
  streamingLabel?: string;
  className?: string;
};

const shellStyles: Record<ChatBubbleVariant, string> = {
  user: 'bg-emerald-600 border-transparent rounded-br-md max-w-[85%]',
  assistant: 'bg-neutral-900 border-neutral-800 rounded-bl-md w-full max-w-full',
  'assistant-accent': 'bg-neutral-900 border-blue-900/40 rounded-bl-md w-full max-w-full',
  error: 'bg-rose-950/40 border-rose-900/60 rounded-bl-md w-full max-w-full',
};

const labelStyles: Record<ChatBubbleVariant, string> = {
  user: 'text-neutral-600',
  assistant: 'text-neutral-500',
  'assistant-accent': 'text-blue-400',
  error: 'text-rose-400',
};

const textStyles: Record<ChatBubbleVariant, string> = {
  user: 'text-white',
  assistant: 'text-neutral-100',
  'assistant-accent': 'text-neutral-100',
  error: 'text-rose-200',
};

const sectionToneStyles = {
  default: 'border-neutral-800',
  warning: 'border-amber-900/50 bg-amber-950/40',
  muted: 'border-transparent',
  accent: 'border-transparent',
};

const tagColors: Record<ChatBubbleVariant, string> = {
  user: 'text-emerald-400',
  assistant: 'text-emerald-400',
  'assistant-accent': 'text-blue-400',
  error: 'text-rose-300',
};

const SectionBlock = memo(function SectionBlock({
  section,
  variant,
  isFirst,
}: {
  section: ChatBubbleSection;
  variant: ChatBubbleVariant;
  isFirst: boolean;
}) {
  const hasBox = section.tone === 'warning';

  return (
    <View
      className={`${isFirst ? '' : 'mt-3'} ${hasBox ? `rounded-xl border px-3 py-2 ${sectionToneStyles.warning}` : section.tone === 'muted' && !isFirst ? 'border-t border-neutral-800 pt-3' : ''}`}>
      <Text
        className={`mb-1 text-xs font-semibold uppercase tracking-wide ${
          section.tone === 'warning' ? 'text-amber-500' : 'text-neutral-500'
        }`}>
        {section.label}
      </Text>
      {section.content ? (
        <Text
          className={`leading-6 ${
            section.tone === 'warning'
              ? 'text-sm text-amber-100/90'
              : section.tone === 'body'
                ? 'text-base text-neutral-100'
                : 'text-sm text-neutral-400'
          }`}>
          {section.content}
        </Text>
      ) : null}
      {section.tags && section.tags.length > 0 ? (
        <View className="mt-2 flex-row flex-wrap gap-2">
          {section.tags.map((tag) => (
            <View key={tag} className="rounded-full bg-neutral-800 px-3 py-1">
              <Text className={`text-xs font-medium ${tagColors[variant]}`}>{tag}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
});

function ChatBubbleComponent({
  variant = 'assistant',
  align = 'left',
  label,
  children,
  sections = [],
  footer,
  isStreaming = false,
  streamingLabel = 'Thinking…',
  className = '',
}: ChatBubbleProps) {
  const showStreaming = isStreaming && !children && sections.length === 0;

  return (
    <View className={`mb-4 ${align === 'right' ? 'items-end' : 'items-start'} ${className}`.trim()}>
      {label ? (
        <Text className={`mb-1 text-xs font-medium ${labelStyles[variant]}`}>{label}</Text>
      ) : null}
      <View className={`rounded-2xl border px-4 py-3 ${shellStyles[variant]}`}>
        {showStreaming ? (
          <LoadingRow label={streamingLabel} />
        ) : (
          <>
            {children ? (
              <Text className={`text-base leading-6 ${textStyles[variant]}`}>
                {children}
                {isStreaming ? <Text className="text-emerald-400"> ▍</Text> : null}
              </Text>
            ) : null}
            {sections.map((section, index) => (
              <SectionBlock
                key={`${section.label}-${index}`}
                section={section}
                variant={variant}
                isFirst={index === 0 && !children}
              />
            ))}
            {footer}
          </>
        )}
      </View>
    </View>
  );
}

export const ChatBubble = memo(ChatBubbleComponent);
