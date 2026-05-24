import type { ReactNode } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { design } from '@/constants/design';

type LoadingViewProps = {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
  className?: string;
  children?: ReactNode;
};

export function LoadingView({
  message,
  size = 'large',
  fullScreen = false,
  className = '',
  children,
}: LoadingViewProps) {
  const spinnerSize = size === 'large' ? 'large' : 'small';

  return (
    <View
      className={`items-center justify-center ${fullScreen ? 'flex-1 px-6 py-16' : 'py-8'} ${className}`.trim()}>
      <ActivityIndicator color={design.colors.primary} size={spinnerSize} />
      {message ? (
        <Text className="mt-3 text-center text-sm leading-5 text-neutral-500">{message}</Text>
      ) : null}
      {children}
    </View>
  );
}

/** Inline loading row for bubbles and buttons */
export function LoadingRow({ label }: { label: string }) {
  return (
    <View className="flex-row items-center gap-2 py-1">
      <ActivityIndicator color={design.colors.primary} size="small" />
      <Text className="text-sm text-neutral-500">{label}</Text>
    </View>
  );
}
