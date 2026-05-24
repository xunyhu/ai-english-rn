import { HomeScreenView } from '../components/HomeScreenView';
import { useHomeScreen } from '../hooks/useHomeScreen';

export function HomeScreen() {
  const {
    welcome,
    copy,
    quickEntries,
    dailyEnglish,
    continueLearning,
    studyProgress,
    isLoading,
    dailyEnglishError,
    refetchDailyEnglish,
    isPlaying,
    isPlayLoading,
    isFavorited,
    onPlayAudio,
    onToggleFavorite,
    navigateTo,
  } = useHomeScreen();

  return (
    <HomeScreenView
      welcome={welcome}
      copy={copy}
      quickEntries={quickEntries}
      dailyEnglish={dailyEnglish}
      continueLearning={continueLearning}
      studyProgress={studyProgress}
      isLoading={isLoading}
      dailyEnglishError={dailyEnglishError}
      onRetryDailyEnglish={refetchDailyEnglish}
      isPlaying={isPlaying}
      isPlayLoading={isPlayLoading}
      isFavorited={isFavorited}
      onPlayAudio={onPlayAudio}
      onToggleFavorite={onToggleFavorite}
      onNavigate={navigateTo}
    />
  );
}
