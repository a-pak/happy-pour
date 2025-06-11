import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  Typography, IconButton,
  Box, List, ListItem, 
  ListItemText, Grid, 
  Button,Drawer,
  Divider, 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import barsService from '../services/bars.ts';
import { BarData } from '../model/IbarInterface.ts';
import { useMapStore } from '../store/mapStore.ts';
import { useDrinkStore } from '../store/drinkStore.ts';
import theme from '../Theme.tsx';

const BarDetailsCard = () => {
    const { id } = useParams<{ id: string }>();
    const [barData, setBarData] = useState<BarData | null>(null);
    const navigate = useNavigate();
    const flyTo = useMapStore((state) => state.flyTo);
    const defaultDrink = useDrinkStore((state) => state.defaultDrink);
    
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

      
    
    const getNormalPrice = (drinkName: string) => {
      const normalDrink = drinks.find((d: any) => d.name === drinkName);
      const drinkPrice = normalDrink ? normalDrink.normalPrice.toFixed(2) : null;
      return drinkPrice ? `${drinkPrice} €`: null;
    };

    const getHappyHourPrice = (drinkName: string) => {
      const happyHourDrink = happyHourDrinks.find((d: any) => d.drinkName === drinkName);
      const happyHourPrice = happyHourDrink ? happyHourDrink.happyHourPrice.toFixed(2) : null;
      return happyHourPrice ? `${happyHourPrice} €` : null;
    }

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
        <Box sx={{ width: 350, p: 2 }}>
  {/* Close button */}
  <IconButton
    onClick={handleClose}
    sx={{
      position: 'absolute',
      top: 8,
      right: 8,
      color: 'white',
    }}
    aria-label="close"
  >
    <CloseIcon />
  </IconButton>

  {/* Row 1: Bar Details (Left) and Default Drink (Right) */}
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
  {/* Left Box: Bar Details */}
  <Box sx={{ flex: 1 }}>
    <Box sx={{ p: 1}}>
      <Typography variant="h6">{bar.name}</Typography>
      <Typography><strong>Address:</strong> {bar.address}</Typography>
      <Typography><strong>Open:</strong> {bar.openFrom.slice(0, -3)} - {bar.openTo.slice(0, -3)}</Typography>
      { bar.cloakroomFee > 0 && (
        <Typography><strong>Cloakroom Fee:</strong> €{bar.cloakroomFee}</Typography>  
      )}
      { bar.entryFee > 0 && (
        <Typography><strong>Entry Fee:</strong> €{bar.entryFee}</Typography>
      )}
    </Box>
  </Box>

  {/* Right Box: Default Drink */}
  {(defaultDrink !== "View all" && (getNormalPrice(defaultDrink) || getHappyHourPrice(defaultDrink))) && (
    <Box
      sx={{
        ml: 2,
        p: 1,
        textAlign: 'left',
        minWidth: '100px',
      }}
    >
      <Typography variant="body2" sx={{ color: '#b57edc' }}>
        {defaultDrink}
      </Typography>
      <Typography variant="h4" sx={{ color: isHappyHourNow() && getHappyHourPrice(defaultDrink) ? 	'rgb(70, 234, 70)' : theme.palette.primary.contrastText, fontWeight: 'bold' }}>
        {isHappyHourNow() && getHappyHourPrice(defaultDrink) ? getHappyHourPrice(defaultDrink): getNormalPrice(defaultDrink)}
      </Typography>
      {(isHappyHourNow() && happyHour) && (
        <>
          <Typography variant="caption" sx={{ color: '#E6BE8A' }}>
            Happy Hour!
          </Typography>
          <Typography><strong>Until: </strong>{happyHour.endTime.slice(0,-3)}</Typography>
        </>
      )}
    </Box>
  )}
</Box>

  {/* More Button */}
  <Link to={`/bar/details/${bar.id}`} style={{ textDecoration: 'none' }}>
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
      More
    </Button>
  </Link>

  <Divider sx={{ my: 2 }} />

  {/* Meta Info */}
  <Typography variant="caption" display="block">
    Created by {bar.createdBy ? bar.createdBy.username : "Unknown user"} at {new Date(bar.createdAt).toLocaleString()}
  </Typography>
  <Typography variant="caption" display="block">
    Last updated by {bar.updatedBy ? bar.updatedBy.username : "Unknown user"} at {new Date(bar.updatedAt).toLocaleString()}
  </Typography>
</Box>
      );
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
      backgroundColor: 'primary',
      overflow: 'auto',
    },
  }}
    >
      {renderDrawerContent()}
    </Drawer>
  );
};

export default BarDetailsCard;
