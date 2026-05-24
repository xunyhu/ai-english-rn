import { View } from 'react-native';

import { Placeholder, ScreenLayout } from '@/components';

type ProfileScreenViewProps = {
  title: string;
  description: string;
  placeholder: string;
};

export function ProfileScreenView({ title, description, placeholder }: ProfileScreenViewProps) {
  return (
    <ScreenLayout title={title} subtitle={description} edges={['top', 'bottom']}>
      <View className="px-5 pt-4">
        <Placeholder message={placeholder} />
      </View>
    </ScreenLayout>
  );
}
