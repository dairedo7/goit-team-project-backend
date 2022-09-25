const { Schema, SchemaTypes, model } = require("mongoose");
const { bookStatus } = require("../helpers/constants");

const yearRegex = /(1[0-9]{3}|20[0-1][0-9]|202[0-2])/;

const bookSchema = new Schema(
  {
    title: {
      type: String,
      minLength: 1,
      maxLength: 30,
      required: [true, "Set title for book"],
    },
    author: {
      type: String,
      minLength: 2,
      maxLength: 30,
      required: [true, "Set author for book"],
    },
    year: {
      type: Number,
      match: yearRegex,
      required: [true, "Set year for book"],
    },
    totalPages: {
      type: Number,
      required: [true, "Set total pages for book"],
    },
    readPages: {
      type: Number,
      default: 0,
      required: [true, "Set read pages for book"],
    },
    rating: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
      min: 0,
      max: 5,
      default: 0,
    },
    resume: {
      type: String,
      maxLength: 300,
    },
    status: {
      type: String,
      enum: {
        values: [bookStatus.PLAN, bookStatus.READ, bookStatus.DONE],
        message: "This subscription isn't allowed",
      },
      default: bookStatus.PLAN,
    },
    user: {
      type: SchemaTypes.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

const Book = model("book", bookSchema);

module.exports = bookSchema;

module.exports = Book;
