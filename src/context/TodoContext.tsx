import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';

interface Todo {
  id: number;
  text: string;
  isDone: boolean;
}

interface TodoContextType {
  todos: Todo[];
  inputValue: string;
  setInputValue: (val: string) => void;
  addTodo: () => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  // 로컬 스토리지에서 데이터 불러오기
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('yong-todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');

  // 데이터 바뀔 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('yong-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim() === '') return;
    setTodos((prev) => [...prev, { id: Date.now(), text: inputValue, isDone: false }]);
    setInputValue('');
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) => prev.map(t => t.id === id ? { ...t, isDone: !t.isDone } : t));
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter(t => t.id !== id));
  };

  return (
    <TodoContext.Provider value={{ todos, inputValue, setInputValue, addTodo, toggleTodo, deleteTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) throw new Error('TodoProvider 안에서 사용해야 합니다.');
  return context;
};