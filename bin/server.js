const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
const app = require("../app");

const { DB_HOST, PORT = 3000 } = process.env;

mongoose
  .connect(DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT);
    app.use("/link", (req, res) => {
      res.sendFile(path.join(__dirname, "../../public/link.html"));
    });
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
