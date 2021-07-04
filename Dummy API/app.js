require("dotenv").config();
const express = require("express");
const db = require("./config/mongo");
const app = express();
const logger = require("morgan");
const { apiKeyPerMin } = require("./utils/apiKeyCron");




app.use((req, res, next) => {
  // const origin = req.headers.origin;
  // console.log(origin);
  // if (allowedOrigins.indexOf(origin) > -1) res.setHeader('Access-Control-Allow-Origin', origin);
  // else if   (process.env.NODE_ENV !== 'production') 
  res.setHeader('Access-Control-Allow-Origin', '*');
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
apiKeyPerMin.start();




//Challange api
const socialMediaRoutes = require("./routes/social-media");
const stockRoutes = require("./routes/stocks");
const institutionsRoutes = require("./routes/institutions");

app.use("/social-media/", socialMediaRoutes);
app.use("/", stockRoutes);
app.use("/", institutionsRoutes);

app.get("/", (req, res) => {
  res.send("<strong>Wireframe | API</strong>");
});
app.get("/docs", (req, res) => {
  res.redirect("https://documenter.getpostman.com/view/12085785/TzRVf6oa");
});
app.get("/:invalid", (req, res) => {
  res.status(404).send({
    msg: "Error 404",
    endpoint: `wireframe.iecsemanipal.com/api/${req.params.invalid}`,
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log("Server started on port " + port);
});