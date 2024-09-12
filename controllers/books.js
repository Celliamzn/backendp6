const Book = require('../models/book')

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.fields.book)
  delete bookObject.userId

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: 'todo', // TODO
    averageRating: bookObject.ratings[0].grade,
  })
  book
    .save()
    .then(() => res.status(201).json({ message: ' Livre enregistré !' }))
    .catch((error) => res.status(400).json({ error }))
}

exports.modifyingBook = (req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.fields, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre modifié !' }))
    .catch((error) => res.status(400).json({ error }))
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
