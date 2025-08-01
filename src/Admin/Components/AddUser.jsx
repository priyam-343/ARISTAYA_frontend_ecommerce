import React, { useState } from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, Typography, CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
import { Transition } from '../../Constants/Constant';
import { MdOutlineCancel, MdPersonAddAlt1 } from 'react-icons/md';
import PropTypes from 'prop-types';

const AddUser = ({ getUser }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState({ firstName: "", lastName: '', email: "", phoneNumber: '', password: "" });

    const handleOnChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setCredentials({ firstName: "", lastName: '', email: "", phoneNumber: '', password: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...credentials }; 
            
            const { data } = await axiosInstance.post(process.env.REACT_APP_REGISTER, payload); 

            if (data.success) {
                getUser(); 
                toast.success("Normal user registered successfully!", { autoClose: 500, theme: 'colored' });
                handleClose();
            } else {
                // FIX: Ensure 'error' (from catch block) is handled safely
                toast.error(data.error || "Failed to add user. Check response data.", { autoClose: 500, theme: 'colored' }); // Use data.error if backend sends it on success:false
            }
        } catch (error) { // 'error' is defined here by the catch block
            // FIX: Robust error message display, check error.response first, then error.message
            toast.error(error.response?.data?.error || error.message || "Failed to add user.", { autoClose: 500, theme: 'colored' });
            console.error("Error adding normal user:", error); 
        } finally {
            setLoading(false);
        }
    };

    const textFieldSx = {
        '& .MuiInputBase-input': { color: 'white' },
        '& .MuiInputLabel-root': { color: '#cccccc', fontFamily: 'Cooper Black, serif' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' },
        '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '& fieldset': { borderColor: '#444' },
            '&:hover fieldset': { borderColor: '#666' },
            '&.Mui-focused fieldset': { borderColor: '#FFD700' },
        },
    };

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', my: "20px" }} >
                <Typography variant='h6' textAlign='center' color="#FFD700" fontWeight="bold">Add New User</Typography>
                <Button variant='contained' endIcon={<MdPersonAddAlt1 />} onClick={handleClickOpen}
                    sx={{ bgcolor: '#FFD700', color: '#000', '&:hover': { bgcolor: '#e6c200' }, fontFamily: 'Cooper Black, serif' }}
                >
                    Add
                </Button>
            </Box>
            <Divider sx={{ mb: 5, borderColor: '#444' }} />
            <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} PaperProps={{ sx: { bgcolor: '#1e1e1e', borderRadius: '15px', border: '1px solid #333', color: 'white' } }}>
                <DialogTitle sx={{ textAlign: "center", fontWeight: 'bold', color: "#FFD700", fontFamily: 'Cooper Black, serif' }}>Add New User</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}><TextField name="firstName" value={credentials.firstName} onChange={handleOnChange} required fullWidth label="First Name" autoFocus sx={textFieldSx} /></Grid>
                            <Grid item xs={12} sm={6}><TextField required fullWidth label="Last Name" name="lastName" value={credentials.lastName} onChange={handleOnChange} sx={textFieldSx} /></Grid>
                            <Grid item xs={12}><TextField required fullWidth label="Email Address" name="email" value={credentials.email} onChange={handleOnChange} sx={textFieldSx} /></Grid>
                            <Grid item xs={12}><TextField required fullWidth label="Contact Number" name="phoneNumber" value={credentials.phoneNumber} onChange={handleOnChange} sx={textFieldSx} /></Grid>
                            <Grid item xs={12}><TextField required fullWidth name="password" label="Password" type="password" value={credentials.password} onChange={handleOnChange} sx={textFieldSx} /></Grid>
                        </Grid>
                        <DialogActions sx={{ display: 'flex', justifyContent: 'space-around', mt: 3 }}>
                            <Button fullWidth variant='contained' color='error' onClick={handleClose} endIcon={<MdOutlineCancel />} sx={{ fontFamily: 'Cooper Black, serif', borderRadius: '8px', py: 1 }}>Cancel</Button>
                            <Button type="submit" fullWidth variant="contained" disabled={loading} endIcon={<MdPersonAddAlt1 />} sx={{ bgcolor: '#FFD700', color: '#000', fontFamily: 'Cooper Black, serif', borderRadius: '8px', py: 1, '&:hover': { bgcolor: '#e6c200' } }}>
                                {loading ? <CircularProgress size={24} sx={{ color: '#000' }} /> : 'Add'}
                            </Button>
                        </DialogActions>
                    </Box >
                </DialogContent>
            </Dialog>
        </>
    );
};

AddUser.propTypes = {
    getUser: PropTypes.func.isRequired,
};

export default AddUser;
