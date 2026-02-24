import { Card } from '@/components/card';
import { PageSection } from '@/components/page-section';
import { AuthForm } from '@/modules/auth';
import styles from './auth.module.css';

export function Auth() {
  return (
    <div className={styles.container}>
      <PageSection className={styles.section}>
        <Card title="Авторизация">
          <AuthForm />
        </Card>
      </PageSection>
    </div>
  );
}
