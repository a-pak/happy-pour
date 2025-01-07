import { Fab, Link } from "@mui/material";
import AppBarComponent from "../components/AppBarComponent";
import MapsComponent from "../components/MapsComponent";
import AddIcon from '@mui/icons-material/Add';

const LandingPage = () => {
    return (
        <>
            <MapsComponent/>
            <Link to='/submit' style={{ position: 'absolute', bottom: 16, right: 16, zIndex: 10 }}>
                <Fab color="primary" aria-label="add">
                    <AddIcon />
                </Fab>
            </Link>
        </>
    )
} 
export default LandingPage;