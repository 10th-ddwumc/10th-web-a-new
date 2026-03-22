import { Children, createContext,useState, type PropsWithChildren, type JSX } from "react";
import type { TTodo } from "../types/todo";

interface TodoContext{

    todos: TTodo[];
    doneTodos:TTodo[];
    addTodo: (text:string) => void;
    completeTodo:(todo:TTodo) => void;
    deleteTodo:(todo:TTodo) => void;

}

const TodoContext = createContext<TodoContext | undefined>
(undefined);

export const TodoProvider =({children}: PropsWithChildren): JSX.Element => {
    const [todos,setTodos] = useState<TTodo[]>([]);
    const [doneTodos,setDoneTodos] = useState<TTodo[]>([]);

    const addTodo=(text:string): void => {
        const newTodo: TTodo={id:Date.now(),text};
        setTodos((prevTodos): TTodo[] => [...prevTodos,newTodo]);
    };

    const completeTodo = (todo:TTodo): void => {
        setTodos((preveTodos):TTodo[] => preveTodos.filter((t):boolean=> t.id !==todo.id));
        setDoneTodos((prevDoneTodos):TTodo[] => [...prevDoneTodos,todo]);
    };

    const deleteTodo = (todo:TTodo): void =>{
        setDoneTodos((prevDoneTodo): TTodo[]=> 
        prevDoneTodo.filter((t):boolean => t.id !==todo.id)); 
    };

    return (
        <TodoContext.Provider
        value={{todos,doneTodos,addTodo,completeTodo, deleteTodo}}>
        {children}
        </TodoContext.Provider>
    )
};