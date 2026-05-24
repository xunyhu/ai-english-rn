import { theme } from './theme';

const Colors = {
  light: {
    text: theme.text,
    background: theme.background,
    tint: theme.tint,
    tabIconDefault: theme.tabBar.inactive,
    tabIconSelected: theme.tabBar.active,
  },
  dark: {
    text: theme.text,
    background: theme.background,
    tint: theme.tint,
    tabIconDefault: theme.tabBar.inactive,
    tabIconSelected: theme.tabBar.active,
  },
} as const;

export default Colors;
