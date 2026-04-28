// ✅ main.tsx 수정
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvide } from './context/AuthContext' // ✅ 추가

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvide>
      <App />
    </AuthProvide> 
  </StrictMode>,
)