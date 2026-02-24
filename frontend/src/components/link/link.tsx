import { type PropsWithChildren, useMemo } from 'react';
import cn from 'classnames';
import { NavLink as RouterLink } from 'react-router';

type Props = {
  href: string;
  newTab?: boolean;
  target?: '_blank' | '_self';
  className?: string;
  onClick?: () => void;
  type?: 'primary' | 'secondary' | 'transparent';
};

export function Link({
  href,
  children,
  target,
  className,
  onClick,
  type,
}: PropsWithChildren<Props>) {
  const staticClassName = useMemo(() => {
    let result = 'p-button p-component';

    switch (type) {
      case 'primary':
        break;
      case 'secondary':
        result += ' p-button-secondary';
        break;
      case 'transparent':
        result += ' p-button-link';
        break;
      default:
        break;
    }
    return result;
  }, [type]);

  return (
    <RouterLink
      to={href}
      target={target}
      className={cn(staticClassName, className)}
      onClick={onClick}
    >
      {children}
    </RouterLink>
  );
}
