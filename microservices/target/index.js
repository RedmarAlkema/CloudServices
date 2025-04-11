require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const targetRoutes = require("./routes/targetRoute");

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use("/api/targets", targetRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Target service draait op poort ${PORT}`));
  })
  .catch((err) => console.log(err));