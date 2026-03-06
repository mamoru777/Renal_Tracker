import { useMemo } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import type { MenuItem } from './types';

type Props = {
  className?: string;
  items: MenuItem[];
  activeIndex?: number;
  onTabChange?: (params: { value: MenuItem; index: number }) => void;
};

export function Tabs({ className, items, activeIndex, onTabChange }: Props) {
  const tabItems = useMemo(
    () =>
      items?.map((item) => ({
        ...item,
        command: item.onTab,
      })),
    [items],
  );

  return (
    <TabMenu
      className={className}
      model={tabItems}
      activeIndex={activeIndex}
      onTabChange={onTabChange}
    />
  );
}
