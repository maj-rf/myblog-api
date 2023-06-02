import mongoose from 'mongoose';
import * as logger from '../utils/logger';
import { MONGO_URI } from './config';

export async function connectDB() {
  try {
    const conn = await mongoose.connect(`${MONGO_URI}`);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
}
