import './App.css';
import Todo from './components/Todo';
import { TodoProvider } from './context/TodoContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
  const { isDarkMode } = useTheme();

  return (
    // 다크모드 수정 : 전체 화면에 테마 클래스 적용
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <TodoProvider>
        <Todo />
      </TodoProvider>
    </div>
  );
}

function App() {
  return (
    // 다크모드 수정 : 전역 테마 상태 제공
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;