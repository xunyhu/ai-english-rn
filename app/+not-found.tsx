import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View className="flex-1 items-center justify-center bg-neutral-950 p-5">
        <Text className="text-xl font-semibold text-neutral-100">This screen does not exist.</Text>
        <Link href="/" className="mt-4 py-4">
          <Text className="text-base text-neutral-400">Go to home</Text>
        </Link>
      </View>
    </>
  );
}
