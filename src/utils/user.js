import mongoose from 'mongoose';

// CashTracker Imports
import User from 'models/User';
import Transaction from 'models/Transaction';
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
    const currentUser = await User.findOne({ email }).select('+password');
    if (currentUser && (await currentUser.passwordMatch(password))) {
      delete currentUser.password;
      return { user: currentUser };
    }
    return { user: null, message: wrongCredentials };
  } catch (err) {
    throw new Error(unexpected);
  }
}

export async function getClientDetails(clientsEmail, pendingRequests) {
  const allConnections = [...clientsEmail, ...pendingRequests];
  const users = await User.find({ email: { $in: allConnections } });
  const unRegisteredUsers = pendingRequests
    .filter(requests => !users.map(({ email }) => email).includes(requests))
    .map(userEmail => ({
      id: '',
      username: '',
      email: userEmail,
      avatar: '',
    }));
  const filteredDetails = users.map(({ id, username, email, avatar }) => ({
    id,
    username,
    email,
    avatar,
  }));
  return [...filteredDetails, ...unRegisteredUsers];
}

export async function updateUser(req) {
  const { clientEmail, action, currency, ...rest } = req.body;
  const { clientsDetails } = req.body;
  let updatedUser;
  let modifiedClientsDetails;
  const session = await mongoose.startSession();
  session.startTransaction();
  const mongooseOptions = { session, new: true };
  let client;
  try {
    // If the client is already a registered user, make some changes to their account
    if (clientEmail) {
      client = await User.findOne({ email: clientEmail });
      if (client) {
        const {
          id: clientId,
          pendingInvitations,
          pendingRequests,
          clientsEmail,
          deletedEmails,
        } = client;
        const hasPendingInvitation = pendingInvitations.find(
          invitation => invitation === req.user.email
        );
        const hasPendingRequest = pendingRequests.find(
          request => request === req.user.email
        );
        const hasClient = clientsEmail.find(email => email === req.user.email);
        const hasDeleted = deletedEmails.find(
          email => email === req.user.email
        );

        if (hasPendingInvitation && action === 'delete') {
          await User.findByIdAndUpdate(
            clientId,
            {
              pendingInvitations: pendingInvitations.filter(
                invitation => invitation !== req.user.email
              ),
            },
            mongooseOptions
          ).orFail();
        } else if (hasPendingRequest && action === 'add') {
          await User.findByIdAndUpdate(
            clientId,
            {
              pendingRequests: pendingRequests.filter(
                request => request !== req.user.email
              ),
              clientsEmail: [...clientsEmail, req.user.email],
            },
            mongooseOptions
          ).orFail();
        } else if (hasClient && action === 'delete' && !hasDeleted) {
          await User.findByIdAndUpdate(
            clientId,
            {
              deletedEmails: [...deletedEmails, req.user.email],
            },
            mongooseOptions
          ).orFail();
        } else if (hasPendingRequest && action === 'delete' && !hasDeleted) {
          await User.findByIdAndUpdate(
            clientId,
            {
              deletedEmails: [...deletedEmails, req.user.email],
            },
            mongooseOptions
          ).orFail();
        } else if (
          !hasPendingInvitation &&
          !hasPendingRequest &&
          !hasClient &&
          action === 'add'
        ) {
          await User.findByIdAndUpdate(
            clientId,
            {
              pendingInvitations: [...pendingInvitations, req.user.email],
            },
            mongooseOptions
          ).orFail();
        }
      }

      // Make changes to user account
      const isPendingInvitation = req.user.pendingInvitations.find(
        invitation => invitation === clientEmail
      );
      const isPendingRequest = req.user.pendingRequests.find(
        request => request === clientEmail
      );

      const isClient = req.user.clientsEmail.find(
        email => email === clientEmail
      );

      if (isPendingRequest && action === 'delete') {
        updatedUser = await User.findByIdAndUpdate(
          req.user._id,
          {
            pendingRequests: req.user.pendingRequests.filter(
              request => request !== clientEmail
            ),
          },
          mongooseOptions
        ).orFail();
      } else if (isPendingRequest && action === 'add') {
        return { modified: false };
      } else if (isPendingInvitation && action === 'add') {
        const { id, username, email, avatar } = client;
        updatedUser = await User.findByIdAndUpdate(
          req.user._id,
          {
            pendingInvitations: req.user.pendingInvitations.filter(
              invitation => invitation !== clientEmail
            ),
            clientsEmail: [...req.user.clientsEmail, clientEmail],
          },
          mongooseOptions
        ).orFail();
        modifiedClientsDetails = [
          ...clientsDetails,
          { id, username, email, avatar },
        ];
      } else if (isPendingInvitation && action === 'delete') {
        const filteredInvitations = req.user.pendingInvitations.filter(
          invitation => invitation !== clientEmail
        );
        updatedUser = await User.findByIdAndUpdate(
          req.user._id,
          {
            pendingInvitations: filteredInvitations,
          },
          mongooseOptions
        ).orFail();
      } else if (isClient && action === 'add') {
        return { modified: false };
      } else if (isClient && action === 'delete') {
        updatedUser = await User.findByIdAndUpdate(
          req.user._id,
          {
            clientsEmail: req.user.clientsEmail.filter(
              email => email !== clientEmail
            ),
          },
          mongooseOptions
        ).orFail();
        modifiedClientsDetails = clientsDetails.filter(
          detail => detail.email !== clientEmail
        );
      } else if (!isPendingRequest && action === 'add') {
        updatedUser = await User.findByIdAndUpdate(
          req.user._id,
          {
            pendingRequests: [...req.user.pendingRequests, clientEmail],
          },
          mongooseOptions
        ).orFail();
        await Transaction.create(
          [
            {
              participants: [req.user.email, clientEmail],
              currency,
              editors: [req.user.email, clientEmail],
              statusChangers: [req.user.email, clientEmail],
              lastEditorCanChangeStatus: false,
              creator: req.user.email,
            },
          ],
          { session }
        );
        if (client) {
          const { id, username, email, avatar } = client;
          modifiedClientsDetails = [
            ...clientsDetails,
            { id, username, email, avatar },
          ];
        } else {
          modifiedClientsDetails = [
            ...clientsDetails,
            {
              id: '',
              username: '',
              clientEmail,
              avatar: '',
            },
          ];
        }
      }
    }

    // If the user is updating other of their profile but not adding new client
    if (rest) {
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        rest,
        mongooseOptions
      ).orFail();
    }

    if (updatedUser) {
      await session.commitTransaction();
      session.endSession();
      return {
        updatedUser: {
          ...updatedUser.toJSON(),
          clientsDetails: modifiedClientsDetails || clientsDetails,
        },
        modified: true,
      };
    }
    return { error: true };
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    session.endSession();
    return { error: true };
  }
}
