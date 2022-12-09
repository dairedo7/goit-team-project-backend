import express from 'express';
import { ctrl } from '../../controllers/books/index.js';
import { getCurrentStatus } from '../../controllers/index.js';
import { validation, validateId, auth, wrapper } from '../../middlewares/index.js';
import { joiBookSchema, joiBookUpdateSchema } from '../../models/index.js';

const apiBooks = express.Router();

apiBooks.get('/', auth, wrapper(ctrl.getBooks));

apiBooks.post('/', auth, validation(joiBookSchema), wrapper(ctrl.addBook));

apiBooks.get('/get-status/:status', auth, wrapper(getCurrentStatus));

apiBooks.put('/', auth, validation(joiBookUpdateSchema), wrapper(ctrl.updateBook));

apiBooks.delete('/:bookId', auth, validateId, wrapper(ctrl.removeBook));

export { apiBooks };
