import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Tabs } from './tabs';
import type { MenuItem } from './types';

type Props = {
  className?: string;
  items: Array<MenuItem & { data: { path: string } }>;
};

const noop = () => {};

export function RouterTabs({ className, items }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const activeIndex = useMemo(
    () => items.findIndex(({ data }) => data?.path === pathname),
    [items, pathname],
  );

  const routerItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        onTab: () => navigate(item.data.path),
      })),
    [items, navigate],
  );

  return (
    <Tabs
      className={className}
      activeIndex={activeIndex}
      items={routerItems}
      onTabChange={noop}
    />
  );
}
