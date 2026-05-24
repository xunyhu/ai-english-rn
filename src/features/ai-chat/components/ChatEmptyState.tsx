import { SymbolView } from 'expo-symbols';
import { Text, View } from 'react-native';

import { AppCard } from '@/components';

type ChatEmptyStateProps = {
  title: string;
  description: string;
};

export function ChatEmptyState({ title, description }: ChatEmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-6 py-16">
      <AppCard variant="default" className="w-full max-w-sm items-center">
        <View className="mb-4 h-14 w-14 items-center justify-center rounded-2xl bg-neutral-800">
          <SymbolView
            name={{ ios: 'bubble.left.and.bubble.right', android: 'chat', web: 'chat' }}
            tintColor="#34d399"
            size={28}
          />
        </View>
        <Text className="text-center text-lg font-semibold text-neutral-100">{title}</Text>
        <Text className="mt-2 text-center text-sm leading-5 text-neutral-500">{description}</Text>
      </AppCard>
    </View>
  );
}
