const { Book, User } = require('../../models');

const addBook = async (req, res) => {
  const book = req.body;
  const user = req.user;

  const bookStatus = req.body.status;

  const result = await Book.create({ ...book });
  user?.books.push(result);

  const { books } = await User.findOne({ _id: user._id }).populate('books');
  console.log(books);
  if (book.readPages > 0 && bookStatus === undefined) {
    result.status = 'read';
  }

  const match = books.find(({ title }) => book.title === title);

  if (match) {
    res.status(400).send({ message: `Book (${book.title}) already exists in your library` });
  } else {
    await user?.save();
    res.status(201).json({
      data: {
        result: {
          _id: result._id,
          title: result.title,
          author: result.author,
          year: result.year,
          totalPages: result.totalPages,
          readPages: result.readPages,
          resume: result.resume,
          rating: result.rating,
          user: result.user,
          status: result.status,
        },
      },
    });
  }
};

module.exports = addBook;
