const { User, joiUserSchema, joiLoginSchema } = require("./user");
const Book = require("./book");

module.exports = {
  User,
  Book,
  joiUserSchema,
  joiLoginSchema,
};
