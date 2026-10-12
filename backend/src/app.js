import cors from 'cors';
import express from 'express';

import { urlRoutes } from './routes/urlRoutes.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(urlRoutes);
