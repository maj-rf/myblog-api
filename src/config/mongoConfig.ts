import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

export const init = async (app: any) => {
  const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
  const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
  const MONGO_URI =
    process.env.MONGO_URI ||
    `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.hslj4fv.mongodb.net/?retryWrites=true&w=majority`;
  const PORT = process.env.PORT || '3000';
  mongoose.connect(MONGO_URI);
  app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`);
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
};
