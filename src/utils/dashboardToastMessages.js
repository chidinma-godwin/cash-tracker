export const getNotModifiedErrMsg = ({ action, type, setErrMsg }) => {
  if (action === 'add' && type === 'request') {
    setErrMsg('You have already sent a connection request to this user');
  } else if (action === 'add') {
    setErrMsg('You already have an account with this user');
  } else if (action === 'delete' && type === 'request') {
    setErrMsg('You have already cancelled your connection request');
  } else if (action === 'delete' && type === 'account') {
    setErrMsg('You have already deleted your account with this user');
  } else {
    setErrMsg('You have already declined connection invitation from this user');
  }
};

export const getUpdateSuccessfulMessage = ({ action, type, setSuccessMsg }) => {
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
};
export const getUpdateFailedMsg = ({ action, type, setErrMsg }) => {
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
};
