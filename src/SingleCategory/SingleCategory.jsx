import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { Container, Box, Button, MenuItem, FormControl, Select, Typography, Skeleton, Grid } from '@mui/material';
import { BiFilterAlt } from 'react-icons/bi';
import { toast } from 'react-toastify';
import ProductCard from '../Components/Card/Product Card/ProductCard';

// The definitive "Source of Truth" for all sub-category filters.
const FILTER_MAP = {
    'men-wear': ['All', 'T-Shirts', 'Jeans', 'Formal Wear', 'Accessories'],
    'women-wear': ['All', 'Dresses', 'Tops', 'Skirts', 'Accessories'],
    'children-wear': ['All', 'Boys', 'Girls', 'Infants'],
    'luxury-shoes': ['All', 'Running', 'Football', 'Formal', 'Casual'],
    'premium-perfumes': ['All', 'Men', 'Women', 'Unisex'],
    'books': ['All', 'Scifi', 'Business', 'Mystery', 'Cookbooks', 'Fiction', 'Self-Help'],
    'precious-jewelries': ['All', 'Necklace', 'Earrings', 'Rings', 'Bracelet', 'Watches'],
};
const SORTING_OPTIONS = ['Price Low To High', 'Price High To Low', 'High Rated', 'Low Rated'];

const SingleCategory = () => {
    const [productData, setProductData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterOption, setFilterOption] = useState('All');
    const { mainCategory } = useParams(); // Updated to use the consistent 'mainCategory' param

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                // Make POST request to fetch products by category and filter option
                const response = await axiosInstance.post(`/api/product/fetchproduct/category`, {
                    userType: mainCategory, // Corresponds to mainCategory on backend
                    userCategory: filterOption // Corresponds to filter option on backend
                });
                // CRITICAL FIX: Access the 'products' array from the response data
                // Backend now returns { success: true, products: [...] }
                if (response.data.success) {
                    setProductData(response.data.products);
                } else {
                    // Handle cases where success is false but no error is thrown
                    toast.error(response.data.message || "Failed to load products.", { theme: 'colored' });
                }
            } catch (error) {
                // Use backend's standardized 'message' field for error toasts
                toast.error(error.response?.data?.message || "Failed to load products.", { theme: 'colored' });
            } finally {
                setIsLoading(false); // Reset loading state
            }
        };

        fetchProducts();
        window.scroll(0, 0); // Scroll to top on component mount/update
    }, [mainCategory, filterOption]); // Re-fetch products when category or filter changes

    // Handles changes in the filter/sort dropdown
    const handleFilterChange = (e) => {
        setFilterOption(e.target.value);
    };

    // Determine current filter options based on the main category, including sorting options
    const currentFilters = FILTER_MAP[mainCategory] ? [...FILTER_MAP[mainCategory], ...SORTING_OPTIONS] : ['All', ...SORTING_OPTIONS];
    // Format the main category for display (e.g., "men-wear" -> "Men Wear")
    const categoryTitle = mainCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <>
            <Container maxWidth='xl' sx={{ mt: '90px', display: 'flex', flexDirection: "column" }}>
                {/* Category Title */}
                <Typography variant="h4" sx={{ fontFamily: 'Cooper Black, serif', color: 'white', textAlign: 'center', mb: 4 }}>
                    {categoryTitle}
                </Typography>

                {/* Filters and Sorting Dropdown */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 4, px: { xs: 2, md: 0 } }}>
                    <Button
                        startIcon={<BiFilterAlt />}
                        sx={{
                            color: '#FFD700',
                            fontFamily: 'Cooper Black, serif',
                            mr: 2,
                            textTransform: 'none',
                            fontSize: '1rem'
                        }}
                    >
                        Filters
                    </Button>
                    <FormControl sx={{ minWidth: 200 }}>
                        <Select
                            value={filterOption}
                            onChange={handleFilterChange}
                            displayEmpty
                            sx={{
                                color: 'white',
                                '.MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#666' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' },
                                '.MuiSvgIcon-root': { color: 'white' },
                                fontFamily: 'Cooper Black, serif',
                                bgcolor: '#1e1e1e',
                                borderRadius: '8px',
                                '.MuiSelect-select': { py: 1.5 }
                            }}
                        >
                            {currentFilters.map(option => (
                                <MenuItem key={option} value={option} sx={{ fontFamily: 'Cooper Black, serif' }}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Product Display Area */}
                <Container maxWidth='xl' sx={{ display: "flex", justifyContent: 'center', flexWrap: "wrap", mb: 5, p: 0 }}>
                    {isLoading ? (
                        // Show skeleton loaders while data is loading
                        <Grid container spacing={2} justifyContent="center">
                            {Array.from(new Array(8)).map((_, index) => (
                                <Grid item key={index} sx={{ m: 2 }}>
                                    <Skeleton variant="rectangular" sx={{ bgcolor: 'grey.900', borderRadius: '12px' }} width={300} height={550} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : productData.length > 0 ? (
                        // Render ProductCard for each product if data is available
                        productData.map(prod => (
                            <ProductCard prod={prod} category={mainCategory} key={prod._id} />
                        ))
                    ) : (
                        // Display message if no products are found
                        <Typography variant="h6" sx={{ color: '#cccccc', fontFamily: 'Cooper Black, serif', textAlign: 'center', mt: 5, width: '100%' }}>
                            No products found for this filter.
                        </Typography>
                    )}
                </Container>
            </Container>
        </>
    );
};

export default SingleCategory;
