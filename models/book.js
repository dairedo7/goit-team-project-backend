const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleSchemaValidationErrors } = require('../helpers');

const statuses = ['already read', 'reading now', 'going to read'];

const yearRegex = /(1[0-9]{3}|20[0-1][0-9]|202[0-2])/;

const bookSchema = Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
    },
    year: {
      type: Number,
      match: yearRegex,
      required: [true, 'Year is required'],
    },
    pages: {
      type: Number,
      min: 3,
      required: [true, 'Pages is required'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    resume: {
      type: String,
    },
    status: {
      type: String,
      enum: statuses,
      required: [true, 'Status is required'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

const joiBookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  year: Joi.number().pattern(yearRegex).required(),
  pages: Joi.number().min(3).required(),
  rating: Joi.number().min(1).max(5),
  resume: Joi.string(),
  status: Joi.string()
    .valueOf(...statuses)
    .required(),
});

bookSchema.post('save', handleSchemaValidationErrors);

const Book = model('book', bookSchema);

module.exports = {
  Book,
  joiBookSchema,
};
