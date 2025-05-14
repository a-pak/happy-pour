import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Box, Typography } from '@mui/material';
import {Link} from "react-router-dom";
import { useUser } from '../store/UserContext';


export const MenuComponent = () => {
    const {user} = useUser();
    const menuItems = [(user !== null) ? user.username : 'Log In', 'About', 'Contact'];

    return (
        <>
            <Box
                component="img"
                src="/logowtext.png"
                alt="Framed"
                sx={{ width: '30vh', height: 'auto' }}
            />
            

            <List>
                {menuItems.map((item) => {
                    if (item !== "About" && item !== "Contact") {
                        return (
                            <Link 
                                to={`/profile`} 
                                key={item}
                                style={{ textDecoration: 'none' }}
                            >
                                <ListItemButton component="li">
                                    <ListItemText>
                                        <Typography style={{ fontWeight: 'bold' }}>
                                            {item.toUpperCase()}
                                        </Typography>
                                    </ListItemText>
                                </ListItemButton>
                            </Link>
                        );
                    }

                    return (
                        <Link 
                            to={`/${item.toLowerCase()}`} 
                            key={item}
                            style={{ textDecoration: 'none' }}
                        >
                            <ListItemButton component="li">
                                <ListItemText>
                                    <Typography>
                                        {item.toUpperCase()}
                                    </Typography>
                                </ListItemText>
                            </ListItemButton>
                        </Link>
                    );
                })}

            </List>
        </>
    )
}
