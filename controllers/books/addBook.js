import { bookServices } from '../../services/index.js';
export const addBook = async (req, res) => {
  const book = req.body;
  const user = req.user;

  const bookStatus = req.body.status;

  const books = await bookServices.getUserBooks(user._id);

  const match = books.find(({ title }) => book.title === title);

  if (match) {
    res.status(400).send({ message: `Book '${book.title}' already exists in your library` });
  } else {
    const result = await bookServices.addBook(book);
    user?.books.push(result);

    if (book.readPages > 0 && bookStatus === undefined) {
      result.status = 'read';
    }

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
