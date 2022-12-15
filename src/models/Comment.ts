import { TComment } from '../types/comment';
import mongoose from 'mongoose';
import { DateTime } from 'luxon';

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', require: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

CommentSchema.virtual('formatted_createdAt').get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED);
});

const Comment = mongoose.model<TComment>('Comment', CommentSchema);
export default Comment;
