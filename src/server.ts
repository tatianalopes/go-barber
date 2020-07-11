import 'reflect-metadata';

import express from 'express';
import 'express-async-errors';

import routes from './routes';
import uploadConfig from './config/upload';
import handleErrors from './middlewares/handleErrors';

import './database';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);
app.use(handleErrors);

app.listen(3333);
