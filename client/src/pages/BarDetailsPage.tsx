import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText, IconButton, Grid, Button } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import barsService from '../services/bars.ts';
import theme from '../Theme';
import CloseIcon from '@mui/icons-material/Close';

const BarDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [barData, setBarData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      barsService
        .getById(parseInt(id))
        .then((data) => setBarData(data))
        .catch((err) => console.error('Failed to fetch bar:', err));
    }
  }, [id]);

  if (!barData) {
    return <Typography>Loading...</Typography>;
  }

  const { bar, drinks, happyHour, happyHourDrinks } = barData;

  const getDrinkPrice = (drinkName: string) => {
    const normalDrink = drinks.find((d: any) => d.name === drinkName);
    const happyHourDrink = happyHourDrinks.find((d: any) => d.drinkName === drinkName);
    
    if (happyHourDrink) {
      return `${happyHourDrink.happyHourPrice} € (Happy Hour)`;
    }
    return normalDrink ? `${normalDrink.normalPrice} €` : 'N/A';
  };

  const removeBar = () => {
    if (window.confirm('Are you sure you want to delete this bar?')) {
      if (id) {
        barsService.removeById(bar.id).then(() => navigate('/'));
      }
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Paper sx={{ padding: 2, backgroundColor: theme.palette.secondary.main }}>
        <Grid container spacing={1}>
          <Grid item xs={10}>
            <Typography variant="h4" gutterBottom>
              {bar.name}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <IconButton
              aria-label="close"
              size="large"
              sx={{ color: 'text.primary', position: 'relative', left: '20px' }}
              onClick={() => navigate(-1)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Grid>
        </Grid>
        <Typography variant="subtitle1" gutterBottom>
          Address: {bar.address}
        </Typography>
        <List>
          {drinks.map((drink: any) => (
            <ListItem key={drink.id}>
              <ListItemText primary={drink.name} secondary={getDrinkPrice(drink.name)} />
            </ListItem>
          ))}
          <ListItem>
            <ListItemText primary="Entry Fee" secondary={`${bar.entryFee} €`} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Cloakroom Fee" secondary={`${bar.cloakroomFee} €`} />
          </ListItem>
          {happyHour && (
            <ListItem>
              <ListItemText
                primary="Happy Hour"
                secondary={`${happyHour.startTime} - ${happyHour.endTime}`}
              />
            </ListItem>
          )}
        </List>

        <Link to={`/update/${bar.id}`}>
          <Button sx={{ backgroundColor: theme.palette.secondary.light }}>Update Prices</Button>
        </Link>
        <Button onClick={removeBar}>Delete Bar (please don't)</Button>
      </Paper>
    </Box>
  );
};

export default BarDetailsPage;
