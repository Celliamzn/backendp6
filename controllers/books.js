const fs = require('fs')
const Book = require('../models/book')
const average = (array) => {
  let sum = 0
  for (let nb of array) {
    sum += nb
  }
  return (sum / array.length).toFixed(1)
}

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book)
  delete bookObject._id
  delete bookObject._userId
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    averageRating: bookObject.ratings[0].grade,
  })
  console.log(book)
  book
    .save()
    .then(() => res.status(201).json({ message: ' Livre enregistré !' }))
    .catch((error) => res.status(400).json({ error }))
}

exports.modifyingBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body }
  delete bookObject._userId
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res
          .status(403)
          .json({ message: "Vous n'êtes pas autorisé à modifier ce livre" })
      } else {
        const filename = book.imageUrl.split('/images/')[1]
        req.file &&
          fs.unlink(`images/${filename}`, (err) => {
            if (err) console.log(err)
          })
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: 'Livre modifié !' }))
          .catch((error) => res.status(400).json({ error }))
      }
    })
    .catch((error) => {
      res.status(404).json({ error })
    })
}

exports.deleteBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
    .catch((error) => res.status(400).json({ error }))
}

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }))
}

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }))
}

exports.ratingBook = async (req, res, next) => {
  if (0 <= req.body.rating <= 5) {
    const ratingObject = { ...req.body, grade: req.body.rating }
    delete ratingObject._id
    const book = await Book.findOne({ _id: req.params.id })
    console.log(book)
    Book.findOne({ _id: req.params.id })
      .then((book) => {
        const bookRatings = book.ratings
        const userIdArray = bookRatings.map((rating) => rating.userId)
        if (userIdArray.includes(req.auth.userId)) {
          res.status(403).json({ message: 'Vous avez déjà noté le livre' })
        } else {
          console.log('book')
          bookRatings.push(ratingObject)
          console.log('book1')
          const grades = bookRatings.map((rating) => rating.grade)
          console.log('book2')
          const averageGrades = average(grades)
          console.log('book4')
          book.averageRating = averageGrades
          console.log('book')
          Book.updateOne(
            { _id: req.params.id },
            {
              ratings: bookRatings,
              averageRating: averageGrades,
              _id: req.params.id,
            }
          )
            .then(() => {
              console.log('book')
              res.status(201).json()
            })
            .catch((error) => {
              console.log('book')
              res.status(400).json({ error })
            })
          res.status(200).json(book)
        }
      })
      .catch((error) => {
        res.status(404).json({ error })
      })
  } else {
    res.status(400).json({ message: 'La note doit être comprise entre 1 et 5' })
  }
}

exports.getBestRating = (req, res, next) => {
  // Utiliser Mongoose pour trouver les livres, les trier par note et limiter le résultat à 3
  Book.find()
    .sort({ averageRating: -1 }) // Tri par la note décroissante (rating), en supposant que le champ s'appelle 'rating'
    .limit(3) // Limite le résultat à 3 livres
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }))
}
