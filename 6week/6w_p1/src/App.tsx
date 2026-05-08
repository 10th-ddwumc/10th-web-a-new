import './App.css'
import { WelcomeData } from './components/UserDataDisplay'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// React Query 클라이언트 생성
const queryClient = new QueryClient()


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WelcomeData />
    </QueryClientProvider>
  )
}

export default App
