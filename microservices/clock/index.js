require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const targetRoutes = require("./routes/clockRoutes");
const consumeTarget = require("./services/readTarget");
const startDeadlineChecker = require("./services/deadline");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use("/clock", targetRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Clock service draait op poort ${PORT}`));
  })
  .catch((err) => console.log(err));

consumeTarget();
startDeadlineChecker();