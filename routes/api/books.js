const express = require('express');

const ctrl = require('../../controllers/books');

const { validation, validateId, auth, wrapper } = require('../../middlewares');
const { joiBookSchema, joiBookUpdateSchema } = require('../../models');

const router = express.Router();

router.get('/', auth, wrapper(ctrl.getBooks));

router.post('/', auth, validation(joiBookSchema), wrapper(ctrl.addBook));

router.put('/:bookId', auth, validation(joiBookUpdateSchema), wrapper(ctrl.updateBook));

router.delete('/:bookId', auth, validateId, wrapper(ctrl.removeBook));

module.exports = router;
