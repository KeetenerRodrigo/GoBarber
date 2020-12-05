import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';

import '@shared/infra/database';
import '@shared/container/index'

import upload from '@config/upload';
import routes from '@shared/infra/http/routes';
import AppError from '@shared/errors/AppError';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(upload.directory));
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message
    })
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })

});


app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('🚀 Server started on port 3333!');
});
