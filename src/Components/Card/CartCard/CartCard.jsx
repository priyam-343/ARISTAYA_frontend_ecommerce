import { Card, CardContent, Typography, Box, Button, Rating } from '@mui/material' // Removed CardActionArea, CardActions, Tooltip as they are re-added below with correct usage
import React from 'react'
import styles from './CartCard.module.css' // Import the CSS module
import { AiFillDelete } from 'react-icons/ai'
import { Link } from 'react-router-dom'

const CartCard = ({ product, removeFromCart }) => {
    // Ensure product?.productId?.images exists and has at least one image.
    const imageUrl = product?.productId?.images && product.productId.images.length > 0
        ? product.productId.images[0].url
        : 'https://placehold.co/400x600/1e1e1e/ffffff?text=No+Image'; // Themed placeholder for vertical image

    return (
        <Card
            className={styles.main_card} // Apply the CSS module class for dimensions
            sx={{
                backgroundColor: '#1e1e1e !important', // Force dark background for the card
                color: '#ffffff !important', // Force white text for general card content
                borderRadius: '12px !important',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4) !important', // Stronger, darker shadow
                border: '1px solid #333333 !important', // Subtle border
                fontFamily: 'Cooper Black, serif !important', // Ensure font family is applied to card
                display: 'flex', // Enable flexbox for vertical stacking
                flexDirection: 'column', // Stack children vertically
                justifyContent: 'space-between', // Distribute space
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', // Smooth transitions
                '&:hover': {
                    transform: 'translateY(-5px)', // Lift on hover
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6) !important', // Even stronger shadow on hover
                },
            }}
            elevation={15}
        >
            {/* The Link wraps the clickable content area (image and product details) */}
            <Link to={`/Detail/type/${product?.productId?.type}/${product?.productId?._id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <Box className={styles.img_box}> {/* Apply the CSS module class for image container dimensions */}
                    <img alt={product?.productId?.name} loading='lazy' src={imageUrl} className={styles.img} />
                </Box>
                <CardContent sx={{ flexGrow: 1, padding: '15px !important' }}> {/* Allow content to grow */}
                    <Typography
                        gutterBottom
                        variant="h6"
                        sx={{
                            textAlign: "center",
                            color: '#ffffff !important', // Force white text for product name
                            fontFamily: 'Cooper Black, serif !important',
                            fontSize: { xs: '1rem', md: '1.1rem' },
                            mb: 1
                        }}
                    >
                        {product?.productId?.name.length > 25 ? product.productId.name.slice(0, 25) + '...' : product.productId.name}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            textAlign: "center",
                            color: '#cccccc !important', // Subtle grey for quantity text
                            fontFamily: 'Cooper Black, serif !important',
                            mb: 1
                        }}
                    >
                        Qty: {product?.quantity}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1, mb: 1 }}>
                        <Typography
                            gutterBottom
                            variant="h6"
                            sx={{
                                textAlign: "center",
                                color: '#FFD700 !important', // Force Gold for price
                                fontFamily: 'Cooper Black, serif !important',
                                fontWeight: 'bold',
                                fontSize: { xs: '1.1rem', md: '1.2rem' }
                            }}
                        >
                            ₹{product?.productId?.price.toLocaleString()}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <Rating
                            name="read-only"
                            value={Math.round(product?.productId?.rating || 0)}
                            readOnly
                            precision={0.5}
                            sx={{ color: '#FFD700 !important' }} // Force Gold stars
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#cccccc !important', // Subtle grey for review count
                                fontFamily: 'Cooper Black, serif !important',
                                mt: 0.5
                            }}
                        >
                            ({product?.productId?.numOfReviews || 0} reviews)
                        </Typography>
                    </Box>
                </CardContent>
            </Link>

            {/* Buttons are outside the Link/CardActionArea to be distinct click targets */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pb: 2 }}>
                <Button
                    variant='contained'
                    endIcon={<AiFillDelete />}
                    onClick={() => removeFromCart(product)} // Pass the entire product object
                    sx={{
                        borderRadius: '8px',
                        backgroundColor: '#8B0000 !important', // Dark Red for delete
                        color: 'white !important',
                        border: '1px solid #B22222', // Slightly lighter red border
                        fontFamily: 'Cooper Black, serif !important',
                        padding: '8px 20px',
                        '&:hover': {
                            backgroundColor: '#B22222 !important', // Darker red on hover
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
                        },
                    }}
                >
                    Remove
                </Button>
            </Box>
        </Card>
    )
}

export default CartCard
