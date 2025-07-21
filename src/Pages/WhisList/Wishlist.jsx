import { Container } from '@mui/system'
import axiosInstance from '../../utils/axiosInstance';
import CartCard from '../../Components/Card/CartCard/CartCard'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ContextFunction } from '../../Context/Context'
import { useNavigate, Link } from 'react-router-dom'
import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import { AiFillCloseCircle, AiOutlineLogin } from 'react-icons/ai'
import { EmptyCart } from '../../Assets/Images/Image';
import { Transition } from '../../Constants/Constant'
import CopyRight from '../../Components/CopyRight/CopyRight'

const Wishlist = () => {
    const { wishlistData, setWishlistData } = useContext(ContextFunction)
    const [openAlert, setOpenAlert] = useState(false);

    let authToken = localStorage.getItem('Authorization')
    let setProceed = authToken ? true : false
    let navigate = useNavigate()

    useEffect(() => {
        if (setProceed) {
            getWishList();
        } else {
            setOpenAlert(true);
            setWishlistData([]);
        }
        window.scroll(0, 0);
    }, [setProceed, setWishlistData]);

    const getWishList = async () => {
        try {
            const { data } = await axiosInstance.get(`${process.env.REACT_APP_GET_WISHLIST}`,
                {
                    headers: {
                        'Authorization': authToken
                    }
                });
            setWishlistData(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            toast.error("Error fetching wishlist", { autoClose: 500, theme: 'colored' });
            setWishlistData([]);
        }
    };

    const removeFromWishlist = async (product) => {
        if (setProceed) {
            try {
                const response = await axiosInstance.delete(`${process.env.REACT_APP_DELETE_WISHLIST}/${product._id}`, {
                    headers: {
                        'Authorization': authToken
                    }
                });
                setWishlistData(prevWishlist => prevWishlist.filter(item => item._id !== product._id));
                toast.success("Removed From Wishlist", { autoClose: 500, theme: 'colored' });
            } catch (error) {
                console.error("Error removing from wishlist:", error);
                toast.error(error.response?.data?.msg || "Something went wrong", { autoClose: 500, theme: 'colored' });
            }
        }
    };

    const handleClose = () => {
        setOpenAlert(false);
        navigate('/');
    };

    const handleToLogin = () => {
        navigate('/login');
    };

    return (
        <>
            <Typography variant='h3' sx={{ textAlign: 'center', margin: "10px 0 ", color: '#ffffff', fontWeight: 'bold', fontFamily: 'Cooper Black, serif !important' }}>Wishlist</Typography>
            {setProceed && Array.isArray(wishlistData) && wishlistData.length <= 0 ? (
                
                <Box sx={{ 
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    flexDirection: 'column' 
                }}>
                    <div className="main-card" style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',    
                        padding: '30px',         
                        maxWidth: '450px',       
                        margin: '40px auto',
                        backgroundColor: '#1e1e1e', 
                        borderRadius: '15px',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                        border: '1px solid #333333'
                    }}>
                        <img src={EmptyCart} alt="Empty_wishlist" className="empty-cart-img" style={{ display: 'block', marginBottom: '25px', maxWidth: '80%', height: 'auto' }} /> 
                        
                        <Typography variant='h6' sx={{ textAlign: 'center', color: '#ffffff', fontWeight: 'bold', mb: 3, fontFamily: 'Cooper Black, serif !important' }}> {}
                            No products in wishlist
                        </Typography>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <Button variant="contained" 
                                sx={{ 
                                    borderRadius: 3, 
                                    backgroundColor: '#333333 !important', 
                                    color: 'white !important',
                                    border: '1px solid #444444',
                                    '&:hover': { backgroundColor: '#444444 !important' },
                                    fontFamily: 'Cooper Black, serif !important',
                                    padding: '12px 30px' 
                                }}>
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </Box>
            ) : (
                
                setProceed && Array.isArray(wishlistData) && wishlistData.length > 0 && (
                    <Container maxWidth='xl' style={{ display: "flex", justifyContent: 'center', flexWrap: "wrap", paddingBottom: 20 }}>
                        {Array.isArray(wishlistData) && wishlistData.map(product => (
                            <CartCard product={product} removeFromCart={removeFromWishlist} key={product._id} />
                        ))}
                    </Container>
                )
            )}

            {}
            {!setProceed && (
                <Dialog open={openAlert}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
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
                        <Typography variant='h5' sx={{ fontFamily: 'Cooper Black, serif !important', color: '#ffffff' }}> Please Login To Proceed</Typography>
                    </DialogContent>
                    <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly', paddingBottom: '20px' }}>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <Button variant='contained' endIcon={<AiOutlineLogin />} 
                                sx={{ 
                                    backgroundColor: '#333333 !important', 
                                    color: 'white !important',
                                    border: '1px solid #444444',
                                    '&:hover': { backgroundColor: '#444444 !important' },
                                    fontFamily: 'Cooper Black, serif !important'
                                }}>Login</Button>
                        </Link>
                        <Button variant='contained' 
                            sx={{ 
                                backgroundColor: '#333333 !important', 
                                color: 'white !important',
                                border: '1px solid #444444',
                                '&:hover': { backgroundColor: '#444444 !important' },
                                fontFamily: 'Cooper Black, serif !important'
                            }}
                            endIcon={<AiFillCloseCircle />} onClick={handleClose}>Close</Button>
                    </DialogActions>
                </Dialog>
            )}
            <CopyRight sx={{ mt: 8, mb: 10 }} />
        </>
    );
};

export default Wishlist;
