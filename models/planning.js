const Joi = require('joi');
const { Schema, SchemaTypes, model } = require('mongoose');

const planningSchema = new Schema(
  {
    startDate: String,
    endDate: String,
    duration: Number,
    books: [{ type: SchemaTypes.ObjectId, ref: 'book' }],
    booksToRead: Array,
    pagesPerDay: Number,
    results: [{ time: String, pagesCount: Number }],
    user: [{ type: SchemaTypes.ObjectId, ref: 'user' }],
  },
  { versionKey: false, timestamps: true }
);

const joiPlanningSchema = Joi.object({
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
  duration: Joi.number(),
  pagesPerDay: Joi.number(),
  results: Joi.array().items(
    Joi.object({
      date: Joi.string().required(),
      pagesCount: Joi.number().required(),
    })
  ),
});

const Planning = model('planning', planningSchema);

module.exports = {
  Planning,
  joiPlanningSchema,
};
