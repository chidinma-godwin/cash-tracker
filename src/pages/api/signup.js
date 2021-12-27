import { createUser } from 'utils/user';
import dbConnect from 'utils/dbConnect';

export default async function (req, res) {
  try {
    await dbConnect();
    const { ok, errMsg } = await createUser(req.body);
    if (ok) {
      res.status(201).send({ ok: true });
    } else {
      res.status(400).send({ ok: false, errMsg });
    }
  } catch (err) {
    res.status(500).send({ ok: false, message: err.message });
  }
}
