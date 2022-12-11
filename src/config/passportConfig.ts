import passportJWT from 'passport-jwt';
import LocalStrategy from 'passport-local';
import User from '../models/User';

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
import bcrypt from 'bcryptjs';

export const passportInit = (passport: any) => {
  passport.use(
    new LocalStrategy.Strategy((username, password, done) => {
      User.findOne({ username }, (err: Error, user: any) => {
        if (err) return done(err);
        if (!user) return done(null, false, { message: 'Incorrect Username' });
        bcrypt.compare(password, user.password, (err: Error, res) => {
          if (res) {
            // passwords match! log user in
            return done(null, user);
          } else {
            // passwords do not match!
            return done(null, false, { message: 'Incorrect password' });
          }
        });
      });
    })
  );

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwtPayload, callback) => {
        try {
          const user = await User.findById(jwtPayload.id);
          return callback(null, user!);
        } catch (err) {
          return callback(err);
        }
      }
    )
  );
};
