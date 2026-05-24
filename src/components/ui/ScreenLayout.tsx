import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
};

export function ScreenLayout({
  title,
  subtitle,
  children,
  header,
  footer,
  edges = ['top'],
}: ScreenLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-neutral-950" edges={edges}>
      <View className="border-b border-neutral-800 px-5 py-3">
        <Text className="text-lg font-semibold text-neutral-100">{title}</Text>
        {subtitle ? <Text className="mt-0.5 text-xs text-neutral-500">{subtitle}</Text> : null}
      </View>
      {header}
      <View className="flex-1">{children}</View>
      {footer}
    </SafeAreaView>
  );
}
