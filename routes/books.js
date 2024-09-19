const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

// Création du controller de book
const booksCtrl = require('../controllers/books')

/**Création des 7 routes liées aux livres : 
 * Créer un livre
 * Lire les 3 livres les + notés
 * Màj d'un livre
 * Supprimer un livre
 * Lire un livre
 * Lire tous les livres
 * Ajout d'une note
 * **/

router.post('/', auth, multer, booksCtrl.createBook)
router.get('/bestrating', booksCtrl.getBestRating)
router.put('/:id', auth, multer, booksCtrl.modifyingBook)
router.delete('/:id', auth, booksCtrl.deleteBook)
router.get('/:id', booksCtrl.getOneBook)
router.get('/', booksCtrl.getAllBooks)
router.post('/:id/rating', auth, booksCtrl.ratingBook)

module.exports = router
