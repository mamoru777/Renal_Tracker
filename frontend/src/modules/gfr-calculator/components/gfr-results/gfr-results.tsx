import { useEffect } from 'react';
import { animated, useSpring } from '@react-spring/web';
import useMeasure from 'react-use-measure';
import { useGfrFetcher } from '../../context';
import { GfrResultsContent } from './gfr-results-content';
import { GfrResultsSaveButton } from './gfr-results-save-button';
import styles from './gfr-results.module.css';

export function GfrResults() {
  const [ref, { width: compWidth }] = useMeasure();

  const [{ opacity, marginLeft, width, spanWidthRate }, api] = useSpring(
    () => ({
      from: {
        opacity: 0,
        marginLeft: '0%',
        width: 0,
        spanWidthRate: 0,
      },
    }),
  );

  const gfrFetcher = useGfrFetcher();

  useEffect(() => {
    if (gfrFetcher.data || gfrFetcher.state !== 'idle') {
      api.start({
        to: [
          { width: compWidth, marginLeft: '3%', config: { duration: 350 } },
          {
            opacity: 1,
            config: { duration: 1200 },
            spanWidthRate: 1,
          },
        ],
      });
    }
  }, [gfrFetcher.state, gfrFetcher.data, api, compWidth]);

  const spanWidth = spanWidthRate.get() ? '100%' : 'max-content';

  return (
    <animated.div
      className={styles.results}
      style={{ width, opacity, marginLeft }}
    >
      <div className={styles.content}>
        <span ref={ref} className={styles.text} style={{ width: spanWidth }}>
          <GfrResultsContent />
        </span>

        <GfrResultsSaveButton />
      </div>
    </animated.div>
  );
}
