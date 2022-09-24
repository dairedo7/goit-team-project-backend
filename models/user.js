const {Schema, model} = require('mongoose');
const Joi = require('joi');

const userSignUpSchema = Schema({
        password: {
          type: String,
          required: [true, 'Password is required'],
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true,
        },
        token: {
          type: String,
          default: null,
        }
}, {versionKey: false, timestamps: true});

const joiUserSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().required(),
    token: Joi.string()
  })

  const joiLoginSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().required(),
  })

  const User = model('user', userSignUpSchema);

  module.exports = {
    User,
    joiUserSchema,
    joiLoginSchema,
  };