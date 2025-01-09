const path = require('path')
const multer = require('multer')
const SharpMulter = require('sharp-multer')

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only images are allowed!'), false)
  }
}

const newFilenameFunction = (originalName, options) => {
  const baseName = path.parse(originalName).name
  const safeBaseName = baseName.replace(/[^a-z0-9_-]/gi, '_')
  const timestamp = Date.now()
  return `${safeBaseName}_${timestamp}.${options.fileFormat}`
}

const storage = SharpMulter({
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
  filename: newFilenameFunction,
  imageOptions: {
    fileFormat: 'webp',
    quality: 80,
    resize: {
      width: 463,
      height: 595,
      fit: 'inside', 
    },
  },
})

module.exports = multer({ storage: storage, fileFilter: fileFilter }).single('image')
