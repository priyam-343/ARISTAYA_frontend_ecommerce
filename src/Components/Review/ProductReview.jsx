import React, { useEffect, useState, useCallback } from 'react'
import axiosInstance from '../../utils/axiosInstance'; 
import Rating from '@mui/material/Rating';
import {
    MdSentimentSatisfiedAlt,
    MdSentimentDissatisfied,
    MdSentimentVeryDissatisfied,
    MdSentimentNeutral,
    MdSentimentVerySatisfied,
    MdStarRate,
    MdOutlineSentimentVeryDissatisfied,
    MdSend,
    MdOutlineFilterAlt
} from 'react-icons/md'
import Box from '@mui/material/Box';
import { Button, MenuItem, Select, TextField, Tooltip, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import './Review.css'
import CommentCard from '../Card/Comment Card/CommentCard';
import { customerReview } from '../../Assets/Images/Image';



const labels = {
    0: <MdOutlineSentimentVeryDissatisfied style={{ color: '#FFD700' }} />,
    0.5: <MdOutlineSentimentVeryDissatisfied style={{ color: '#FFD700' }} />,
    1: <MdSentimentVeryDissatisfied style={{ color: '#FFD700' }} />,
    1.5: <MdSentimentVeryDissatisfied style={{ color: '#FFD700' }} />,
    2: <MdSentimentDissatisfied style={{ color: '#FFD700' }} />,
    2.5: <MdSentimentDissatisfied style={{ color: '#FFD700' }} />,
    3: <MdSentimentNeutral style={{ color: '#FFD700' }} />,
    3.5: <MdSentimentNeutral style={{ color: '#FFD700' }} />,
    4: <MdSentimentSatisfiedAlt style={{ color: '#FFD700' }} />,
    4.5: <MdSentimentSatisfiedAlt style={{ color: '#FFD700' }} />,
    5: <MdSentimentVerySatisfied style={{ color: '#FFD700' }} />,
};


function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}
const ProductReview = ({ authToken, setProceed, setOpenAlert, id }) => {
    const [value, setValue] = useState(0);
    const [hover, setHover] = useState('');
    const [reviews, setReviews] = useState([])
    const [comment, setComment] = useState('')
    const [filterOption, setFilterOption] = useState('all')
    const [title, setTitle] = useState('All')

    const commentFilter = ["All", "Most Recent", "Old", "Positive First", "Negative First"]

    const fetchReviews = useCallback(async () => {
        const filter = filterOption.toLowerCase();
        try {
            const { data } = await axiosInstance.post(`${process.env.REACT_APP_GET_REVIEW}/${id}`, { filterType: filter });
            setReviews(data);
        } catch (error) {
            console.error("Error fetching reviews:", error.response?.data?.msg || error.message);
            toast.error("Error fetching reviews", { autoClose: 500, theme: 'colored' });
            setReviews([]);
        }
    }, [filterOption, id]);

    useEffect(() => {
        fetchReviews();
    }, [title, id, fetchReviews]);

    const handleChange = (e) => {
        setTitle(e.target.value);
        setFilterOption(e.target.value.split(" ").join("").toLowerCase());
    }

    const handleSubmitReview = async (e) => {
        e.preventDefault()
        if (!comment && value === 0) { // Check value === 0 for initial state
            toast.error("Please fill all fields", { theme: "colored", autoClose: 500, })
        }
        else if (comment.length <= 4) {
            toast.error("Please add more than 4 characters", { theme: "colored", autoClose: 500, })
        }
        else if (value <= 0) {
            toast.error("Please add rating", { theme: "colored", autoClose: 500, })
        }
        else if (comment.length >= 4 && value > 0) {
            try {
                if (setProceed) {
                    const { data } = await axiosInstance.post(`${process.env.REACT_APP_ADD_REVIEW}`, { id: id, comment: comment, rating: value }, {
                        headers: {
                            'Authorization': authToken
                        }
                    })
                    toast.success(data.msg, { theme: "colored", autoClose: 500, })
                    fetchReviews()
                }
                else {
                    setOpenAlert(true)
                }
                setComment('')
                setValue(0)
            }
            catch (error) {
                toast.error(error.response?.data?.msg || "Something went wrong", { theme: "colored", autoClose: 600, })
                setComment('')
                setValue(0)
            }
        }
    }

    const textFieldSx = {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#444444',
            },
            '&:hover fieldset': {
                borderColor: '#666666',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#FFD700',
            },
            backgroundColor: '#1e1e1e',
            borderRadius: '8px',
        },
        '& .MuiInputLabel-outlined': {
            color: '#cccccc',
        },
        '& .MuiInputLabel-outlined.Mui-focused': {
            color: '#FFD700',
        },
        '& .MuiInputBase-input': {
            fontFamily: 'Cooper Black, serif !important',
            color: '#ffffff !important',
        },
        '& .MuiInputBase-multiline': {
            padding: '12px 14px',
        }
    };

    return (
        <>
            <div className='form-container'>
                <form onSubmit={handleSubmitReview} className='form'>
                    <Typography variant='h5' sx={{ color: '#ffffff', fontFamily: 'Cooper Black, serif !important', mb: 2 }}>
                        Add Your Review
                    </Typography>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            mb: 2
                        }}
                    >
                        <Rating
                            name="hover-feedback"
                            value={value}
                            precision={0.5}
                            getLabelText={getLabelText}
                            id="rating"
                            onChange={(event, newValue) => {
                                setValue(newValue);
                            }}
                            onChangeActive={(event, newHover) => {
                                setHover(newHover);
                            }}
                            emptyIcon={<MdStarRate style={{ opacity: 0.55, color: '#444444' }} fontSize="inherit" />}
                            sx={{ color: '#FFD700' }}
                        />
                        {value !== null && (
                            <Box className='expression-icon' sx={{ ml: 2, color: '#FFD700' }}>{labels[hover !== -1 ? hover : value]}</Box>
                        )}
                    </Box>
                    <TextField
                        id="filled-textarea"
                        value={comment} onChange={(e) => {
                            setComment(e.target.value)
                        }}
                        label="Add Review"
                        placeholder="What did you like or dislike?"
                        multiline
                        rows={4}
                        className='comment'
                        variant="outlined"
                        sx={textFieldSx}
                    />

                    <Tooltip title='Send Review'>
                        <Button className='form-btn' variant='contained' type='submit' endIcon={<MdSend />}
                            sx={{
                                backgroundColor: '#333333 !important',
                                color: 'white !important',
                                border: '1px solid #444444',
                                '&:hover': { backgroundColor: '#444444 !important' },
                                fontFamily: 'Cooper Black, serif !important',
                                padding: '12px 30px'
                            }}>
                            Send
                        </Button>
                    </Tooltip>

                </form>
                <div className="form-img-box">
                    <img src={customerReview} loading='lazy' alt="Customer Review" className='review-img' />
                </div>
            </div>

            {reviews.length >= 1 ?
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, width: "80vw", maxWidth: '1200px', mx: 'auto', mt: 5, pr: { xs: 2, md: 0 } }}>
                        <Button endIcon={<MdOutlineFilterAlt />}
                            sx={{
                                backgroundColor: '#333333 !important',
                                color: 'white !important',
                                border: '1px solid #444444',
                                '&:hover': { backgroundColor: '#444444 !important' },
                                fontFamily: 'Cooper Black, serif !important',
                                padding: '8px 15px'
                            }}>Filters</Button>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={title}
                            sx={{
                                width: 200,
                                backgroundColor: '#1e1e1e',
                                color: '#ffffff',
                                fontFamily: 'Cooper Black, serif !important',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#444444',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#666666',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#FFD700',
                                },
                                '& .MuiSelect-icon': {
                                    color: '#cccccc',
                                },
                            }}
                            onChange={handleChange}
                        >
                            {commentFilter.map(prod => (
                                <MenuItem key={prod} value={prod} sx={{
                                    backgroundColor: '#1e1e1e !important',
                                    color: '#ffffff !important',
                                    fontFamily: 'Cooper Black, serif !important',
                                    '&:hover': {
                                        backgroundColor: '#333333 !important',
                                    }
                                }}>{prod}</MenuItem>
                            ))}
                        </Select>

                    </Box>
                    <Box className='review-box' >
                        {
                            reviews.map(review =>
                                <CommentCard userReview={review} key={review._id} authToken={authToken} setReviews={setReviews} reviews={reviews} fetchReviews={fetchReviews} />
                            )
                        }
                    </Box>
                </>
                :
                <Typography sx={{ textAlign: 'center', mt: 5, color: '#cccccc', fontFamily: 'Cooper Black, serif !important' }}>No reviews have been submitted for this product yet. Be the first to add a review!</Typography>
            }


        </>
    )
}

export default ProductReview
