const { User, joiUserSchema, joiLoginSchema } = require('./user');
const { Book, joiBookSchema, joiBookUpdateSchema } = require('./book');
const { Planning, joiPlanningSchema } = require('./planning');

module.exports = {
  User,
  Book,
  Planning,
  joiUserSchema,
  joiLoginSchema,
  joiBookSchema,
  joiBookUpdateSchema,
  joiPlanningSchema,
};
