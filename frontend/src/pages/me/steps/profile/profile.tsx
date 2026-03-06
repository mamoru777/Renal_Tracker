import { PageSection } from '@/components/page-section';
import { useAuthenticatedUser } from '@/modules/user';
import { ProfileForm } from './components';

export function Profile() {
  const { user } = useAuthenticatedUser();

  return (
    <PageSection>
      <h1>Данные пользователя</h1>

      <ProfileForm key={user.id} />
    </PageSection>
  );
}
