import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const BAR_HEIGHTS = [16, 28, 20, 36, 24, 32, 18];
const BAR_COUNT = BAR_HEIGHTS.length;

type WaveformPlaceholderProps = {
  active: boolean;
};

function WaveBar({ index, active }: { index: number; active: boolean }) {
  const scale = useSharedValue(0.35);

  useEffect(() => {
    if (active) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 280 + index * 40 }),
          withTiming(0.35, { duration: 280 + index * 40 }),
        ),
        -1,
        false,
      );
      return;
    }
    scale.value = withTiming(0.35, { duration: 200 });
  }, [active, index, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: BAR_HEIGHTS[index]! * scale.value,
    opacity: active ? 0.5 + scale.value * 0.5 : 0.35,
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="w-2 rounded-full bg-emerald-400"
    />
  );
}

export function WaveformPlaceholder({ active }: WaveformPlaceholderProps) {
  return (
    <View className="h-20 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/80">
      <View className="h-10 flex-row items-end justify-center gap-2">
        {Array.from({ length: BAR_COUNT }).map((_, index) => (
          <WaveBar key={index} index={index} active={active} />
        ))}
      </View>
    </View>
  );
}
