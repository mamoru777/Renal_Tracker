import cn from 'classnames';
import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';
import styles from './spinner.module.css';

type Props = {
  fullScreen?: boolean;
  active?: boolean;
};

export function Spinner({ fullScreen, active }: Props) {
  if (!active) {
    return null;
  }

  return (
    <div
      className={cn(styles.spinner, {
        [styles.fullScreen]: fullScreen,
      })}
    >
      <BlockUI fullScreen blocked={fullScreen} />
      <ProgressSpinner />
    </div>
  );
}
