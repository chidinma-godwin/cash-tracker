// CashTracker Imports
import User from 'models/User';
import { wrongCredentials, unexpected } from 'constants/errorMessages';

export async function createUser({
  name,
  email,
  password,
  password2,
  usePassword = true,
}) {
  const user = await User.findOne({ email });
  if (user) {
    return new Error('A user with this email already exist');
  }
  if (usePassword && password !== password2) {
    return new Error('Password do not match!');
  }
  const pendingInvitationsUsers = await User.find({ pendingRequests: email });
  const pendingInvitationsEmail =
    pendingInvitationsUsers &&
    pendingInvitationsUsers.map(pendingUser => pendingUser.email);

  const newUser = await User.create({
    username: name,
    email,
    ...(usePassword && { password }),
    ...(pendingInvitationsEmail && {
      pendingInvitations: pendingInvitationsEmail,
    }),
  });
  return { username: newUser.username, email: newUser.email };
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
