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
    Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddUser from '../AddUser'; // Assuming this component is located at '../AddUser'
import PropTypes from 'prop-types';

/**
 * UserTable component displays a filterable and sortable table of users.
 * It allows searching users by name, phone number, and email.
 * It also integrates with the AddUser component for adding new users.
 *
 * @param {object} props - The props object.
 * @param {Array<object>} props.user - An array of user objects to display.
 * @param {function} props.getUsersInfo - A function to refresh user data (e.g., after a user is added).
 */
const UserTable = ({ user, getUsersInfo }) => {
    // Define table columns with their IDs, labels, and default alignment/width.
    const columns = [
        { id: 'name', label: 'Name', minWidth: 170, align: 'center' },
        { id: 'phone', label: 'Phone Number', align: 'center', minWidth: 100 },
        { id: 'email', label: 'Email', minWidth: 170, align: 'center' },
        { id: 'date', label: 'Created On', minWidth: 170, align: 'center' },
    ];

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    // This effect sorts and filters the user data whenever the search query or the user prop changes.
    useEffect(() => {
        // Create a mutable copy to sort users by creation date in descending order (newest first).
        const sortedUser = [...user].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const filtered = sortedUser.filter((userItem) => {
            if (!searchQuery) return true; // If no search query, return all users.

            // Split the search query into individual words for broader matching.
            const queries = searchQuery.toLowerCase().split(" ");

            // Prepare user data for case-insensitive search.
            const fullName = `${userItem.firstName || ''} ${userItem.lastName || ''}`.toLowerCase();
            const phoneNumber = userItem.phoneNumber?.toString() || ''; // Use optional chaining for safety
            const email = userItem.email?.toLowerCase() || ''; // Use optional chaining for safety

            // Check if every query word is found in the full name, phone number, or email.
            return queries.every((query) =>
                fullName.includes(query) ||
                phoneNumber.includes(query) ||
                email.includes(query)
            );
        });
        setFilteredUsers(filtered);
    }, [searchQuery, user]); // Dependencies: re-run when searchQuery or user data changes.

    // --- Consistent Styling Definitions ---
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
            {/* Search Input Field */}
            <Container sx={{ display: 'flex', justifyContent: 'center', my: 5, bgcolor: '#000000', py: 2 }}>
                <TextField
                    id="search"
                    type="search"
                    label="Search Users"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                    sx={{
                        width: { xs: '90%', sm: 500, md: 800 }, // Responsive width
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

            {/* The AddUser component is passed the `getUsersInfo` function to refresh the table after a user is added. */}
            <AddUser getUsersInfo={getUsersInfo} />

            {/* User Table Display */}
            <Paper
                elevation={6}
                sx={{ bgcolor: '#1e1e1e', borderRadius: '15px', border: '1px solid #333', overflow: "hidden", width: '100%', mt: 3 }}
            >
                <TableContainer sx={{ maxHeight: '500px' }}> {/* Fixed height with scrolling */}
                    <Table stickyHeader aria-label="user table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id} align={column.align} sx={{ ...tableHeadCellSx, minWidth: column.minWidth }}>
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Conditional rendering: If no users found after filtering */}
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
                                // Map over filtered users to render rows
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
                                                {/* Format date for better readability */}
                                                {new Date(info.createdAt).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })}
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer >
            </Paper>
        </>
    );
};

// --- PropTypes for Type Checking ---
UserTable.propTypes = {
    user: PropTypes.array.isRequired,
    getUsersInfo: PropTypes.func.isRequired,
};

export default UserTable;