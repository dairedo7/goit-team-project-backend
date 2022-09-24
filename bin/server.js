const path = require("path");
const express = require("express");
const { authRouter } = require("../routes/api/auth");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

module.exports = class Server {
  constructor() {
    this.app = express();
  }

  async start() {
    this.initRoutes();
    this.initErrorHandling();
    this.initListening();
  }

  initRoutes() {
    this.app.use("/auth", authRouter);
    this.app.use("/link", (req, res) => {
      res.sendFile(path.join(__dirname, "../public/link.html"));
    });
  }

  initErrorHandling() {
    this.app.use((err, req, res, next) => {
      let status = 500;
      if (err.response) {
        status = err.response.status;
      }
      return res.status(status).send(err.message);
    });
  }

  initListening() {
    this.app.listen((process.env.PORT = 3010), () =>
      console.log("Started listening on port", process.env.PORT)
    );
  }
};
