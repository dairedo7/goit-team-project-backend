const Joi = require('joi');
const { Schema, model, SchemaTypes } = require('mongoose');
const { bookStatus } = require('../helpers/constants');

const bookSchema = new Schema(
  {
    title: {
      type: String,
      minLength: 1,
      maxLength: 60,
      required: [true, 'Set title for book'],
      unique: true,
    },
    author: {
      type: String,
      minLength: 2,
      maxLength: 50,
      required: [true, 'Set author for book'],
    },
    year: {
      type: Number,
      required: [true, 'Set year for book'],
    },
    totalPages: {
      type: Number,
      required: [true, 'Set total pages for book'],
    },
    readPages: {
      type: Number,
      default: 0,
    },
    rating: {
      type: String,
      enum: ['1', '2', '3', '4', '5'],
      default: '1',
    },
    resume: {
      type: String,
      maxLength: 300,
    },
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
    status: {
      type: String,
      enum: {
        values: [bookStatus.PLAN, bookStatus.READ, bookStatus.DONE],
        message: "This subscription isn't allowed",
      },
      default: bookStatus.PLAN,
    },
  },
  { versionKey: false, timestamps: true }
);

const joiBookSchema = Joi.object({
  title: Joi.string().min(1).max(60).required(),
  author: Joi.string().min(2).max(50).required(),
  year: Joi.number().required(),
  totalPages: Joi.number().required(),
  readPages: Joi.number(),
  rating: Joi.string().valueOf(...[0, 1, 2, 3, 4, 5]),
  resume: Joi.string().max(300),
  status: Joi.string().valueOf(...[bookStatus.PLAN, bookStatus.READ, bookStatus.DONE]),
});

const joiBookUpdateSchema = Joi.object({
  rating: Joi.string().valueOf(...[0, 1, 2, 3, 4, 5]),
  resume: Joi.string().max(300),
  bookId: Joi.string().required(),
});

const Book = model('book', bookSchema);

module.exports = {
  joiBookSchema,
  joiBookUpdateSchema,
  Book,
};
