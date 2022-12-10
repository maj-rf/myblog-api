import {
  loginUser,
  getCurrentUser,
  registerUser,
} from './../controllers/authController';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'welcome to api' });
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/me', getCurrentUser);

module.exports = router;
