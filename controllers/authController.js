const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

// register controller
const registerUser = async (req, res) => {
    try {
        const {username, email, password, role} = req.body;

        // user already exists with same username or email
        const user = await User.findOne({$or: [{username}, {email}]})
        if (user) 
            return res.status(400).json({
            message: 'user exists',
            success: false
        })

        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(password, salt)

        // create user and save
        const newUser = new User({username, email, password: hashed, role: role || 'user'})
        await newUser.save()

        if (newUser) return res.status(201).json({
            success: true,
            message: 'user created',
            data: newUser
        })
        return res.status(400).json({
            success: false,
            message: 'some error occurred',
            data: undefined,
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error
        })
    }
}

// login controller
const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body;

        // check user
        const user = await User.findOne({username});
        if (!user) return res.status(404).json({
            success: true,
            message: 'user does not exist'
        })

        // check password
        const isPassCorrect = await bcrypt.compare(password, user.password)
        if (!isPassCorrect) return res.status(400).json({
            success: false,
            message: 'invalid credentials'
        })

        // generate token
        const accessToken = jsonwebtoken.sign({
            userId: user._id,
            username: user.username,
            role: user.role
        }, process.env.JWT_SECRET_KEY, {expiresIn: '30m'})
        res.status(200).json({
            success: true,
            message: 'login success',
            data: accessToken
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error
        })
    }
}

const changePassword = async (req, res) => {
    try {
        const userId = req.userInfo.userId;
        
        // check if user exists
        const user = await User.findById(userId)
        if (!user) return res.status(400).json({
            success: false,
            message: 'user does not exist'
        })

        // extract input
        const {oldPassword, newPassword} = req.body;
        if (!oldPassword || !newPassword) return res.status(400).json({
            success: false,
            message: 'invalid input'
        })

        // check if old pass is correct
        const passwordCheck = bcrypt.compare(oldPassword, user.password);
        if (!passwordCheck) return res.status(400).json({
            message: 'invalid old password',
            success: false,
        })

        // encrypt new password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedNewPassword;
        await user.save()

        res.status(200).json({
            success: true,
            message: 'password change success'
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error
        })
    }
}

module.exports = {registerUser, loginUser, changePassword}