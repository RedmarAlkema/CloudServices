require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/scoreRoute");
const startConsumer = require("./services/getTarget");
const startUploadConsumer = require("./services/getUpload");
const startgetDeadline = require("./services/getDeadline");

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());
app.use("/score", routes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Score service draait op poort ${PORT}`));
  })
  .catch((err) => console.log(err));

startConsumer();
startUploadConsumer();
startgetDeadline.start(); 