import mongoose from 'mongoose';
import { IUser } from '../types/types';

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: { type: String, maxLength: 25, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
  },
  { timestamps: true },
);

// delete private credentials and change _id to id
UserSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

export const User = mongoose.model<IUser>('User', UserSchema);
