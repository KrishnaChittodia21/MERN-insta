import { Schema, model } from 'mongoose';

const { ObjectId } = Schema.Types;
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  expireToken: Date,
  pic: {
    type: String,
    default: 'https://res.cloudinary.com/kannu21/image/upload/v1601738527/noimage_q2i5as.jpg',
  },
  followers: [{
    type: ObjectId,
    ref: 'User',
  }],
  following: [{
    type: ObjectId,
    ref: 'User',
  }],
});

model('User', userSchema);
