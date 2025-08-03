import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, Grid, TextField, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AiFillCloseCircle, AiFillDelete } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { Transition } from '../../../Constants/Constant';
import PropTypes from 'prop-types';

const UserInfoItem = ({ id }) => {
    const [userData, setUserData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [openAlert, setOpenAlert] = useState(false);
    const navigate = useNavigate();
    const authToken = localStorage.getItem("Authorization");

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                const apiEndpoint = `${process.env.REACT_APP_ADMIN_GET_SINGLE_USER}/${id}`;
                const { data } = await axios.get(apiEndpoint, {
                    headers: { 'Authorization': authToken }
                });
                
                setUserData(data.user || {}); 
            } catch (error) {
                console.error("Error fetching user data:", error); 
                toast.error(error.response?.data?.message || "Failed to load user data.", { theme: 'colored' });
            } finally {
                setIsLoading(false);
            }
        };

        if (id && authToken) {
            fetchUserData();
        } else {
            setIsLoading(false);
            if (!authToken) { 
                toast.warn("Authentication token missing. Please log in.", { theme: "colored" });
            }
        }
        window.scroll(0, 0);
    }, [id, authToken]);

    const deleteAccount = async () => {
        try {
            const deleteApiUrl = `${process.env.REACT_APP_ADMIN_DELETE_USER}/${id}`;
            const { data } = await axios.delete(deleteApiUrl, { 
                headers: { 'Authorization': authToken }
            });
            
            toast.success(data.message || "Account deleted successfully", { autoClose: 500, theme: 'colored' });
            navigate(-1); 
        } catch (error) {
            
            toast.error(error.response?.data?.message || "Failed to delete account.", { theme: 'colored' });
        } finally {
            setOpenAlert(false);
        }
    };

    const textFieldSx = {
        '& .MuiInputLabel-root.Mui-disabled': {
            color: '#cccccc',
            fontFamily: 'Cooper Black, serif',
        },
        '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: 'white',
            color: 'white',
            fontFamily: 'Cooper Black, serif',
        },
        '& .Mui-disabled .MuiOutlinedInput-notchedOutline': {
            borderColor: '#444',
        },
    };

    if (isLoading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress sx={{ color: '#FFD700' }} />
            </Container>
        );
    }

    return (
        <>
            <Container
                sx={{
                    width: '100%', display: 'flex', flexDirection: 'column',
                    p: 3, bgcolor: '#1e1e1e',
                    borderRadius: '15px', border: '1px solid #333',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.4)', color: 'white',
                }}
            >
                <Typography variant='h5' fontWeight="bold" sx={{ mb: 3, color: '#FFD700', textAlign: 'center' }}>
                    User Details
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}><TextField disabled label="First Name" value={userData.firstName || ''} fullWidth sx={textFieldSx} /></Grid>
                    <Grid item xs={12} sm={6}><TextField disabled label="Last Name" value={userData.lastName || ''} fullWidth sx={textFieldSx} /></Grid>
                    <Grid item xs={12} sm={6}><TextField disabled label="Contact Number" value={userData.phoneNumber || ''} fullWidth sx={textFieldSx} /></Grid>
                    <Grid item xs={12} sm={6}><TextField disabled label="Email" value={userData.email || ''} fullWidth sx={textFieldSx} /></Grid>
                    <Grid item xs={12}><TextField disabled label="Address" value={userData.address || 'Not Provided'} fullWidth sx={textFieldSx} /></Grid>
                    <Grid item xs={12} sm={6}><TextField disabled label="City" value={userData.city || 'Not Provided'} fullWidth sx={textFieldSx} /></Grid>
                    <Grid item xs={12} sm={6}><TextField disabled label="Postal/Zip Code" value={userData.zipCode || 'Not Provided'} fullWidth sx={textFieldSx} /></Grid>
                    <Grid item xs={12}><TextField disabled label="Province/State" value={userData.userState || 'Not Provided'} fullWidth sx={textFieldSx} /></Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, p: 2, borderTop: '1px solid #333', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <Typography variant='h6' sx={{ color: 'white', textAlign: 'center' }}>
                        Delete this Account?
                    </Typography>
                    <Button
                        variant='contained'
                        color='error'
                        endIcon={<AiFillDelete />}
                        onClick={() => setOpenAlert(true)}
                        sx={{ bgcolor: '#E53935', '&:hover': { bgcolor: '#C62828' } }}
                    >
                        Delete
                    </Button>
                </Box>
            </Container>

            <Dialog open={openAlert} TransitionComponent={Transition} keepMounted onClose={() => setOpenAlert(false)} PaperProps={{ sx: { bgcolor: '#1e1e1e', borderRadius: '15px', border: '1px solid #333', color: 'white' } }}>
                <DialogContent sx={{ p: 4 }}>
                    <Typography sx={{ textAlign: 'center', color: '#cccccc' }}>
                        This user's data will be permanently erased. Are you sure?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-evenly', pb: 2 }}>
                    <Button variant='contained' endIcon={<AiFillDelete />} color='error' onClick={deleteAccount} sx={{ bgcolor: '#E53935', '&:hover': { bgcolor: '#C62828' } }}>Delete</Button>
                    <Button variant='contained' onClick={() => setOpenAlert(false)} endIcon={<AiFillCloseCircle />} sx={{ bgcolor: '#2196F3', '&:hover': { bgcolor: '#1976D2' } }}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

UserInfoItem.propTypes = {
    id: PropTypes.string.isRequired,
};

export default UserInfoItem;