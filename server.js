require('dotenv').config()
const express = require('express')
const connectDB = require('./database/db')
const authRouter = require('./routes/authRoute')
const homeRouter = require('./routes/homeRoute')
const adminRouter = require('./routes/adminRoute')
const uploadImageRouter = require('./routes/imageRoutes')

const app = express()

const PORT = process.env.PORT || 3000

// db
connectDB()

// middleware
app.use(express.json())

// router
app.use('/api/auth', authRouter)
app.use('/api/home', homeRouter)
app.use('/api/admin', adminRouter)
app.use('/api/image', uploadImageRouter)

app.listen(PORT, () => {
    console.log(`server started on ${PORT}`)
})