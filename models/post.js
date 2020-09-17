import { Schema, model } from 'mongoose';

const { ObjectId } = Schema.Types;
const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  postedBy: {
    type: ObjectId,
    ref: 'User',
  },
});

model('Post', postSchema);
