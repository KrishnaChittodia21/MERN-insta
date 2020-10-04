/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import { Router } from 'express';
import { model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import sendgridtransport from 'nodemailer-sendgrid-transport';
import { JWT_SECRET, MAILER_KEY } from '../keys';
import requireLogin from '../middleware/requireLogin';

const router = Router();
const User = model('User');
const transporter = nodemailer.createTransport(sendgridtransport({
  auth: {
    api_key: MAILER_KEY,
  },
}));

router.get('/', (req, res) => {
  res.send('Hello');
});

router.get('/protected', requireLogin, (req, res) => {
  res.send('Hello User');
});

router.post('/signup', (req, res) => {
  const {
    name, email, password, pic,
  } = req.body;
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
            pic,
          });
          user.save()
            .then((userResult) => {
              transporter.sendMail({
                to: userResult.email,
                from: 'krishnachittodia.10@gmail.com',
                subject: 'signup success',
                html: '<h1>Welcome to my creativity</h1>',
              });
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
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            res.json({
              token,
              user: savedUser,
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

router.post('/reset-password', (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res.status(422).json({ error: 'user not found with this email' });
        }
        user.resetToken = token;
        user.expireToken = Date.now() + 3600000;
        user.save()
          .then((result) => {
            transporter.sendMail({
              to: user.email,
              from: 'krishnachittodia.10@gmail.com',
              subject: 'password reset',
              html: `
            <p>You request for a password reset</p>
            <h5>Click on this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
            `,
            });
            res.json({ message: 'check your mail' });
          });
      });
  });
});

router.post('/new-password', (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: 'Try again session expired' });
      }
      bcrypt.hash(newPassword, 16)
        .then((hashedPassword) => {
          user.password = hashedPassword;
          user.resetToken = undefined;
          user.expireToken = undefined;
          user.save()
            .then((savedUser) => {
              res.json({ message: 'password updated success' });
            })
            .catch((err) => {
              console.log(err);
            });
        });
    });
});

export default router;
