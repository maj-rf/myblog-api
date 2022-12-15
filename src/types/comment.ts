import { Document, ObjectId } from 'mongoose';

export interface TComment extends Document {
  //_id: ObjectId;
  author: ObjectId;
  post: ObjectId;
  content: string;
}
