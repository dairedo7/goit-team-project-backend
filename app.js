import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' assert { type: 'json' };
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import { authRouter } from './routes/api/auth.js';
import { apiUsers } from './routes/api/users.js';
import { apiBooks } from './routes/api/books.js';
dotenv.config();

const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/user', apiUsers);
app.use('/book', apiBooks);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

export { app };
