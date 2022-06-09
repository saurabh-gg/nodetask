const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db");
  })
  .catch((e) => {
    console.log("no connection to db", e);
  });
