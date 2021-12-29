/* eslint-disable func-names */
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { hash, compare } from 'bcrypt';

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    min: [4, 'Username should have a minimum of 3 characters'],
    max: [31, 'Usernme should have a maximum 0f 30 characters'],
  },
  email: {
    type: String,
    required: [true, 'Your email is required'],
    unique: true,
  },
  password: {
    type: String,
    min: [7, 'Password should have a minimum of 6 characters'],
    select: false,
  },
  clientsEmail: [String],
  deletedEmails: [String],
  pendingInvitations: [String],
  pendingRequests: [String],
});

UserSchema.plugin(uniqueValidator, {
  message: 'A user with this email already exists',
});

UserSchema.pre('save', async function () {
  if (this.password && this.isModified(this.password)) {
    this.password = await hash(this.password, 12);
  }
});

UserSchema.methods.passwordMatch = async function (password) {
  const same = await compare(password, this.password);
  return same;
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
