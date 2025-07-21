import './Desktop.css'; 
import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineHeart, AiOutlineShoppingCart, AiFillCloseCircle } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { FiLogOut } from 'react-icons/fi';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Badge, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { ContextFunction } from '../Context/Context';
import { toast } from 'react-toastify';
import { getCart, getWishList, handleClickOpen, handleClose, Transition } from '../Constants/Constant'; 

const DesktopNavigation = () => {
  const { cart, setCart, wishlistData, setWishlistData, setLoginUser } = useContext(ContextFunction);
  const [openAlert, setOpenAlert] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  let authToken = localStorage.getItem('Authorization');
  let setProceed = authToken !== null ? true : false;

  useEffect(() => {
    getCart(setProceed, setCart, authToken);
    getWishList(setProceed, setWishlistData, authToken);
  }, [setProceed, setCart, setWishlistData, authToken]); 

  const logoutUser = () => { 
    localStorage.clear();
    setLoginUser({});
    setCart([]);
    setWishlistData([]);
    toast.success("Logout Successfully", { autoClose: 500, theme: 'colored' });
    setOpenAlert(false); 
    navigate('/'); 
  };

  return (
    <>
      <nav className='nav'>
        <div className="logo">
          <Link to='/'>
            <span>ARISTAYA</span>
          </Link>
        </div>
        <div className="nav-items">
          <ul className="nav-items">
            <li className="nav-links">
              <NavLink to='/' className={location.pathname === '/' ? 'active' : ''}>
                <span className='nav-icon-span'>Home</span>
              </NavLink>
            </li>

            <li className="nav-links">
              <NavLink to="/cart" className={location.pathname === '/cart' ? 'active' : ''}>
                <span className='nav-icon-span'>Cart
                  <Badge badgeContent={setProceed ? cart.length : 0} sx={{ '& .MuiBadge-badge': { backgroundColor: '#FFD700', color: '#000000', fontFamily: 'Outfit, sans-serif' } }}>
                    <AiOutlineShoppingCart className='nav-icon' />
                  </Badge>
                </span>
              </NavLink>
            </li>
            <li className="nav-links">
              <NavLink to="/wishlist" className={location.pathname === '/wishlist' ? 'active' : ''}>
                <span className='nav-icon-span'>Wishlist
                  <Badge badgeContent={setProceed ? wishlistData.length : 0} sx={{ '& .MuiBadge-badge': { backgroundColor: '#FFD700', color: '#000000', fontFamily: 'Outfit, sans-serif' } }}>
                    <AiOutlineHeart className='nav-icon' />
                  </Badge>
                </span>
              </NavLink>
            </li>

            {
              setProceed ?
                <>
                  <li className="nav-links">
                    <NavLink to='/update' className={location.pathname === '/update' ? 'active' : ''}>
                      <span className='nav-icon-span'>
                        <CgProfile className='CgProfile-icon' />
                      </span>
                    </NavLink>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Button
                      variant='contained'
                      className='logout-btn' 
                      onClick={() => handleClickOpen(setOpenAlert)}
                      endIcon={<FiLogOut />}
                    >
                      <Typography variant='button' sx={{ fontFamily: 'Cooper Black, serif !important' }}>Logout</Typography>
                    </Button>
                  </li>
                </>
                :
                <li className="nav-links">
                  <NavLink to='/login' className={location.pathname === '/login' ? 'active' : ''}>
                    <span className='nav-icon-span'>
                      <CgProfile className='CgProfile-icon' />
                    </span>
                  </NavLink>
                </li>
            }
          </ul>
        </div>
      </nav>

      {}
      <Dialog
        open={openAlert}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleClose(setOpenAlert)} 
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{ 
          sx: {
            backgroundColor: '#1e1e1e', 
            color: '#ffffff', 
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6)',
            border: '1px solid #333333',
          }
        }}
      >
        <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 }, display: 'flex', justifyContent: 'center', padding: '30px' }}>
          <Typography variant='h6' sx={{ textAlign: 'center', fontFamily: 'Cooper Black, serif !important', color: '#ffffff' }}>
            Do You Want To Logout?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly', paddingBottom: '20px' }}>
          <Button
            variant='contained'
            endIcon={<FiLogOut />}
            sx={{
              backgroundColor: '#333333 !important',
              color: 'white !important',
              border: '1px solid #444444',
              '&:hover': { backgroundColor: '#444444 !important' },
              fontFamily: 'Cooper Black, serif !important'
            }}
            onClick={logoutUser} 
          >
            Logout
          </Button>
          <Button
            variant='contained'
            sx={{
              backgroundColor: '#333333 !important',
              color: 'white !important',
              border: '1px solid #444444',
              '&:hover': { backgroundColor: '#444444 !important' },
              fontFamily: 'Cooper Black, serif !important'
            }}
            endIcon={<AiFillCloseCircle />}
            onClick={() => handleClose(setOpenAlert)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DesktopNavigation;
