const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/welcome', authMiddleware, (req, res) => {
    res.status(200).json({
        message: "welcome to home page",
        user: req.userInfo,
    })
})

module.exports = router