import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WelcomeData } from "./components/WelcomeData.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WelcomeData />
    </QueryClientProvider>
  );
}

export default App;
