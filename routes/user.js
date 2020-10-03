/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
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

router.put('/follow', requireLogin, (req, res) => {
  User.findByIdAndUpdate(req.body.followId, {
    $push: { followers: req.user._id },
  }, { new: true }, (err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    }
    User.findByIdAndUpdate(req.user._id, {
      $push: { following: req.body.followId },
    }, { new: true }).select('-password')
      .then((result1) => {
        res.json(result1);
      })
      .catch((err1) => res.status(422).json({ error: err1 }));
  });
});

router.put('/unfollow', requireLogin, (req, res) => {
  User.findByIdAndUpdate(req.body.unfollowId, {
    $pull: { followers: req.user._id },
  }, { new: true }, (err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    }
    User.findByIdAndUpdate(req.user._id, {
      $push: { following: req.body.unfollowId },
    }, { new: true }).select('-password')
      .then((result1) => {
        res.json(result1);
      })
      .catch((err1) => res.status(422).json({ error: err1 }));
  });
});

router.put('/updateprofilepic', requireLogin, (req, res) => {
  User.findByIdAndUpdate(req.user._id, { $set: { pic: req.body.pic } }, { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: 'pic cannot be updated' });
      }
      res.json(result);
    });
});

export default router;
