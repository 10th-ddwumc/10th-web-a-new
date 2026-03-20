import TodoItem from './TodoItem';

interface TodoListProps {
  title: string;
  todos: any[];
}

const TodoList = ({ title, todos }: TodoListProps) => {
  return (
    <div className="text-left">
      <h2 className="text-sm font-bold mb-4 text-slate-500 dark:text-slate-300 uppercase tracking-widest">
        {title}
      </h2>
      <ul className="flex flex-col">
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;