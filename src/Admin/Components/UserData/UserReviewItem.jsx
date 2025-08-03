import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import CommentCard from '../../../Components/Card/Comment Card/CommentCard';

const UserReviewItem = ({ id }) => {
    const [userReviews, setUserReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const authToken = localStorage.getItem("Authorization");
    const getUserReviewsApiUrl = process.env.REACT_APP_ADMIN_GET_USER_REVIEW;
    const getProductApiUrl = process.env.REACT_APP_FETCH_PRODUCT;

    const fetchUserReviews = React.useCallback(async () => {
        setIsLoading(true);
        try {
            if (!getUserReviewsApiUrl || !id || !authToken) {
                setIsLoading(false);
                return;
            }
            
            
            const reviewsApiUrl = `${getUserReviewsApiUrl}/${id}`;
            const reviewsResponse = await axios.get(reviewsApiUrl, {
                headers: { 'Authorization': authToken }
            });

            const rawReviews = reviewsResponse.data.reviews || reviewsResponse.data || [];

            
            const productsResponse = await axios.get(getProductApiUrl);
            const allProducts = productsResponse.data.products || [];

            
            const productMap = allProducts.reduce((acc, product) => {
                if (product && product._id) {
                    acc[product._id] = product.name;
                }
                return acc;
            }, {});

            
            const reviewsWithProductNames = rawReviews.map(review => {
                
                const productId = review.productId && typeof review.productId === 'object'
                    ? review.productId._id
                    : review.productId;

                const productName = productMap[productId] || "Product Not Found";
                
                return {
                    ...review,
                    productName: productName
                };
            });
            
            setUserReviews(reviewsWithProductNames);

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch user reviews.", { theme: "colored" });
            setUserReviews([]);
        } finally {
            setIsLoading(false);
        }
    }, [id, getUserReviewsApiUrl, authToken, getProductApiUrl]);

    useEffect(() => {
        if (id && getUserReviewsApiUrl && authToken) {
            fetchUserReviews();
        } else {
            setIsLoading(false);
        }
    }, [id, getUserReviewsApiUrl, authToken, fetchUserReviews]);

    const deleteReviewByAdminSuccess = (reviewId) => {
        setUserReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));
    };

    const updateReviewByAdminSuccess = (updatedReview) => {
        setUserReviews(prevReviews => prevReviews.map(review =>
            review._id === updatedReview._id ? updatedReview : review
        ));
    };

    if (isLoading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', bgcolor: '#000000' }}>
                <CircularProgress sx={{ color: '#FFD700' }} />
            </Container>
        );
    }

    return (
        <>
            <Typography variant='h6' fontWeight="bold" sx={{ margin: '20px 0', textAlign: 'center', color: '#FFD700', fontFamily: 'Cooper Black, serif' }}>
                User Reviews
            </Typography>
            {userReviews.length < 1 &&
                <Typography variant='h6' sx={{ margin: '40px 0', textAlign: 'center', color: '#cccccc', fontFamily: 'Cooper Black, serif' }}>
                    Not reviewed any products
                </Typography>
            }
            <Container
                maxWidth='xl'
                sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    paddingBottom: 2,
                    marginBottom: 30,
                    width: '100%',
                }}
            >
                {userReviews.map(review => (
                    review.productId ? (
                        <Box
                            key={review._id}
                            sx={{
                                width: { xs: '95%', sm: '80%', md: '700px', lg: '800px' },
                                maxWidth: '800px',
                                bgcolor: '#1e1e1e',
                                borderRadius: '15px',
                                border: '1px solid #333',
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                p: 2,
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontFamily: 'Cooper Black, serif',
                                    mb: 1,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    color: '#FFD700'
                                }}
                            >
                                Product: <span style={{ color: review.productName === 'Product Not Found' ? '#e57373' : 'white' }}>{review.productName}</span>
                            </Typography>
                            <CommentCard
                                userReview={review}
                                onDeleteSuccess={deleteReviewByAdminSuccess}
                                onUpdateSuccess={updateReviewByAdminSuccess}
                            />
                        </Box>
                    ) : (
                        <Box
                            key={review._id}
                            sx={{
                                p: 2,
                                bgcolor: '#2a2a2a',
                                borderRadius: '15px',
                                border: '1px solid #333',
                                color: '#cccccc',
                                fontFamily: 'Cooper Black, serif',
                                textAlign: 'center',
                                width: { xs: '95%', sm: '80%', md: '700px', lg: '800px' },
                                maxWidth: '800px',
                                minHeight: '150px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            Review Data Missing (Product ID not populated)
                        </Box>
                    )
                ))}
            </Container>
        </>
    );
};

UserReviewItem.propTypes = {
    id: PropTypes.string.isRequired,
};

export default UserReviewItem;
