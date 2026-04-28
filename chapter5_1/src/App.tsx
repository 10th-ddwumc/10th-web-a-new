import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import './App.css';
import Homepage from './pages/Homepages';
import ErrorPage from './pages/ErrorPage';
import SignUpPage from './pages/SignupPage';
import Mypage from './pages/MyPage';
import LoginPage from './pages/Loginpage';
import ProtectedLayout from './layouts/ProtectedLayout';


const publicRouters: RouteObject[] =[{
  path: "/",
    element: <Homepage/>,
    errorElement: <ErrorPage />,
   children: [
    {index: true, element: <div>Home</div> },
    {path: "login", element: <LoginPage/>},
    {path: 'signup', element: <SignUpPage/>},
    ]
},
];

const protectedRoutes: RouteObject[]=[{
    path: "/",
    element: <ProtectedLayout/>,
    errorElement: <ErrorPage />,
    children: [
    {path: 'my', element: <Mypage/>},
    ]
},
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage/>,
    errorElement: <ErrorPage />,
   children: [
    {index: true, element: <div>Home</div> },
    {path: "login", element: <LoginPage/>},
    {path: 'signup', element: <SignUpPage/>},
    {path: 'my', element: <Mypage/>},
  ],
  },
]);

function App(){
  return (
    <>
   <RouterProvider router={router}/>
    </>
  );
}

export default App;
