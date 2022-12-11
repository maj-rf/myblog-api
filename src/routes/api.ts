import { get_currentUser } from './../controllers/userController';
import { auth_login_post } from '../controllers/authController';
import { post_register } from '../controllers/userController';
import express, { Request, Response } from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'welcome to api' });
});

router.post('/register', post_register);
router.post('/login', auth_login_post);
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  get_currentUser
);

module.exports = router;
