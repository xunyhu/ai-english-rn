import { AppButton } from '@/components';

type NextQuestionButtonProps = {
  label: string;
  onPress: () => void;
};

export function NextQuestionButton({ label, onPress }: NextQuestionButtonProps) {
  return (
    <AppButton
      label={label}
      onPress={onPress}
      variant="outline"
      fullWidth
      className="mx-4 mb-2 border-blue-800/60 !bg-blue-950/30"
    />
  );
}
