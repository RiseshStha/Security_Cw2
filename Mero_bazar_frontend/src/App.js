import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom'
import Loginpage from './pages/login/Loginpage';
import Navbar from './components/Navbar';
import 'react-toastify/dist/ReactToastify.css';
import Registerpage from './pages/register/Registerpage';
import Homepage from './pages/homepage/Homepage';
import Landingpage from './pages/landingpage/Landingpage';
import DashboardNavbar from './components/DashboardNavbar';
import UserRoutes from './protected_routes/UserRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserProfile from './pages/userprofile/UserProfile';
import PostDetailPage from './pages/postdeatailpage/PostDetailPage';
import ForgotPassword from './pages/forgotpassword/ForgotPassword';
import Chat from './pages/messagepage/Messagepage';

const App = () => {
  const location = useLocation();

  const renderNavbar = () => {
    if(location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register' || location.pathname ==='/forgot_password') {
      return <Navbar />;
    }
    return <DashboardNavbar />;
  };

  return (
    <>
    {renderNavbar()}
    <div style={{ marginTop: '5px' }}></div>    
      <Routes>
      <Route path='/login' element={<Loginpage/>} />
      <Route path='/register' element={<Registerpage/>}/>
      <Route path='/' element={<Landingpage/>}/>
      <Route path='/forgot_password' element={<ForgotPassword/>}/>
      <Route path='/post_detail/:id' element={<PostDetailPage/>}/>

      <Route element={<UserRoutes/>}>
      <Route path='/home' element={<Homepage/>}/>
      {/* <Route path='/profile/:id' element={<UserProfile/>} /> */}
      <Route path='/profile' element={<UserProfile/>} />
      <Route path='/message' element={<Chat/>} />
      </Route>
      </Routes>
      <ToastContainer/>
    </>
  );
}

const AppWrapper= () => (
  <Router>
    <App/>
  </Router>
);

export default AppWrapper;
