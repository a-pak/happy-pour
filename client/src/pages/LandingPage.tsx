import { Fab, IconButton, SwipeableDrawer } from "@mui/material";
import { Link } from "react-router-dom";
import MapsComponent from "../components/MapsComponent";
import AddIcon from '@mui/icons-material/Add';
import { Outlet } from "react-router-dom";
import SubmitPage from "./SubmitPage";
import { useState } from "react";
import { ThemeProvider } from "@emotion/react";
import theme from "../Theme";

const LandingPage = () => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    
    return (
        <>
            <ThemeProvider theme={theme}>
            <Fab 
                color="secondary" 
                aria-label="add"
                onClick={() => setDrawerOpen(true)}
                style={{ position: 'absolute', bottom: 50, right: 30, zIndex: 1000 }}
            >
                <AddIcon />
            </Fab>
            <MapsComponent/>

            

            <SwipeableDrawer
                anchor="bottom" // Drawer avautuu oikealta
                open={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
                onOpen={() => setDrawerOpen(true)}
                sx={{
                "& .MuiDrawer-paper": {
                    width: "100%",
                    backgroundColor: "#1F1F1F" // Leveys Drawerille
                },
                }}
            >
                {/* SubmitPage lomake Drawerissa */}
                <SubmitPage />
            </SwipeableDrawer>
            <Outlet />
            </ThemeProvider>
        </>
    )
} 
export default LandingPage;