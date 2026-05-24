import { Text } from 'react-native';

import { AppCard } from './ui/AppCard';

type PlaceholderProps = {
  message: string;
};

export function Placeholder({ message }: PlaceholderProps) {
  return (
    <AppCard variant="default" className="mt-6">
      <Text className="text-center text-sm leading-5 text-neutral-500">{message}</Text>
    </AppCard>
  );
}
