import TodoItem from './TodoItem';

const TodoList = ({ title, todos }: { title: string; todos: any[] }) => (
  <section>
    <h2>{title}</h2>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </ul>
  </section>
);
export default TodoList;