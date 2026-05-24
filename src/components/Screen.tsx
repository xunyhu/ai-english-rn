import type { ReactNode } from 'react';
import { View } from 'react-native';

import { ScreenLayout } from './ui/ScreenLayout';

type ScreenProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

/** @deprecated Prefer ScreenLayout for new screens */
export function Screen({ title, description, children }: ScreenProps) {
  return (
    <ScreenLayout title={title} subtitle={description} edges={['top', 'bottom']}>
      {children ? <View className="flex-1 px-5 pt-4">{children}</View> : <View className="flex-1" />}
    </ScreenLayout>
  );
}
