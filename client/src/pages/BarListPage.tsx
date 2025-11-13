import React, { useEffect, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Box,
  Drawer,
  useMediaQuery,
  IconButton,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import barsService from '../services/bars';
import { useTheme } from '@mui/material/styles';
import { useDrinkStore } from '../store/drinkStore';
import { BarData } from '../model/IbarInterface';
import { getCheapestPrice } from '../utils/priceUtil';
import CloseIcon from '@mui/icons-material/Close';
import { useLocationStore } from '../store/locationStore';
import { calculateDistance } from '../utils/locationUtil';
import { useMapStore } from '../store/mapStore';
const BarListPage: React.FC = () => {
  const [bars, setBars] = useState<BarData[]>([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const defaultDrink = useDrinkStore((state) => state.defaultDrink);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {userLocation} = useLocationStore();
  const {mapCenter} = useMapStore();

  useEffect(() => {
    barsService
      .getAll()
      .then((data: any[]) => {
        setBars(data);
      })
      .catch((err) => console.error('Failed to fetch bars:', err));
  }, []);
  const showAll = defaultDrink.toLowerCase() === "View all".toLowerCase();
  // --- TODO: 🍝 Mamma Mia! This spaghetti has been in my family for generations! 🍝 ---
  
  // Filter NaN prices
  const filteredBars = showAll ? bars : bars.filter((bar) => (getCheapestPrice(bar, defaultDrink) != null));
  
  // Sort by location
  const currentLocation = userLocation ? userLocation : mapCenter;
  const barsSortedByLocation = filteredBars.sort((a,b) => {
    const distanceA = calculateDistance(currentLocation, {latitude: a.bar.coordLat, longitude: a.bar.coordLong})
    const distanceB = calculateDistance(currentLocation, {latitude: b.bar.coordLat, longitude: b.bar.coordLong})
    return distanceA - distanceB;
  })

   // sort by price
  const barsSortedByPrice = filteredBars.sort((a, b) => {
    const priceA = getCheapestPrice(a, defaultDrink) || Infinity;
    const priceB = getCheapestPrice(b, defaultDrink) || Infinity;
    return priceA - priceB;
  });

  // If show all then show all bars sorted by location.
  const barsSorted = showAll ? barsSortedByLocation : barsSortedByPrice;
  
  const handleClose = () => {
    navigate("/");
  };

  const renderContent = () => {
    return (
      <Box sx={{
        width: '100%',
        p: isMobile ? '8px 16px' : 2,
        position: 'relative',
        marginTop: isMobile ? 0 : '64px',
        boxSizing: 'border-box'
      }}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'white'
          }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
          Bar List
        </Typography>

        <TableContainer component={Paper} sx={{ 
          border: 'none',
          backgroundColor: 'transparent'
        }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.secondary.light }}>
                <TableCell sx={{ color: theme.palette.primary.contrastText }}>
                  Bar Name
                </TableCell>
                <TableCell align="right" sx={{ color: theme.palette.secondary.contrastText }}>
                  {showAll ? `Distance (km)` : `${defaultDrink} Price (€)`}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {barsSorted.map((bar) => (
                <TableRow
                  key={bar.bar.id}
                  hover
                  sx={{ 
                    backgroundColor: theme.palette.primary.light, 
                    cursor: 'pointer', 
                    '&:hover': { backgroundColor: theme.palette.action.hover } 
                  }}
                  onClick={() => navigate(`/bars/${bar.bar.id}`)}
                >
                  <TableCell>{bar.bar.name}</TableCell>
                  <TableCell align="right">
                    {
                      showAll ? 
                      `${calculateDistance(currentLocation, {latitude: bar.bar.coordLat, longitude: bar.bar.coordLong}).toPrecision(3)} km` :
                      `${getCheapestPrice(bar, defaultDrink)?.toFixed(2)} €`
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <>
      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={true}
          onClose={handleClose}
          variant='persistent'
          hideBackdrop={true}
          ModalProps={{
            keepMounted: true,
            disableEnforceFocus: true,
            disableScrollLock: true
          }}
          PaperProps={{
            sx: {
              width: '100%',
              height: '100%',
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
            },
          }}
        >
          {renderContent()}
        </Drawer>
      ) : (
        <Drawer
          anchor="right"
          open={true}
          onClose={handleClose}
          variant='persistent'
          hideBackdrop={true}
          ModalProps={{
            keepMounted: true,
            disableEnforceFocus: true,
            disableScrollLock: true
          }}
          PaperProps={{
            sx: {
              width: '400px',
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
            },
          }}
        >
          {renderContent()}
        </Drawer>
      )}
    </>
  );
};

export default BarListPage;
