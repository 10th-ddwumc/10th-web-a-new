import ContextPage from './ContextPage';
import { ThemeProvider } from './context/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider>
      <ContextPage />
    </ThemeProvider>
  );
}