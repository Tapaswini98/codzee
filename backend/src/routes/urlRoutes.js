import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import * as urlController from '../controllers/urlController.js';

const shortenRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'too many urls shortened, please try again later' },
});

export const urlRoutes = Router();

urlRoutes.post('/api/urls', shortenRateLimit, urlController.create);
urlRoutes.get('/api/urls', urlController.list);
urlRoutes.get('/:code', urlController.redirect);
