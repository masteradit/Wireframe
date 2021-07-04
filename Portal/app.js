require("dotenv").config();
const express = require("express");
const passport = require("passport");
const cors = require("cors");
const db = require("./config/mongo");
const app = express();
const logger = require("morgan");

app.use(passport.initialize());
require("./config/passport")(passport);

// passport setup
app.use(passport.initialize());
require("./config/passport")(passport);


app.use((req, res, next) => {
  const allowedOrigins = [
    "http://wireframe.iecsemanipal.com/",
    "https://wireframe.iecsemanipal.com/",
  ];
  const origin = req.headers.origin;
  console.log(origin);
  if (allowedOrigins.indexOf(origin) > -1) res.setHeader('Access-Control-Allow-Origin', origin);
  else if (process.env.NODE_ENV !== 'production') res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(logger("dev"));

db.connectMongo();

const userRoute = require("./routes/user");
const teamRoute = require("./routes/team");
const submissionRoute = require("./routes/submission");
const chatRoute = require("./routes/chats");

//routes
app.use("/api/", userRoute);
app.use("/api/", teamRoute);
app.use("/api/", submissionRoute);
app.use("/api/", chatRoute);


app.get("/api", (req, res) => {
  res.send("<strong>Wireframe Portal | API</strong>");
});
app.get("/api/docs", (req, res) => {
  res.redirect("");
});
app.get("/api/:invalid", (req, res) => {
  res.status(404).send({
    msg: "Error 404",
    endpoint: `wireframe.iecsemanipal.com/api/${req.params.invalid}`,
  });
});

module.exports = app;
