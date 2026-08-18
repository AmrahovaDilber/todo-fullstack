import { useState, useEffect } from 'react';
import TodoItem from '../TodoItem/TodoItem';

function TodoList({ todos, onToggle, onDelete, onEdit }) {

    return (
        <div>
            {todos?.map(item =>
                <TodoItem key={item._id} item={item} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit}></TodoItem>
            )}
        </div>
    )
}
export default TodoList