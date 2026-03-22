import { type FormEvent, useState } from 'react';
import type { TTodo } from '../types/todo';
//import './Todo.css';

const TodoBefore = () => {
    const [todos, setTodos] = useState<TTodo[]>([
    ]);
    const [doneTodos, setDoneTodos] = useState<TTodo[]>([
    ]);
    const [input, setInput] = useState<string>('');

    console.log('Input:', input);
    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        console.log('동작함');
        const text = input.trim();

        if (text) {
            const newTodo: TTodo = {
                id: Date.now(),
                text
            };
            setTodos((prevTodos): TTodo[] => [...prevTodos, newTodo]);
            setInput('');
        }
    };
    const completeTodo = (todo: TTodo): void => {
        setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
        setDoneTodos((prevDoneTodos) => [...prevDoneTodos, todo]);
    };

    const deleteTodo = (todo: TTodo): void => {
        setDoneTodos((prevDoneTodo): TTodo[] => prevDoneTodo.filter((t): boolean => t.id !== todo.id));
    };
    return (
        <div className='todo-container'>
            <h1 className='todo-container__header'>GeGe Todo</h1>
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
            <div className='render-container'>
                <div className='render-container__section'>
                    <h2 className='render-container__title'>할일</h2>
                    <ul id="todo-list" className='render-container__list'>
                        {todos.map((todo) => (
                            <li key={todo.id} className='render-container__item'>
                                <span className='render-container__item-name'>{todo.text}</span>
                                <button onClick={() => completeTodo(todo)} style={{ backgroundColor: '#28a745' }}
                                    className='render-container__item-button'>완료</button>
                            </li>
                        ))}

                    </ul>
                </div>
                <div className='render-container__section'>
                    <h2 className='render-container__title'>완료</h2>
                    <ul id="done-list" className='render-container__list'>
                        {doneTodos.map((todo) => (
                            <li key={todo.id} className='render-container__item'>
                                <span className='render-container__item-name'>{todo.text}</span>
                                <button onClick={() => deleteTodo(todo)} style={{ backgroundColor: '#dc3545' }}
                                    className='render-container__item-button'>삭제</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
};

export default TodoBefore;