import { Text, View } from 'react-native';

import type { WelcomeInfo } from '../types';

type WelcomeHeaderProps = WelcomeInfo;

export function WelcomeHeader({ greeting, displayName, subtitle }: WelcomeHeaderProps) {
  return (
    <View className="mb-6">
      <Text className="text-sm font-medium text-emerald-400">
        {greeting}, {displayName}
      </Text>
      <Text className="mt-1 text-2xl font-semibold tracking-tight text-neutral-100">
        Let&apos;s learn English
      </Text>
      <Text className="mt-2 text-base leading-6 text-neutral-500">{subtitle}</Text>
    </View>
  );
}
