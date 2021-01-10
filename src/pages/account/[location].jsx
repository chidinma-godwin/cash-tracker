import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';

// CashTracker Imports
import LoginForm from 'components/UserAccount/loginForm';
import SignUpForm from 'components/UserAccount/signupForm';
import useStyles from './useStyles';

export default function Account({ location }) {
  const classes = useStyles();
  const router = useRouter();

  const queryLocation =
    (location && location === 'signup') || router.query.location === 'signup';

  const [showSignup, setShowSignup] = useState(queryLocation);

  const handleAnimation = () => setShowSignup(!showSignup);

  return (
    <div
      data-testid='container'
      className={`${classes.container} ${showSignup ? 'animate' : ''}`}
    >
      <div className={classes.formsContainer}>
        <div className={classes.accounts}>
          <LoginForm />
          <SignUpForm />
        </div>
      </div>
      <div className={classes.panelsContainer}>
        <div className={`${classes.panel} ${classes.leftPanel}`}>
          <div className={classes.content}>
            <h3>New Here?</h3>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt
              voluptatum, mollitia accusamus dolorem ducimus placeat corporis
              accusantium consectetur dolore soluta aut. Numquam dolores tempore
              ipsa fugiat ullam dignissimos labore incidunt?
            </p>
            <Button
              variant='outlined'
              classes={{ root: classes.buttonStyles }}
              onClick={handleAnimation}
            >
              Sign Up
            </Button>
          </div>
          <img src='/transfer.svg' alt='transfer' />
        </div>
        <div className={`${classes.panel} ${classes.rightPanel}`}>
          <div className={classes.content}>
            <h3>Already have an account?</h3>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt
              voluptatum, mollitia accusamus dolorem ducimus placeat corporis
              accusantium consectetur dolore soluta aut. Numquam dolores tempore
              ipsa fugiat ullam dignissimos labore incidunt?
            </p>
            <Button
              variant='outlined'
              classes={{ root: classes.buttonStyles }}
              onClick={handleAnimation}
            >
              Sign In
            </Button>
          </div>
          <img src='/agreement.svg' alt='agreement' />
        </div>
      </div>
    </div>
  );
}

Account.propTypes = {
  location: PropTypes.string,
};

Account.defaultProps = {
  location: undefined,
};

export const getStaticPaths = async () => ({
  paths: [
    { params: { location: 'login' } },
    { params: { location: 'signup' } },
  ],
  fallback: false,
});

export const getStaticProps = async context => {
  const { location } = context.params;

  return {
    props: {
      location,
    },
  };
};
