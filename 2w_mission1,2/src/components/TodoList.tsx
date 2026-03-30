import type { TTodo } from '../types/todo';
import { useTheme } from '../context/ThemeContext';

interface TodoListProps {
    title: string;
    todos?: TTodo[];
    buttonLabel: string;
    buttonColor: string;
    onClick: (todo: TTodo) => void;
}

export const TodoList = ({ title, todos, buttonLabel, buttonColor, onClick }: TodoListProps) => {
    const { isDarkMode } = useTheme();

    return (
        <div className='render-container__section'>
            <h2 className={`render-container__title ${isDarkMode ? 'render-container__title--dark' : ''}`}>
                {title}
            </h2>

            <ul id="todo-list" className='render-container__list'>
                {todos?.map((todo) => (
                    <li
                        key={todo.id}
                        className={`render-container__item ${isDarkMode ? 'render-container__item--dark' : ''}`}
                    >
                        <span
                            className={`render-container__item-name ${isDarkMode ? 'render-container__item-name--dark' : ''}`}
                        >
                            {todo.text}
                        </span>

                        <button
                            onClick={() => onClick(todo)}
                            style={{ backgroundColor: buttonColor }}
                            className='render-container__item-button'
                        >
                            {buttonLabel}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;