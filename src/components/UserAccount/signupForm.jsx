import { useRef, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import EmailIcon from '@material-ui/icons/Email';
import PersonIcon from '@material-ui/icons/Person';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Formik } from 'formik';
import { string, object, ref } from 'yup';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';

// CashTracker imports
import { signupEndpoint } from 'constants/endpoints';
import { unexpected } from 'constants/errorMessages';
import apiRequest from 'utils/apiRequest';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#fff',
    padding: '1rem',
    borderRadius: '10px',
    gridRow: '1 / 2',
    gridColumn: '1 / 2',
    overflow: 'hidden',
    transition: '1.5s ease-in-out',
  },
  signUp: {
    opacity: 0,
    zIndex: 1,
  },
  spinner: {
    marginLeft: '0.7em',
  },
});

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const classes = useStyles();
  const router = useRouter();
  const nameRef = useRef(null);
  const emailRef = useRef(null);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const togglePassword2 = () => {
    setShowPassword2(!showPassword2);
  };

  const focusName = () => {
    nameRef.current.focus();
  };

  const focusEmail = () => {
    emailRef.current.focus();
  };

  const handleCloseError = () => setErrMsg('');

  const disableButton = (isSubmitting, values, errors) =>
    isSubmitting ||
    !values.name ||
    !values.email ||
    !values.password ||
    !values.password2 ||
    !!Object.entries(errors).length;

  const schema = object().shape({
    name: string()
      .required('Your name is required')
      .min(3, 'Username must be at least 3 characters'),
    email: string()
      .email('Invalid email address')
      .required('Your email is required'),
    password: string()
      .required('Please choose a password')
      .min(6, 'Your password must have a minimum length of 6'),
    password2: string()
      .oneOf([ref('password'), null], 'Passwords must match')
      .required('Please re-enter your password'),
  });

  return (
    <Formik
      validationSchema={schema}
      initialValues={{ name: '', email: '', password: '', password2: '' }}
      onSubmit={async values => {
        try {
          const { response, err } = await apiRequest(signupEndpoint, values);
          if (response.status === 201) {
            router.push('/account/login');
          } else if (err) {
            setErrMsg(err);
          }
        } catch (err) {
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
          noValidate
          data-testid='signup-form'
          className={`${classes.form} ${classes.signUp}`}
          onSubmit={handleSubmit}
        >
          <h2>Sign Up</h2>
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
            id='signup-name'
            name='name'
            label='Username'
            variant='outlined'
            error={Boolean(errors.name && touched.name)}
            helperText={errors.name && touched.name && errors.name}
            color='primary'
            size='small'
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
            inputRef={nameRef}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton aria-label='username' onClick={focusName}>
                    <PersonIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <TextField
            id='signup-email'
            name='email'
            label='Email'
            variant='outlined'
            error={Boolean(errors.email && touched.email)}
            helperText={errors.email && touched.email && errors.email}
            type='email'
            color='primary'
            size='small'
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            inputRef={emailRef}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton aria-label='email' onClick={focusEmail}>
                    <EmailIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <TextField
            id='signup-password'
            name='password'
            label='Password'
            variant='outlined'
            error={Boolean(errors.password && touched.password)}
            helperText={errors.password && touched.password && errors.password}
            type={showPassword ? 'text' : 'password'}
            color='primary'
            size='small'
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
          <TextField
            id='signup-password2'
            name='password2'
            label='Confirm Password'
            variant='outlined'
            error={Boolean(errors.password2 && touched.password2)}
            helperText={
              errors.password2 && touched.password2 && errors.password2
            }
            type={showPassword2 ? 'text' : 'password'}
            color='primary'
            size='small'
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password2}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle confirm password visibility'
                    onClick={togglePassword2}
                  >
                    {showPassword2 ? <Visibility /> : <VisibilityOff />}
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
              'Create account'
            )}
          </Button>
        </form>
      )}
    </Formik>
  );
}
