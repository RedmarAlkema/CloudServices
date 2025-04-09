require('dotenv').config({ path: './.env' });

const express = require('express')
const routes = require('./routes')
const authRoutes = require('../auth/routes/authRoutes');
const app = express()
const PORT = 3000

app.use(express.json())
app.use('/', routes)

app.listen(PORT, () => {
    console.log('Gateway has started on port ' + PORT)
})