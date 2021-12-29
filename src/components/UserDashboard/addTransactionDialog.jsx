import { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import MuiAlert from '@material-ui/lab/Alert';
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
import { Formik } from 'formik';
import currencyToSymbolMap from 'currency-symbol-map/map';
import { object, string } from 'yup';
import PropTypes from 'prop-types';

// CashTracker imports
import { useUser } from 'utils/hooks';

const filter = createFilterOptions();

export default function AddTransactionDialog({
  showDialog,
  handleCloseDialog,
  handleTransactionAccount,
  openSnackBar,
  handleCloseSnackBar,
  errMsg,
}) {
  const { user } = useUser();
  const [hideFields, setHideFields] = useState(false);

  const schema = object().shape({
    clientEmail: string()
      .email()
      .required('Please enter the email of the user you are inviting'),
    currency: string().required(
      'Enter the currency this transactions will be made in'
    ),
  });

  return (
    <>
      <Dialog
        open={showDialog}
        onClose={handleCloseDialog}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Add a new account</DialogTitle>
        <Formik
          validationSchema={schema}
          initialValues={{ clientEmail: '', currency: '' }}
          onSubmit={(values, { resetForm }) => {
            handleTransactionAccount('', 'add', 'request', values, resetForm);
          }}
        >
          {({
            values,
            handleSubmit,
            handleChange,
            isSubmitting,
            errors,
            handleBlur,
            setFieldValue,
            touched,
          }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent>
                {errMsg && (
                  <Snackbar
                    open={openSnackBar}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackBar}
                  >
                    <MuiAlert
                      elevation={6}
                      variant='filled'
                      severity='error'
                      onClose={handleCloseSnackBar}
                    >
                      {errMsg}
                    </MuiAlert>
                  </Snackbar>
                )}
                <DialogContentText>
                  Please enter the email of the user you want to start
                  transactions with.
                </DialogContentText>
                <Autocomplete
                  id='clientEmail'
                  value={values.clientEmail}
                  freeSolo
                  onChange={(_, newValue) => {
                    if (newValue && newValue.inputValue) {
                      // Create a new value from the user input
                      setHideFields(true);
                      setFieldValue('clientEmail', newValue.inputValue);
                    } else {
                      setHideFields(true);
                      setFieldValue('clientEmail', newValue);
                    }
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    if (params.inputValue !== '') {
                      filtered.push({
                        inputValue: params.inputValue,
                        email: `Add "${params.inputValue}"`,
                      });
                    }

                    return filtered;
                  }}
                  options={user.clientsEmail.map(email => email)}
                  getOptionLabel={option => {
                    // Add "xxx" option created dynamically
                    if (option.inputValue) {
                      return option.inputValue;
                    }
                    // Value selected with enter, right from the input. string option
                    return option;
                  }}
                  renderOption={option => {
                    if (option.email) {
                      return option.email;
                    }
                    return option;
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      autoFocus
                      margin='dense'
                      label='Client Email'
                      type='email'
                      error={Boolean(errors.clientEmail)}
                      variant='outlined'
                      InputLabelProps={{ shrink: true }}
                      helperText={
                        errors.clientEmail &&
                        touched.clientEmail &&
                        errors.clientEmail
                      }
                      fullWidth
                    />
                  )}
                />
                {hideFields && (
                  <>
                    <Typography variant='h6'>
                      There is no user with this email on your client list. A
                      request will be sent to this user to connect with you.
                    </Typography>
                    <div>
                      <Button
                        color='primary'
                        onClick={() => setHideFields(false)}
                      >
                        Continue
                      </Button>
                      <Button
                        onClick={() => {
                          setHideFields(false);
                          handleCloseDialog();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
                {!hideFields && (
                  <TextField
                    id='currency'
                    margin='dense'
                    select
                    label='Currency'
                    error={Boolean(errors.currency)}
                    value={values.currency}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    SelectProps={{
                      native: true,
                    }}
                    helperText={
                      errors.currency && touched.currency && errors.currency
                    }
                    variant='outlined'
                  >
                    <option value='' disabled hidden>
                      --Select Currency--
                    </option>
                    {Object.entries(currencyToSymbolMap).map(option => (
                      <option key={option[0]} value={option[0]}>
                        {`${option[0]} (${option[1]})`}
                      </option>
                    ))}
                  </TextField>
                )}
              </DialogContent>
              {!hideFields && (
                <DialogActions>
                  <Button
                    onClick={handleCloseDialog}
                    variant='contained'
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    variant='contained'
                    color='primary'
                  >
                    {isSubmitting ? 'Loading...' : 'Add'}
                  </Button>
                </DialogActions>
              )}
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}

AddTransactionDialog.propTypes = {
  showDialog: PropTypes.bool.isRequired,
  handleCloseDialog: PropTypes.func.isRequired,
  handleTransactionAccount: PropTypes.func.isRequired,
  openSnackBar: PropTypes.bool.isRequired,
  handleCloseSnackBar: PropTypes.func.isRequired,
  errMsg: PropTypes.string.isRequired,
};
