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
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    app.listen(PORT, () => {
      console.log(`listening on port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
