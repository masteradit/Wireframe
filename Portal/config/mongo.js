const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;

async function connectMongo() {
  mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("DB CONNECTED");
    })
    .catch(console.log("DB NOT CONNECTED"));
}
module.exports = {
  connectMongo,
};
