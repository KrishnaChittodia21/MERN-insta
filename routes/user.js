import { Router } from 'express';
import { model } from 'mongoose';
import requireLogin from '../middleware/requireLogin';

const router = Router();
const Post = model('Post');
const User = model('User');

router.get('/user/:id', requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select('-password')
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate('postedBy', '_id name')
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => res.status(404).json({ error: 'User not found' }));
});

export default router;
