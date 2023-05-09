import mongoose from 'mongoose';
import { IComment } from '../types/types';
const { Schema } = mongoose;

const CommentSchema = new Schema({
  content: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  blog: { type: Schema.Types.ObjectId, ref: 'Blog' },
});

CommentSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    // returnedObject.id = returnedObject._id.toString();
    // delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
