import React, { forwardRef } from 'react';
import { Slide } from "@mui/material";

// This is a reusable transition component for Material-UI Dialogs.
// It is the only truly constant, reusable piece of logic from the original file.
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// All other functions have been removed as their logic is now handled
// directly within the components that need them, which is a more consistent
// and maintainable pattern for this project.
export { Transition };
