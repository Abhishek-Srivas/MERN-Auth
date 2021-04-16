const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const dotenv = require("dotenv");

const authRoute = require("./routes/auth");

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;
app.use((req, res, next) => {
  // To remove CROS (cross-resource-origin-platform) problem
  res.setHeader("Access-Control-Allow-Origin", "*"); // to allow all client we use *
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS,GET,POST,PUT,PATCH,DELETE"
  ); //these are the allowed methods
  res.setHeader("Access-Control-Allow-Headers", "*"); // allowed headers (Auth for extra data related to authoriaztiom)
  next();
});

app.use(bodyParser.json());

app.use(authRoute);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  res.send({
    error: {
      status: err.statusCode || 500,
      message: err,
    },
  });
});


mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(PORT);
    console.log("server started");
  })
  .catch((err) => {
    console.log(err);
  });
