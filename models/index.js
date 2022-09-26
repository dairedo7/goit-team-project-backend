const { User, joiUserSchema, joiLoginSchema } = require('./user');
const { Book, joiBookSchema } = require('./book');

module.exports = {
  User,
  Book,
  joiUserSchema,
  joiLoginSchema,
  joiBookSchema,
};
