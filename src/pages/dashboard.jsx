import { useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Grid from '@material-ui/core/Grid';
import MuiAlert from '@material-ui/lab/Alert';
import Skeleton from '@material-ui/lab/Skeleton';
import { useRouter } from 'next/router';

// CashTracker Imports
import { useUser } from 'utils/hooks';
import Layout from 'components/AppLayout/layout';
import AddTransactionDialog from 'components/UserDashboard/addTransactionDialog';
import ClientDetailsList from 'components/UserDashboard/clientDetailsLit';
import PendingUserList from 'components/UserDashboard/pendingUserList';

export default function Dashboard() {
  const [showDialog, setShowDialog] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const { user, mutate, loading } = useUser();
  const router = useRouter();
  console.info(user);

  useEffect(() => {
    if (!user && !loading) {
      router.push('/account/login');
    }
  }, [user, loading, router]);

  const handleShowDialog = () => setShowDialog(true);

  const handleCloseDialog = () => setShowDialog(false);

  const handleTransactionAccount = async (
    attachedEmail,
    action,
    type,
    values,
    resetForm
  ) => {
    const body = values
      ? JSON.stringify({
          action,
          ...values,
          clientsDetails: user.clientsDetails,
        })
      : JSON.stringify({
          action,
          clientEmail: attachedEmail,
          clientsDetails: user.clientsDetails,
        });
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
      if (res.status === 304) {
        setSuccessMsg('');
        setShowDialog(true);
        setOpenSnackBar(true);
        if (action === 'add' && type === 'request') {
          setErrMsg('You have already sent a connection request to this user');
        } else if (action === 'add') {
          setErrMsg('You already have an account with this user');
        } else if (action === 'delete' && type === 'request') {
          setErrMsg('You have already cancelled your connection request');
        } else if (action === 'delete' && type === 'account') {
          setErrMsg('You have already deleted your account with this user');
        } else {
          setErrMsg(
            'You have already declined connection invitation from this user'
          );
        }
      } else if (res.status === 400) {
        setSuccessMsg('');
        setShowDialog(true);
        setOpenSnackBar(true);
        setErrMsg('There was an error in your input. Please try again');
      } else {
        const resJson = await res.json();
        if (resJson) {
          mutate(resJson);
          setErrMsg('');
          setOpenSnackBar(true);
          setShowDialog(false);
          if (action === 'add' && type === 'request') {
            setSuccessMsg('Invitation sent successfully');
          } else if (action === 'add') {
            setSuccessMsg('Transaction account successfully confirmed');
          } else if (action === 'delete' && type === 'request') {
            setSuccessMsg('Transaction account request cancelled');
          } else if (action === 'delete' && type === 'account') {
            setSuccessMsg('Transaction account deleted successfully');
          } else {
            setSuccessMsg('Transaction account invitation declined');
          }
          if (resetForm) resetForm();
        } else {
          setSuccessMsg('');
          setOpenSnackBar(true);
          if (action === 'add' && type === 'request') {
            setErrMsg('Unable to invite this user. Please try again.');
          } else if (action === 'add') {
            setErrMsg('Unable to confirm this account. Please try again.');
          } else if (action === 'delete' && type === 'request') {
            setErrMsg('Unable to cancel request. Please try again.');
          } else if (action === 'delete' && type === 'account') {
            setErrMsg(
              'Unable to delete your account with this user. Please try again.'
            );
          } else {
            setErrMsg('Unable to decline this invitation. Please try again.');
          }
        }
      }
    } catch (err) {
      console.log(err);
      setSuccessMsg('');
      setOpenSnackBar(true);
      setErrMsg('Unexpected error! Please try again.');
    }
  };

  const handleCloseSnackBar = () => setOpenSnackBar(false);

  if (!user) {
    return (
      <Layout>
        <Skeleton variant='rect' height={200} />
      </Layout>
    );
  }

  return (
    <Layout>
      {successMsg && (
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
            severity='success'
            onClose={handleCloseSnackBar}
          >
            {successMsg}
          </MuiAlert>
        </Snackbar>
      )}
      <Grid container>
        <Grid item>
          <PendingUserList
            pendingInvitations={user.pendingInvitations}
            handleTransactionAccount={handleTransactionAccount}
          />
        </Grid>
        <Grid item>
          <ClientDetailsList
            handleTransactionAccount={handleTransactionAccount}
            handleShowDialog={handleShowDialog}
          />
        </Grid>
      </Grid>
      <AddTransactionDialog
        showDialog={showDialog}
        handleCloseDialog={handleCloseDialog}
        handleTransactionAccount={handleTransactionAccount}
        openSnackBar={openSnackBar}
        handleCloseSnackBar={handleCloseSnackBar}
        errMsg={errMsg}
      />
    </Layout>
  );
}

// Export const getStaticProps = async function () {
//   const credits = await fetcher('/api/transactions/credits');
//   const debits = await fetcher('/api/transactions/debits');

//   return {
//     props: {
//       credits,
//       debits,
//     },
//   };
// };
