const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const targetRoutes = require("./routes/targetRoutes");
const startConsumer = require("./services/readTarget");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3004;

app.use("/read", targetRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("📦 MongoDB verbonden");
    app.listen(PORT, () => {
      console.log(`📡 Read Target Service draait op poort ${PORT}`);
    });
  })
  .catch(err => console.error("❌ Fout bij verbinden met MongoDB:", err)
);

startConsumer();