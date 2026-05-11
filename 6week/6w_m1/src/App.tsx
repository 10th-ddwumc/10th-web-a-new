import './App.css'
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import HomeLayout from './layouts/HomeLayout';
import MyPage from './pages/MyPage';
import SignupPage from './pages/SignupPage';
import ProtectedLayout from './layouts/ProtectedLayout';
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import LpDetailPage from './pages/LpDetailPage'; // 추가

//1. 홈페이지
//2. 로그인 페이지
//3. 회원가입 페이지

//인증이 필요한 라우트
const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'my',
        element: <MyPage />
      },
      {
        path: 'lp/:lpid',
        element: <LpDetailPage />
      }
    ]
  },
];

//인증없이 접근 가능한 라우트
const publicRoutes: RouteObject[] = [{
  path: "/",
  element: <HomeLayout />,
  errorElement: <NotFoundPage />,
  children: [
    // index: true = path: '/'와 같은 의미 
    // { index: true, element: <HomePage /> },
    { path: 'login', element: <LoginPage /> },
    { path: 'signup', element: <SignupPage /> },
    { path: "v1/auth/google/callback", element: <GoogleLoginRedirectPage /> },
  ]
},
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

//tanstack/react-query 설정
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      //쿼리가 실패했을 때 자동으로 재시도할 횟수
      retry: 3,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      {/* React Query Devtools는 개발 환경에서만 활성화하는 것이 좋음 */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;