import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import HomeLayout from "./layouts/HomeLayout";
import MyPage from "./pages/MyPage";
import SignupPage from "./pages/SignupPage";
import ProtectedLayout from "./layouts/ProtectedLayout";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirectPage";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import LpDetailPage from "./pages/LpDetailPage";

// 1. 홈페이지
// 2. 로그인 페이지
// 3. 회원가입 페이지

// 인증이 필요한 라우트
const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },

      //  기존 MyPage 경로 유지
      {
        path: "my",
        element: <MyPage />,
      },

      // Navbar나 사이드바에서 /mypage로 이동하는 코드가 있을 수 있어서 추가
      {
        path: "mypage",
        element: <MyPage />,
      },

      // LpCard에서 navigate(`/lp/${lp.id}`)로 이동하므로 이 경로 필요
      // 이 경로가 ProtectedLayout 안에 있어야 상세페이지에서도 버거 아이콘/사이드바/+버튼이 보임
      {
        path: "lp/:lpid",
        element: <LpDetailPage />,
      },

      // 혹시 다른 파일에서 /lps/:id 형태로 이동하는 경우까지 대비
      {
        path: "lps/:lpid",
        element: <LpDetailPage />,
      },
    ],
  },
];

// 인증 없이 접근 가능한 라우트
const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      // index: true = path: "/"와 같은 의미
      // { index: true, element: <HomePage /> },

      {
        path: "login",
        element: <LoginPage />,
      },

      {
        path: "signup",
        element: <SignupPage />,
      },

      {
        path: "v1/auth/google/callback",
        element: <GoogleLoginRedirectPage />,
      },
    ],
  },
];

// ProtectedLayout을 사용하는 상세페이지가 먼저 안정적으로 잡히도록 protectedRoutes를 앞에 둠
const router = createBrowserRouter([...protectedRoutes, ...publicRoutes]);

// tanstack/react-query 설정
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 쿼리가 실패했을 때 자동으로 재시도할 횟수
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
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default App;