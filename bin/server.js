const mongoose = require("mongoose");
require("dotenv").config();
// const path = require("path");
const app = require("../app");

const { DB_HOST='mongodb+srv://Igor:22garik22@cluster0.rycybld.mongodb.net/contacts_js?retryWrites=true&w=majority' } = process.env;

const port = process.env.PORT || 8000;


// View engine
app.set('view engine', 'ejs')

// Render the starting page
app.get('/', function(req, res)  {
  res.render('views/link')
})


mongoose
  .connect(DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(port)
    app.listen(port || 3000);
    // app.use("/link", (req, res) => {
    //   res.sendFile(path.join(__dirname, "../../public/link.html"));
    // });

    console.log("Database connection successful");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
