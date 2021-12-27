import dbConnect from 'utils/dbConnect';
import { findUser } from 'utils/user';

export default async function (req, res) {
  try {
    await dbConnect();
    const { email, password } = req.body;
    const { user, message } = await findUser(email, password);
    if (user) {
      res.status(201).send({ user });
    } else {
      res.status(400).send({ message });
    }
  } catch (err) {
    res.status(500).send({ user: null, message: err.message });
  }
}
