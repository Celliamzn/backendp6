const dotenv = require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const app = express()

const booksRoutes = require('./routes/books')
const userRoutes = require('./routes/user')

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8mkdq.mongodb.net/`
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

// Middleware pour analyser les requêtes au format JSON
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

// Middleware pour servir les fichiers statiques du dossier 'images'
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/api/books', booksRoutes)
app.use('/api/auth', userRoutes)

module.exports = app
