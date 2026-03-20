import { useTodo } from '../context/TodoContext';

const TodoItem = ({ todo }: { todo: any }) => {
  const { toggleTodo, deleteTodo } = useTodo();

  return (
    <li className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-slate-700/30 last:border-none">
      <span className={`flex-1 text-sm transition-all ${todo.isDone 
        ? 'line-through text-gray-400 dark:text-slate-500' 
        : 'text-slate-800 dark:text-slate-100'}`}>
        {todo.text}
      </span>

      <div className="flex gap-2 ml-4">
        <button 
          onClick={() => toggleTodo(todo.id)}
          className="text-[11px] px-3 py-1.5 rounded-lg font-bold transition-colors
                     bg-gray-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 hover:dark:bg-slate-600"
        >
          {todo.isDone ? '취소' : '완료'}
        </button>
        <button 
          onClick={() => deleteTodo(todo.id)}
          className="text-[11px] px-3 py-1.5 bg-red-50 text-red-500 rounded-lg font-bold 
                     hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
        >
          삭제
        </button>
      </div>
    </li>
  );
};

export default TodoItem;