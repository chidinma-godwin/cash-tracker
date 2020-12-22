import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';

// CashTracker imports
import useStyles from './useStyles';

const LandingPage = () => {
  const styles = useStyles();
  const router = useRouter();

  const handleNavigate = location => {
    router.push('/account/[location]', `/account/${location}`);
  };

  return (
    <section className={styles.intro}>
      <div className={styles.buttonWrapper}>
        <a
          data-testid='login'
          className={styles.buttonStyles}
          onClick={() => handleNavigate('login')}
          onKeyDown={() => handleNavigate('login')}
          role='button'
          tabIndex={0}
        >
          <span />
          <span />
          <span />
          <span />
          Login
        </a>
        <a
          data-testid='sign-up'
          className={styles.buttonStyles}
          onClick={() => handleNavigate('signup')}
          onKeyDown={() => handleNavigate('signup')}
          role='button'
          tabIndex={0}
        >
          <span />
          <span />
          <span />
          <span />
          Sign Up
        </a>
      </div>

      <div className={styles.glowWrapper}>
        <Typography variant='h2' className={styles.glowText}>
          <span>C</span>
          <span>A</span>
          <span>S</span>
          <span>H</span>
        </Typography>
        <Typography variant='h2' className={styles.glowText}>
          <span>T</span>
          <span>R</span>
          <span>A</span>
          <span>C</span>
          <span>K</span>
          <span>E</span>
          <span>R</span>
        </Typography>
      </div>
      <Typography variant='subtitle1' classes={{ root: styles.subtitle }}>
        Track Your cash movement with ease
      </Typography>
      <svg
        className={styles.curve}
        version='1.1'
        viewBox='0 0 135.87 41.319'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g transform='translate(5.1618 -101.68)'>
          <path d='m-5.1618 141.14c43.775-2.0845 72.303-10.174 91.574-20.944 29.649-16.57 47.402-20.394 49.127-17.747 0 0-2.9893 33.247-3.1169 43.982-8.9429 0.47794-56.289 4.3573-98.257 0.54109-6.2059-0.56431-39.326 4.7506-39.326-0.54109z' />
        </g>
      </svg>
    </section>
  );
};

export default LandingPage;
