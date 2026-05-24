import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

type AppCardVariant = 'default' | 'elevated' | 'accent' | 'danger';

type AppCardProps = {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  variant?: AppCardVariant;
  className?: string;
  contentClassName?: string;
};

const variantBorder: Record<AppCardVariant, string> = {
  default: 'border-neutral-800 bg-neutral-900',
  elevated: 'border-neutral-800 bg-neutral-900/95',
  accent: 'border-emerald-900/40 bg-neutral-900',
  danger: 'border-rose-900/50 bg-rose-950/40',
};

export function AppCard({
  children,
  title,
  subtitle,
  variant = 'default',
  className = '',
  contentClassName = '',
}: AppCardProps) {
  return (
    <View
      className={`rounded-2xl border p-4 ${variantBorder[variant]} ${className}`.trim()}>
      {title ? (
        <Text className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
          {title}
        </Text>
      ) : null}
      {subtitle ? (
        <Text className={`text-sm text-neutral-500 ${title ? 'mt-1' : ''}`}>{subtitle}</Text>
      ) : null}
      {children ? (
        <View className={`${title || subtitle ? 'mt-3' : ''} ${contentClassName}`.trim()}>
          {children}
        </View>
      ) : null}
    </View>
  );
}
