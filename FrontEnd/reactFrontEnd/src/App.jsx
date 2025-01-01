import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainPage from './pages/MainPage';
import FavoritesPage from './pages/FavoritesPage';
import ScrollToTop from './components/ScrollToTop';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<MainPage />}/>
      <Route path='/login' element={<LoginPage />}/>
      <Route path='/register' element={<ScrollToTop><RegisterPage /></ScrollToTop>}/>
      <Route path='/home' element={<HomePage />}/>
      <Route path='/favorites' element={<FavoritesPage />}/>
    </>
      
  )
);
const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};
export default App
