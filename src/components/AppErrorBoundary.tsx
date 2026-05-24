import { Pressable, Text, View } from 'react-native';

import { getErrorMessage } from '@/lib/errors';

type AppErrorBoundaryProps = {
  error: Error;
  retry: () => void;
};

export function AppErrorBoundary({ error, retry }: AppErrorBoundaryProps) {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-950 px-6">
      <Text className="text-xl font-semibold text-neutral-100">Something went wrong</Text>
      <Text className="mt-3 text-center text-sm leading-6 text-neutral-500">
        {getErrorMessage(error)}
      </Text>
      <Pressable
        onPress={retry}
        className="mt-6 rounded-xl bg-emerald-500 px-6 py-3 active:opacity-80">
        <Text className="text-sm font-semibold text-neutral-950">Try again</Text>
      </Pressable>
    </View>
  );
}
