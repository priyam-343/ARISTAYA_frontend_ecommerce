import { Card, CardContent, Typography, Box, Button, Rating } from '@mui/material' 
import React from 'react'
import styles from './CartCard.module.css' 
import { AiFillDelete } from 'react-icons/ai'
import { Link } from 'react-router-dom'

const CartCard = ({ product, removeFromCart }) => {
    
    const imageUrl = product?.productId?.images && product.productId.images.length > 0
        ? product.productId.images[0].url
        : 'https://placehold.co/400x600/1e1e1e/ffffff?text=No+Image'; 

    return (
        <Card
            className={styles.main_card} 
            sx={{
                backgroundColor: '#1e1e1e !important', 
                color: '#ffffff !important', 
                borderRadius: '12px !important',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4) !important', 
                border: '1px solid #333333 !important', 
                fontFamily: 'Cooper Black, serif !important', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between', 
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', 
                '&:hover': {
                    transform: 'translateY(-5px)', 
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6) !important', 
                },
            }}
            elevation={15}
        >
            {}
            <Link to={`/Detail/type/${product?.productId?.type}/${product?.productId?._id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <Box className={styles.img_box}> {}
                    <img alt={product?.productId?.name} loading='lazy' src={imageUrl} className={styles.img} />
                </Box>
                <CardContent sx={{ flexGrow: 1, padding: '15px !important' }}> {}
                    <Typography
                        gutterBottom
                        variant="h6"
                        sx={{
                            textAlign: "center",
                            color: '#ffffff !important', 
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
                            color: '#cccccc !important', 
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
                                color: '#FFD700 !important', 
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
                            sx={{ color: '#FFD700 !important' }} 
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#cccccc !important', 
                                fontFamily: 'Cooper Black, serif !important',
                                mt: 0.5
                            }}
                        >
                            ({product?.productId?.numOfReviews || 0} reviews)
                        </Typography>
                    </Box>
                </CardContent>
            </Link>

            {}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pb: 2 }}>
                <Button
                    variant='contained'
                    endIcon={<AiFillDelete />}
                    onClick={() => removeFromCart(product)} 
                    sx={{
                        borderRadius: '8px',
                        backgroundColor: '#8B0000 !important', 
                        color: 'white !important',
                        border: '1px solid #B22222', 
                        fontFamily: 'Cooper Black, serif !important',
                        padding: '8px 20px',
                        '&:hover': {
                            backgroundColor: '#B22222 !important', 
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
