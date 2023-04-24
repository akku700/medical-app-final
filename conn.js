const mongoose = require("mongoose");

const db = "mongodb://localhost:27017/medical";

mongoose
  .connect(db)
  .then(() => {
    console.log("database connection established");
  })
  .catch((e) => {
    console.log(e);
  });
