// AppBarComponent.tsx
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { FormControl, InputLabel } from '@mui/material';

const AppBarComponent: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const theme = useTheme(); // Haetaan MUI teema
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Tarkistaa, onko näyttö pieni

  const toggleDrawer = (open: boolean) => () => {
    setOpenDrawer(open);
  };
  const menuItems = ['Log In', 'About', 'Contact'];

  const [drink, setDrink] = useState('Draft Beer (0,5 l)')
  const handleChange = (event: SelectChangeEvent) => {
    setDrink(event.target.value);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        {isMobile && (
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
        )}

        {/*
        <Typography variant="h6" sx={{ flexGrow: 1 }} align='center'>
          Happy Pour
        </Typography>
        {!isMobile && menuItems.map((item) => (
          <Button key={item} color="inherit">{item}</Button>
        ))}        
        */}

        <FormControl variant="standard" sx={{ m: 1, minWidth: 120, ml: 'auto' }}>
        <InputLabel id="demo-simple-select-standard-label">Drink</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={drink}
            onChange={handleChange}
            label="Drink"
            sx={{
              width: 220,
              '& .MuiOutlinedInput-root': {
                border: 'none',
              }}}
          >
            <MenuItem value={'b0,5'}>Draft Beer (0,5 l)</MenuItem>
            <MenuItem value={'w0,75'}>House Wine (0,75 l)</MenuItem>
          </Select>
        </FormControl>
      </Toolbar>


      <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer(false)}>
        <List>
          {menuItems.map((item) => (
            <ListItem component="li" key={item}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default AppBarComponent;
