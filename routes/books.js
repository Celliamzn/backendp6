const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const booksCtrl = require('../controllers/books')

router.post('/', auth, multer, booksCtrl.createBook)
router.put('/:id', auth, multer, booksCtrl.modifyingBook)
router.delete('/:id', auth, booksCtrl.deleteBook)
router.get('/:id', booksCtrl.getOneBook)
router.get('/', booksCtrl.getAllBooks)

module.exports = router
