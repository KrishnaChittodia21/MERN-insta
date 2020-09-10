/* eslint-disable no-console */
import { Router } from 'express';
import { model } from 'mongoose';
import bcrypt from 'bcrypt';

const router = Router();
const User = model('User');

router.get('/', (req, res) => {
  res.send('Hello');
});

router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({
      error: 'Please add all the fields',
    });
  }
  User.findOne({ email })
    .then((savedUser) => {
      if (savedUser) {
        res.status(422).json({
          error: `User already exists with email ${email}`,
        });
      }
      bcrypt.hash(password, 16)
        .then((hashedPassword) => {
          const user = new User({
            email,
            name,
            password: hashedPassword,
          });
          user.save()
            .then((user) => {
              res.status(200).json({
                message: 'User saved successfully',
              });
            })
            .catch((err) => {
              console.log(err);
            });
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({
      message: 'Please provide required details',
    });
  }
  User.findOne({ email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({
          message: 'Invalid Email or Password',
        });
      }
      bcrypt.compare(password, savedUser.password)
        .then((matched) => {
          if (matched) {
            res.status(200).json({
              message: 'logged in successfully',
            });
          } else {
            return res.status(422).json({
              message: 'invalid email or password',
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

export default router;
