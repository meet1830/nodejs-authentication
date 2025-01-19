const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')

const router = express.Router()

router.get('/welcome', authMiddleware, adminMiddleware, (req, res) => {
    res.status(200).json({
        message: 'welcome to login page',
        success: true
    })
})

module.exports = router