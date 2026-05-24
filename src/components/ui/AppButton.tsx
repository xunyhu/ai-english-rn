import { SymbolView } from 'expo-symbols';
import type { SymbolViewProps } from 'expo-symbols';
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { design } from '@/constants/design';

type AppButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type AppButtonSize = 'sm' | 'md' | 'lg';

type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: SymbolViewProps['name'];
  className?: string;
};

const variantStyles: Record<AppButtonVariant, { container: string; text: string; icon: string }> = {
  primary: {
    container: 'bg-emerald-500 border-transparent',
    text: 'text-neutral-950',
    icon: design.colors.primaryForeground,
  },
  secondary: {
    container: 'bg-neutral-800 border-neutral-700',
    text: 'text-neutral-100',
    icon: design.colors.text,
  },
  outline: {
    container: 'bg-transparent border-neutral-700',
    text: 'text-neutral-100',
    icon: design.colors.textSecondary,
  },
  ghost: {
    container: 'bg-transparent border-transparent',
    text: 'text-neutral-300',
    icon: design.colors.textSecondary,
  },
  danger: {
    container: 'bg-rose-950/50 border-rose-500/50',
    text: 'text-rose-200',
    icon: design.colors.danger,
  },
};

const sizeStyles: Record<AppButtonSize, { py: string; px: string; text: string; icon: number }> = {
  sm: { py: 'py-2', px: 'px-3', text: 'text-xs', icon: 16 },
  md: { py: 'py-3', px: 'px-4', text: 'text-sm', icon: 18 },
  lg: { py: 'py-4', px: 'px-5', text: 'text-base', icon: 20 },
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  className = '',
}: AppButtonProps) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];
  const isDisabled = disabled || loading;

  const flexClass = className.includes('flex-1') ? 'flex-1' : fullWidth ? 'w-full' : '';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`flex-row items-center justify-center gap-2 rounded-xl border active:opacity-80 ${v.container} ${s.py} ${s.px} ${flexClass} ${isDisabled ? 'opacity-50' : ''} ${className.replace('flex-1', '')}`.trim()}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? design.colors.primaryForeground : design.colors.primary}
          size="small"
        />
      ) : icon ? (
        <SymbolView name={icon} tintColor={v.icon} size={s.icon} />
      ) : null}
      <Text className={`font-semibold ${s.text} ${v.text}`}>{label}</Text>
    </Pressable>
  );
}

type AppButtonRowProps = {
  children: ReactNode;
  className?: string;
};

export function AppButtonRow({ children, className = '' }: AppButtonRowProps) {
  return <View className={`flex-row gap-3 ${className}`.trim()}>{children}</View>;
}
