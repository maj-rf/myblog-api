import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../config/config';
import { PublicUser } from '../types/types';

export const signAccessToken = (payload: PublicUser, expiresIn: string) =>
  jwt.sign(payload, `${ACCESS_TOKEN_SECRET}`, { expiresIn });

export const signRefreshToken = (payload: PublicUser, expiresIn: string) =>
  jwt.sign(payload, `${REFRESH_TOKEN_SECRET}`, { expiresIn });

// export const verifyRefreshToken = async (token) =>
// try{
//   const decoded = jwt.verify(token, `${REFRESH_TOKEN_SECRET}`);
// } catch(error){

// }
