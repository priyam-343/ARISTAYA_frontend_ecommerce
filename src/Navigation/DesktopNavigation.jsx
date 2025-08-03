import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineHeart, AiOutlineShoppingCart, AiFillCloseCircle } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { FiLogOut } from 'react-icons/fi';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Badge, Button, Dialog, DialogActions, DialogContent, Typography, Box, Avatar } from '@mui/material';
import { ContextFunction } from '../Context/Context';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import { Transition } from '../Constants/Constant';
import { FaShippingFast } from 'react-icons/fa';

const DesktopNavigation = () => {
  const { cart, setCart, wishlistData, setWishlistData, loginUser, setLoginUser, logout } = useContext(ContextFunction);
  const [openAlert, setOpenAlert] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const authToken = localStorage.getItem('Authorization');
  const isLoggedIn = !!authToken;
  const isAdmin = loginUser?.isAdmin || false;
  const onAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    const fetchNavData = async () => {
      const token = localStorage.getItem('Authorization');
      
      if (token && !onAdminPage) {
        try {
          const [cartResponse, wishlistResponse] = await Promise.all([
            axiosInstance.get(process.env.REACT_APP_GET_CART, { headers: { 'Authorization': token } }),
            axiosInstance.get(process.env.REACT_APP_GET_WISHLIST, { headers: { 'Authorization': token } })
          ]);
          if (cartResponse.data.success) {
            setCart(cartResponse.data.cart || []);
          } else {
            
            console.error(cartResponse.data.message || "Failed to load cart data.");
          }
          if (wishlistResponse.data.success) {
            setWishlistData(wishlistResponse.data.wishlistItems || []);
          } else {
            console.error(wishlistResponse.data.message || "Failed to load wishlist data.");
          }
        } catch (error) {
          
          console.error("Error fetching navigation data:", error.response?.data?.message || error.message);
        }
      } else {
          
          setCart([]);
          setWishlistData([]);
      }
    };
    fetchNavData();
  }, [authToken, onAdminPage, setCart, setWishlistData]);

  const logoutUser = () => {
    logout();
    setLoginUser({});
    toast.success("Logout Successfully", { autoClose: 500, theme: 'colored' });
    setOpenAlert(false);
    navigate('/');
  };

  const navLinkStyles = {
    color: '#ffffff',
    textDecoration: 'none',
    fontFamily: 'Cooper Black, serif',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    transition: 'color 0.2s ease-in-out',
  };

  const activeNavLinkStyles = {
    color: '#FFD700',
  };

  return (
    <>
      <Box component="nav" sx={{
        display: { xs: 'none', md: 'flex' },
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 4,
        height: '80px',
        bgcolor: '#000000',
        borderBottom: '1px solid #1e1e1e',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1100,
        boxSizing: 'border-box'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Link to='/' style={{ textDecoration: 'none', color: '#FFD700', fontSize: '2rem', fontFamily: 'Cooper Black, serif' }}>
            ARISTAYA
          </Link>
          {isLoggedIn && isAdmin && (
            <Button
              component={Link}
              to={onAdminPage ? "/" : "/admin/home"}
              variant="contained"
              sx={{
                bgcolor: '#FFD700',
                color: '#000000',
                fontFamily: 'Cooper Black, serif',
                borderRadius: '8px',
                '&:hover': { bgcolor: '#e6c200' }
              }}
            >
              {onAdminPage ? "User" : "Admin"}
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <NavLink to='/' style={({ isActive }) => ({ ...navLinkStyles, ...(isActive && activeNavLinkStyles) })}>Home</NavLink>
          <NavLink to="/cart" style={({ isActive }) => ({ ...navLinkStyles, ...(isActive && activeNavLinkStyles) })}>
            <Badge badgeContent={isLoggedIn ? cart.length : 0} sx={{ '& .MuiBadge-badge': { bgcolor: '#FFD700', color: '#000' } }}><AiOutlineShoppingCart size={24} /></Badge>
            <span style={{ marginLeft: '8px' }}>Cart</span>
          </NavLink>
          <NavLink to="/wishlist" style={({ isActive }) => ({ ...navLinkStyles, ...(isActive && activeNavLinkStyles) })}>
            <Badge badgeContent={isLoggedIn ? wishlistData.length : 0} sx={{ '& .MuiBadge-badge': { bgcolor: '#FFD700', color: '#000' } }}><AiOutlineHeart size={24} /></Badge>
            <span style={{ marginLeft: '8px' }}>Wishlist</span>
          </NavLink>

          {isLoggedIn && (
            <NavLink to="/myorders" style={({ isActive }) => ({ ...navLinkStyles, ...(isActive && activeNavLinkStyles) })}>
              <FaShippingFast size={24} />
              <span style={{ marginLeft: '8px' }}>Orders</span>
            </NavLink>
          )}

          {isLoggedIn ? (
            <>
              <NavLink to='/update' style={({ isActive }) => ({ ...navLinkStyles, ...(isActive && activeNavLinkStyles) })}>
                {loginUser?.profileImage ? (
                  <Avatar src={loginUser.profileImage} alt="Profile" sx={{ width: 24, height: 24 }} />
                ) : (
                  <CgProfile size={24} />
                )}
                <span style={{ marginLeft: '8px' }}>Profile</span>
              </NavLink>

              <Button onClick={() => setOpenAlert(true)} endIcon={<FiLogOut />} sx={{ bgcolor: '#1e1e1e', color: '#FFD700', fontFamily: 'Cooper Black, serif', border: '1px solid #333', borderRadius: '8px', textTransform: 'none', '&:hover': { bgcolor: '#2a2a2a', borderColor: '#FFD700' } }}>
                Logout
              </Button>
            </>
          ) : (
            <NavLink to='/login' style={({ isActive }) => ({ ...navLinkStyles, ...(isActive && activeNavLinkStyles) })}>
              <CgProfile size={24} />
              <span style={{ marginLeft: '8px' }}>Login</span>
            </NavLink>
          )}
        </Box>
      </Box>

      <Dialog open={openAlert} TransitionComponent={Transition} keepMounted onClose={() => setOpenAlert(false)} PaperProps={{ sx: { bgcolor: '#1e1e1e', color: 'white', borderRadius: '12px', border: '1px solid #333' } }}>
        <DialogContent sx={{ p: 4 }}>
          <Typography variant='h6' sx={{ textAlign: 'center', fontFamily: 'Cooper Black, serif' }}>Do You Want To Logout?</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-evenly', pb: 3 }}>
          <Button variant='contained' endIcon={<FiLogOut />} onClick={logoutUser} sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}>Logout</Button>
          <Button variant='contained' endIcon={<AiFillCloseCircle />} onClick={() => setOpenAlert(false)} sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DesktopNavigation;
