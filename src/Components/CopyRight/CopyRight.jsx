import { Typography } from '@mui/material'
import React from 'react'

const CopyRight = (props) => {
    return (
        
        <Typography variant="body1" fontWeight="bold" color="text.secondary" align="center" {...props} sx={{ color: '#1976d2' }}>
            {' '}
            {new Date().getFullYear()}
            {' © '}
            Developed By Priyam Kumar
        </Typography>
    )
}

export default CopyRight