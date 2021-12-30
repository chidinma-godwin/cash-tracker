import nextConnect from 'next-connect';
import auth from 'middleware/auth';
import { updateUser } from 'utils/user';
import User from 'models/User';

const handler = nextConnect();

handler
  .use(auth)
  .get(async (req, res) => {
    res.json({
      user: req.user,
    });
  })
  .put(async (req, res) => {
    try {
      const { updatedUser, modified, error } = await updateUser(req);
      if (error) {
        res.status(400).end();
      } else if (!modified) {
        res.status(304).end();
      } else {
        res.json({
          user: updatedUser,
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ ok: false });
    }
  })
  .delete(async (req, res) => {
    const { id } = req.body;
    try {
      await User.findUserByIdAndDelete(id);
      req.logOut();
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ ok: false });
    }
  });

export default handler;
