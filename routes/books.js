const express = require('express')

const router = express.Router()

const auth = require('../middleware/auth')

const booksCtrl = require('../controllers/books')

router.post('/', auth, booksCtrl.createBook)
router.put('/:id', auth, booksCtrl.modifyingBook)
router.delete('/:id', auth, booksCtrl.deleteBook)
router.get('/:id', auth, booksCtrl.getOneBook)
router.get('/', auth, booksCtrl.getAllBooks)

module.exports = router
