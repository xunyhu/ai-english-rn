import { SymbolView } from 'expo-symbols';
import { memo } from 'react';
import { Pressable, TextInput, View } from 'react-native';

type ChatInputProps = {
  value: string;
  placeholder: string;
  canSend: boolean;
  isStreaming: boolean;
  onChangeText: (text: string) => void;
  onSend: () => void;
};

function ChatInputComponent({
  value,
  placeholder,
  canSend,
  isStreaming,
  onChangeText,
  onSend,
}: ChatInputProps) {
  return (
    <View className="border-t border-neutral-800 bg-neutral-950 px-4 py-3">
      <View className="flex-row items-end gap-2 rounded-2xl border border-neutral-800 bg-neutral-900 px-3 py-2">
        <TextInput
          className="max-h-28 min-h-[40px] flex-1 py-2 text-base text-neutral-100"
          placeholder={placeholder}
          placeholderTextColor="#737373"
          value={value}
          onChangeText={onChangeText}
          multiline
          editable={!isStreaming}
          onSubmitEditing={canSend ? onSend : undefined}
          blurOnSubmit={false}
          returnKeyType="send"
        />
        <Pressable
          onPress={onSend}
          disabled={!canSend}
          className={`mb-0.5 h-9 w-9 items-center justify-center rounded-xl ${
            canSend ? 'bg-emerald-500 active:opacity-80' : 'bg-neutral-800'
          }`}>
          <SymbolView
            name={{ ios: 'arrow.up', android: 'arrow_upward', web: 'arrow_upward' }}
            tintColor={canSend ? '#0a0a0a' : '#525252'}
            size={18}
          />
        </Pressable>
      </View>
    </View>
  );
}

export const ChatInput = memo(ChatInputComponent);
