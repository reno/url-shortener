import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { routes } from './routes';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());

  const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 requests per `window`
    message: { error: "Too many requests from this IP, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use(apiLimiter);
  app.use(express.json());

  app.use(routes);

  return app;
}
