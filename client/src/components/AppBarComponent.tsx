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
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { MenuComponent } from './MenuComponent';
import { ThemeProvider } from '@emotion/react';
import SportsBarIcon from "@mui/icons-material/SportsBar";
import theme from '../Theme'
import { Box, FormControl, InputLabel } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';


const AppBarComponent: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openBarList, setOpenBarList] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const menuItems = ['Log In', 'About', 'Contact'];
  const toggleDrawer = (open: boolean) => () => {
    setOpenDrawer(open);
  };
  const toggleBarList = (open: boolean) => () => {
    setOpenBarList(open)
  } 

  const [drink, setDrink] = useState('b0,5')
  const handleChange = (event: SelectChangeEvent) => {
    setDrink(event.target.value);
  };



  return (
    <ThemeProvider theme={theme}>
    <AppBar position="sticky" color='secondary'>
      <Toolbar>
        {isMobile && (
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
        )}
        {!isMobile && menuItems.map((item) => (
          <Button key={item} color="inherit">{item}</Button>
        ))}
        <Drawer 
          color='primary' 
          anchor="left" 
          open={openDrawer} 
          onClose={toggleDrawer(false)}
          sx={{
            '& .MuiDrawer-paper': {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText', 
            },
          }} >
          <MenuComponent />
        </Drawer>
        <Box sx={{ flexGrow: 1, 
                    display: 'flex',
                    justifyContent: 'center'
         }}>
          <FormControl variant="standard" sx={{ minWidth: 120, ml: 'auto', marginBottom: 1}}>
              <InputLabel id="drink-selector"></InputLabel>
              <Select
                  labelId="drink-selector-label"
                  id="drink-selector-standard"
                  value={drink}
                  onChange={handleChange}
                  label="Drink"
                  sx={{
                  width: 220,
                  '& .MuiOutlinedInput-root': {
                      border: 'none',
                      color: 'primary.main'
                  }}}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "grey.900", 
                        color: "white",
                      },
                    },
                  }}
              >
                  <MenuItem value={'b0,5'}>Draft Beer (0,5 l)</MenuItem>
                  <MenuItem value={'w0,75'}>House Wine (0,75 l)</MenuItem>
              </Select>
          </FormControl>

        </Box>
        <IconButton color="inherit" aria-label="bars" onClick={toggleDrawer(true)}>
          <SportsBarIcon />
        </IconButton>
      </Toolbar>
      
    </AppBar>
    </ThemeProvider>
  );
};

export default AppBarComponent;
