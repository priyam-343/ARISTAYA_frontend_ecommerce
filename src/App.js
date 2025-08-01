import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material'; 
import HomePage from './Pages/Home/HomePage';
import Login from './Auth/Login/Login';
import Register from './Auth/Register/Register';
import Cart from './Pages/Cart/Cart';
import ProductDetail from './Pages/Detail/ProductDetail';
import SingleCategory from './SingleCategory/SingleCategory';
import MobileNavigation from './Navigation/MobileNavigation';
import DesktopNavigation from './Navigation/DesktopNavigation';
import Wishlist from './Pages/WhisList/Wishlist';
import PaymentSuccess from './Pages/Payment/PaymentSuccess';
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckoutForm from './Components/Checkout/CheckoutForm';
import UpdateDetails from './Pages/Update_User/UpdateDetails';
import ForgotPasswordForm from './Auth/ForgotPassword/ForgotPasswordForm';
import AddNewPassword from './Auth/ForgotPassword/AddNewPassword';
import AdminLogin from './Admin/Auth/Login/AdminLogin';
import AdminRegister from './Admin/Auth/Register/AdminRegister';
import AdminHomePage from './Admin/Pages/AdminHomePage';
import SingleUserPage from './Admin/Pages/SingleUserPage';
import SingleProduct from './Admin/Pages/SingleProduct';
import CopyRight from './Components/CopyRight/CopyRight'; 
import UserOrderHistoryPage from './Pages/UserOrderHistoryPage'; // NEW: Import the new component

function App() {
  return (
    <>
      <ToastContainer toastClassName='toastContainerBox' transition={Flip} position='top-center' />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#000000' }}>
          <CssBaseline />
          <DesktopNavigation />
          <Box component="main" className='margin'>
            <Routes>
              {/* User-Facing Routes */}
              <Route path='/' index element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/product/:mainCategory' element={<SingleCategory />} />
              <Route path='/product/:mainCategory/:id' element={<ProductDetail />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/wishlist' element={<Wishlist />} />
              <Route path='/checkout' element={<CheckoutForm />} />
              <Route path='/update' element={<UpdateDetails />} />
              <Route path='/paymentsuccess' element={<PaymentSuccess />} />
              <Route path='/forgotpassword' element={<ForgotPasswordForm />} />
              <Route path='/user/reset/:id/:token' element={<AddNewPassword />} />
              {/* NEW: Route for User Order History */}
              <Route path='/myorders' element={<UserOrderHistoryPage />} /> 

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path='/admin/register' element={<AdminRegister />} />
              <Route path='/admin/home' element={<AdminHomePage />} />
              <Route path='/admin/home/user/:id' element={<SingleUserPage />} />
              <Route path='/admin/home/product/:mainCategory/:id' element={<SingleProduct />} />
            </Routes>
          </Box>
          <MobileNavigation />
          <CopyRight />
        </Box>
      </Router>
    </>
  );
}

export default App;