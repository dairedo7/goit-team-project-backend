const mongoose = require('mongoose');
require('dotenv').config();
// const path = require("path");
const app = require('./app');

const { DB_HOST } = process.env;

const port = 3030;

// View engine
app.set('view engine', 'ejs');

mongoose
  .connect(DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(port);
    app.listen(port || 3000); // Render the starting page
    app.get('/', function (req, res) {
      res.send('The API has been deployed');
      // res.render('views/link');
    });

    // app.use("/link", (req, res) => {
    //   res.sendFile(path.join(__dirname, "../../public/link.html"));
    // });

    console.log('Database connection successful');
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
