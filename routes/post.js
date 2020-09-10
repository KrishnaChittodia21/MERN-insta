/* eslint-disable no-console */
import { Router } from 'express';
import { model } from 'mongoose';
import requireLogin from '../middleware/requireLogin';

const router = Router();
const Post = model('Post');

router.post('/createpost', requireLogin, (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(422).json({
      error: 'Please add all the fields',
    });
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
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

export default router;