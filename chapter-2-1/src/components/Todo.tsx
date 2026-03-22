import { useContext, useState, type FormEvent} from "react"
import type {TTodo } from "../types/todo";
import TodoList from "./TodoList";
import TodoForm from "./TodoForm";
import { useTodo } from "../context/TodoContext";


const Todo = () => {

    const {todos,completeTodo,addTodo,deleteTodo,doneTodos} =useTodo();
    

    return (
    <div className="todo-container">
        <h1 className="todo-container__header">DUDU TODO</h1>
        <TodoForm />
        <div className="render-container">
    <TodoList
    title='할 일'
    todos={todos}
    buttonLabel='완료'
    buttonColor='#28a745'
    onClick={completeTodo}
    />

    <TodoList
    title='완료'
    todos={doneTodos}
    buttonLabel='삭제'
    onClick={deleteTodo}
    buttonColor='#dc3545'
    />

        </div>
    </div>
    );
};
export default Todo;