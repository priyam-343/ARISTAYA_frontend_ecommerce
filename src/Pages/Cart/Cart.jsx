import React, { useContext, useEffect, useState, useCallback } from 'react'
import { ContextFunction } from '../../Context/Context';
import {
    Button,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    Container,
    CssBaseline,
    Box,
} from '@mui/material'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AiFillCloseCircle, AiOutlineLogin } from 'react-icons/ai'
import CartCard from '../../Components/Card/CartCard/CartCard';
import ProductCard from '../../Components/Card/Product Card/ProductCard';
import './Cart.css'
import OrderSummary from './OrderSummary';
import { EmptyCart } from '../../Assets/Images/Image';
import { Transition } from '../../Constants/Constant';
import CopyRight from '../../Components/CopyRight/CopyRight';
import cartStyles from '../../Components/Card/CartCard/CartCard.module.css';

const Cart = () => {
    const { cart, setCart } = useContext(ContextFunction)
    const [total, setTotal] = useState(0)
    const [openAlert, setOpenAlert] = useState(false);
    const [previousOrder, setPreviousOrder] = useState([]);
    const shippingCoast = 100

    const navigate = useNavigate()
    const authToken = localStorage.getItem('Authorization')
    const setProceed = authToken ? true : false

    const getCart = useCallback(async () => {
        if (setProceed) {
            try {
                console.log("Attempting GET cart from URL:", process.env.REACT_APP_GET_CART);
                const { data } = await axios.get(`${process.env.REACT_APP_GET_CART}`, {
                    headers: { 'Authorization': authToken }
                })
                setCart(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching cart data:", error.response?.data?.msg || error.message);
                toast.error("Error fetching cart data", { autoClose: 500, theme: 'colored' });
                setCart([]);
            }
        }
    }, [setProceed, setCart, authToken]);

    const getPreviousOrder = useCallback(async () => {
        if (setProceed) {
            try {
                console.log("Attempting GET previous orders from URL:", process.env.REACT_APP_GET_PREVIOUS_ORDERS);
                const { data } = await axios.get(`${process.env.REACT_APP_GET_PREVIOUS_ORDERS}`, {
                    headers: { 'Authorization': authToken }
                })
                setPreviousOrder(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error("Error fetching previous orders:", error.response?.data?.msg || error.message);
                toast.error("Error fetching previous orders", { autoClose: 500, theme: 'colored' });
                setPreviousOrder([]);
            }
        }
    }, [setProceed, authToken]);

    useEffect(() => {
        if (setProceed) {
            getCart()
            getPreviousOrder()
        } else {
            setOpenAlert(true)
        }
        window.scrollTo(0, 0)
    }, [setProceed, getCart, getPreviousOrder])

    useEffect(() => {
        if (Array.isArray(cart)) {
            const subtotal = cart.reduce((acc, curr) => {
                const price = curr.productId?.price || 0;
                const quantity = curr.quantity || 0;
                return acc + (price * quantity);
            }, 0);
            setTotal(subtotal + shippingCoast);
        } else {
            console.warn("Cart is not an array. Resetting.");
            setCart([]);
            setTotal(0);
        }
    }, [cart, shippingCoast, setCart])

    const handleClose = () => {
        setOpenAlert(false);
        navigate('/')
    };
    const handleToLogin = () => {
        navigate('/login')
    };

    const removeFromCart = async (product) => {
        if (setProceed) {
            try {
                console.log("Attempting DELETE cart item from URL:", `${process.env.REACT_APP_DELETE_FROM_CART}/${product._id}`);
                await axios.delete(`${process.env.REACT_APP_DELETE_FROM_CART}/${product._id}`, {
                    headers: {
                        'Authorization': authToken
                    }
                })
                toast.success("Removed From Cart", { autoClose: 500, theme: 'colored' })
                setCart(cart.filter(c => c.productId._id !== product.productId._id))
            } catch (error) {
                console.error("Error removing from cart:", error.response?.data?.msg || error.message);
                toast.error("Something went wrong", { autoClose: 500, theme: 'colored' })
            }
        }
    }

    const proceedToCheckout = () => {
        if (cart.length <= 0) {
            toast.error("Please add items in cart to proceed", { autoClose: 500, theme: 'colored' })
        } else {
            sessionStorage.setItem('totalAmount', total)
            navigate('/checkout')
        }
    }

    return (
        <>
            <CssBaseline />
            <Container fixed maxWidth='xl'>
                <Typography variant='h3' sx={{ textAlign: 'center', marginTop: 10, color: '#ffffff', fontWeight: 'bold', fontFamily: 'Cooper Black, serif !important' }}>
                    Cart
                </Typography>

                {setProceed && cart.length <= 0 ? (
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        minHeight: '400px',
                        mt: 5
                    }}>
                        <div className="main-card">
                            <img src={EmptyCart} alt="Empty_cart" className="empty-cart-img" />
                            <Typography variant='h6' sx={{
                                textAlign: 'center',
                                color: '#ffffff !important',
                                fontWeight: 'bold',
                                fontFamily: 'Cooper Black, serif !important',
                                mb: 3
                            }}>
                                Your Cart is Empty
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
                    setProceed && cart.length > 0 && (
                        <Container sx={{ display: 'flex', flexDirection: "column", mb: 10, mt: 5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                {
                                    cart.map(product =>
                                        <CartCard product={product} removeFromCart={removeFromCart} key={product._id} />
                                    )
                                }
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                                <OrderSummary proceedToCheckout={proceedToCheckout} total={total} shippingCoast={shippingCoast} />
                            </Box>
                        </Container>
                    )
                )}
            </Container>

            {setProceed && previousOrder.length > 0 && (
                <>
                    <Typography variant='h6' sx={{ textAlign: 'center', margin: "5px 0", color: '#ffffff', fontWeight: 'bold', fontFamily: 'Cooper Black, serif !important' }}>
                        Previous Orders
                    </Typography>
                    <Container maxWidth='xl' sx={{ marginTop: 10, display: "flex", justifyContent: 'center', flexWrap: "wrap", paddingBottom: 20 }}>
                        {
                            previousOrder.map(order => (
                                Array.isArray(order.productData) && order.productData.map(prod => (
                                    <Link to={`/Detail/type/${prod.productId.type}/${prod.productId._id}`} key={prod._id} style={{ textDecoration: 'none' }}>
                                        <ProductCard prod={prod.productId} />
                                    </Link>
                                ))
                            ))
                        }
                    </Container>
                </>
            )}

            {!setProceed && (
                <Dialog
                    open={openAlert}
                    keepMounted
                    onClose={handleClose}
                    TransitionComponent={Transition}
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
                            <Button variant='contained' onClick={handleToLogin} endIcon={<AiOutlineLogin />}
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
    )
}

export default Cart
