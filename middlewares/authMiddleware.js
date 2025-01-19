const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
        const bearer = req.headers['authorization']
        const authToken = bearer?.split(' ')[1];

        // token exists
        if (!authToken) return res.status(401).json({
            success: false,
            message: 'no token'
        })

        try {
            const decodedTokenInfo = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
            req.userInfo = decodedTokenInfo
            console.log('test userinfo', decodedTokenInfo)
            next()
        } catch(error) {
            res.status(500).json({
                message: error,
                success: false
            })
        }
    }

module.exports = authMiddleware