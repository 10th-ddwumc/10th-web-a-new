import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Homepage from './pages/Homepages';
import LoginpPage from './pages/Loginpage';
import ErrorPage from './pages/ErrorPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage/>,
   children: [
    {index: true, element: <div>Home</div> },
    {path: 'login', element: <LoginpPage/>}
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
