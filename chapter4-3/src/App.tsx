import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Homepage from './pages/Homepages';
import LoginpPage from './pages/Loginpage';
import ErrorPage from './pages/ErrorPage';
import SignUpPage from './pages/SignupPage';
import Mypage from './pages/MyPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage/>,
    errorElement: <ErrorPage />,
   children: [
    {index: true, element: <div>Home</div> },
    {path: "login", element: <LoginpPage/>},
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
