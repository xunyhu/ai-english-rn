import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { TabBarIcon } from '@/components/TabBarIcon';
import { theme } from '@/constants/theme';

const TAB_ICONS = {
  index: { ios: 'house.fill', android: 'home', web: 'home' },
  chat: { ios: 'bubble.left.and.bubble.right', android: 'chat', web: 'chat' },
  shadowing: { ios: 'waveform', android: 'graphic_eq', web: 'graphic_eq' },
  interview: { ios: 'person.2', android: 'groups', web: 'groups' },
  profile: { ios: 'person.crop.circle', android: 'person', web: 'person' },
} as const;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.tabBar.active,
        tabBarInactiveTintColor: theme.tabBar.inactive,
        tabBarStyle: {
          backgroundColor: theme.tabBar.background,
          borderTopColor: theme.tabBar.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 60,
          paddingTop: 6,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <TabBarIcon color={color} name={TAB_ICONS.index} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => (
            <TabBarIcon color={color} name={TAB_ICONS.chat} />
          ),
        }}
      />
      <Tabs.Screen
        name="shadowing"
        options={{
          title: 'Shadowing',
          tabBarIcon: ({ color }) => (
            <TabBarIcon color={color} name={TAB_ICONS.shadowing} />
          ),
        }}
      />
      <Tabs.Screen
        name="interview"
        options={{
          title: 'Interview',
          tabBarIcon: ({ color }) => (
            <TabBarIcon color={color} name={TAB_ICONS.interview} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <TabBarIcon color={color} name={TAB_ICONS.profile} />
          ),
        }}
      />
    </Tabs>
  );
}
