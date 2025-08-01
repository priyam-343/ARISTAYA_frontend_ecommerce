import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import CommentCard from '../../../Components/Card/Comment Card/CommentCard'; // Make sure this path is correct

const UserReviewItem = ({ id }) => {
    console.log("UserReviewItem component (Final Admin Version - Single Column) loaded!");

    const [userReviews, setUserReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const authToken = localStorage.getItem("Authorization"); // GET AUTH TOKEN INTERNALLY
    const getUserReviewsApiUrl = process.env.REACT_APP_ADMIN_GET_USER_REVIEW; // GET API URL INTERNALLY

    const fetchUserReviews = React.useCallback(async () => {
        setIsLoading(true);
        try {
            if (!getUserReviewsApiUrl || !id || !authToken) {
                console.warn("UserReviewItem: Missing required data (id, apiUrl, or authToken). Cannot fetch reviews.");
                setIsLoading(false);
                return;
            }
            
            const apiUrl = `${getUserReviewsApiUrl}/${id}`;
            
            const response = await axios.get(apiUrl, {
                headers: { 'Authorization': authToken }
            });

            const responseData = response.data;
            
            if (responseData && Array.isArray(responseData)) {
                setUserReviews(responseData);
            } else if (responseData && responseData.reviews && Array.isArray(responseData.reviews)) {
                setUserReviews(responseData.reviews);
            } else {
                console.warn("UserReviewItem: Unexpected data format received for reviews:", responseData);
                setUserReviews([]);
            }
        } catch (error) {
            console.error("Error fetching user reviews:", error);
            toast.error(error.response?.data?.msg || "Failed to fetch user reviews.", { theme: "colored" });
        } finally {
            setIsLoading(false);
        }
    }, [id, getUserReviewsApiUrl, authToken]);

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
                    flexDirection: "column", // Key change: Stack items vertically for single column
                    alignItems: "center",   // Key change: Center items horizontally
                    gap: 3,                  // Space between cards
                    paddingBottom: 2,
                    marginBottom: 30,
                    width: '100%',
                }}
            >
                {userReviews.map(review => (
                    review.productId ? (
                        // This Box ensures the CommentCard has the desired responsive width and alignment
                        <Box
                            key={review._id}
                            sx={{
                                // Responsive width to match user-side appearance
                                width: { xs: '95%', sm: '80%', md: '700px', lg: '800px' },
                                maxWidth: '800px', // Prevents it from getting too wide on very large screens
                                
                                // Apply card-like styling to this wrapper Box
                                bgcolor: '#1e1e1e',
                                borderRadius: '15px',
                                border: '1px solid #333',
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                p: 2, // Padding inside this wrapper
                            }}
                        >
                            <CommentCard
                                userReview={review}
                                onDeleteSuccess={deleteReviewByAdminSuccess}
                                onUpdateSuccess={updateReviewByAdminSuccess}
                            />
                        </Box>
                    ) : (
                        // Fallback Box - consistent styling with the working review boxes
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
                                // Consistent responsive width
                                width: { xs: '95%', sm: '80%', md: '700px', lg: '800px' },
                                maxWidth: '800px',
                                minHeight: '150px', // Retain minHeight for fallback message
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
