import { useState } from 'react'

const FILTERS = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
]

function TodoFilter({ currentFilter, onFilterChange }) {
    const [isOpen, setIsOpen] = useState(true)
    const toggleOpen = () => setIsOpen((open) => !open)

    return (
        <div className="todo-filter">
            <button className="todo-filter__toggle" onClick={toggleOpen}>
                Filter {isOpen ? '▲' : '▼'}
            </button>

            {isOpen && (
                <div className="todo-filter__options">
                    {FILTERS.map(({ value, label }) => (
                        <button
                            key={value}
                            className={`todo-filter__btn${currentFilter === value ? ' todo-filter__btn--active' : ''}`}
                            onClick={() => onFilterChange(value)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TodoFilter
