import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import path from 'path';
import { errors } from 'celebrate';

import uploadConfig from '@config/upload';
import routes from './routes';
import handleErrors from './middlewares/handleErrors';
import rateLimiter from './middlewares/rateLimiter';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(
  '/assets',
  express.static(path.join(__dirname, '..', '..', '..', '..', 'assets')),
);
app.use(rateLimiter);
app.use(routes);
app.use(errors());
app.use(handleErrors);

app.listen(3333);
