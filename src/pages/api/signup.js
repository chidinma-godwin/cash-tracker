import { createUser } from 'utils/user';
import dbConnect from 'utils/dbConnect';

export default async function (req, res) {
  try {
    await dbConnect();
    await createUser(req.body);
    res.status(201).send({ ok: true });
  } catch (err) {
    res.status(500).send({ ok: false, message: err.message });
  }
}
