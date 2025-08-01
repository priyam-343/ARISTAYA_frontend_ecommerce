import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Box, Button, Container, Tooltip, Typography, Dialog,
    DialogActions, DialogContent, Chip, Rating,
    ButtonGroup, Skeleton,
} from '@mui/material';
import { MdAddShoppingCart } from 'react-icons/md';
import { AiFillHeart, AiFillCloseCircle, AiOutlineLogin } from 'react-icons/ai';
import { TbDiscount2 } from 'react-icons/tb';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { ContextFunction } from '../../Context/Context';
import ProductReview from '../../Components/Review/ProductReview';
import ProductCard from '../../Components/Card/Product Card/ProductCard';
import { Transition } from '../../Constants/Constant';
import PropTypes from 'prop-types';

// Helper function to calculate original price and discount percentage
const calculateDiscount = (price) => {
    const originalPrice = price * 1.45; // Assuming a 45% markup for original price
    const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
    return { originalPrice, discountPercent };
};

const ProductDetail = () => {
    const { setCart, setWishlistData } = useContext(ContextFunction);
    const [openAlert, setOpenAlert] = useState(false); // State for login alert dialog
    const { mainCategory, id } = useParams(); // Get product ID and main category from URL parameters
    const [product, setProduct] = useState(null); // State for the main product details
    const [similarProduct, setSimilarProduct] = useState([]); // State for similar products
    const [productQuantity, setProductQuantity] = useState(1); // State for quantity to add to cart
    const [loading, setLoading] = useState(true); // Loading state for initial data fetch

    const authToken = localStorage.getItem('Authorization');
    const isLoggedIn = !!authToken; // Check if user is logged in

    // Callback to re-fetch product data, useful after review changes
    const fetchProductData = useCallback(async () => {
        try {
            const productResponse = await axiosInstance.get(`/api/product/fetchproduct/${id}`);
            // CRITICAL FIX: Access the 'product' object from the response data
            // Backend now returns { success: true, product: {...} }
            if (productResponse.data.success) {
                setProduct(productResponse.data.product);
            } else {
                toast.error(productResponse.data.message || "Failed to load product details.", { theme: 'colored' });
            }
        } catch (error) {
            // Use backend's standardized 'message' field for error toasts
            toast.error(error.response?.data?.message || "Failed to update product details.", { theme: 'colored' });
        }
    }, [id]);

    // Effect to fetch initial product and similar product data
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true); // Set loading state to true
            try {
                const [productRes, similarRes] = await Promise.all([
                    axiosInstance.get(`/api/product/fetchproduct/${id}`), // Fetch main product
                    axiosInstance.post(`/api/product/fetchproduct/type`, { userType: mainCategory }) // Fetch similar products
                ]);

                // CRITICAL FIX: Access the 'product' object from productRes.data
                if (productRes.data.success) {
                    setProduct(productRes.data.product);
                } else {
                    toast.error(productRes.data.message || "Failed to load main product.", { theme: 'colored' });
                }

                // CRITICAL FIX: Access the 'products' array from similarRes.data
                if (similarRes.data.success) {
                    setSimilarProduct(similarRes.data.products);
                } else {
                    toast.error(similarRes.data.message || "Failed to load similar products.", { theme: 'colored' });
                }

            } catch (error) {
                // Use backend's standardized 'message' field for error toasts
                toast.error(error.response?.data?.message || "Failed to load product page.", { theme: 'colored' });
            } finally {
                setLoading(false); // Reset loading state
            }
        };
        fetchInitialData();
        window.scroll(0, 0); // Scroll to top on component mount/update
    }, [id, mainCategory]); // Re-fetch when product ID or main category changes

    // Function to add product to cart
    const addToCart = async (productToAdd) => {
        if (isLoggedIn) {
            try {
                const { data } = await axiosInstance.post(`/api/cart/addcart`, { _id: productToAdd._id, quantity: productQuantity }, { headers: { 'Authorization': authToken } });
                // CRITICAL FIX: Access the 'savedCart' object from the response data
                // Backend now returns { success: true, savedCart: {...} }
                if (data.success) {
                    setCart(data.savedCart); // Update global cart state
                    toast.success(data.message || "Added To Cart", { autoClose: 500, theme: 'colored' });
                } else {
                    toast.error(data.message || "Failed to add to cart", { autoClose: 500, theme: 'colored' });
                }
            } catch (error) {
                // Use backend's standardized 'message' field for error toasts
                toast.error(error.response?.data?.message || "Failed to add to cart", { autoClose: 500, theme: 'colored' });
            }
        } else {
            setOpenAlert(true); // Prompt login if not logged in
        }
    };

    // Function to add product to wishlist
    const addToWishlist = async (productToAdd) => {
        if (isLoggedIn) {
            try {
                const { data } = await axiosInstance.post(`/api/wishlist/addwishlist`, { _id: productToAdd._id }, { headers: { 'Authorization': authToken } });
                // CRITICAL FIX: Access the 'savedWishlist' object from the response data
                // Backend now returns { success: true, savedWishlist: {...} }
                if (data.success) {
                    setWishlistData(data.savedWishlist); // Update global wishlist state
                    toast.success(data.message || "Added To Wishlist", { autoClose: 500, theme: 'colored' });
                } else {
                    toast.error(data.message || "Failed to add to wishlist", { autoClose: 500, theme: 'colored' });
                }
            } catch (error) {
                // Use backend's standardized 'message' field for error toasts
                toast.error(error.response?.data?.message || "Failed to add to wishlist", { autoClose: 500, theme: 'colored' });
            }
        } else {
            setOpenAlert(true); // Prompt login if not logged in
        }
    };

    // Functions to increase/decrease product quantity
    const increaseQuantity = () => product && setProductQuantity(prev => Math.min(prev + 1, product.stock));
    const decreaseQuantity = () => setProductQuantity(prev => Math.max(prev - 1, 1));

    // Calculate discount details
    const discount = product ? calculateDiscount(product.price) : { originalPrice: 0, discountPercent: 0 };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#000000' }}>
            <Container maxWidth='xl' sx={{ flexGrow: 1, py: 5 }}>
                {/* Login Alert Dialog */}
                <Dialog open={openAlert} TransitionComponent={Transition} keepMounted onClose={() => setOpenAlert(false)} PaperProps={{ sx: { bgcolor: '#1e1e1e', color: 'white', borderRadius: '12px', border: '1px solid #333' } }}>
                    <DialogContent sx={{ width: { xs: 280, md: 350 }, backgroundColor: '#1e1e1e' }}>
                        <Typography variant='h5' sx={{ fontFamily: 'Cooper Black, serif', color: 'white', textAlign: 'center' }}>Please Login To Proceed</Typography>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'space-evenly', backgroundColor: '#1e1e1e', pb: 2 }}>
                        <Button component={Link} to="/login" variant='contained' endIcon={<AiOutlineLogin />} sx={{ backgroundColor: '#333', '&:hover': { bgcolor: '#444' } }}>Login</Button>
                        <Button variant='contained' onClick={() => setOpenAlert(false)} endIcon={<AiFillCloseCircle />} sx={{ backgroundColor: '#333', '&:hover': { bgcolor: '#444' } }}>Close</Button>
                    </DialogActions>
                </Dialog>

                <main style={{ paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
                    {loading || !product ? (
                        // Skeleton loading state
                        <>
                            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}><Skeleton variant='rectangular' sx={{ width: '100%', maxWidth: '500px', height: { xs: 350, md: 500 }, borderRadius: '12px', bgcolor: 'grey.900' }} /></Box>
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
                                <Skeleton variant='text' sx={{ fontSize: '3rem', bgcolor: 'grey.900' }} width="80%" />
                                <Skeleton variant='text' sx={{ fontSize: '1.5rem', bgcolor: 'grey.900' }} width="100%" height={100} />
                                <Skeleton variant='text' sx={{ fontSize: '1rem', bgcolor: 'grey.900', width: '40%' }} />
                                <Skeleton variant='rectangular' sx={{ bgcolor: 'grey.900', borderRadius: '8px', width: '150px', height: '40px' }} />
                                <Skeleton variant='rectangular' sx={{ bgcolor: 'grey.900', borderRadius: '8px', width: '200px', height: '50px' }} />
                            </Box>
                        </>
                    ) : (
                        // Product details display
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '40px', width: '100%', maxWidth: '1200px' }}>
                            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box sx={{ width: '100%', maxWidth: '500px', p: 2, bgcolor: '#1e1e1e', borderRadius: '12px', border: '1px solid #333' }}>
                                    <img alt={product.name} src={product.images?.[0]?.url || 'https://placehold.co/500x600?text=No+Image'} style={{ width: '100%', height: 'auto', objectFit: 'contain', borderRadius: '8px' }} />
                                </Box>
                            </Box>
                            <Box sx={{ flex: 1, p: { xs: 1, md: 2 }, color: 'white' }}>
                                <Typography variant='h4' sx={{ mb: 2, fontFamily: 'Cooper Black, serif' }}>{product.name}</Typography>
                                <Typography variant='body1' sx={{ mb: 2, color: '#cccccc' }}>{product.description}</Typography>
                                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {[product.brand, product.subCategory].filter(Boolean).map(item => (
                                        <Chip label={item.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} key={item} variant="outlined" sx={{ borderColor: '#444', color: '#cccccc', bgcolor: '#1e1e1e', fontFamily: 'Cooper Black, serif' }} />
                                    ))}
                                </Box>
                                <Chip label={`${discount.discountPercent}% off`} variant="filled" sx={{ background: '#FFD700', color: '#000', fontWeight: 'bold', fontFamily: 'Cooper Black, serif', mb: 2 }} icon={<TbDiscount2 color='black' />} />
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" sx={{ color: '#888', textDecoration: 'line-through' }}>₹{Math.round(discount.originalPrice).toLocaleString()}</Typography>
                                    <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 'bold' }}>₹{product.price.toLocaleString()}</Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <ButtonGroup variant="outlined" sx={{ '& .MuiButton-root': { borderColor: '#444', color: 'white' } }}>
                                        <Button onClick={increaseQuantity} disabled={productQuantity >= product.stock}>+</Button>
                                        <Button disabled sx={{ color: 'white !important' }}>{productQuantity}</Button>
                                        <Button onClick={decreaseQuantity} disabled={productQuantity <= 1}>-</Button>
                                    </ButtonGroup>
                                </Box>

                                {/* Product Rating and Review Count */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
                                    <Rating
                                        name="read-only"
                                        value={product.rating || 0}
                                        readOnly
                                        precision={0.1}
                                        sx={{ color: '#FFD700' }}
                                    />
                                    <Typography variant="h6" sx={{ color: '#cccccc', mt: 1 }}>
                                        {product.rating?.toFixed(1) || 0} out of 5
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#cccccc' }}>
                                        ({product.numOfReviews || 0} reviews)
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }} >
                                    <Button variant='contained' startIcon={<MdAddShoppingCart />} onClick={() => addToCart(product)} sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}>Buy</Button>
                                    <Button size='small' variant='contained' onClick={() => addToWishlist(product)} sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}><AiFillHeart size={21} /></Button>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </main>

                {/* Product Reviews Section */}
                {product && <ProductReview product={product} onReviewChange={fetchProductData} isLoggedIn={isLoggedIn} authToken={authToken} setOpenAlert={setOpenAlert} />}

                {/* Similar Products Section */}
                <Typography variant='h5' sx={{ mt: 10, mb: 5, fontWeight: 'bold', textAlign: 'center', color: 'white' }}>Similar Products</Typography>
                <Box sx={{ display: 'flex', overflowX: 'auto', pb: 2, mb: 5, justifyContent: { xs: 'flex-start', md: 'center' } }}>
                    {similarProduct.filter(p => p._id !== id).map(p => (
                        <ProductCard prod={p} category={mainCategory} key={p._id} />
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

ProductDetail.propTypes = {
    // This component does not receive props.
};

export default ProductDetail;
