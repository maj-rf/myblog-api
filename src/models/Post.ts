import mongoose, { Types, Document } from 'mongoose';
import Comment from './Comment';

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    author: { type: Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    published: { type: Boolean, default: false },
    comments: { type: [Types.ObjectId], default: [], ref: 'Comment' },
  },
  { timestamps: true }
);

PostSchema.virtual('url').get(function () {
  return `/posts/${this._id}`;
});

PostSchema.virtual('date_diff').get(function () {
  const rtf = new Intl.RelativeTimeFormat('en', {
    localeMatcher: 'best fit',
    numeric: 'auto',
    style: 'long',
  });
  const diff = Math.floor(
    (this.createdAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff >= -1 && diff < 0
    ? rtf.format(0, 'day')
    : rtf.format(diff, 'days');
});

export interface TPost extends Document {
  _id: Types.ObjectId;
  author: Types.ObjectId;
  title: string;
  content: string;
  published: boolean;
  comments: Types.ObjectId[];
}

// export interface TPost extends InferSchemaType<typeof PostSchema> {
//   _id: Types.ObjectId;
// }

const Post = mongoose.model<TPost>('Post', PostSchema);
export default Post;
