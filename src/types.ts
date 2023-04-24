import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { Document } from 'mongoose';
export interface IComment extends Document {
  content: string;
  user: IUser['_id'];
}

export interface IBlog extends Document {
  user: IUser['_id'];
  title: string;
  content: string;
  published: boolean;
  tags: string[];
  comments: Array<IComment['_id']>;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  blog: Array<IBlog['id']>;
}

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}
