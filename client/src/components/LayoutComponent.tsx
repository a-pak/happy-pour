import { Outlet } from "react-router-dom";
import AppBarComponent from "./AppBarComponent";
import { GlobalErrorNotifier } from "./GlobalErrorNotifier";
import { Box } from '@mui/material';

const LayoutComponent = () => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
        }}>
            <AppBarComponent /> {/* Should be fixed inside the component itself */}
            <GlobalErrorNotifier /> 
            <Outlet />
        </Box>
    );
}


export default LayoutComponent;