/* eslint-disable no-console */
import express from 'express';
import mongoose from 'mongoose';
import keys from './keys';
import './models/user';
import auth from './routes/auth';

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(auth);
mongoose.connect(keys.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

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
