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
import { BarData } from '../model/IbarInterface.ts';
import { PriceDTO } from '../model/IPriceInterface.ts';
import { getCurrentHappyHour } from '../utils/happyHourUtil.ts';

const BarDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [barData, setBarData] = useState<BarData | null>(null);
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

  const { bar, prices } = barData;

  const getDrinkPrice = (drinkName: string) => {
    const normalPrice = prices.find((p: PriceDTO) => p.drinkName === drinkName);
    return normalPrice ? `${normalPrice.price} €` : 'N/A';
  };

  const removeBar = () => {
    navigate(`/bars/delete/${bar.id}`);
  };
  
  const currentHappyHour = getCurrentHappyHour(barData);

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
            <IconButton onClick={() => navigate('/')} sx={{ color: '#b57edc' }}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ color: '#d1b3ff', mt: 1 }}>
          {bar.address}
        </Typography>

        {currentHappyHour && (
          <Box sx={{ mt: 3, p: 2, backgroundColor: '#2e2e2e', borderRadius: '8px' }}>
            <Typography variant="h6" sx={{ color: '#00e676', mb: 1 }}>
              Happy Hour Prices
            </Typography>
            <List>
              {currentHappyHour.prices.map((hhPrice: PriceDTO) => (
                <ListItem key={hhPrice.drinkName} disablePadding>
                  <ListItemText
                    primary={hhPrice.drinkName}
                    secondary={`${hhPrice.price} €`}
                    primaryTypographyProps={{ sx: { color: '#b2ff59', fontWeight: 'bold' } }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        <List>
          {prices.map((price: PriceDTO) => (
            <ListItem key={price.id} disablePadding sx={{ color: '#e0cfff' }}>
              <ListItemText
                primary={price.drinkName}
                secondary={getDrinkPrice(price.drinkName)}
                primaryTypographyProps={{ sx: { fontWeight: 'bold' } }}
              />
            </ListItem>
          ))}
          {/*<ListItem disablePadding>
            <ListItemText primary="Entry Fee" secondary={`${bar.entryFee} €`} />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText primary="Cloakroom Fee" secondary={`${bar.cloakroomFee} €`} />
          </ListItem>*/}
          {currentHappyHour && (
            <ListItem disablePadding>
              <ListItemText
                primary="Happy Hour"
                secondary={`${currentHappyHour.startTime} - ${currentHappyHour.endTime}`}
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
          <Link to={`/prices/update/${bar.id}`} style={{ textDecoration: 'none' }}>
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
          <Link to={`/bars/delete/${bar.id}`}>
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
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default BarDetailsPage;
