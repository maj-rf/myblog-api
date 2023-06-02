import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { Document, ObjectId } from 'mongoose';
export interface IComment extends Document {
  content: string;
  user: ObjectId;
  blog: ObjectId;
}

export interface IBlog extends Document {
  user: ObjectId;
  title: string;
  content: string;
  published: boolean;
  tags: string[];
  comments: Array<ObjectId>;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  sessions: string[];
  //blog: Array<ObjectId>;
}

export type PublicUser = Pick<IUser, '_id' | 'username' | 'email'>;

export interface CustomRequest extends Request {
  token: string | JwtPayload;
  user?: IUser;
}

export interface PayloadWithPublicUser extends JwtPayload {
  user: PublicUser;
}
