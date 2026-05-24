import { Pressable, Text, View } from 'react-native';

import { getErrorMessage } from '@/lib/errors';

type QueryErrorViewProps = {
  error: unknown;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function QueryErrorView({
  error,
  message = 'Could not load data.',
  onRetry,
  retryLabel = 'Retry',
}: QueryErrorViewProps) {
  return (
    <View className="mx-5 my-4 rounded-2xl border border-rose-900/50 bg-rose-950/40 p-4">
      <Text className="text-sm font-medium text-rose-200">{message}</Text>
      <Text className="mt-1 text-xs leading-5 text-rose-300/80">{getErrorMessage(error)}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry} className="mt-3 self-start active:opacity-70">
          <Text className="text-sm font-semibold text-rose-400">{retryLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
