import MapsComponent from "../components/MapsComponent";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import theme from "../Theme";
import { Box } from "@mui/material";

const LandingPage = () => {
    return (
        <ThemeProvider theme={theme}>           
            <Box sx={{ 
                display: 'flex',
                position: 'relative',
                height: '100vh'
            }}>
                <Box sx={{ 
                    flexGrow: 1,
                    position: 'relative'
                }}>
                    <MapsComponent/>
                </Box>
                <Outlet />
                
            </Box>
        </ThemeProvider>
    )
} 

export default LandingPage;