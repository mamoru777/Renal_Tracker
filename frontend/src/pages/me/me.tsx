import { Outlet } from 'react-router';
import { PageSection } from '@/components/page-section';
import { RouterTabs } from '@/components/tabs';
import { PRIME_ICONS } from '@/constants/icons';
import { appRoutes } from '@/constants/routes';
import styles from './me.module.css';

export function Me() {
  const tabItems = [
    {
      label: 'Профиль',
      icon: PRIME_ICONS.USER,
      data: {
        path: appRoutes.ME_PROFILE,
      },
    },
    {
      label: 'Анализы',
      icon: PRIME_ICONS.ANALYZE,
      data: {
        path: appRoutes.ME_ANALYZES,
      },
    },
  ];

  return (
    <>
      <PageSection>
        <RouterTabs items={tabItems} className={styles.tabs} />
      </PageSection>

      <Outlet />
    </>
  );
}
