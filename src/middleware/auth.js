import nextConnect from 'next-connect';
import { getSession } from 'next-auth/react';

// CashTracker Imports
import dbConnect from 'utils/dbConnect';

const auth = nextConnect()
  .use(async (req, res, next) => {
    await dbConnect();
    next();
  })
  .use(async (req, res, next) => {
    const { user } = await getSession({ req });
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).end();
    }
  });

export default auth;
