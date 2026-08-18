import { useEffect, useState } from 'react'
import TodoList from './components/TodoList/TodoList'
import AddTodo from './components/AddTodo/AddTodo'
import TodoFilter from './components/TodoFilter/TodoFilter'
import './App.css'

const API_URL = 'http://localhost:3000/todos'

function App() {
  const [todos, setTodos] = useState([])
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  async function request(url, options) {
    const response = await fetch(url, options)
    const result = response.status === 204 ? null : await response.json()
    if (!response.ok) throw new Error(result?.message || 'Request failed')
    return result?.data ?? result
  }

  useEffect(() => {
    request(API_URL)
      .then(setTodos)
      .catch((err) => setError(err.message))
  }, [])

  async function onAdd(title) {
    try {
      const todo = await request(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      setTodos((currentTodos) => [...currentTodos, todo])
    } catch (err) {
      setError(err.message)
    }
  }

  async function onToggle(id, completed) {
    try {
      const todo = await request(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      })
      setTodos((currentTodos) => currentTodos.map((item) => item._id === id ? todo : item))
    } catch (err) {
      setError(err.message)
    }
  }

  async function onEdit(id, title) {
    try {
      const todo = await request(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      setTodos((currentTodos) => currentTodos.map((item) => item._id === id ? todo : item))
    } catch (err) {
      setError(err.message)
    }
  }

  async function onDelete(id) {
    try {
      await request(`${API_URL}/${id}`, { method: 'DELETE' })
      setTodos((currentTodos) => currentTodos.filter((item) => item._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const visibleTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })
  const activeCount = todos.filter((todo) => !todo.completed).length

  async function clearCompleted() {
    const completedTodos = todos.filter((todo) => todo.completed)
    await Promise.all(completedTodos.map((todo) => onDelete(todo._id)))
  }


  return (
    <>
      <div className="app">
        <header className="app__header">
          <h1 className="app__title">todos</h1>
        </header>

        <main className="app__main">
          <AddTodo onAdd={onAdd} />

          <TodoList
            todos={visibleTodos}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />

          {error && <p className="app__error">{error}</p>}

          {todos.length > 0 && (
            <footer className="app__footer">
              <span className="app__count">
                {activeCount} item{activeCount !== 1 ? 's' : ''} left
              </span>
              <TodoFilter currentFilter={filter} onFilterChange={setFilter} />
              <button
                className="app__clear-btn"
                onClick={clearCompleted}
                disabled={activeCount === todos.length}
              >
                Clear completed
              </button>
            </footer>
          )}
        </main>
      </div>
    </>
  )
}

export default App
