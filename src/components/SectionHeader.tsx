import { Text, View } from 'react-native';

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
};

export function SectionHeader({ title, actionLabel }: SectionHeaderProps) {
  return (
    <View className="mb-3 flex-row items-center justify-between">
      <Text className="text-base font-semibold text-neutral-100">{title}</Text>
      {actionLabel ? (
        <Text className="text-sm text-neutral-500">{actionLabel}</Text>
      ) : null}
    </View>
  );
}
