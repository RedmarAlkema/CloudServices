const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log('Auth module gestart op poort 5000'));
  })
  .catch(err => console.log(err));
