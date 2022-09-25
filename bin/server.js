const mongoose = require("mongoose");
const app = require("../app");

const { DB_HOST, PORT = 3010 } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() =>
    app.listen(PORT, () => console.log("Database connection successful"))
  )
  .catch((error) => {
    console.log(`The server is not running. Error message: ${error.message}`);
    process.exit(1);
  });
