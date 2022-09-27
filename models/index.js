const { User, joiUserSchema, joiLoginSchema } = require("./user");
const { Book, joiBookSchema, joiBookUpdateSchema } = require("./book");

module.exports = {
  User,
  Book,
  joiUserSchema,
  joiLoginSchema,
  joiBookSchema,
  joiBookUpdateSchema,
};
