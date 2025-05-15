import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { MenuComponent } from './MenuComponent';
import SportsBarIcon from "@mui/icons-material/SportsBar";
import MapIcon from '@mui/icons-material/Map';
import theme from '../Theme'
import { Box, FormControl, InputLabel } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDrinkStore } from "../store/drinkStore";
import {useUser} from "../store/UserContext.tsx";

const AppBarComponent: React.FC = () => {
  const {user} = useUser();
  const [openDrawer, setOpenDrawer] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const menuItems = [(user !== null) ? user.username : 'Log In', 'About', 'Contact'];
  const navigate = useNavigate();
  const location = useLocation();
  const {defaultDrink, setDefaultDrink} = useDrinkStore();

  const toggleDrawer = (open: boolean) => () => {
    setOpenDrawer(open);
  };
  const toggleBarList = () => {
    navigate('/bars')
  } 
  const toggleLandingPage = () => {
    navigate('/')
  }

  const handleChange = (event: SelectChangeEvent) => {
    setDefaultDrink(event.target.value);
  };

  return (
    <AppBar position="sticky" color='secondary'>
    <Toolbar>
      {/* Desktop view */}
      {!isMobile && (
        <IconButton edge="start" color="inherit" aria-label="home" onClick={toggleLandingPage}>
         <img src="/logo.png" alt="Logo" style={{ height: 32 }} />
        </IconButton>
      )}
      {!isMobile && menuItems.map((item) => (
        item !== "About" && item !== "Contact" ? (
          <Button key={item} color="inherit" onClick={() => navigate(`/profile`)}>
            {item}
          </Button>
        ) : (
          <Button key={item} color="inherit" onClick={() => navigate(`/${item.toLowerCase().replace(" ", "")}`)}>
            {item}
          </Button>
        )
      ))}

      {/* Mobile view */}
      {isMobile && (
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
      )}

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
        }}
      >
        <MenuComponent onClose={toggleDrawer(false)} />
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
                  value={defaultDrink}
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
                  <MenuItem value={'View all'}>View all</MenuItem>
                  <MenuItem value={'Beer'}>Beer</MenuItem>
                  <MenuItem value={'Wine'}>Wine</MenuItem>
                  <MenuItem value={'Coffee'}>Coffee</MenuItem>
              </Select>
          </FormControl>

        </Box>
        {location.pathname !== '/' 
        ? <IconButton color="inherit" aria-label="bars" onClick={toggleLandingPage}>
            <MapIcon />
          </IconButton>
        : <IconButton color="inherit" aria-label="bars" onClick={toggleBarList}>
            <SportsBarIcon />
          </IconButton>}
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
