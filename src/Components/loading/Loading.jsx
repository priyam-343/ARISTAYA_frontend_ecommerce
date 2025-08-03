import React from 'react';
import { Skeleton, Box } from '@mui/material';

const Loading = () => {
    return (
        <Box sx={{
            width: { xs: '90%', sm: 280, md: 300 },
            minHeight: { xs: 450, sm: 500, md: 550 },
            m: 2,
            bgcolor: '#1e1e1e',
            borderRadius: '12px',
            border: '1px solid #333',
            p: 2,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {}
            <Skeleton
                variant="rectangular"
                sx={{
                    bgcolor: 'grey.900',
                    borderRadius: '8px',
                    height: { xs: 250, sm: 300, md: 350 },
                }}
            />
            {}
            <Box sx={{ pt: 2, flexGrow: 1 }}>
                <Skeleton variant="text" sx={{ fontSize: '1.5rem', bgcolor: 'grey.900' }} />
                <Skeleton variant="text" sx={{ fontSize: '1rem', bgcolor: 'grey.900', width: '80%' }} />
                <Skeleton variant="text" sx={{ fontSize: '1.2rem', bgcolor: 'grey.900', mt: 2, width: '60%' }} />
            </Box>
        </Box>
    );
};

export default Loading;
