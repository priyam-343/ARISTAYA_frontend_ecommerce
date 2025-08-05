import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Container,
    InputAdornment,
    TextField,
    Typography,
    Box,
    Switch,
    Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddUser from '../AddUser';
import PropTypes from 'prop-types';
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';

const UserTable = ({ user, getUsersInfo }) => {

    const columns = [
        { id: 'name', label: 'Name', minWidth: 170, align: 'center' },
        { id: 'phone', label: 'Phone Number', align: 'center', minWidth: 100 },
        { id: 'email', label: 'Email', minWidth: 170, align: 'center' },
        { id: 'date', label: 'Created On', minWidth: 170, align: 'center' },
        { id: 'admin', label: 'Admin', minWidth: 100, align: 'center' },
        { id: 'freeShipping', label: 'Free Shipping', minWidth: 100, align: 'center' },
    ];

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const authToken = localStorage.getItem('Authorization');

    const isAllFreeShipping = user.length > 0 && user.every(u => u.isFreeShippingEligible);

    useEffect(() => {
        const sortedUser = [...user].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const filtered = sortedUser.filter((userItem) => {
            if (!searchQuery) return true;
            const queries = searchQuery.toLowerCase().split(" ");
            const fullName = `${userItem.firstName || ''} ${userItem.lastName || ''}`.toLowerCase();
            const phoneNumber = userItem.phoneNumber?.toString() || '';
            const email = userItem.email?.toLowerCase() || '';
            return queries.every((query) =>
                fullName.includes(query) ||
                phoneNumber.includes(query) ||
                email.includes(query)
            );
        });
        setFilteredUsers(filtered);
    }, [searchQuery, user]);


    const handleToggleFreeShipping = async (userId) => {
        try {
            await axiosInstance.put(
                `${process.env.REACT_APP_ADMIN_USER_TOGGLE_SHIPPING}/${userId}/freeshipping`,
                {},
                { headers: { Authorization: authToken } }
            );
            toast.success("Free shipping status updated!", { theme: 'colored' });
            getUsersInfo();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update free shipping status.", { theme: 'colored' });
        }
    };


    const handleMasterToggle = async () => {
        const isTurningOn = !isAllFreeShipping;
        const usersToUpdate = isTurningOn 
            ? user.filter(u => !u.isFreeShippingEligible)
            : user.filter(u => u.isFreeShippingEligible);

        if (usersToUpdate.length === 0) {
            return toast.info(isTurningOn ? "All users are already eligible for free shipping." : "No users are eligible for free shipping.", { theme: 'colored' });
        }

        try {
            await Promise.all(usersToUpdate.map(async (u) => {
                await axiosInstance.put(
                    `${process.env.REACT_APP_ADMIN_USER_TOGGLE_SHIPPING}/${u._id}/freeshipping`,
                    {},
                    { headers: { Authorization: authToken } }
                );
            }));

            toast.success(`Successfully turned free shipping ${isTurningOn ? 'ON' : 'OFF'} for all users!`, { theme: 'colored' });
            getUsersInfo();
        } catch (error) {
            toast.error("Failed to update free shipping for all users.", { theme: 'colored' });
        }
    };

    const linkSx = {
        textDecoration: 'none',
        color: 'white',
        fontFamily: 'Cooper Black, serif',
        '&:hover': {
            color: '#FFD700',
            textDecoration: 'underline'
        }
    };

    const tableCellSx = {
        bgcolor: '#1e1e1e',
        color: 'white',
        fontFamily: 'Cooper Black, serif',
        borderBottom: '1px solid #333'
    };

    const tableHeadCellSx = {
        ...tableCellSx,
        bgcolor: '#2a2a2a',
        fontWeight: 'bold',
    };

    return (
        <>
            <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 5, bgcolor: '#000000', py: 2 }}>
                <TextField
                    id="search"
                    type="search"
                    label="Search Users"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                    sx={{
                        width: { xs: '90%', sm: 500, md: 800 },
                        '& .MuiInputBase-input': { color: 'white', fontFamily: 'Cooper Black, serif' },
                        '& .MuiInputLabel-root': { color: '#cccccc', fontFamily: 'Cooper Black, serif' },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' },
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            '& fieldset': { borderColor: '#444' },
                            '&:hover fieldset': { borderColor: '#666' },
                            '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                        },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <AiOutlineSearch style={{ color: '#FFD700' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Container>

            <AddUser getUsersInfo={getUsersInfo} />

            <Paper
                elevation={6}
                sx={{ bgcolor: '#1e1e1e', borderRadius: '15px', border: '1px solid #333', overflow: "hidden", width: '100%', mt: 3 }}
            >
                <TableContainer sx={{ maxHeight: '500px' }}>
                    <Table stickyHeader aria-label="user table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id} align={column.align} sx={{ ...tableHeadCellSx, minWidth: column.minWidth }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            {column.label}
                                            {column.id === 'freeShipping' && (
                                                <Switch
                                                    checked={isAllFreeShipping}
                                                    onChange={handleMasterToggle}
                                                    sx={{
                                                        mt: 1,
                                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                                            color: '#FFD700',
                                                        },
                                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                            backgroundColor: '#FFD700',
                                                        },
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} sx={tableCellSx}>
                                        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                                            <Typography variant="h6" sx={{ color: '#cccccc', fontFamily: 'Cooper Black, serif' }}>
                                                User not found.
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((info) => (
                                    <TableRow key={info._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" align="center" sx={tableCellSx}>
                                            <Link to={`/admin/home/user/${info._id}`} style={linkSx}>
                                                {`${info.firstName || ''} ${info.lastName || ''}`}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="center" sx={tableCellSx}>
                                            <Link to={`/admin/home/user/${info._id}`} style={linkSx}>
                                                {info.phoneNumber || 'N/A'}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="center" sx={tableCellSx}>
                                            <Link to={`/admin/home/user/${info._id}`} style={linkSx}>
                                                {info.email || 'N/A'}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="center" sx={tableCellSx}>
                                            <Link to={`/admin/home/user/${info._id}`} style={linkSx}>
                                                {new Date(info.createdAt).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="center" sx={tableCellSx}>
                                            <Link to={`/admin/home/user/${info._id}`} style={linkSx}>
                                                {info.isAdmin ? 'Yes' : 'No'}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="center" sx={tableCellSx}>
                                            <Switch
                                                checked={info.isFreeShippingEligible}
                                                onChange={() => handleToggleFreeShipping(info._id)}
                                                sx={{
                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                        color: '#FFD700',
                                                    },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                        backgroundColor: '#FFD700',
                                                    },
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
};


UserTable.propTypes = {
    user: PropTypes.array.isRequired,
    getUsersInfo: PropTypes.func.isRequired,
};

export default UserTable;