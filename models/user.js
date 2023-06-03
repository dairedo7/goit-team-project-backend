const { Schema, SchemaTypes, model } = require('mongoose');
const Joi = require('joi');

const emailRegexp = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;

const userSignUpSchema = Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, 'Email is required'],
      unique: true,
    },
    token: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: false,
    },
    books: [
      {
        type: SchemaTypes.ObjectId,
        ref: 'book',
      },
    ],
    planning: [
      {
        type: SchemaTypes.ObjectId,
        default: null,
        ref: 'planning',
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

const joiUserSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua'] } })
    .required(),
  name: Joi.string(),
  password: Joi.string().required(),
  repeatPassword: Joi.ref('password'),
  token: Joi.string(),
});

const joiLoginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua'] } })
    .required(),
  password: Joi.string().required(),
});

const User = model('user', userSignUpSchema);

module.exports = {
  User,
  joiUserSchema,
  joiLoginSchema,
};
