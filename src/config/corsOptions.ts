import cors from 'cors';
import { PORT } from './config';

const allowedOrigins = [
  `https://localhost:${PORT}`,
  'https://muni-api.onrender.com/',
];

export const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};
