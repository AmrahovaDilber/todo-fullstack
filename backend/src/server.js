const app = require('./app')
const mongoose = require('mongoose')
require('dotenv').config()

const port = process.env.PORT || 3000
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todo'

mongoose
    .connect(mongoUri)
    .then(() => {
        console.log('MongoDB connected')
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    })
    .catch((error) => {
        console.error('MongoDB connection failed:', error.message)
        process.exit(1)
    })
