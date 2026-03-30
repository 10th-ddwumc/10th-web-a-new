import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { useTodo } from '../context/TodoContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggleButton from './ThemeToggleButton';

const Todo = () => {
    const { todos, doneTodos, completeTodo, deleteTodo } = useTodo();
    const { isDarkMode } = useTheme();

    return (
        <div className={`todo-container ${isDarkMode ? 'todo-container--dark' : ''}`}>
            <div className='todo-container__top'>
                <h1 className={`todo-container__header ${isDarkMode ? 'todo-container__header--dark' : ''}`}>
                    GeGe Todo
                </h1>

                <ThemeToggleButton />
            </div>

            <TodoForm />

            <div className='render-container'>
                <TodoList
                    title='할일'
                    todos={todos}
                    buttonLabel='완료'
                    buttonColor='#28a745'
                    onClick={completeTodo}
                />
                <TodoList
                    title='완료'
                    todos={doneTodos}
                    buttonLabel='삭제'
                    buttonColor='#dc3545'
                    onClick={deleteTodo}
                />
            </div>
        </div>
    );
};

export default Todo;