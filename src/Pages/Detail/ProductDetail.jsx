import './Productsimilar.css'
import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    Box,
    Button,
    Container,
    Tooltip,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Chip,
    Rating,
    ButtonGroup,
    Skeleton,
    IconButton,
} from '@mui/material';
import { MdAddShoppingCart } from 'react-icons/md'
import { AiFillHeart, AiFillCloseCircle, AiOutlineLogin, AiOutlineShareAlt } from 'react-icons/ai'
import { TbDiscount2 } from 'react-icons/tb'
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { ContextFunction } from '../../Context/Context';
import ProductReview from '../../Components/Review/ProductReview';
import ProductCard from '../../Components/Card/Product Card/ProductCard';
import { Transition, getSingleProduct } from '../../Constants/Constant';
import CopyRight from '../../Components/CopyRight/CopyRight';


const ProductDetail = () => {
    const { cart, setCart, wishlistData, setWishlistData } = useContext(ContextFunction)
    const [openAlert, setOpenAlert] = useState(false);
    const { id, cat } = useParams()
    const [product, setProduct] = useState(null)
    const [similarProduct, setSimilarProduct] = useState([])
    const [productQuantity, setProductQuantity] = useState(1)
    const [loading, setLoading] = useState(true);


    let authToken = localStorage.getItem('Authorization')
    let setProceed = authToken ? true : false


    useEffect(() => {
        getSingleProduct(setProduct, id, setLoading)
        getSimilarProducts()
        window.scroll(0, 0)
    }, [id, cat])

    const addToCart = async (product) => {
        if (setProceed) {
            try {
                const { data } = await axiosInstance.post(`${process.env.REACT_APP_ADD_CART}`, { _id: product._id, quantity: productQuantity }, {
                    headers: {
                        'Authorization': authToken
                    }
                })
                setCart(data)
                toast.success("Added To Cart", { autoClose: 500, theme: 'colored' })
            } catch (error) {
                console.error("Error adding to cart:", error.response?.data?.msg || error.message);
                toast.error(error.response?.data?.msg || "Failed to add to cart", { autoClose: 500, theme: 'colored' })
            }
        }
        else {
            setOpenAlert(true);
        }
    }

    const addToWhishList = async (product) => {
        if (setProceed) {
            try {
                const { data } = await axiosInstance.post(`${process.env.REACT_APP_ADD_WISHLIST}`, { _id: product._id }, {
                    headers: {
                        'Authorization': authToken
                    }
                })
                setWishlistData(data)
                toast.success("Added To Wishlist", { autoClose: 500, theme: 'colored' })
            }
            catch (error) {
                console.error("Error adding to wishlist:", error.response?.data?.msg || error.message);
                toast.error(error.response?.data?.msg || "Failed to add to wishlist", { autoClose: 500, theme: 'colored' })
            }
        }
        else {
            setOpenAlert(true);
        }

    };

    const shareProduct = async (product) => { 
        const shareData = {
            text: product.name,
            title: "e-ARISTAYA",
            url: `https://e-ARISTAYA.vercel.app/Detail/type/${cat}/${id}`
        };

        if (navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                console.log('Product shared successfully!');
            } catch (error) {
                if (error.name === 'AbortError' || (error.message && error.message.includes('canceled'))) {
                    console.log('User canceled share.');
                } else {
                    console.error('Error sharing product:', error);
                    toast.error("Failed to share product. Please try again.", { autoClose: 2000, theme: 'colored' });
                }
            }
        }
        else {
            toast.error("Sharing not supported on this device/browser.", { autoClose: 2000, theme: 'colored' });
            console.log('Web Share API not supported or data is invalid for sharing.');
        }
    };

    const getSimilarProducts = async () => {
        try {
            const { data } = await axiosInstance.post(`${process.env.REACT_APP_PRODUCT_TYPE}`, { userType: cat })
            setSimilarProduct(data)
        } catch (error) {
            console.error("Error fetching similar products:", error);
        }
    }

    let productChips = [];
    if (product) {
        if (cat === 'shoe') {
            productChips.push(product.brand, product.category);
        } else if (cat === 'book') {
            productChips.push(product.brand, product.category);
        } else if (cat === 'men-wear' || cat === 'women-wear' || cat === 'children-wear') {
            productChips.push(product.brand, product.category);
        } else if (cat === 'perfumes') {
            productChips.push(product.brand, product.category);
        } else if (cat === 'jewelry') {
            productChips.push(product.brand, product.category);
        }
        productChips = productChips.filter(Boolean);
    }


    const increaseQuantity = () => {
        setProductQuantity((prev) => Math.min(prev + 1, product.stock));
    }
    const decreaseQuantity = () => {
        setProductQuantity((prev) => Math.max(prev - 1, 1));
    }

    return (
        <>
            <Container maxWidth='xl' >
                {/* Dialog for login alert */}
                <Dialog
                    open={openAlert}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => setOpenAlert(false)}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 }, display: 'flex', justifyContent: 'center', backgroundColor: '#1e1e1e', color: 'white' }}>
                        <DialogContentText style={{ textAlign: 'center', color: 'white' }} id="alert-dialog-slide-description">
                            <Typography variant='h5' sx={{ fontFamily: 'Cooper Black, serif !important' }}>Please Login To Proceed</Typography>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly', backgroundColor: '#1e1e1e' }}>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <Button variant='contained' endIcon={<AiOutlineLogin />} sx={{ backgroundColor: '#333333', color: 'white', '&:hover': { backgroundColor: '#444444' } }}>Login</Button>
                        </Link>
                        <Button variant='contained' sx={{ backgroundColor: '#333333', color: 'white', '&:hover': { backgroundColor: '#444444' } }}
                            onClick={() => setOpenAlert(false)} endIcon={<AiFillCloseCircle />}>Close</Button>
                    </DialogActions>
                </Dialog>

                <main className='main-content' style={{ padding: '20px 0' }}>
                    {loading || !product ? (
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'center', justifyContent: 'center', mt: 5 }}>
                            <Skeleton variant='rectangular' sx={{ width: { xs: '90%', md: '45%' }, height: { xs: 300, md: 500 }, borderRadius: '12px', bgcolor: 'grey.900' }} />
                            <Box sx={{ width: { xs: '90%', md: '45%' }, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Skeleton variant='text' sx={{ fontSize: '3rem', bgcolor: 'grey.900' }} width="80%" />
                                <Skeleton variant='text' sx={{ fontSize: '1.5rem', bgcolor: 'grey.900' }} width="100%" height={100} />
                                <Skeleton variant='rectangular' sx={{ width: '150px', height: '30px', borderRadius: '8px', bgcolor: 'grey.900' }} />
                                <Skeleton variant='text' sx={{ fontSize: '2rem', bgcolor: 'grey.900' }} width="50%" />
                                <Skeleton variant='rectangular' sx={{ width: '150px', height: '40px', borderRadius: '8px', bgcolor: 'grey.900' }} />
                                <Skeleton variant='rectangular' sx={{ width: '250px', height: '50px', borderRadius: '8px', bgcolor: 'grey.900' }} />
                            </Box>
                        </Box>
                    ) : (
                        <div className="product-image" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                            <div className='detail-img-box' style={{ width: '100%', maxWidth: '500px', height: 'auto', maxHeight: '600px', margin: 'auto' }}>
                                <img alt={product.name} src={product.images && product.images.length > 0 ? product.images[0].url : 'https://placehold.co/400x400/CCCCCC/000000?text=No+Image'} className='detail-img' />
                            </div>
                        </div>
                    )}
                    {loading || !product ? (
                        <section style={{ display: 'flex', flexWrap: "wrap", width: "100%", justifyContent: "space-around", alignItems: 'center' }}>
                            {/* Content for loading state, if any, goes here */}
                        </section>

                    ) : (
                        <section className='product-details' style={{ flex: 1, padding: '20px', color: 'white' }}>
                            <Typography variant='h4' sx={{ mb: 2, color: 'white', fontFamily: 'Cooper Black, serif !important' }}>{product.name}</Typography>

                            <Typography variant='body1' sx={{ mb: 2, color: '#e0e0e0' }}>
                                {product.description}
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <div className="chip" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {
                                        productChips.map((item, index) => (
                                            <Chip
                                                label={item}
                                                key={index}
                                                variant="outlined"
                                                sx={{
                                                    borderColor: '#444444',
                                                    color: '#cccccc',
                                                    backgroundColor: '#1e1e1e',
                                                    fontFamily: 'Cooper Black, serif !important'
                                                }}
                                            />
                                        ))
                                    }
                                </div>
                            </Box>
                            <Chip
                                label={product.price > 1000 ? "Upto 9% off" : "Upto 38% off"}
                                variant="outlined"
                                sx={{
                                    background: '#FFD700',
                                    color: '#000000',
                                    width: '150px',
                                    fontWeight: 'bold',
                                    fontFamily: 'Cooper Black, serif !important',
                                    mb: 2
                                }}
                                avatar={<TbDiscount2 color='black' />}
                            />
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ color: '#888888', textDecoration: 'line-through', fontFamily: 'Cooper Black, serif !important' }}>
                                    ₹{product.price > 1000 ? (product.price + 1000).toLocaleString() : (product.price + 300).toLocaleString()}
                                </Typography>
                                <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 'bold', fontFamily: 'Cooper Black, serif !important' }}>
                                    ₹{product.price.toLocaleString()}
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <ButtonGroup variant="outlined" aria-label="outlined button group" sx={{
                                    '& .MuiButton-root': {
                                        borderColor: '#444444',
                                        color: 'white',
                                        fontFamily: 'Cooper Black, serif !important',
                                        '&:hover': {
                                            borderColor: '#666666',
                                            backgroundColor: '#1e1e1e',
                                        }
                                    }
                                }}>
                                    <Button onClick={increaseQuantity}>+</Button>
                                    <Button>{productQuantity}</Button>
                                    <Button onClick={decreaseQuantity}>-</Button>
                                </ButtonGroup>
                            </Box>
                            <Rating name="read-only" value={Math.round(product.rating)} readOnly precision={0.5} sx={{ color: '#FFD700', mb: 2 }} />
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }} >
                                <Tooltip title='Add To Cart'>
                                    <Button variant='contained' className='all-btn' startIcon={<MdAddShoppingCart />} onClick={(() => addToCart(product))}
                                        sx={{
                                            backgroundColor: '#333333 !important', color: 'white !important',
                                            '&:hover': { backgroundColor: '#444444 !important' }
                                        }}>
                                        Buy
                                    </Button>
                                </Tooltip>
                                <Tooltip title='Add To Wishlist'>
                                    <Button style={{ marginLeft: 0 }} size='small' variant='contained' className='all-btn' onClick={(() => addToWhishList(product))}
                                        sx={{
                                            backgroundColor: '#333333 !important', color: 'white !important',
                                            '&:hover': { backgroundColor: '#444444 !important' }
                                        }}>
                                        {<AiFillHeart fontSize={21} />}
                                    </Button>
                                </Tooltip>
                                <Tooltip title='Share'>
                                    <Button style={{ marginLeft: 0 }} variant='contained' className='all-btn' startIcon={<AiOutlineShareAlt />} onClick={() => shareProduct(product)}
                                        sx={{
                                            backgroundColor: '#333333 !important', color: 'white !important',
                                            '&:hover': { backgroundColor: '#444444 !important' }
                                        }}>
                                        Share
                                    </Button>
                                </Tooltip>
                            </Box>
                        </section>
                    )}
                </main>
                {product && <ProductReview setProceed={setProceed} authToken={authToken} id={id} setOpenAlert={setOpenAlert} />}


                <Typography variant='h5' sx={{ marginTop: 10, marginBottom: 5, fontWeight: 'bold', textAlign: 'center', color: 'white', fontFamily: 'Cooper Black, serif !important' }}>Similar Products</Typography>
                <Box>
                    <Box className='similarProduct' sx={{ display: 'flex', overflowX: 'auto', marginBottom: 10, justifyContent: { xs: 'flex-start', md: 'center' } }}>
                        {
                            similarProduct.filter(prod => prod._id !== id).map(prod => (
                                <Link to={`/Detail/type/${prod.type}/${prod._id}`} key={prod._id} style={{ textDecoration: 'none' }}>
                                    <ProductCard prod={prod} />
                                </Link>
                            ))
                        }
                    </Box>
                </Box>

            </Container >
            <CopyRight sx={{ mt: 8, mb: 10 }} />

        </>
    )
}

export default ProductDetail
