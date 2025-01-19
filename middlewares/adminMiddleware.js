const adminRoleMiddleware = (req, res, next) => {
    const userInfo = req.userInfo
    if (userInfo.role !== 'admin') return res.status(500).json({
        success: false,
        message: 'admin rights required'
    })
    next()
}

module.exports = adminRoleMiddleware