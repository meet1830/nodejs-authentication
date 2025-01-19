const Image = require('../models/Image')
const {uploadToCloudinary} = require('../helpers/cloudinaryHelper')
const fs = require('fs')
const cloudinary = require('../config/cloudinary')

const uploadImageController = async (req, res) => {
    try {
        // check if input is received
        if (!req.file) return res.status(400).json({
            success: false,
            message: 'invalid input'
        })

        // upload to cloudinary
        const {url, publicId} = await uploadToCloudinary(req.file.path);

        // save to db
        const imageData = new Image({
            url: url,
            publicId: publicId,
            uploadedBy: req.userInfo.userId
        })
        await imageData.save();

        // delete file from local fs
        fs.unlinkSync(req.file.path)

        res.status(201).json({
            success: true,
            message: 'image upload success',
            data: imageData
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error
        })
    }
}

const getAllImages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder !== 'asc' ? -1 : 1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages / limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder;

        const allImages = await Image.find().sort(sortObj).skip(skip).limit(limit)
        if (allImages) res.status(200).json({
            success: true,
            data: {
                currentPage: page,
                totalPages: totalPages,
                totalImages: totalImages,
                data: allImages,
            },
            message: 'images download success'
        })
        else res.status(400).json({
            success: false,
            data: undefined,
            message: 'get all images failed'
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error
        })
    }
}

const deleteImageController = async (req, res) => {
    try {
        const deleteImageId = req.params.id;
        const userId = req.userInfo.userId;

        // image exists
        const image = await Image.findById(deleteImageId);
        if (!image) return res.status(404).json({
            success: false,
            message: 'image does not exist'
        })

        // check uploaded by is same as current user
        if (image.uploadedBy.toString() !== userId) return res.status(401).json({
            message: 'image uploaded by different user',
            success: false
        })

        // delete image from cloudinary
        await cloudinary.uploader.destroy(image.publicId);

        // delete from db
        await Image.findByIdAndDelete(deleteImageId);

        res.status(200).json({
            success: true,
            message: 'image deleted'
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error
        })
    }
}

module.exports = {uploadImageController, getAllImages, deleteImageController}