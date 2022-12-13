import mongoose, { Types, Document } from 'mongoose';
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

export interface TComment extends Document {
  _id: Types.ObjectId;
  author: Types.ObjectId;
  post: Types.ObjectId;
  content: string;
}

// export interface TComment extends InferSchemaType<typeof CommentSchema> {
//   _id: Types.ObjectId;
// }
const Comment = mongoose.model<TComment>('Comment', CommentSchema);
export default Comment;
