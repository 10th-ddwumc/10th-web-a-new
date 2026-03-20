import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import { useTodo } from './context/TodoContext';

function App() {
  const { todos } = useTodo();

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>YONG TODO</h1>
      <TodoInput />
      <TodoList title="할 일" todos={todos.filter(t => !t.isDone)} />
      <TodoList title="완료" todos={todos.filter(t => t.isDone)} />
    </div>
  );
}

export default App;