import mongoose from 'mongoose';
import { DateTime } from 'luxon';
import { TUser } from '../types/user';

const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    username: { type: String, required: true, maxLength: 25, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
  },
  { timestamps: true }
);

UserSchema.virtual('formatted_createdAt').get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED);
});

UserSchema.virtual('url').get(function () {
  return '/profile/' + this._id;
});

const User = mongoose.model<TUser>('User', UserSchema);
export default User;
