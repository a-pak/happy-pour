import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Box, Typography, Divider } from '@mui/material';
import { Link } from "react-router-dom";
import { useUserStore } from '../store/userStore.ts';
import React from 'react';

type MenuComponentProps = {
    onClose: () => void;
  };

  
export const MenuComponent: React.FC<MenuComponentProps> = ({ onClose }) => {
    const { user } = useUserStore();
    const menuItems = [(user !== null) ? user.username : 'Log In', 'About', 'Contact'];

    return (
        <Box sx={{ px: 3, pt: 4 }}>
          {/* Klikattava logo, joka myös sulkee drawerin */}
          <Link to="/" style={{ textDecoration: 'none' }} onClick={onClose}>
            <Box
              component="img"
              src="/logowtext.png"
              alt="Framed"
              sx={{
                width: '22vh',
                height: 'auto',
                display: 'block',
                mx: 'auto',
                my: 4,
                cursor: 'pointer',
              }}
            />
          </Link>
    
          <Divider sx={{ mb: 2, borderColor: 'grey.700' }} />
    
          <List>
            {menuItems.map((item, index) => {
              const isProfile = item !== "About" && item !== "Contact";
              const path = isProfile ? "/profile" : `/${item.toLowerCase()}`;
    
              return (
                <Link
                  to={path}
                  key={index}
                  style={{ textDecoration: 'none' }}
                  onClick={onClose}
                >
                  <ListItemButton
                    component="li"
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                        color: 'white',
                      }
                    }}
                  >
                    <ListItemText>
                      <Typography
                        sx={{
                          fontWeight: isProfile ? 'bold' : 'normal',
                          fontSize: '1.1rem',
                          color: 'inherit'
                        }}
                      >
                        {item.toUpperCase()}
                      </Typography>
                    </ListItemText>
                  </ListItemButton>
                </Link>
              );
            })}
          </List>
        </Box>
      );
    };