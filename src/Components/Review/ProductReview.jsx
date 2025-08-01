import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Rating, Box, Button, MenuItem, Select, TextField, Tooltip, Typography, FormControl } from '@mui/material';
import {
    MdSentimentSatisfiedAlt,
    MdSentimentDissatisfied,
    MdSentimentVeryDissatisfied,
    MdSentimentNeutral,
    MdSentimentVerySatisfied,
    MdStarRate,
    MdSend,
    MdOutlineFilterAlt
} from 'react-icons/md';
import { toast } from 'react-toastify';
import CommentCard from '../Card/Comment Card/CommentCard';
import { customerReview } from '../../Assets/Images/Image'; // Assuming this path is correct
import PropTypes from 'prop-types';

// Labels for rating icons (emojis)
const labels = {
    1: <MdSentimentVeryDissatisfied style={{ color: '#FFD700' }} />,
    2: <MdSentimentDissatisfied style={{ color: '#FFD700' }} />,
    3: <MdSentimentNeutral style={{ color: '#FFD700' }} />,
    4: <MdSentimentSatisfiedAlt style={{ color: '#FFD700' }} />,
    5: <MdSentimentVerySatisfied style={{ color: '#FFD700' }} />,
};

const ProductReview = ({ product, onReviewChange, isLoggedIn, authToken, setOpenAlert }) => {
    const [value, setValue] = useState(0); // State for the rating value
    const [hover, setHover] = useState(-1); // State for hover effect on rating icons
    const [reviews, setReviews] = useState([]); // State to store fetched reviews
    const [comment, setComment] = useState(''); // State for the review comment
    const [filterOption, setFilterOption] = useState('All'); // State for review filter/sort option

    // Options for filtering and sorting comments
    const commentFilter = ["All", "Most Recent", "Old", "Positive First", "Negative First"];

    // Callback to fetch reviews based on product ID and filter option
    const fetchReviews = useCallback(async () => {
        try {
            const { data } = await axiosInstance.post(`${process.env.REACT_APP_GET_REVIEW}/${product._id}`, {
                filterType: filterOption.toLowerCase().replace(/ /g, '') // Format filter string for backend
            });
            // Backend now returns { success: true, reviews: [...] }
            if (data.success) {
                setReviews(data.reviews || []); // Set reviews from the 'reviews' field
            } else {
                // Handle cases where success is false but no error is thrown
                toast.error(data.message || "Error fetching reviews.", { theme: 'colored' });
            }
        } catch (error) {
            // Use backend's standardized 'message' field for error toasts
            toast.error(error.response?.data?.message || "Error fetching reviews.", { theme: 'colored' });
            console.error("Error fetching reviews:", error);
        }
    }, [filterOption, product._id]);

    // Effect to fetch reviews when filter option or product ID changes
    useEffect(() => {
        fetchReviews();
    }, [filterOption, fetchReviews]);

    // Handles submission of a new review
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        // Client-side validation for comment and rating
        if (!comment || value === 0) {
            return toast.error("Please add a rating and a comment.", { theme: "colored" });
        }
        if (isLoggedIn) {
            try {
                const { data } = await axiosInstance.post(`${process.env.REACT_APP_ADD_REVIEW}`,
                    { id: product._id, comment, rating: value }, // Send product ID, comment, and rating
                    { headers: { 'Authorization': authToken } } // Send auth token
                );
                // Backend now returns { success: true, message: "...", review: {...} }
                if (data.success) {
                    toast.success(data.message, { theme: "colored" }); // Use data.message for success
                    setReviews(prevReviews => [data.review, ...prevReviews]); // Add new review to state
                    onReviewChange(); // Callback to parent to update product's overall rating
                    setComment(''); // Clear comment field
                    setValue(0); // Reset rating
                } else {
                    toast.error(data.message, { theme: "colored" }); // Use data.message for backend-specific error
                }
            } catch (error) {
                // Use backend's standardized 'message' field for error toasts
                toast.error(error.response?.data?.message || "Something went wrong while adding review.", { theme: "colored" });
                console.error("Error submitting review:", error);
            }
        } else {
            setOpenAlert(true); // Prompt login if not logged in
        }
    };

    // Callback for successful review deletion (from CommentCard)
    const deleteReviewSuccess = (reviewId) => {
        setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId)); // Remove deleted review from state
        onReviewChange(); // Callback to parent to update product's overall rating
    };

    // Callback for successful review update (from CommentCard)
    const updateReviewSuccess = (updatedReview) => {
        setReviews(prevReviews => prevReviews.map(review =>
            review._id === updatedReview._id ? updatedReview : review // Replace old review with updated one
        ));
        onReviewChange(); // Callback to parent to update product's overall rating
    };

    // Custom styles for Material-UI TextField components
    const textFieldSx = {
        width: '100%',
        '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#444' },
            '&:hover fieldset': { borderColor: '#666' },
            '&.Mui-focused fieldset': { borderColor: '#FFD700' },
            backgroundColor: '#1e1e1e',
            borderRadius: '8px',
        },
        '& .MuiInputLabel-root': { color: '#cccccc', fontFamily: 'Cooper Black, serif' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' },
        '& .MuiInputBase-input': { color: 'white', fontFamily: 'Cooper Black, serif' },
    };

    return (
        <Box sx={{ mt: 8, width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4, p: 3, bgcolor: '#1e1e1e', borderRadius: '12px', border: '1px solid #333' }}>
                {/* Add Review Form */}
                <Box component="form" onSubmit={handleSubmitReview} sx={{ flex: 1, width: '100%' }}>
                    <Typography variant='h5' sx={{ color: 'white', mb: 2 }}>Add Your Review</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Rating
                            name="hover-feedback" value={value} precision={1}
                            onChange={(event, newValue) => setValue(newValue)}
                            onChangeActive={(event, newHover) => setHover(newHover)}
                            emptyIcon={<MdStarRate style={{ opacity: 0.55, color: '#444' }} fontSize="inherit" />}
                            sx={{ color: '#FFD700', fontSize: '2.5rem' }}
                        />
                        {value !== null && (<Box sx={{ ml: 2, fontSize: '2rem' }}>{labels[hover !== -1 ? hover : value]}</Box>)}
                    </Box>
                    <TextField value={comment} onChange={(e) => setComment(e.target.value)} label="Add Review" placeholder="What did you like or dislike?" multiline rows={4} variant="outlined" sx={textFieldSx} />
                    <Tooltip title='Send Review'>
                        <Button variant='contained' type='submit' endIcon={<MdSend />} sx={{ mt: 2, bgcolor: '#333', '&:hover': { bgcolor: '#444' }, p: '12px 30px' }}>Send</Button>
                    </Tooltip>
                </Box>
                {/* Customer Review Image (hidden on small screens) */}
                <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center' }}>
                    <img src={customerReview} loading='lazy' alt="Customer Review" style={{ maxWidth: '100%', height: 'auto', maxHeight: '300px' }} />
                </Box>
            </Box>

            {/* Display Reviews Section */}
            {reviews.length > 0 && (
                <>
                    {/* Review Filters */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, maxWidth: '1200px', mx: 'auto', mt: 5, px: { xs: 2, md: 0 } }}>
                        <Button startIcon={<MdOutlineFilterAlt />} sx={{ color: '#FFD700', textTransform: 'none', fontSize: '1rem' }}>Filters</Button>
                        <FormControl sx={{ minWidth: 200 }}>
                            <Select value={filterOption} onChange={(e) => setFilterOption(e.target.value)}
                                sx={{
                                    color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#666' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' },
                                    '.MuiSvgIcon-root': { color: 'white' }, fontFamily: 'Cooper Black, serif',
                                    bgcolor: '#1e1e1e', borderRadius: '8px', '.MuiSelect-select': { py: 1.5 }
                                }}
                            >
                                {commentFilter.map(option => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
                            </Select>
                        </FormControl>
                    </Box>
                    {/* List of Comment Cards */}
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        {reviews.map(review => (
                            <Box
                                key={review._id}
                                sx={{
                                    width: { xs: '95%', sm: '80%', md: '700px', lg: '800px' },
                                    maxWidth: '800px',
                                }}
                            >
                                <CommentCard
                                    userReview={review}
                                    onDeleteSuccess={deleteReviewSuccess}
                                    onUpdateSuccess={updateReviewSuccess}
                                />
                            </Box>
                        ))}
                    </Box>
                </>
            )}
        </Box>
    );
};

ProductReview.propTypes = {
    product: PropTypes.object.isRequired,
    onReviewChange: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    authToken: PropTypes.string,
    setOpenAlert: PropTypes.func.isRequired,
};

export default ProductReview;
