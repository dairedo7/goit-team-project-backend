const Joi = require('joi');
const { Schema, SchemaTypes, model } = require('mongoose');
// const { INPROCESS, FINISHEDBOOK, FINISHEDTRAINING } = require('../../');
// const { PLAN } = require('../helpers/constants');

const planningSchema = new Schema(
  {
    startDate: String,
    endDate: String,
    duration: Number,
    books: [{ type: SchemaTypes.ObjectId, ref: 'book' }],
    booksToRead: [{ type: SchemaTypes.ObjectId, ref: 'book' }],
    pagesPerDay: Number,
    results: [{ date: String, pagesCount: Number }],
    user: [{ type: SchemaTypes.ObjectId, ref: 'user' }],
    totalPages: Number,
    totalReadPages: {
      type: Number,
      default: 0,
    },
    rest: {
      type: Number,
      default: null,
    },
    // status: {
    //   type: String,
    //   inprocess: INPROCESS,
    //   finishedbook: FINISHEDBOOK,
    //   finishedtraining: FINISHEDTRAINING,
    // },
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
