const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const apiAuth = require('./routes/api/auth');
const apiUsers = require('./routes/api/users');
const apiBooks = require('./routes/api/books');

const app = express();

// app.use((req, res, next) => {
//   if (req.protocol === 'http') {
//     return res.redirect(301, `https://${req.headers.host}${req.url}`);
//   }

//   next();
// });

app.get('/', (req, res) => {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, './public/index.html'));
});

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/auth', apiAuth);
app.use('/user', apiUsers);
app.use('/book', apiBooks);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
