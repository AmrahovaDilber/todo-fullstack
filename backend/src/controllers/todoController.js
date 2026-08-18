const todoService = require('../services/todoServices')

const getTodos = async (req, res) => {
    try {
        const todos = await todoService.getTodos()
        res.status(200).json({
            status: "success",
            data: todos
        })

    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err.message
        })
    }
}

const createTodo = async (req, res) => {
    try {
        const todo = await todoService.createTodo(req.body)
        res.status(201).json({
            status: "success",
            data: todo
        })
    } catch (err) {
        res.status(404).json({
            status: "fail"
        })
    }
}

const updateTodo = async (req, res) => {
    try {
        const updatedTodo = await todoService.updateTodo(req.params.id, req.body)
        res.status(200).json({
            status: "success",
            data: updatedTodo
        })
    } catch (err) {
        console.log(err)
    }
}

const getTodoById = async (req, res) => {
    try {
        const todo = await todoService.getTodoById(req.params.id)
        if (!todo) {
            return res.status(404).json({ status: "fail", message: "Todo not found" })
        }
        res.status(200).json({ status: "success", data: todo })
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message })
    }
}

const deleteTodo = async (req, res) => {
    try {
        await todoService.deleteTodo(req.params.id)
        res.status(204).send()
    } catch (err) {
        console.log(err)
    }
}

module.exports = { getTodos, createTodo, getTodoById, updateTodo, deleteTodo }