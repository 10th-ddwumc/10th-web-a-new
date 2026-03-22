import React, { useState, type FormEvent } from 'react'
import { useTodo } from '../context/TodoContext';

interface TodoFormProps {
    input: string;
    setInput: (input: string) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const TodoForm = () => {
    const [input, setInput] = useState<string>('');
    const { addTodo } = useTodo();

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const text = input.trim();

        if (text) {
            addTodo(text);
            setInput('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className='todo-container__form'>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className='todo-container__input'
                type="text"
                placeholder='할 일 입력'
                required />
            <button type="submit" className='todo-container__button'>추가</button>
        </form>
    )
}

export default TodoForm;