import { Container, InputAdornment, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from 'react-icons/ai';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Link } from "react-router-dom";
import { getAllProducts } from "../../Constants/Constant"; 

const SearchBar = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch all products when component mounts
        getAllProducts(setData);
    }, [])

    const handleSearch = event => {
        const query = event.target.value;
        setSearchTerm(query);

        if (query.length > 0) {
            const newFilteredData = data.filter(item =>
                (item.name && item.name.toLowerCase().includes(query.toLowerCase())) ||
                (item.type && item.type.toLowerCase().includes(query.toLowerCase())) ||
                (item.brand && item.brand.toLowerCase().includes(query.toLowerCase())) ||
                (item.category && item.category.toLowerCase().includes(query.toLowerCase())) ||
                (item.author && item.author.toLowerCase().includes(query.toLowerCase())) ||
                (item.description && item.description.toLowerCase().includes(query.toLowerCase())) ||
                (item.gender && item.gender.toLowerCase().includes(query.toLowerCase()))
            );
            setFilteredData(newFilteredData);
        } else {
            setFilteredData([]); // Clear filtered data if search term is empty
        }
    };

    const Item = styled(Paper)(({ theme }) => ({
        // Apply premium dark theme styles to search results items
        backgroundColor: '#1e1e1e', 
        ...theme.typography.body2,
        padding: theme.spacing(1.5), 
        textAlign: 'left', 
        color: '#ffffff', 
        fontFamily: 'Cooper Black, serif !important', 
        transition: 'background-color 0.3s ease',
        '&:hover': {
            backgroundColor: '#333333', 
        },
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #333333', 
    }));

    
    const searchTextFieldSx = {
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
            height: '45px', 
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
            padding: '10px 14px !important', 
        },
    };

    return (
        <Container sx={{ 
            display: "flex", 
            justifyContent: 'center', 
            alignItems: 'center', 
            flexDirection: 'column', 
            padding: 5, 
            mt: 5, 
            mb: 5 
        }}>
            <TextField
                id="search"
                type="search"
                label="Search Products"
                value={searchTerm}
                onChange={handleSearch}
                sx={{ width: { xs: 350, sm: 500, md: 800 }, ...searchTextFieldSx }} 
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <AiOutlineSearch style={{ color: '#cccccc', fontSize: 22 }} /> {}
                        </InputAdornment>
                    ),
                }}
            />
            {
                searchTerm.length > 0 &&
                <Box sx={{ 
                    width: { xs: 350, sm: 500, md: 800 }, 
                    overflowY: "auto", 
                    maxHeight: "300px", 
                    backgroundColor: '#1e1e1e', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.6)',
                    border: '1px solid #333333',
                    mt: 1, 
                    
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                    '-ms-overflow-style': 'none',                      'scrollbar-width': 'none',                  }}>
                    <Stack spacing={0}>
                        {filteredData.length === 0 ?
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    textAlign: "center", 
                                    margin: "25px 0", 
                                    color: '#cccccc', 
                                    fontFamily: 'Cooper Black, serif !important' 
                                }}
                            >
                                Product Not Found
                            </Typography>
                            : filteredData.map(products => (
                                <Link to={`/Detail/type/${products.type}/${products._id}`} key={products._id} style={{ textDecoration: 'none' }}>
                                    <Item sx={{ borderRadius: 0, display: 'flex', justifyContent: 'space-between', padding: "8px 15px", alignItems: 'center' }}>
                                        <Typography variant="body2" sx={{ color: '#ffffff', fontFamily: 'Cooper Black, serif !important' }}> {}
                                            {products.name.length > 40 ? products.name.slice(0, 40) + '...' : products.name} {}
                                        </Typography>
                                        <img 
                                            src={products.images && products.images.length > 0 ? products.images[0].url : 'https://placehold.co/55x65/1e1e1e/ffffff?text=No+Img'} 
                                            alt={products.name} 
                                            style={{ width: 55, height: 65, objectFit: 'cover', borderRadius: '4px' }} 
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/55x65/1e1e1e/ffffff?text=No+Img'; }} 
                                        />
                                    </Item>
                                </Link>
                            ))}
                    </Stack>
                </Box>
            }
        </Container >
    )
}

export default SearchBar
