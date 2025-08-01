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
import AddProduct from '../AddProduct';
import PropTypes from 'prop-types';

// --- Constants for Image Placeholders ---
const PLACEHOLDER_NO_IMAGE = "https://placehold.co/100x100/000000/FFD700?text=No+Image";
const PLACEHADER_IMAGE_ERROR = "https://placehold.co/100x100/000000/FFD700?text=Image+Error"; // Corrected typo here

// This helper converts the new 'mainCategory' slug into a user-friendly display name.
const getDisplayCategory = (mainCategory) => {
    if (!mainCategory) return 'N/A';
    let displayName = mainCategory.replace(/-/g, ' ');

    // Specific mapping for common categories
    switch (displayName) {
        case 'men wear': return "Men's Wear";
        case 'women wear': return "Women's Wear";
        case 'children wear': return "Children's Wear";
        default: return displayName.replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
    }
};

/**
 * ProductTable component displays a filterable and sortable table of products.
 * It allows searching products by various fields and links to individual product detail pages.
 * It also integrates with the AddProduct component for adding new products.
 *
 * @param {object} props - The props object.
 * @param {Array<object>} props.data - An array of product objects to display.
 * @param {function} props.getProductInfo - A function to refresh product data (e.g., after adding a new product).
 */
const ProductTable = ({ data, getProductInfo }) => {
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Define table columns with their IDs, labels, and default alignment/width.
    const columns = [
        { id: 'name', label: 'Name', minWidth: 170, align: 'center' },
        { id: 'image', label: 'Image', minWidth: 100, align: 'center' },
        { id: 'mainCategory', label: 'Main Category', align: 'center', minWidth: 100 },
        { id: 'price', label: 'Price', minWidth: 100, align: 'center' },
        { id: 'rating', label: 'Rating', minWidth: 100, align: 'center' },
    ];

    // Handler for search input changes.
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filters and sorts the data whenever the `data` prop or `searchTerm` changes.
    useEffect(() => {
        // Create a mutable copy to sort
        const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));

        const filtered = sortedData.filter(item => {
            if (searchTerm === '') return true; // Show all if search term is empty

            const queries = searchTerm.toLowerCase().split(" "); // Split search term into individual words

            // Get display category for search
            const displayCategory = getDisplayCategory(item.mainCategory).toLowerCase();

            // Check if every query word is found in any relevant product field
            return queries.every((query) =>
                (item.name && item.name.toLowerCase().includes(query)) ||
                (displayCategory.includes(query)) ||
                (item.subCategory && item.subCategory.toLowerCase().includes(query)) ||
                (item.price !== undefined && item.price.toString().toLowerCase().includes(query)) || // Check for undefined before toString
                (item.rating !== undefined && item.rating.toString().toLowerCase().includes(query)) || // Check for undefined before toString
                (item.brand && item.brand.toLowerCase().includes(query)) ||
                (item.author && item.author.toLowerCase().includes(query)) ||
                (item.description && item.description.toLowerCase().includes(query))
            );
        });

        setFilteredData(filtered);
    }, [data, searchTerm]); // Dependencies for useEffect

    // Styles for navigation links within the table cells
    const linkSx = {
        textDecoration: 'none',
        color: '#ffffff',
        fontFamily: 'Cooper Black, serif',
        '&:hover': {
            color: '#FFD700',
            textDecoration: 'underline'
        }
    };

    return (
        <>
            {/* Search Input Field */}
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 5, mt: 5, bgcolor: '#000000', py: 2 }}>
                <TextField
                    id="search"
                    type="search"
                    label="Search Products"
                    onChange={handleSearch}
                    value={searchTerm}
                    sx={{
                        width: { xs: '90%', sm: 500, md: 800 }, // Responsive width
                        '& .MuiInputBase-input': { color: '#ffffff', fontFamily: 'Cooper Black, serif' },
                        '& .MuiInputLabel-root': { color: '#cccccc', fontFamily: 'Cooper Black, serif' },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' },
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            '& fieldset': { borderColor: '#444444' },
                            '&:hover fieldset': { borderColor: '#666666' },
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

            {/* Add Product Component Integration */}
            <AddProduct getProductInfo={getProductInfo} />

            {/* Product Table Display */}
            <Paper
                elevation={6}
                sx={{ bgcolor: '#1e1e1e', borderRadius: '15px', border: '1px solid #333333', boxShadow: '0 8px 20px rgba(0,0,0,0.4)', overflow: "hidden", width: '100%', mt: 3 }}
            >
                <TableContainer
                    sx={{
                        maxHeight: '500px', // Fixed height with scrolling
                        // Custom scrollbar styles for a themed look
                        '&::-webkit-scrollbar': { height: '8px', width: '8px' },
                        '&::-webkit-scrollbar-track': { background: '#333333', borderRadius: '10px' },
                        '&::-webkit-scrollbar-thumb': { background: '#FFD700', borderRadius: '10px' },
                        '&::-webkit-scrollbar-thumb:hover': { background: '#e6c200' },
                    }}
                >
                    <Table stickyHeader aria-label="sticky table" >
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        sx={{ minWidth: column.minWidth, bgcolor: '#2a2a2a', color: "#ffffff", fontWeight: 'bold', fontFamily: 'Cooper Black, serif', borderBottom: '1px solid #444444' }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Conditional rendering: If no products found after filtering */}
                            {filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} sx={{ bgcolor: '#1e1e1e', borderBottom: '1px solid #333333' }}>
                                        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                                            <Typography variant="h6" sx={{ color: '#cccccc', fontFamily: 'Cooper Black, serif' }}>
                                                Product not found.
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                // Map over filtered data to render product rows
                                filteredData.map((prod) => (
                                    <TableRow key={prod._id} sx={{ '& > *': { borderBottom: 'unset !important' } }}>
                                        <TableCell component="th" scope="row" align="center" sx={{ bgcolor: '#1e1e1e', color: '#ffffff', fontFamily: 'Cooper Black, serif', borderBottom: '1px solid #333333' }}>
                                            <Link to={`/admin/home/product/${prod.mainCategory}/${prod._id}`} style={linkSx}>
                                                {/* Truncate long names for better table display with ellipsis */}
                                                {prod.name.length > 20 ? `${prod.name.slice(0, 20)}...` : prod.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="center" sx={{ bgcolor: '#1e1e1e', color: '#ffffff', fontFamily: 'Cooper Black, serif', borderBottom: '1px solid #333333' }}>
                                            <Link to={`/admin/home/product/${prod.mainCategory}/${prod._id}`} style={linkSx}>
                                                <img
                                                    src={prod?.images?.[0]?.url || PLACEHOLDER_NO_IMAGE} // Use defined placeholder constant
                                                    alt={prod.name || "Product Image"}
                                                    style={{ width: "100px", height: "100px", objectFit: "contain", borderRadius: '8px' }}
                                                    onError={(e) => { e.target.onerror = null; e.target.src = PLACEHADER_IMAGE_ERROR; }} // Use defined error placeholder
                                                />
                                            </Link>
                                        </TableCell>
                                        <TableCell align="center" sx={{ bgcolor: '#1e1e1e', color: '#ffffff', fontFamily: 'Cooper Black, serif', borderBottom: '1px solid #333333' }}>
                                            <Link to={`/admin/home/product/${prod.mainCategory}/${prod._id}`} style={linkSx}>
                                                {getDisplayCategory(prod.mainCategory)}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="center" sx={{ bgcolor: '#1e1e1e', color: '#ffffff', fontFamily: 'Cooper Black, serif', borderBottom: '1px solid #333333' }}>
                                            <Link to={`/admin/home/product/${prod.mainCategory}/${prod._id}`} style={linkSx}>
                                                ₹{prod.price?.toLocaleString()} {/* Use toLocaleString for currency formatting */}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="center" sx={{ bgcolor: '#1e1e1e', color: '#ffffff', fontFamily: 'Cooper Black, serif', borderBottom: '1px solid #333333' }}>
                                            <Link to={`/admin/home/product/${prod.mainCategory}/${prod._id}`} style={linkSx}>
                                                {prod.rating || 'N/A'} {/* Display N/A if rating is null/undefined */}
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
ProductTable.propTypes = {
    data: PropTypes.array.isRequired,
    getProductInfo: PropTypes.func.isRequired,
};

export default ProductTable;