/* eslint-disable no-console */
import express from 'express';
import mongoose from 'mongoose';
import { MONGO_URI } from './keys';
import './models/user';
import './models/post';
import auth from './routes/auth';
import post from './routes/post';
import user from './routes/user';

const app = express();
const PORT = 5000;

app.use(express.json());

app.use(auth);
app.use(post);
app.use(user);

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
