import { useChatActions } from './useChatActions';
import { useMessageSpeechPlay } from './useMessageSpeechPlay';
import { CHAT_COPY } from '../constants';
import { selectCanSend, useChatStore } from '../store/chat-store';

/** Aggregated chat screen state — prefer store selectors in ChatScreen for performance */
export function useChatScreen() {
  const messages = useChatStore((state) => state.messages);
  const inputText = useChatStore((state) => state.inputText);
  const isStreaming = useChatStore((state) => state.isStreaming);
  const error = useChatStore((state) => state.error);
  const canSend = useChatStore(selectCanSend);
  const setInputText = useChatStore((state) => state.setInputText);
  const { sendMessage, dismissError } = useChatActions();
  const onPlayMessageAudio = useMessageSpeechPlay();

  return {
    copy: CHAT_COPY,
    messages,
    inputText,
    isStreaming,
    isLoading: isStreaming,
    error,
    canSend,
    setInputText,
    onSend: sendMessage,
    onDismissError: dismissError,
    onPlayMessageAudio,
  };
}
