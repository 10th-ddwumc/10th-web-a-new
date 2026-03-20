import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import { useTodo } from './context/TodoContext';
import { useTheme } from './context/ThemeContext';

function App() {
  const { todos } = useTodo();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen transition-colors duration-500 py-10 px-4 bg-gray-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      <div className="max-w-md mx-auto px-6 py-8 shadow-2xl rounded-3xl transition-colors duration-500 bg-white dark:bg-slate-800 border border-transparent dark:border-slate-700">
        
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black tracking-tighter uppercase">Yong Todo</h1>
          <button 
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-sm bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-yellow-400 dark:hover:bg-slate-600"
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </header>

        <main className="flex flex-col gap-8 text-left">
          <TodoInput />
          <div className="flex flex-col gap-8 text-left">
            <TodoList title="할 일" todos={todos.filter(t => !t.isDone)} />
            <div className="border-t border-gray-100 dark:border-slate-700/50" />
            <TodoList title="완료" todos={todos.filter(t => t.isDone)} />
          </div>
        </main>

        <footer className="mt-12 text-center text-[10px] font-medium opacity-40">
          &copy; 2026 YUYOMI. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default App;