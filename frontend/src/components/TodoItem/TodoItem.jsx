import { useState } from 'react'

function TodoItem({ item, onToggle, onDelete, onEdit }) {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(item.title)

    const submitEdit = () => {
        const title = editValue.trim()
        if (title && title !== item.title) onEdit?.(item._id, title)
        setEditValue(title || item.title)
        setIsEditing(false)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') submitEdit()
        if (event.key === 'Escape') {
            setEditValue(item.title)
            setIsEditing(false)
        }
    }

    return (
        <li className={`todo-item${item.completed ? ' todo-item--completed' : ''}`}>
            <input
                className="todo-item__checkbox"
                type="checkbox"
                checked={item.completed}
                onChange={() => onToggle?.(item._id, !item.completed)}
            />

            {isEditing ? (
                <input
                    className="todo-item__edit-input"
                    type="text"
                    value={editValue}
                    onChange={(event) => setEditValue(event.target.value)}
                    onBlur={submitEdit}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            ) : (
                <span
                    className="todo-item__text"
                    onDoubleClick={() => setIsEditing(true)}
                    title="Double-click to edit"
                >
                    {item.title}
                </span>
            )}

            <button className="todo-item__delete-btn" onClick={() => onDelete?.(item._id)}>
                ✕
            </button>
        </li>
    )
}
export default TodoItem