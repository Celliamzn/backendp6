const fs = require('fs')
const Book = require('../models/book')

//Fonction pour la moyenne des notes du livre
const average = (array) => {
  let sum = 0
  for (let nb of array) {
    sum += nb
  }
  return (sum / array.length).toFixed(1) // Retourne la moyenne arrondie à une décimale
}

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book)
  if (bookObject.ratings[0].grade !== 0) {
    // Suppression de l'ID fourni par le client (pour éviter les conflits)
    delete bookObject._id
    // Suppression de l'userId pour sécuriser la création
    delete bookObject._userId
    const book = new Book({
      ...bookObject,
      // Récupération de l'userid de la personne qui créé
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${
        req.file.filename
      }`,
      averageRating: bookObject.ratings[0].grade,
    })
    // Enregistrement du livre dans la base de données
    book
      .save()
      .then(() => res.status(201).json({ message: ' Livre enregistré !' }))
      .catch((error) => res.status(400).json({ error }))
  } else {
    res.status(400).json('Vous devez noter le livre')
  }
}

exports.modifyingBook = (req, res, next) => {
  // Vérifie si une nouvelle image a été fournie
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body }
  // Suppression de l'userId pour éviter la réassignation
  delete bookObject._userId
  // Récupération du livre que l'on modifie
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Vérification que l'userId coonecté correspond bien au créateur du livre
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: '403: unauthorized request »' })
      } else {
        const filename = book.imageUrl.split('/images/')[1]
        req.file &&
          //Si une image est fournie : suppresion de l'ancienne image (Green Code)
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
  // Récupération du livre que l'on supprime
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Vérification que l'userId coonecté correspond bien au créateur du livre
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'unauthorized' })
      } else {
        //Suppresion de l'image du server (Green Code)
        const filename = book.imageUrl.split('/images/'[1])
        fs.unlink(`images/${filename}`, () => {
          // Suppression du livre de la base de données
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'objet supprimé' })
            })
            .catch((error) => res.status(401).json({ error }))
        })
      }
    })
    .catch((error) => res.status(500).json({ error }))
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
  // La note ajoutée doit se situer entre 0 et 5
  if (0 <= req.body.rating <= 5) {
    const ratingObject = { ...req.body, grade: req.body.rating }
    delete ratingObject._id
    const book = await Book.findOne({ _id: req.params.id })
    // Récupération du livre auquel on rajoute une note
    Book.findOne({ _id: req.params.id })
      .then((book) => {
        // Récupération des notes du livre
        const bookRatings = book.ratings
        const userIdArray = bookRatings.map((rating) => rating.userId)
        // Vérifiation si l'user n'a pas déjà noté le livre
        if (userIdArray.includes(req.auth.userId)) {
          res.status(403).json({ message: 'Vous avez déjà noté le livre' })
        } else {
          //Ajout de la note
          bookRatings.push(ratingObject)
          const grades = bookRatings.map((rating) => rating.grade)
          // Création de la moyenne du livre
          const averageGrades = average(grades)
          book.averageRating = averageGrades
          // Mise à jour du livre dans la base de données
          Book.updateOne(
            { _id: req.params.id },
            {
              ratings: bookRatings,
              averageRating: averageGrades,
              _id: req.params.id,
            }
          )
            .then(() => {
              res.status(201).json(book)
            })
            .catch((error) => {
              res.status(400).json({ error })
            })
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
  Book.find()
    .sort({ averageRating: -1 }) // Tri par la note décroissante
    .limit(3) // Limite le résultat à 3 livres
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }))
}
