import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // 1. 추가
import './App.css';
import Homepage from './pages/Homepages';
import ErrorPage from './pages/ErrorPage';
import SignUpPage from './pages/SignupPage';
import Mypage from './pages/MyPage';
import LoginPage from './pages/Loginpage';
import LpListPage from './pages/LpListPage';
import { AuthProvide } from './context/AuthContext'; 
import LpDetailPage from './pages/LpDetailpage';
import SearchPage from './pages/SearchPage';

const queryClient = new QueryClient();

const routes: RouteObject[] = [{
    path: "/",
    element: <Homepage />, 
    errorElement: <ErrorPage />,
    children: [
        { index: true, element: <LpListPage /> },
        { path: "login", element: <LoginPage /> },
        { path: "signup", element: <SignUpPage /> },
        { path: "lp/:lpid", element: <LpDetailPage /> },
        { path: "my", element: <Mypage /> }, 
        { path: "Search", element: <SearchPage /> }, 
    ]
}];

const router = createBrowserRouter(routes);

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvide>
                <RouterProvider router={router} />
            </AuthProvide>
        </QueryClientProvider>
    );
}

export default App;