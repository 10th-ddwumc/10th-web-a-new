import { useTodo } from '../context/TodoContext';

const TodoItem = ({ todo }: { todo: any }) => {
  const { toggleTodo, deleteTodo } = useTodo();
  return (
    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
      <span style={{ textDecoration: todo.isDone ? 'line-through' : 'none' }}>{todo.text}</span>
      <div>
        <button onClick={() => toggleTodo(todo.id)}>{todo.isDone ? '취소' : '완료'}</button>
        <button onClick={() => deleteTodo(todo.id)}>삭제</button>
      </div>
    </li>
  );
};
export default TodoItem;