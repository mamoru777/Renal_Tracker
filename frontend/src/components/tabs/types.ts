import type { PRIME_ICONS } from '@/constants/icons';

export type MenuItem = {
  icon?: (typeof PRIME_ICONS)[keyof typeof PRIME_ICONS];
  label?: string;
  onTab?: (e: { item: MenuItem }) => void;
};
