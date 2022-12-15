import { Document, ObjectId } from 'mongoose';

export interface TUser extends Document {
  //_id: ObjectId;
  username: string;
  email: string;
  password: string;
}
