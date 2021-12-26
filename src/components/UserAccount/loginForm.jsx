import { useRef, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import EmailIcon from '@material-ui/icons/Email';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Formik } from 'formik';
import { string, object } from 'yup';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { signIn } from 'next-auth/react';

// CashTracker Imports
import { dashboardEndpoint } from 'constants/endpoints';
import { unexpected } from 'constants/errorMessages';

const useStyles = makeStyles({
  spinner: {
    marginLeft: '0.7em',
  },
  googleButtonContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
  },
});

export default function LoginForm({ className }) {
  const [showPassword, setShowPassword] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const classes = useStyles();
  const router = useRouter();
  const emailRef = useRef(null);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const focusEmail = () => {
    emailRef.current.focus();
  };

  const handleCloseError = () => setErrMsg('');

  const disableButton = (isSubmitting, values, errors) =>
    isSubmitting ||
    !values.email ||
    !values.password ||
    !!Object.entries(errors).length;

  const schema = object().shape({
    email: string()
      .email('Invalid email address')
      .required('Your email is required'),
    password: string().required('Please enter your password'),
  });

  return (
    <Formik
      validationSchema={schema}
      initialValues={{ email: '', password: '' }}
      onSubmit={async values => {
        try {
          signIn('credentials', {
            ...values,
            callbackUrl: dashboardEndpoint,
          });
          router.push('/dashboard');
        } catch (err) {
          console.log(err);
          setErrMsg(unexpected);
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form
          data-testid='login-form'
          noValidate
          className={className}
          onSubmit={handleSubmit}
        >
          <h2>Sign In</h2>
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(errMsg)}
            onClose={handleCloseError}
          >
            <MuiAlert
              elevation={6}
              variant='filled'
              severity='error'
              onClose={handleCloseError}
            >
              {errMsg}
            </MuiAlert>
          </Snackbar>
          <TextField
            id='login-email'
            name='email'
            label='Email'
            variant='outlined'
            type='email'
            color='primary'
            size='small'
            error={Boolean(errors.email && touched.email)}
            helperText={errors.email && touched.email && errors.email}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            inputRef={emailRef}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton aria-label='email icon' onClick={focusEmail}>
                    <EmailIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <TextField
            id='login-password'
            name='password'
            label='Password'
            variant='outlined'
            type={showPassword ? 'text' : 'password'}
            color='primary'
            size='small'
            error={Boolean(errors.password && touched.password)}
            helperText={errors.password && touched.password && errors.password}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={togglePassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <Button
            type='submit'
            aria-label='submit'
            variant='contained'
            color='primary'
            disabled={disableButton(isSubmitting, values, errors)}
          >
            {isSubmitting ? (
              <>
                <span>Loading</span>
                <CircularProgress
                  size='1em'
                  classes={{ root: classes.spinner }}
                />
              </>
            ) : (
              'Login'
            )}
          </Button>
          <div className={classes.googleButtonContainer}>
            <p style={{ fontWeight: 'bold' }}>Or</p>
            <Button
              type='button'
              aria-label='sign in with google'
              variant='contained'
              color='primary'
              onClick={() =>
                signIn('google', {
                  callbackUrl: dashboardEndpoint,
                })
              }
            >
              Sign In With Google
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
}

LoginForm.propTypes = {
  className: PropTypes.string.isRequired,
};
