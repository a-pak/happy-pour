import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Grid,
  Button,
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import barsService from '../services/bars.ts';
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
    return (
      <Box sx={{ color: '#b57edc', textAlign: 'center', mt: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const { bar, drinks, happyHour, happyHourDrinks } = barData;

  const getDrinkPrice = (drinkName: string) => {
    const normalDrink = drinks.find((d: any) => d.name === drinkName);
    const happyHourDrink = happyHourDrinks.find((d: any) => d.drinkName === drinkName);
    if (happyHourDrink) {
      return (
        <span style={{ color: '#00e676' }}>
          {happyHourDrink.happyHourPrice} € <em>(Happy Hour)</em>
        </span>
      );
    }
    return normalDrink ? `${normalDrink.normalPrice} €` : 'N/A';
  };

  const removeBar = () => {
    if (window.confirm('Are you sure you want to delete this bar?')) {
      barsService.removeById(bar.id).then(() => navigate('/'));
    }
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: '#121212', minHeight: '100vh' }}>
      <Paper
        elevation={4}
        sx={{
          padding: 3,
          backgroundColor: '#1e1e1e',
          color: '#b57edc',
          borderRadius: '12px',
          maxWidth: 600,
          margin: '0 auto',
        }}
      >
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={10}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#d1b3ff' }}>
              {bar.name}
            </Typography>
          </Grid>
          <Grid item xs={2} sx={{ textAlign: 'right' }}>
            <IconButton onClick={() => navigate(-1)} sx={{ color: '#b57edc' }}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ color: '#d1b3ff', mt: 1 }}>
          {bar.address}
        </Typography>

        <List>
          {drinks.map((drink: any) => (
            <ListItem key={drink.id} disablePadding sx={{ color: '#e0cfff' }}>
              <ListItemText
                primary={drink.name}
                secondary={getDrinkPrice(drink.name)}
                primaryTypographyProps={{ sx: { fontWeight: 'bold' } }}
              />
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemText primary="Entry Fee" secondary={`${bar.entryFee} €`} />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText primary="Cloakroom Fee" secondary={`${bar.cloakroomFee} €`} />
          </ListItem>
          {happyHour && (
            <ListItem disablePadding>
              <ListItemText
                primary="Happy Hour"
                secondary={`${happyHour.startTime} - ${happyHour.endTime}`}
              />
            </ListItem>
          )}
        </List>

        <Box
            sx={{
              mt: 3,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              alignItems: 'stretch',
            }}
          >
          <Link to={`/update/${bar.id}`} style={{ textDecoration: 'none' }}>
            <Button
              
              variant="outlined"
              sx={{
                width: { xs: '100%', sm: 'auto' },
                borderColor: '#b57edc',
                color: '#b57edc',
                '&:hover': {
                  backgroundColor: '#b57edc22',
                  borderColor: '#b57edc',
                },
              }}
            >
              Update Prices
            </Button>
          </Link>
          <Button
            
            onClick={removeBar}
            variant="outlined"
            sx={{
              width: { xs: '100%', sm: 'auto' },
              borderColor: '#ff5252',
              color: '#ff5252',
              '&:hover': {
                backgroundColor: '#ff525222',
              },
            }}
          >
            Delete Bar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default BarDetailsPage;
