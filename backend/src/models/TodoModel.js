const mongoose = require('mongoose')
const TodoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },

}, { collection: 'tasks' })

const Todo = mongoose.model('Todo', TodoSchema)
module.exports = Todo