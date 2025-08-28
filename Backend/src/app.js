const express = require('express')
const authRoutes = require('./routes/auth.routes')
const app = express()
const cookie = require('cookie-parser');
const adminRoutes = require('./routes/admin.routes')


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookie());

app.use('/api/auth', authRoutes)
app.use("/api/admin", adminRoutes);
module.exports = app

