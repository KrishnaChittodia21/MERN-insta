/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import { Router } from 'express';
import { model } from 'mongoose';
import requireLogin from '../middleware/requireLogin';

const router = Router();
const Post = model('Post');

router.get('/allpost', (req, res) => {
  Post.find()
    .populate('postedBy', '_id name')
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/createpost', requireLogin, (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    return res.status(422).json({
      error: 'Please add all the fields',
    });
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo: pic,
    postedBy: req.user,
  });
  post.save()
    .then((result) => {
      res.json({
        post: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/mypost', requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate('PostedBy', '_id name')
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((err) => {
      console.log(err);
    });
});

export default router;
