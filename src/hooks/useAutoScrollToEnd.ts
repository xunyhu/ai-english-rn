import { useCallback, useEffect, useRef } from 'react';
import type { FlatList } from 'react-native';

/** Scrolls to end when tailKey changes (e.g. new message or streaming delta on last row). */
export function useAutoScrollToEnd<T>(tailKey: string) {
  const listRef = useRef<FlatList<T>>(null);
  const tailKeyRef = useRef(tailKey);

  const scrollToEnd = useCallback((animated = true) => {
    listRef.current?.scrollToEnd({ animated });
  }, []);

  useEffect(() => {
    if (tailKey === tailKeyRef.current) return;
    tailKeyRef.current = tailKey;
    if (tailKey === 'empty') return;

    const timer = setTimeout(() => scrollToEnd(true), 80);
    return () => clearTimeout(timer);
  }, [tailKey, scrollToEnd]);

  const onContentSizeChange = useCallback(() => {
    if (tailKeyRef.current === 'empty') return;
    scrollToEnd(false);
  }, [scrollToEnd]);

  return { listRef, scrollToEnd, onContentSizeChange };
}
