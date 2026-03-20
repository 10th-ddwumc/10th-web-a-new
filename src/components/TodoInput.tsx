import { useTodo } from '../context/TodoContext';

const TodoInput = () => {
  const { inputValue, setInputValue, addTodo } = useTodo();
  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
      <input 
        type="text" 
        value={inputValue} 
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addTodo()}
        placeholder="할 일 입력"
      />
      <button onClick={addTodo}>할 일 추가</button>
    </div>
  );
};
export default TodoInput;