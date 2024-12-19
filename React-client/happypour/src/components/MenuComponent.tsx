import React, { useState } from 'react'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FormControl, InputLabel, Typography } from '@mui/material';


export const MenuComponent = ({  }) => {
    const menuItems = ['Search', 'Log In', 'About', 'Contact'];

    return (
        <div>
            <Typography variant="h4" sx={{ flexGrow: 1, margin: 5 }} align='center'>
            Happy Pour
            </Typography>
            <List>
            {menuItems.map((item) => (
              <ListItemButton component="li" key={item}>
                <ListItemText primary={item} />
              </ListItemButton>
            ))}
          </List>
        </div>
    )
}
