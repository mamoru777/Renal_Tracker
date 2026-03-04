import { Outlet } from 'react-router';
import { PageSection } from '@/components/page-section';
import { useTokens } from '../auth-provider';

function SecuredRouteComponent() {
  const { accessToken } = useTokens();

  return accessToken ? (
    <Outlet />
  ) : (
    <PageSection>
      <h1>Ошибка</h1>

      <h2>Неавторизованным пользователям доступ запрещен</h2>
    </PageSection>
  );
}

export const SecuredRoute = SecuredRouteComponent;
