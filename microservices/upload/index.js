require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB verbonden met UploadDB'))
  .catch((err) => console.error('MongoDB fout:', err));

app.use('/upload', uploadRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Upload service draait op poort ${process.env.PORT}`);
});