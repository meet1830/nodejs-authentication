const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const adminRoleMiddleware = require('../middlewares/adminMiddleware')
const uploadMiddleware = require('../middlewares/imageUploadMiddleware')
const {uploadImageController, getAllImages, deleteImageController} = require('../controllers/imageController')

const router = express.Router()

// upload route
router.post('/upload', authMiddleware, adminRoleMiddleware, uploadMiddleware.single('image'), uploadImageController)

// get all images route
router.get('/get', authMiddleware, getAllImages)

// delete
router.delete('/:id', authMiddleware, adminRoleMiddleware, deleteImageController)

module.exports = router;