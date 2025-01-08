import { Fab } from "@mui/material";
import { Link } from "react-router-dom";
import MapsComponent from "../components/MapsComponent";
import AddIcon from '@mui/icons-material/Add';
import { Outlet } from "react-router-dom";

const LandingPage = () => {
    return (
        <>
            <MapsComponent/>
            <Link to='/submit' style={{ position: 'absolute', bottom: 25, right: 60, zIndex: 10 }}>
                <Fab color="secondary" aria-label="add">
                    <AddIcon />
                </Fab>
            </Link>
            <Outlet />
        </>
    )
} 
export default LandingPage;