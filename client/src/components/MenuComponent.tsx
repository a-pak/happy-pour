import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Typography } from '@mui/material';
import {Link} from "react-router-dom";


export const MenuComponent = () => {
    const menuItems = ['Search', 'Login', 'About', 'Contact'];

    return (
        <div>
            <Typography variant="h4" sx={{ flexGrow: 1, margin: 5 }} align='center'>
            Happy Pour
            </Typography>
            <List>
                {menuItems.map((item) => (
                    <Link to={`/${item.toLowerCase()}`} key={item}>
                        <ListItemButton component="li">
                            <ListItemText primary={item} />
                        </ListItemButton>
                    </Link>
                ))}
            </List>
        </div>
    )
}
