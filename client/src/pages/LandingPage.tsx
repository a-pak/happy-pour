import MapsComponent from "../components/MapsComponent";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import theme from "../Theme";

const LandingPage = () => {
    return (
        <div style={{ position: 'relative', zIndex: 10 }}>
            <ThemeProvider theme={theme}>           
            <MapsComponent/>   
            <Outlet />
            </ThemeProvider>
        </div>
    )
} 

export default LandingPage;