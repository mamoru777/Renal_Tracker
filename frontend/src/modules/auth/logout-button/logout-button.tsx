import { useCallback } from 'react';
import { Button } from '@/components/button';
import { useLogout, useUserId } from '../auth-provider';

type Props = {
  onClick?: () => void;
};

export function LogoutButton({ onClick }: Props) {
  const logout = useLogout();
  const isLoggedIn = useUserId();

  const handleLogout = useCallback(() => {
    logout();
    onClick?.();
  }, [logout, onClick]);

  if (!isLoggedIn) {
    return null;
  }

  return <Button onClick={handleLogout}>Выйти</Button>;
}
