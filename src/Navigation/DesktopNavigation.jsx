import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineHeart, AiOutlineShoppingCart, AiFillCloseCircle } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { FiLogOut } from 'react-icons/fi';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Badge, Button, Dialog, DialogActions, DialogContent, Typography, Box } from '@mui/material';
import { ContextFunction } from '../Context/Context';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import { Transition } from '../Constants/Constant'; // Assuming this constant exists
import { FaShippingFast } from 'react-icons/fa'; // Import Orders icon

const DesktopNavigation = () => {
  const { cart, setCart, wishlistData, setWishlistData, loginUser, setLoginUser } = useContext(ContextFunction);
  const [openAlert, setOpenAlert] = useState(false); // State for logout confirmation dialog
  const navigate = useNavigate();
  const location = useLocation();
  const authToken = localStorage.getItem('Authorization');
  const isLoggedIn = !!authToken; // Check if user is logged in
  const isAdmin = loginUser?.isAdmin || false; // Check if the logged-in user is an admin
  const onAdminPage = location.pathname.startsWith('/admin'); // Check if current path is an admin page

  useEffect(() => {
    const fetchNavData = async () => {
      if (isLoggedIn) {
        try {
          const [cartResponse, wishlistResponse] = await Promise.all([
            axiosInstance.get(process.env.REACT_APP_GET_CART, { headers: { 'Authorization': authToken } }), // Fetch cart data
            axiosInstance.get(process.env.REACT_APP_GET_WISHLIST, { headers: { 'Authorization': authToken } }) // Fetch wishlist data
          ]);
          // CRITICAL FIX: Access the 'cart' array from cartResponse.data
          // Backend now returns { success: true, cart: [...] }
          if (cartResponse.data.success) {
            setCart(cartResponse.data.cart || []);
          } else {
            toast.error(cartResponse.data.message || "Failed to load cart data.", { theme: 'colored' });
          }

          // CRITICAL FIX: Access the 'wishlistItems' array from wishlistResponse.data
          // Backend now returns { success: true, wishlistItems: [...] }
          if (wishlistResponse.data.success) {
            setWishlistData(wishlistResponse.data.wishlistItems || []);
          } else {
            toast.error(wishlistResponse.data.message || "Failed to load wishlist data.", { theme: 'colored' });
          }

        } catch (error) {
          // Use backend's standardized 'message' field for error toasts
          toast.error(error.response?.data?.message || "Couldn't load navigation data.", { theme: 'colored' });
        }
      }
    };
    fetchNavData();
  }, [isLoggedIn, setCart, setWishlistData, authToken]); // Dependencies: login status, setters, and auth token

  // Handles user logout
  const logoutUser = () => {
    localStorage.clear(); // Clear all local storage
    setLoginUser({}); // Clear global login user state
    setCart([]); // Clear global cart state
    setWishlistData([]); // Clear global wishlist state
    toast.success("Logout Successfully", { autoClose: 500, theme: 'colored' });
    setOpenAlert(false); // Close logout confirmation dialog
    navigate('/'); // Navigate to home page
  };

  // Styles for NavLink components
  const navLinkStyles = {
    color: '#ffffff', // Default link color
    textDecoration: 'none',
    fontFamily: 'Cooper Black, serif',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    transition: 'color 0.2s ease-in-out', // Smooth color transition on hover
  };

  // Styles for active NavLink components
  const activeNavLinkStyles = {
    color: '#FFD700', // Golden color for active links
  };

  return (
    <>
      <Box component="nav" sx={{
        display: { xs: 'none', md: 'flex' }, // Visible only on medium and larger screens
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 4,
        height: '80px',
        bgcolor: '#000000', // Dark background
        borderBottom: '1px solid #1e1e1e', // Subtle bottom border
        position: 'fixed', // Fixed position at the top
        top: 0,
        width: '100%',
        zIndex: 1100, // High z-index to stay on top
        boxSizing: 'border-box' // Include padding in element's total width and height
      }}>
        {/* Left side: Branding and Admin Toggle Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Link to='/' style={{ textDecoration: 'none', color: '#FFD700', fontSize: '2rem', fontFamily: 'Cooper Black, serif' }}>
            ARISTAYA
          </Link>
          {isLoggedIn && isAdmin && ( // Show Admin/User toggle only if logged in and is admin
            <Button
              component={Link}
              to={onAdminPage ? "/" : "/admin/home"} // Toggle between user and admin home
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

        {/* Right side: Main Navigation Links */}
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

          {/* User-Facing Orders Button (visible only when logged in) */}
          {isLoggedIn && (
            <NavLink to="/myorders" style={({ isActive }) => ({ ...navLinkStyles, ...(isActive && activeNavLinkStyles) })}>
              <FaShippingFast size={24} />
              <span style={{ marginLeft: '8px' }}>Orders</span>
            </NavLink>
          )}

          {/* Conditional Login/Logout/Profile Button */}
          {isLoggedIn ? (
            <>
              <NavLink to='/update' style={({ isActive }) => ({ ...navLinkStyles, ...(isActive && activeNavLinkStyles) })}>
                <CgProfile size={24} />
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

      {/* Logout Confirmation Dialog */}
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
