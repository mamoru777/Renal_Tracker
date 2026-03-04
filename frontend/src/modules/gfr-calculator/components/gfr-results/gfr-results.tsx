import { useEffect } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { useGfrFetcher } from '../../context';
import { GfrResultsContent } from './gfr-results-content';
import { GfrResultsSaveButton } from './gfr-results-save-button';
import styles from './gfr-results.module.css';

export function GfrResults() {
  const [{ opacity, marginLeft, width }, api] = useSpring(() => ({
    from: {
      opacity: 0,
      marginLeft: '0%',
      width: '0%',
    },
    config: {
      duration: 1300,
    },
  }));

  const gfrFetcher = useGfrFetcher();

  useEffect(() => {
    if (gfrFetcher.data || gfrFetcher.state !== 'idle') {
      api.start({
        to: {
          opacity: 1,
          marginLeft: '5%',
          width: 'auto',
        },
      });
    }
  }, [gfrFetcher.state, gfrFetcher.data, api]);

  return (
    <animated.div
      className={styles.results}
      style={{ width, opacity, marginLeft }}
    >
      <div className={styles.content}>
        <GfrResultsContent />
        <GfrResultsSaveButton />
      </div>
    </animated.div>
  );
}
