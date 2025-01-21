import MapsComponent from "../components/MapsComponent";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import theme from "../Theme";

const LandingPage = () => {
    
    return (
        <>
            <ThemeProvider theme={theme}>           
                <MapsComponent/>
                <Outlet />
            </ThemeProvider>
        </>
    )
} 
export default LandingPage;