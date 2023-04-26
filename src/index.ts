import app from './app';
import http from 'http';
import * as logger from './utils/logger';
const server = http.createServer(app);
import { PORT } from './config/config';

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
