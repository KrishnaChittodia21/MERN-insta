import { Router } from 'express';

const router = Router();

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
  res.status(200).json({
    message: 'Successfully posted',
  });
});

export default router;
