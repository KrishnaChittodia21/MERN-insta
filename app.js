import express from 'express';
import mongoose from 'mongoose';

const app = express();
const PORT = 5000;

mongoose.connect();

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
