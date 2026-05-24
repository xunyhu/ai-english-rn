import { Pressable, Text } from 'react-native';

import { AppCard } from '@/components';

type ChatErrorBannerProps = {
  message: string;
  dismissLabel: string;
  onDismiss: () => void;
};

export function ChatErrorBanner({ message, dismissLabel, onDismiss }: ChatErrorBannerProps) {
  return (
    <AppCard variant="danger" className="mx-4 my-2 !p-3">
      <Pressable onPress={onDismiss} className="flex-row items-start justify-between gap-3 active:opacity-70">
        <Text className="flex-1 text-sm leading-5 text-rose-200">{message}</Text>
        <Text className="text-sm font-medium text-rose-400">{dismissLabel}</Text>
      </Pressable>
    </AppCard>
  );
}
