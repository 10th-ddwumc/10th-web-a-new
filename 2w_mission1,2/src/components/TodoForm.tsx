import { useState, type FormEvent } from 'react';
import { useTodo } from '../context/TodoContext';
import { useTheme } from '../context/ThemeContext';

export const TodoForm = () => {
    const [input, setInput] = useState<string>('');
    const { addTodo } = useTodo();
    const { isDarkMode } = useTheme();

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
                className={`todo-container__input ${isDarkMode ? 'todo-container__input--dark' : ''}`}
                type="text"
                placeholder='할 일 입력'
                required
            />
            <button
                type="submit"
                className={`todo-container__button ${isDarkMode ? 'todo-container__button--dark' : ''}`}
            >
                추가
            </button>
        </form>
    );
};

export default TodoForm;