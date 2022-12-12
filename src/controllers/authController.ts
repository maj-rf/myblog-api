import { TUser } from './../models/User';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

// Handle User login on POST.
export const auth_login_post = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    'local',
    { session: false },
    (err, user: TUser, info) => {
      try {
        if (err || !user) {
          return res.status(400).json({
            message: 'Auth Failed',
            user: user,
          });
        }
        req.login(user, { session: false }, (err: any) => {
          if (err) res.send(err);
          const body = {
            _id: user._id,
            username: user.username,
            email: user.email,
          };

          const token = jwt.sign({ user }, process.env.JWT_SECRET || '', {
            expiresIn: '1d',
          });

          return res.json({
            success: 'true',
            user: body,
            token: token,
          });
        });
      } catch (error) {
        return next(error);
      }
    }
  )(req, res);
};
