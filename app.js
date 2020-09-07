import express from 'express';
import mongoose from 'mongoose';
import { MONGO_URI } from './keys';

const app = express();
const PORT = 5000;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log('connected to mongoose');
})

mongoose.connection.on('error', (err) => {
  console.log('error on connection ', err);
})

const middleWare = (req, res, next) => {
  console.log('Middleware Used');
  next();
}

app.use(middleWare)

app.get('/', (req, res) => {
  res.send('Hello World');
})

app.listen(PORT, () => {
  console.log('server is running on ', PORT);
})
