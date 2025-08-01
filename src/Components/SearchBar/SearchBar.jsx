import React, { useEffect, useState } from "react";
import { Container, InputAdornment, TextField, Typography, Box, Paper } from "@mui/material";
import { AiOutlineSearch } from 'react-icons/ai';
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const SearchBar = () => {
    const [allProducts, setAllProducts] = useState([]); // Stores all products fetched from the backend
    const [filteredData, setFilteredData] = useState([]); // Stores products filtered by search term
    const [searchTerm, setSearchTerm] = useState(''); // Stores the current search input

    // Effect to fetch all products when the component mounts
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const { data } = await axiosInstance.get('/api/product/fetchproduct');
                // CRITICAL FIX: Access the 'products' array from the response data
                // Backend now returns { success: true, products: [...] }
                if (data.success) {
                    setAllProducts(data.products || []); // Set all products from the 'products' field
                } else {
                    toast.error(data.message || "Search could not be initialized.", { theme: 'colored' });
                }
            } catch (error) {
                // Use backend's standardized 'message' field for error toasts
                toast.error(error.response?.data?.message || "Search could not be initialized.", { theme: 'colored' });
            }
        };
        fetchAllProducts();
    }, []); // Empty dependency array ensures this runs only once on mount

    // Handles changes in the search input and filters products
    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchTerm(query);

        if (query.length > 0) {
            const newFilteredData = allProducts.filter(item => {
                const lowerCaseQuery = query.toLowerCase();
                // Filters products based on name, description, brand, mainCategory, or subCategory
                return (
                    item.name?.toLowerCase().includes(lowerCaseQuery) ||
                    item.description?.toLowerCase().includes(lowerCaseQuery) ||
                    item.brand?.toLowerCase().includes(lowerCaseQuery) ||
                    item.mainCategory?.toLowerCase().includes(lowerCaseQuery) ||
                    item.subCategory?.toLowerCase().includes(lowerCaseQuery)
                );
            });
            setFilteredData(newFilteredData);
        } else {
            setFilteredData([]); // Clear filtered data if search term is empty
        }
    };

    // Custom styles for the search TextField component
    const searchTextFieldSx = {
        width: { xs: '100%', sm: 500, md: 800 },
        '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#444' },
            '&:hover fieldset': { borderColor: '#666' },
            '&.Mui-focused fieldset': { borderColor: '#FFD700' },
            backgroundColor: '#1e1e1e',
            borderRadius: '8px',
            height: '50px',
        },
        '& .MuiInputLabel-root': { color: '#cccccc', fontFamily: 'Cooper Black, serif' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' },
        '& .MuiInputBase-input': { color: 'white', fontFamily: 'Cooper Black, serif' },
    };

    return (
        <Container sx={{ position: 'relative', display: "flex", flexDirection: 'column', alignItems: 'center', p: 0 }}>
            {/* Search Input Field */}
            <TextField
                id="search"
                type="search"
                label="Search ARISTAYA"
                value={searchTerm}
                onChange={handleSearch}
                sx={searchTextFieldSx}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <AiOutlineSearch style={{ color: '#cccccc', fontSize: 22 }} />
                        </InputAdornment>
                    ),
                }}
            />
            {/* Search Results Dropdown */}
            {searchTerm.length > 0 && (
                <Paper sx={{
                    position: 'absolute',
                    top: '55px', // Position below the search input
                    width: { xs: '100%', sm: 500, md: 800 },
                    overflowY: "auto", // Enable vertical scrolling for results
                    maxHeight: "300px",
                    bgcolor: '#1e1e1e',
                    borderRadius: '8px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.6)',
                    border: '1px solid #333',
                    zIndex: 1200, // Ensure it appears above other content
                }}>
                    {filteredData.length === 0 ? (
                        // Message when no products are found
                        <Typography variant="h6" sx={{ textAlign: "center", p: 3, color: '#cccccc' }}>
                            Product Not Found
                        </Typography>
                    ) : (
                        // Map and display filtered products
                        filteredData.map(product => (
                            <Link to={`/product/${product.mainCategory}/${product._id}`} key={product._id} style={{ textDecoration: 'none' }} onClick={() => setSearchTerm('')}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    p: 1.5,
                                    color: 'white',
                                    borderBottom: '1px solid #333',
                                    transition: 'background-color 0.2s ease-in-out',
                                    '&:hover': { bgcolor: '#333' },
                                    '&:last-child': { borderBottom: 'none' }
                                }}>
                                    <Typography variant="body1">
                                        {product.name.length > 50 ? product.name.slice(0, 50) + '...' : product.name}
                                    </Typography>
                                    <img
                                        src={product.images?.[0]?.url || 'https://placehold.co/55x65?text=No+Img'}
                                        alt={product.name}
                                        style={{ width: 55, height: 65, objectFit: 'cover', borderRadius: '4px', marginLeft: '15px' }}
                                    />
                                </Box>
                            </Link>
                        ))
                    )}
                </Paper>
            )}
        </Container>
    );
};

export default SearchBar;
