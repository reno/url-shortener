import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { makeUrlShortenerController, makeUrlRedirectorController } from './factories/controllers.factory';

export const routes = Router();

const createLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: { error: "Too many URLs created from this IP, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

routes.post('/shorten', createLimiter, (req: Request, res: Response) => {
  return makeUrlShortenerController().handle(req, res);
});

routes.get('/:hash', (req: Request, res: Response) => {
  return makeUrlRedirectorController().handle(req, res);
});
