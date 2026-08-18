const Todo = require('../models/TodoModel');

const getTodos = async () => {
    return Todo.find()
}
const createTodo = async (body) => {
    return Todo.create(body)
}
const getTodoById = async (id) => {
    return Todo.findById(id)
}
const updateTodo = async (id, body) => {
    return Todo.findByIdAndUpdate(id, body, { new: true, runValidators: true })
}
const deleteTodo = async (id) => {
    return Todo.findByIdAndDelete(id)
}

module.exports = { getTodos, createTodo, getTodoById, updateTodo, deleteTodo }