import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Rating, SpeedDial, SpeedDialAction, TextField, Typography, Stack } from '@mui/material';
import axiosInstance from '../../../utils/axiosInstance';
import { AiFillEdit, AiFillDelete, AiOutlineSend } from 'react-icons/ai';
import { GiCancel } from 'react-icons/gi';
import { toast } from 'react-toastify';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import PropTypes from 'prop-types';

const CommentCard = ({ userReview, onDeleteSuccess, onUpdateSuccess }) => {
    const [authUser, setAuthUser] = useState(null); // Stores the ID of the currently authenticated user
    const [isAdmin, setIsAdmin] = useState(false); // Stores if the current user is an admin
    const [edit, setEdit] = useState(false); // State to toggle edit mode for the comment
    const [editComment, setEditComment] = useState(userReview.comment); // State for edited comment text
    const [value, setValue] = useState(userReview.rating); // State for edited rating value
    const authToken = localStorage.getItem('Authorization'); // Get auth token from local storage

    // Effect to fetch the authenticated user's details on component mount or auth token change
    useEffect(() => {
        const getUser = async () => {
            if (authToken) {
                try {
                    const { data } = await axiosInstance.get(process.env.REACT_APP_GET_USER_DETAILS, {
                        headers: { 'Authorization': authToken }
                    });
                    // CRITICAL FIX: Access user details from 'data.user' as per backend standardization
                    if (data.success && data.user) {
                        setAuthUser(data.user._id); // Set authenticated user's ID
                        setIsAdmin(data.user.isAdmin || false); // Set admin status
                    } else {
                        // Handle cases where success is false or user data is missing
                        console.error("Failed to fetch auth user details: ", data.message);
                    }
                } catch (error) {
                    // Use backend's standardized 'message' field for error toasts
                    console.error("Error fetching auth user details in CommentCard:", error.response?.data?.message || error.message);
                }
            }
        };
        getUser();
    }, [authToken]); // Dependency array includes authToken to re-run if it changes

    // Handles the deletion of a comment
    const handleDeleteComment = async () => {
        // Determine the correct API endpoint based on admin status
        const url = isAdmin
            ? `${process.env.REACT_APP_ADMIN_DELETE_REVIEW}/${userReview._id}`
            : `${process.env.REACT_APP_DELETE_REVIEW}/${userReview._id}`;
        try {
            const { data } = await axiosInstance.delete(url, { headers: { 'Authorization': authToken } });

            // Backend now returns { success: true, message: "..." }
            if (data.success) {
                toast.success(data.message || "Review deleted", { autoClose: 500, theme: 'colored' }); // Use data.message
                onDeleteSuccess(userReview._id); // Call parent callback for successful deletion
            } else {
                toast.error(data.message || "Failed to delete review", { autoClose: 500, theme: 'colored' }); // Use data.message
            }
        } catch (error) {
            console.error("Error deleting review:", error);
            // Use backend's standardized 'message' field for error toasts
            toast.error(error.response?.data?.message || "Failed to delete review", { autoClose: 500, theme: 'colored' });
        }
    };

    // Handles the editing of a review
    const handleEditReview = async () => {
        // Client-side validation for comment and rating
        if (!editComment || value === 0) {
            return toast.error("Please add a rating and comment.", { autoClose: 500, theme: 'colored' });
        }
        try {
            const { data } = await axiosInstance.put(process.env.REACT_APP_EDIT_REVIEW,
                { id: userReview._id, comment: editComment, rating: value }, // Send review ID, updated comment, and rating
                { headers: { 'Authorization': authToken } } // Send auth token
            );

            // Backend now returns { success: true, message: "..." }
            if (data.success) {
                toast.success(data.message || "Review updated", { autoClose: 500, theme: 'colored' }); // Use data.message
                onUpdateSuccess({ ...userReview, comment: editComment, rating: value }); // Call parent callback for successful update
                setEdit(false); // Exit edit mode
            } else {
                toast.error(data.message || "Failed to update review", { autoClose: 500, theme: 'colored' }); // Use data.message
            }
        } catch (error) {
            console.error("Error updating review:", error);
            // Use backend's standardized 'message' field for error toasts
            toast.error(error.response?.data?.message || "Failed to update review", { autoClose: 600, theme: 'colored' });
        }
    };

    // Format review creation date and time
    const date = new Date(userReview.createdAt).toLocaleDateString('en-us', { year: "numeric", month: "long", day: "numeric" });
    const time = new Date(userReview.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

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
        <Box sx={{
            display: 'flex', gap: 2, p: 2, bgcolor: '#1e1e1e',
            borderRadius: '12px', border: '1px solid #333', position: 'relative'
        }}>
            {/* User Avatar */}
            <Avatar sx={{ bgcolor: '#333', color: '#FFD700' }}>
                {userReview?.user?.firstName?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
                {/* User Name */}
                <Typography variant="h6" sx={{ color: 'white', fontFamily: 'Cooper Black, serif' }}>
                    {`${userReview?.user?.firstName || 'Anonymous'} ${userReview?.user?.lastName || ''}`}
                </Typography>

                {!edit ? (
                    // Display mode for review
                    <>
                        <Rating name="read-only" value={userReview.rating} readOnly precision={0.1} sx={{ color: '#FFD700', my: 1 }} />
                        <Typography variant="body1" sx={{ color: '#cccccc', wordBreak: 'break-word', pr: 5 }}>
                            {userReview.comment}
                        </Typography>
                    </>
                ) : (
                    // Edit mode for review
                    <Stack spacing={2} sx={{ my: 1 }}>
                        <Rating
                            name="edit-rating"
                            value={value}
                            precision={1}
                            onChange={(event, newValue) => setValue(newValue)}
                            sx={{ color: '#FFD700', fontSize: '2rem' }}
                        />
                        <TextField
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            label="Edit Review"
                            multiline
                            variant="outlined"
                            sx={textFieldSx}
                        />
                        <Stack direction="row" spacing={1}>
                            <Button variant='contained' onClick={handleEditReview} startIcon={<AiOutlineSend />} sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}>Save</Button>
                            <Button variant='outlined' onClick={() => setEdit(false)} startIcon={<GiCancel />} sx={{ borderColor: '#444', color: '#ccc', '&:hover': { borderColor: '#666' } }}>Cancel</Button>
                        </Stack>
                    </Stack>
                )}

                {/* Review Date and Time */}
                <Typography variant="caption" sx={{ color: "gray", display: 'block', mt: 2 }}>
                    {`${date} at ${time}`}
                </Typography>

                {/* SpeedDial for Edit/Delete actions (visible only to author or admin) */}
                {(authUser === userReview?.user?._id || isAdmin) && !edit &&
                    <SpeedDial
                        ariaLabel="Review Actions"
                        sx={{ position: 'absolute', top: 16, right: 16 }}
                        icon={<SpeedDialIcon />}
                        direction="left"
                        FabProps={{
                            size: 'small',
                            sx: { bgcolor: '#333', '&:hover': { bgcolor: '#444' } }
                        }}
                    >
                        <SpeedDialAction icon={<AiFillEdit />} tooltipTitle="Edit" onClick={() => setEdit(true)} />
                        <SpeedDialAction icon={<AiFillDelete />} tooltipTitle="Delete" onClick={handleDeleteComment} />
                    </SpeedDial>
                }
            </Box>
        </Box>
    );
};

CommentCard.propTypes = {
    userReview: PropTypes.object.isRequired,
    onDeleteSuccess: PropTypes.func.isRequired,
    onUpdateSuccess: PropTypes.func.isRequired,
};

export default CommentCard;
