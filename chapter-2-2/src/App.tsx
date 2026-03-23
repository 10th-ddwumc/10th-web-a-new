import ContextPage from './useContext/ContextPage';
import { ThemeProvider } from './useContext/context/ThemeProvider';
import './App.css';

export default function App() {
  return (
    <ThemeProvider>
      <ContextPage />
    </ThemeProvider>
  );
}