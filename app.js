const express = require('express')
const mongoose = require('mongoose')
const app = express()

const booksRoutes = require('./routes/books')
const userRoutes = require('./routes/user')

const { modifyingBook } = require('./controllers/books')
mongoose
  .connect(
    'mongodb+srv://kayath:MSNoDd8CZLVUVmPq@cluster0.8mkdq.mongodb.net/',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  next()
})

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/books', booksRoutes)
app.use('/api/auth', userRoutes)

module.exports = app
