import dotenv from 'dotenv';
dotenv.config();

// create a .env file and create variables for MONGODB_URI and PORT

export const MONGO_URI = process.env.MONGODB_URI;
export const PORT = process.env.PORT;
