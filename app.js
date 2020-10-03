/* eslint-disable no-console */
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { MONGO_URI } from './keys';
import './models/user';
import './models/post';
import auth from './routes/auth';
import post from './routes/post';
import user from './routes/user';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(auth);
app.use(post);
app.use(user);

if(process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log('connected to mongoose');
});

mongoose.connection.on('error', (err) => {
  console.log('error on connection ', err);
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log('server is running on ', PORT);
});
