import { useUserId } from '../auth';
import { GfrAuthCalculator } from './components/gfr-auth-calculator';
import { GfrResults } from './components/gfr-results';
import { GfrUnauthCalculator } from './components/gfr-unauth-calculator';
import styles from './gfr-calculator.module.css';

export function GfrCalculator() {
  const userId = useUserId();

  const CalculatorComponent = userId ? GfrAuthCalculator : GfrUnauthCalculator;

  return (
    <div className={styles.container}>
      <CalculatorComponent />
      <GfrResults />
    </div>
  );
}
