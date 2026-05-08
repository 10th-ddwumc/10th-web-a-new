import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import HomeLayout from "./layouts/HomeLayout";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";
import LpListPage from "./pages/LpListPage";
import LpDetailPage from "./pages/LpDetailPage";
import LpNewPage from "./pages/LpNewPage";
import { AuthProvider } from "./context/AuthContext";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirectPage";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "my", element: <MyPage /> },
      { path: "lps", element: <LpListPage /> },
      {
        path: "lps/new",
        element: (
          <ProtectedRoute>
            <LpNewPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "lp/:lpid",
        element: (
          <ProtectedRoute>
            <LpDetailPage />
          </ProtectedRoute>
        ),
      },
      { path: "v1/auth/google/callback", element: <GoogleLoginRedirectPage /> },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
