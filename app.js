const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
require('dotenv').config()

const app = express()

// middleware
app.use(express.static('public'))
app.use(express.json())

// view engine
app.set('view engine', 'ejs')

// database connection
const dbURI = process.env.DB_PATH
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err))

// routes
app.get('/', (req, res) => res.render('home'))
app.get('/items', (req, res) => res.render('items'))

app.use(authRoutes)