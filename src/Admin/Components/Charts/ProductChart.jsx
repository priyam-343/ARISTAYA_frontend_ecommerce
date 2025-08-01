import React from 'react';
import { Container, Box, Typography, Paper, Grid } from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
    PieChart, Pie, Cell, Area, AreaChart, Legend // Import Legend for potential future use or inspiration
} from 'recharts';
import PropTypes from 'prop-types';

// Define chart categories and colors for consistent use across charts
const CATEGORY_DEFINITIONS = [
    { name: "Men's Wear", slug: 'men-wear' },
    { name: "Women's Wear", slug: 'women-wear' },
    { name: "Children's Wear", slug: 'children-wear' },
    { name: "Luxury Shoes", slug: 'luxury-shoes' },
    { name: "Precious Jewelries", slug: 'precious-jewelries' },
    { name: "Books", slug: 'books' },
    { name: "Premium Perfumes", slug: 'premium-perfumes' },
];
const CHART_COLORS = ['#FFD700', '#2196F3', '#4CAF50', '#E53935', '#9C27B0', '#FF5733', '#33FF57'];

// Constant for converting degrees to radians, used in custom label rendering
const RADIAN = Math.PI / 180;

/**
 * Renders a customized label for Pie Chart slices, displaying the percentage.
 * The label is placed slightly outside the slice for better visibility.
 */
const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
    const radius = outerRadius * 1.05; // Position label slightly outside the pie
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text
            x={x}
            y={y}
            fill="#ffffff" // Changed label color to white for better contrast against dark background
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            style={{ fontFamily: 'Cooper Black, serif', fontWeight: 'bold', fontSize: '0.8rem' }} // Slightly smaller font
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

/**
 * Custom Tooltip component for Recharts, providing consistent styling and formatting.
 */
const CustomChartTooltip = ({ active, payload, label, isCurrency = false }) => {
    if (active && payload && payload.length) {
        // For AreaChart (Daily Revenue Trend), label is a date.
        // For Bar/Pie Charts, payload[0].payload contains the 'name' (category name).
        const itemLabel = isCurrency
            ? new Date(label).toLocaleDateString("en-US", { day: "numeric", month: "short" })
            : payload[0].payload.name;

        return (
            <Box sx={{ bgcolor: '#2a2a2a', border: '1px solid #FFD700', borderRadius: '8px', p: 1.5, fontFamily: 'Cooper Black, serif' }}>
                <Typography variant="body2" sx={{ color: '#FFD700', fontFamily: 'inherit', mb: 0.5, fontWeight: 'bold' }}>
                    {itemLabel}
                </Typography>
                {payload.map((entry, index) => (
                    <Typography key={`item-${index}`} variant="body2" sx={{ color: 'white', fontFamily: 'inherit' }}>
                        {/* Ensure name is present, use dataKey if not, and format value */}
                        {`${entry.name || entry.dataKey}: ${isCurrency ? '₹' : ''}${entry.value.toLocaleString()}`}
                    </Typography>
                ))}
            </Box>
        );
    }
    return null;
};

/**
 * Reusable Paper component for wrapping charts, providing consistent styling and title.
 */
