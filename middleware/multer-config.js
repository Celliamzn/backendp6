const multer = require('multer')
const SharpMulter = require('sharp-multer')

//Utilisation de sharp-multer pour redimensioner les images (Green Code)
const newFilenameFunction = (og_filename, options) => {
  const name = og_filename.split(' ').join('_')
  const newname = name + Date.now() + '.' + options.fileFormat
  return newname
}

const storage = SharpMulter({
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
  filename: newFilenameFunction,

  imageOptions: {
    fileFormat: 'jpg',
    quality: 80,
    resize: { width: 600, height: 800},
  },
})

module.exports = multer({ storage: storage }).single('image')
