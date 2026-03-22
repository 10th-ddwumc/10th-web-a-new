import type { TTodo } from '../types/todo';
import { createContext, useContext, useState, type PropsWithChildren } from 'react';

interface ITodoContext {
    todos: TTodo[];
    doneTodos: TTodo[];
    addTodo: (text: string) => void;
    completeTodo: (todo: TTodo) => void;
    deleteTodo: (todo: TTodo) => void;

}

export const TodoContext = createContext<ITodoContext | undefined>(undefined);

export const TodoProvider = ({ children }: PropsWithChildren) => {

    const [todos, setTodos] = useState<TTodo[]>([]);
    const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);

    const addTodo = (text: string): void => {
        const newTodo: TTodo = {
            id: Date.now(),
            text
        };
        setTodos((prevTodos): TTodo[] => [...prevTodos, newTodo]);
    }
    const completeTodo = (todo: TTodo): void => {
        setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
        setDoneTodos((prevDoneTodos) => [...prevDoneTodos, todo]);
    };

    const deleteTodo = (todo: TTodo): void => {
        setDoneTodos((prevDoneTodo): TTodo[] => prevDoneTodo.filter((t): boolean => t.id !== todo.id));
    };
    return (
        <TodoContext.Provider value={{ todos, doneTodos, addTodo, completeTodo, deleteTodo }}>
            {children}
        </TodoContext.Provider>
    );
};
export const useTodo = () => {
    const context = useContext(TodoContext);
    //컨텍스트가 없는 경우
    if (!context) {
        throw new Error('useTodo를 사용하기 위해서는 무조건 TodoProvider로 감싸져야 합니다.');
    }
    //컨텍스트가 있는 경우
    return context;
};

export default TodoContext;