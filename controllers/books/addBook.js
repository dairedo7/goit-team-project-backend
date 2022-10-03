const { Book } = require('../../models/book');

const addBook = async (req, res) => {
  // const { _id: user } = req.user;
  // console.log(user);
  const book = req.body;
  const user = req.user;
  // console.log(books);

  const result = await Book.create({ ...book, readPages: 0 });
  console.log(result);
  user?.books.push(result);
  // console.log(books);
  await user?.save();

  res.status(201).json({
    data: {
      result: {
        _id: result._id,
        title: result.title,
        author: result.author,
        year: result.year,
        totalPages: result.numberOfPages,
        readPages: result.readPages,
        resume: result.resume,
        rating: result.rating,
        user: result.user,
      },
    },
  });
};

module.exports = addBook;
