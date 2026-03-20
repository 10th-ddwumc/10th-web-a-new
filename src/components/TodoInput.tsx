import { useTodo } from '../context/TodoContext';

const TodoInput = () => {
  const { inputValue, setInputValue, addTodo } = useTodo();
  return (
    <div className="flex gap-2">
      <input 
        type="text" 
        value={inputValue} 
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addTodo()}
        placeholder="할 일을 입력하세요"
        className="flex-1 p-3 border border-gray-200 rounded-xl bg-transparent transition-all 
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500
                   dark:border-slate-700"
      />
      <button 
        onClick={addTodo}
        className="px-5 py-3 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity"
      >
        추가
      </button>
    </div>
  );
};
export default TodoInput;