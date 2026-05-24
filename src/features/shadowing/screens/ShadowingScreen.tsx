import { ShadowingScreenView } from '../components/ShadowingScreenView';
import { useShadowingRecorder } from '../hooks/useShadowingRecorder';
import { useShadowingScreen } from '../hooks/useShadowingScreen';

export function ShadowingScreen() {
  const recorder = useShadowingRecorder();
  const props = useShadowingScreen(recorder);

  return <ShadowingScreenView {...props} />;
}
