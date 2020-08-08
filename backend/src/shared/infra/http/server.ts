import 'reflect-metadata';

import express from 'express';
import 'express-async-errors';
import cors from 'cors';

import routes from './routes';
import uploadConfig from '@config/upload';
import handleErrors from './middlewares/handleErrors';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);
app.use(handleErrors);

app.listen(3333);
