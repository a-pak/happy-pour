import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  Typography, IconButton,
  Box, List, ListItem, 
  ListItemText, Grid, 
  Button,Drawer, 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import barsService from '../services/bars.ts';
import { BarData } from '../model/IbarInterface.ts';
import { useMapStore } from '../store/mapStore.ts';

const BarDetailsCard = () => {
    const { id } = useParams<{ id: string }>();
    const [barData, setBarData] = useState<BarData | null>(null);
    const navigate = useNavigate();
    const flyTo = useMapStore((state) => state.flyTo);
  
    useEffect(() => {
      if (id) {
        barsService
          .getById(parseInt(id))
          .then((data) => setBarData(data))
          .catch((err) => console.error('Failed to fetch bar:', err));
      }
    }, [id]);
    
    function renderDrawerContent() {
      if (!barData) {
        return (
          <>
            <Typography>Loading...</Typography>
          </>
        );
      }

    const { bar, drinks, happyHour, happyHourDrinks } = barData;
    flyTo(bar.coordLat, bar.coordLong, 15);
    
    const getDrinkPrice = (drinkName: string) => {
      const normalDrink = drinks.find((d: any) => d.name === drinkName);
      return normalDrink ? `${normalDrink.normalPrice} €` : 'N/A';
    };
  
    const isHappyHourNow = () => {
      if (!happyHour) return false;
      const now = new Date();
      const currentTime = now.getHours() + now.getMinutes() / 60;
    
      const [startHour, startMinute] = happyHour.startTime.split(':').map(Number);
      const [endHour, endMinute] = happyHour.endTime.split(':').map(Number);
      const startTime = startHour + startMinute / 60;
      const endTime = endHour + endMinute / 60;
    
      return currentTime >= startTime && currentTime <= endTime;
    };
      return (
        <Box sx={{ padding: 3 }}>
        {/* Header Section */}
        <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={10}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d1b3ff' }}>
              {bar.name}
            </Typography>
          </Grid>
          <Grid item xs={2} sx={{ textAlign: 'right' }}>
            <IconButton onClick={handleClose} sx={{ color: '#b57edc' }}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>

        {/* Address */}
        <Typography variant="subtitle1" sx={{ color: '#d1b3ff', mb: 2 }}>
          {bar.address}
        </Typography>

        {/* Happy Hour Section */}
        {isHappyHourNow() && (
          <Box sx={{ mb: 3, p: 2, backgroundColor: '#2e2e2e', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: '#00e676', mb: 1 }}>
              Happy Hour Prices
            </Typography>
            <List dense>
              {happyHourDrinks.map((drink: any) => (
                <ListItem key={drink.drinkName} disablePadding>
                  <ListItemText
                    primary={drink.drinkName}
                    secondary={`${drink.happyHourPrice} €`}
                    primaryTypographyProps={{ sx: { color: '#b2ff59', fontWeight: 'bold' } }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Regular Drinks */}
        <Box sx={{ mb: 2 }}>
          <List dense>
            {drinks.map((drink: any) => (
              <ListItem key={drink.id} disablePadding>
                <ListItemText
                  primary={drink.name}
                  secondary={getDrinkPrice(drink.name)}
                  primaryTypographyProps={{ sx: { color: '#e0cfff', fontWeight: 'bold' } }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Fees and Happy Hour Time */}
        <Box sx={{ mb: 2 }}>
          <List dense>
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
        </Box>

        {/* Actions */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mt: 3,
          }}
        >
          <Link to={`/bar/edit/${bar.id}`} style={{ textDecoration: 'none' }}>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                borderColor: '#b57edc',
                color: '#b57edc',
                '&:hover': {
                  backgroundColor: '#b57edc22',
                  borderColor: '#b57edc',
                },
              }}
            >
              More
            </Button>
          </Link>
        </Box>
      </Box>
      )
    }

  const handleClose = () => {
    navigate("/");
  };

  return (
    <Drawer
      anchor="bottom"
      open={true}
      onClose={handleClose}
      variant='persistent'
      hideBackdrop={true}
      ModalProps={{
    keepMounted: true,          // optional: improves mobile performance
    disableEnforceFocus: true,  // allows background interaction
    disableScrollLock: true     // optional: allows page scroll in background
  }}
  PaperProps={{
    sx: {
      maxHeight: '90vh',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      backgroundColor: '#121212',
      overflow: 'auto',
    },
  }}
    >
      {renderDrawerContent()}
    </Drawer>
  );
};

export default BarDetailsCard;
