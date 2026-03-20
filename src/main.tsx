import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { TodoProvider } from './context/TodoContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <TodoProvider>
        <App />
      </TodoProvider>
    </ThemeProvider>
  </React.StrictMode>
);