import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || '3003';

// Use test DB if running tests
export const MONGO_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGO_URI
    : process.env.MONGO_URI;

// for JWTs
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
