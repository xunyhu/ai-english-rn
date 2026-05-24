import { ProfileScreenView } from '../components/ProfileScreenView';
import { useProfileScreen } from '../hooks/useProfileScreen';

export function ProfileScreen() {
  const props = useProfileScreen();
  return <ProfileScreenView {...props} />;
}
