import { Outlet } from "react-router-dom";
import AppBarComponent from "./AppBarComponent";
import { GlobalErrorNotifier } from "./GlobalErrorNotifier";
import { Box } from "@mui/material";

const LayoutComponent = () => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            position: 'relative'
        }}>
            <AppBarComponent />
            <GlobalErrorNotifier />
            <Box sx={{
                flex: 1,
                position: 'relative',
                zIndex: (theme) => theme.zIndex.appBar - 1
            }}>
                <Outlet />
            </Box>
        </Box>
    )
}

export default LayoutComponent;