const ChartPaper = ({ title, children }) => (
    <Paper elevation={6} sx={{ p: 3, bgcolor: '#1e1e1e', borderRadius: '15px', border: '1px solid #333' }}>
        <Typography variant="h5" sx={{ textAlign: "center", mb: 3, color: "#FFD700", fontFamily: 'Cooper Black, serif' }}>
            {title}
        </Typography>
        <Box sx={{ width: '100%', height: 350, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* The chart itself will take responsive container */}
            {children}
        </Box>
    </Paper>
);

/**
 * ProductChart component displays various analytics charts related to products,
 * reviews, cart, wishlist, and payment data.
 */
const ProductChart = ({ products, review, cart, wishlist, paymentData }) => {
    // Create a map for quick product lookup by ID.
    // This makes the data processing more efficient when dealing with cart/wishlist items.
    const productMap = new Map(products.map(p => [p._id, p]));

    // --- Data Processing for Charts ---

    // Data for Product Quantity Distribution Bar Chart:
    // Counts products per main category.
    const productData = CATEGORY_DEFINITIONS.map(category => ({
        name: category.name,
        Quantity: products.filter(prod => prod.mainCategory === category.slug).length
    }));

    // Data for Review Rating Distribution Bar Chart:
    // Counts reviews for each rounded star rating (1-5).
    const reviewData = [
        { name: "1 ⭐", Reviews: review.filter(r => Math.round(r.rating) === 1).length },
        { name: "2 ⭐", Reviews: review.filter(r => Math.round(r.rating) === 2).length },
        { name: "3 ⭐", Reviews: review.filter(r => Math.round(r.rating) === 3).length },
        { name: "4 ⭐", Reviews: review.filter(r => Math.round(r.rating) === 4).length },
        { name: "5 ⭐", Reviews: review.filter(r => Math.round(r.rating) === 5).length },
    ];

    // Data for Items in User Carts Pie Chart:
    // Counts cart items per main category, robustly handling populated/unpopulated product IDs.
    const cartData = CATEGORY_DEFINITIONS.map(category => {
        const count = cart.reduce((acc, cartItem) => {
            // Get product ID, whether it's populated object or just ID string
            const productId = cartItem.productId?._id || cartItem.productId;
            const product = productId ? productMap.get(productId) : null;
            return (product && product.mainCategory === category.slug) ? acc + 1 : acc;
        }, 0);
        return { name: category.name, value: count };
    }).filter(item => item.value > 0); // Filter out categories with zero items for cleaner pie chart

    // Data for Items in User Wishlists Bar Chart:
    // Counts wishlist items per main category, robustly handling populated/unpopulated product IDs.
    const wishlistData = CATEGORY_DEFINITIONS.map(category => {
        const count = wishlist.reduce((acc, wishlistItem) => {
            // Get product ID, whether it's populated object or just ID string
            const productId = wishlistItem.productId?._id || wishlistItem.productId;
            const product = productId ? productMap.get(productId) : null;
            return (product && product.mainCategory === category.slug) ? acc + 1 : acc;
        }, 0);
        return { name: category.name, "Quantity in wishlist": count };
    });

    // Process payment data for Daily Revenue Trend Area Chart:
    // Groups total revenue by date and sorts chronologically.
    const groupedPaymentData = paymentData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .reduce((acc, item) => {
            const date = new Date(item.createdAt).toISOString().substr(0, 10); // Format date as YYYY-MM-DD
            const existing = acc.find(el => el.date === date);
            if (existing) {
                existing.totalAmount += item.totalAmount; // Add to existing date's total
            } else {
                acc.push({ date, totalAmount: item.totalAmount }); // Add new date entry
            }
            return acc;
        }, []);


    return (
        <Container sx={{ mt: 5, p: 0 }}>
            <Grid container spacing={4}>
                {/* Daily Revenue Trend Chart (Area Chart) */}
                <Grid item xs={12}>
                    <ChartPaper title="Daily Revenue Trend">
                        <ResponsiveContainer>
                            <AreaChart data={groupedPaymentData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis
                                    dataKey="date"
                                    // Formats X-axis ticks to show short month and day
                                    tickFormatter={(tick) => new Date(tick).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                    tick={{ fill: 'white', fontFamily: 'Cooper Black, serif' }}
                                />
                                <YAxis
                                    tick={{ fill: 'white', fontFamily: 'Cooper Black, serif' }}
                                    // Formats Y-axis ticks as currency
                                    tickFormatter={(value) => `₹${value.toLocaleString()}`}
                                />
                                {/* Custom tooltip specifically for currency data */}
                                <Tooltip content={<CustomChartTooltip isCurrency={true} />} />
                                <Area type="monotone" dataKey="totalAmount" name="Revenue" stroke="#FFD700" fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartPaper>
                </Grid>

                {/* Product Quantity Distribution Chart (Bar Chart) */}
                <Grid item xs={12} md={6}>
                    <ChartPaper title="Product Quantity Distribution">
                        <ResponsiveContainer>
                            <BarChart data={productData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: 'white', fontSize: 11, fontFamily: 'Cooper Black, serif' }}
                                    angle={-35} // Angle for labels to prevent overlap
                                    textAnchor="end"
                                    interval={0} // Show all ticks
                                    height={80} // Give more height for angled labels
                                />
                                <YAxis tick={{ fill: 'white', fontFamily: 'Cooper Black, serif' }} allowDecimals={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Bar dataKey="Quantity">
                                    {productData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartPaper>
                </Grid>

                {/* Items in User Carts Pie Chart */}
                <Grid item xs={12} md={6}>
                    <ChartPaper title="Items in User Carts">
                        <ResponsiveContainer width="100%" height="80%"> {/* Adjusted height to make space for legend */}
                            <PieChart>
                                {/* Tooltip for the pie chart */}
                                <Tooltip content={<CustomChartTooltip />} />
                                <Pie
                                    data={cartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false} // Keep label line for external labels
                                    label={renderCustomizedLabel} // Custom label to show percentage
                                    outerRadius={100}
                                    dataKey="value"
                                >
                                    {cartData.map((entry, index) => {
                                        // Find the index of the category in CATEGORY_DEFINITIONS to get the corresponding color
                                        const categoryIndex = CATEGORY_DEFINITIONS.findIndex(cat => cat.name === entry.name);
                                        const color = CHART_COLORS[categoryIndex % CHART_COLORS.length];
                                        return <Cell key={`cell-${index}`} fill={color} />;
                                    })}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        {/* --- PIE CHART LEGEND --- */}
                        {cartData.length > 0 && (
                            <Box sx={{
                                mt: 2, // Margin top for spacing from chart
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: 2, // Space between legend items
                                maxWidth: '100%',
                                p:1
                            }}>
                                {cartData.map((entry, index) => {
                                    const categoryIndex = CATEGORY_DEFINITIONS.findIndex(cat => cat.name === entry.name);
                                    const color = CHART_COLORS[categoryIndex % CHART_COLORS.length];
                                    return (
                                        <Box key={`legend-${index}`} sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box sx={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: '50%',
                                                bgcolor: color, // Use the synced color
                                                mr: 1, // Margin right for spacing from text
                                            }} />
                                            <Typography variant="body2" sx={{ color: 'white', fontFamily: 'Cooper Black, serif' }}>
                                                {entry.name}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>
                        )}
                        {cartData.length === 0 && (
                            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2, color: '#cccccc', fontFamily: 'Cooper Black, serif' }}>
                                No cart items to display.
                            </Typography>
                        )}
                    </ChartPaper>
                </Grid>

                {/* Items in User Wishlists Chart (Bar Chart) */}
                <Grid item xs={12} md={6}>
                    <ChartPaper title="Items in User Wishlists">
                        <ResponsiveContainer>
                            <BarChart data={wishlistData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: 'white', fontSize: 11, fontFamily: 'Cooper Black, serif' }}
                                    angle={-35}
                                    textAnchor="end"
                                    interval={0}
                                    height={80}
                                />
                                <YAxis tick={{ fill: 'white', fontFamily: 'Cooper Black, serif' }} allowDecimals={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Bar dataKey="Quantity in wishlist">
                                    {wishlistData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartPaper>
                </Grid>

                {/* Review Rating Distribution Chart (Bar Chart) */}
                <Grid item xs={12} md={6}>
                    <ChartPaper title="Review Rating Distribution">
                        <ResponsiveContainer>
                            <BarChart data={reviewData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="name" tick={{ fill: 'white', fontFamily: 'Cooper Black, serif' }} />
                                <YAxis tick={{ fill: 'white', fontFamily: 'Cooper Black, serif' }} allowDecimals={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Bar dataKey="Reviews" fill="#FFD700" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartPaper>
                </Grid>
            </Grid>
        </Container>
    );
};

ProductChart.propTypes = {
    products: PropTypes.array.isRequired,
    review: PropTypes.array.isRequired,
    cart: PropTypes.array.isRequired,
    wishlist: PropTypes.array.isRequired,
    paymentData: PropTypes.array.isRequired,
};

export default ProductChart;