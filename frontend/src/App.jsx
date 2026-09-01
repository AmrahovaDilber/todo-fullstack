import { useEffect, useState } from 'react'
import AddTodo from './components/AddTodo/AddTodo'
import TodoFilter from './components/TodoFilter/TodoFilter'
import TodoList from './components/TodoList/TodoList'
import './App.css'

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3000/auth'
const TODO_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/todos'

function App() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', passwordConfirm: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('token')))

  const isRegistering = mode === 'register'

  function switchMode(nextMode) {
    setMode(nextMode)
    setError('')
    setMessage('')
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (isRegistering && form.password !== form.passwordConfirm) {
      setError('Passwords do not match.')
      return
    }

    if (!AUTH_API_URL) {
      setError('Authentication is not configured. Add VITE_AUTH_API_URL to connect this form.')
      return
    }

    const endpoint = `${AUTH_API_URL.replace(/\/$/, '')}/${isRegistering ? 'signup' : 'login'}`
    const payload = isRegistering ? form : { email: form.email, password: form.password }

    try {
      setIsSubmitting(true)
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (!response.ok) throw new Error(result.message || 'Something went wrong. Please try again.')

      const token = result.data?.token || result.token
      if (!token) throw new Error('The server did not return an authentication token.')
      localStorage.setItem('token', token)
      setIsAuthenticated(true)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthenticated) {
    return <TodoPage onLogout={() => { localStorage.removeItem('token'); setIsAuthenticated(false) }} />
  }

  return (
    <main className="auth-page">
      <section className="auth-intro" aria-labelledby="app-name">
        <div className="auth-intro__content">
          <span className="auth-intro__mark" aria-hidden="true">T</span>
          <p className="auth-intro__eyebrow">A calmer way to plan</p>
          <h1 id="app-name">Todolist</h1>
          <p className="auth-intro__copy">Keep the important things close, and the busywork out of your head.</p>
        </div>
        <p className="auth-intro__footer">One task at a time.</p>
      </section>

      <section className="auth-panel" aria-labelledby="auth-heading">
        <div className="auth-card">
          <div className="auth-tabs" role="tablist" aria-label="Authentication options">
            <button className={`auth-tabs__button ${!isRegistering ? 'auth-tabs__button--active' : ''}`} type="button" role="tab" aria-selected={!isRegistering} onClick={() => switchMode('login')}>Sign in</button>
            <button className={`auth-tabs__button ${isRegistering ? 'auth-tabs__button--active' : ''}`} type="button" role="tab" aria-selected={isRegistering} onClick={() => switchMode('register')}>Create account</button>
          </div>

          <header className="auth-card__header">
            <p className="auth-card__kicker">{isRegistering ? 'Start fresh' : 'Good to see you'}</p>
            <h2 id="auth-heading">{isRegistering ? 'Create your account' : 'Sign in to your list'}</h2>
            <p>{isRegistering ? 'A few details and you are ready to go.' : 'Pick up exactly where you left off.'}</p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {isRegistering && <label className="auth-form__field" htmlFor="name"><span>Your name</span><input id="name" name="name" type="text" autoComplete="name" value={form.name} onChange={handleChange} required placeholder="Alex Morgan" /></label>}
            <label className="auth-form__field" htmlFor="email"><span>Email address</span><input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" /></label>
            <label className="auth-form__field" htmlFor="password"><span>Password</span><input id="password" name="password" type="password" autoComplete={isRegistering ? 'new-password' : 'current-password'} value={form.password} onChange={handleChange} required minLength="8" placeholder="At least 8 characters" /></label>
            {isRegistering && <label className="auth-form__field" htmlFor="passwordConfirm"><span>Confirm password</span><input id="passwordConfirm" name="passwordConfirm" type="password" autoComplete="new-password" value={form.passwordConfirm} onChange={handleChange} required minLength="8" placeholder="Repeat your password" /></label>}

            {error && <p className="auth-form__notice auth-form__notice--error" role="alert">{error}</p>}
            {message && <p className="auth-form__notice auth-form__notice--success" role="status">{message}</p>}
            <button className="auth-form__submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait...' : isRegistering ? 'Create account' : 'Sign in'}</button>
          </form>

          <p className="auth-card__switch">{isRegistering ? 'Already have an account?' : 'New here?'} <button type="button" onClick={() => switchMode(isRegistering ? 'login' : 'register')}>{isRegistering ? 'Sign in' : 'Create an account'}</button></p>
        </div>
      </section>
    </main>
  )
}

function TodoPage({ onLogout }) {
  const [todos, setTodos] = useState([])
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  async function request(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        ...options.headers,
      },
    })
    const result = response.status === 204 ? null : await response.json()
    if (!response.ok) throw new Error(result?.message || 'Request failed')
    return result?.data ?? result
  }

  useEffect(() => {
    request(TODO_API_URL).then(setTodos).catch((requestError) => setError(requestError.message))
  }, [])

  async function onAdd(title) {
    try {
      const todo = await request(TODO_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) })
      setTodos((currentTodos) => [...currentTodos, todo])
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function onToggle(id, completed) {
    try {
      const todo = await request(`${TODO_API_URL}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ completed }) })
      setTodos((currentTodos) => currentTodos.map((item) => item._id === id ? todo : item))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function onEdit(id, title) {
    try {
      const todo = await request(`${TODO_API_URL}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) })
      setTodos((currentTodos) => currentTodos.map((item) => item._id === id ? todo : item))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function onDelete(id) {
    try {
      await request(`${TODO_API_URL}/${id}`, { method: 'DELETE' })
      setTodos((currentTodos) => currentTodos.filter((item) => item._id !== id))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const visibleTodos = todos.filter((todo) => filter === 'all' || (filter === 'active' ? !todo.completed : todo.completed))
  const activeCount = todos.filter((todo) => !todo.completed).length

  return (
    <main className="app">
      <header className="app__header">
        <h1 className="app__title">todos</h1>
        <button className="app__logout-btn" type="button" onClick={onLogout}>Sign out</button>
      </header>
      <section className="app__main">
        <AddTodo onAdd={onAdd} />
        <TodoList todos={visibleTodos} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
        {error && <p className="app__error" role="alert">{error}</p>}
        {todos.length > 0 && (
          <footer className="app__footer">
            <span className="app__count">{activeCount} item{activeCount !== 1 ? 's' : ''} left</span>
            <TodoFilter currentFilter={filter} onFilterChange={setFilter} />
            <button className="app__clear-btn" type="button" onClick={() => todos.filter((todo) => todo.completed).forEach((todo) => onDelete(todo._id))} disabled={activeCount === todos.length}>Clear completed</button>
          </footer>
        )}
      </section>
    </main>
  )
}

export default App
