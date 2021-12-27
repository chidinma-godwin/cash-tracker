// CashTracker Imports
import User from 'models/User';
import {
  wrongCredentials,
  unexpected,
  userAlreadyExists,
} from 'constants/errorMessages';

export async function createUser({
  name,
  email,
  password,
  password2,
  usePassword = true,
}) {
  try {
    const user = await User.findOne({ email });
    if (user) {
      return { errMsg: userAlreadyExists, ok: false };
    }
    if (usePassword && password !== password2) {
      return { errMsg: 'Password do not match!', ok: false };
    }
    const pendingInvitationsUsers = await User.find({ pendingRequests: email });
    const pendingInvitationsEmail =
      pendingInvitationsUsers &&
      pendingInvitationsUsers.map(pendingUser => pendingUser.email);

    await User.create({
      username: name,
      email,
      ...(usePassword && { password }),
      ...(pendingInvitationsEmail && {
        pendingInvitations: pendingInvitationsEmail,
      }),
    });

    return { errMsg: null, ok: true };
  } catch (err) {
    return { errMsg: err, ok: false };
  }
}

export async function findUser(email, password) {
  try {
    const currentUser = await User.findOne({ email });
    if (currentUser && (await currentUser.passwordMatch(password))) {
      delete currentUser.password;
      return { user: currentUser };
    }
    return { user: null, message: wrongCredentials };
  } catch (err) {
    throw new Error(unexpected);
  }
}
