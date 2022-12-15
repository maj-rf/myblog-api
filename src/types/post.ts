import { Document, ObjectId } from 'mongoose';

export interface TPost extends Document {
  //_id: ObjectId;
  author: ObjectId;
  title: string;
  content: string;
  published: boolean;
  comments: ObjectId[];
}
