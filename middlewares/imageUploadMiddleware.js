const multer = require('multer')
const path = require('path')

// set multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.filename + "-" + Date.now() + path.extname(file.originalname))
    }
})

// file filter func - check file type
const checkFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new Error('not an image'))
    }
}

// multer middleware
module.exports = multer({
    storage: storage,
    fileFilter: checkFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5mb
    }
})