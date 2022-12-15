import { TPost } from './../types/post';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    published: { type: Boolean, default: false },
    comments: { type: [Schema.Types.ObjectId], default: [], ref: 'Comment' },
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

const Post = mongoose.model<TPost>('Post', PostSchema);
export default Post;
