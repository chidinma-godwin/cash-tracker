import nextConnect from 'next-connect';
import { getSession } from 'next-auth/react';

// CashTracker Imports
import dbConnect from 'utils/dbConnect';

const auth = nextConnect()
  .use(async (req, res, next) => {
    await dbConnect();
    next();
  })
  .use(async (req, res) => {
    const { user } = await getSession({ req });
    res.send({ user });
  });

export default auth;
