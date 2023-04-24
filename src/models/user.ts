import mongoose from 'mongoose';
//import uniqueValidator from 'mongoose-unique-validator';
import { IUser } from '../types';

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: { type: String, maxLength: 25, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    blog: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
  },
  { timestamps: true },
);

//UserSchema.plugin(uniqueValidator);

UserSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    // returnedObject.id = returnedObject._id.toString();
    // delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

export const User = mongoose.model<IUser>('User', UserSchema);
