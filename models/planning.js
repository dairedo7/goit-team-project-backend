const Joi = require("joi");
const { Schema, SchemaTypes, model } = require("mongoose");

const planningSchema = new Schema(
  {
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    duration: Number,
    books: [
      {
        type: SchemaTypes.ObjectId,
        ref: "book",
      },
    ],
    pagesReadPerDay: Number,
    totalPages: Number,
    readPages: {
      type: Number,
      default: 0,
    },
    results: [
      {
        date: {
          type: String,
          required: [true, "Date is required"],
        },
        pagesCount: {
          type: Number,
          required: [true, "Number of pages is required"],
        },
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

const joiPlanningSchema = Joi.object({
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
  duration: Joi.number(),
  pagesReadPerDay: Joi.number(),
  totalPages: Joi.number(),
  readPages: Joi.number(),
  results: Joi.array().items(
    Joi.object({
      date: Joi.string().required(),
      pagesCount: Joi.number().required(),
    })
  ),
});

const Planning = model("planning", planningSchema);

module.exports = {
  Planning,
  joiPlanningSchema,
};
