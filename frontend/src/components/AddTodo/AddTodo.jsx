import { useState } from 'react';

function AddTodo({ onAdd }) {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const [maxLength] = useState(100);
    const isOverLimit = value.length > maxLength;
    const remaining = maxLength - value.length;
    function validateTitle(title) {
        if (!title.trim()) {
            setError('Please enter a valid todo title.');
            return;
        }
        if (isOverLimit) {
            setError(`Todo title cannot exceed ${maxLength} characters.`);
            return;
        }
        return true
    }
    function handleSubmit(e) {

        e.preventDefault();
        if (!validateTitle(value)) return
        onAdd(value.trim())
        setValue('');
        setError('');
    }
    return (
        <div className="add-todo-wrapper">
            <form className="add-todo" onSubmit={handleSubmit}>
                <input
                    className={`add-todo__input${error ? ' add-todo__input--error' : ''}`}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="What needs to be done?"
                    autoFocus
                />
                <button className="add-todo__btn" type="submit">
                    Add
                </button>
            </form>

            <div className="add-todo__meta">
                {error ? (
                    <span className="add-todo__error">{error}</span>
                ) : (
                    <span className={`add-todo__counter${isOverLimit ? ' add-todo__counter--over' : ''}`}>
                        {remaining} chars left
                    </span>
                )}
            </div>
        </div>
    )
}
export default AddTodo;