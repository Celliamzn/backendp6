const multer = require('multer')
const SharpMulter = require('sharp-multer')

const newFilenameFunction = (og_filename, options) => {
  const name = og_filename.split(' ').join('_')
  const newname =name + Date.now() + '.' + options.fileFormat
  return newname;
};

const storage = SharpMulter ({
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
    filename: newFilenameFunction,

  imageOptions: {
    fileFormat: 'jpg',
    quality: 80,
    resize: { width: 500, height: 500 },
  },


})

module.exports = multer({ storage: storage }).single('image')
