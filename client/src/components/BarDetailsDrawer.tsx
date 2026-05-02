import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Typography, IconButton,
  Box, Button, Drawer,
  Divider,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import barsService from '../services/bars.ts';
import { BarData } from '../types/IbarInterface.ts';
import { useMapStore } from '../store/mapStore.ts';
import { useDrinkStore } from '../store/drinkStore.ts';
import theme from '../Theme.tsx';
import { PriceDTO } from '../types/IPriceInterface.ts';
import { getCurrentHappyHour } from '../utils/happyHourUtil.ts';
import { formatTimestamp } from '../utils/timeUtils.ts';

const BarDetailsDrawer = () => {
  const { id } = useParams<{ id: string }>();
  const [barData, setBarData] = useState<BarData | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const flyTo = useMapStore((state) => state.flyTo);
  const setView = useMapStore((state) => state.setView);
  const defaultDrink = useDrinkStore((state) => state.defaultDrink);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const fromMarkerClick = (location.state as any)?.fromMarkerClick || false;

  useEffect(() => {
    if (id) {
      barsService
        .getById(parseInt(id))
        .then((data) => setBarData(data))
        .catch((err) => console.error('Failed to fetch bar:', err));
    }
  }, [id]);

  useEffect(() => {
    if(barData) {
      if (fromMarkerClick) {
        // Animate fly to for marker clicks
        flyTo(barData.bar.coordLat, barData.bar.coordLong);
      } else {
        // Direct navigation for URL access
        setView(barData.bar.coordLat, barData.bar.coordLong, 16);
      }
    }
  }, [barData, flyTo, setView, fromMarkerClick])

  function renderDrawerContent() {
    if (!barData) {
      return (
        <>
          <Typography>Loading...</Typography>
        </>
      );
    }

    const { bar, prices } = barData;

    const activeHappyHour = getCurrentHappyHour(barData);

    const getNormalPrice = () : PriceDTO | null => {
      let normalPrice : PriceDTO | null = null;
      let cheapestAmount = Number.MAX_VALUE;
      prices.forEach(p => {      
        if(p.drinkType === defaultDrink 
          && p.happyHourId === null 
          && p.price < cheapestAmount) {
            normalPrice = p;
            cheapestAmount = p.price;
        }
      });
      return normalPrice ? normalPrice : null;
    };

    const getHappyHourPrice = () : PriceDTO | null => {
      let happyHourPrice : PriceDTO | null = null;
      if(activeHappyHour) {
        let cheapestAmount = Number.MAX_VALUE;
        activeHappyHour.prices.forEach(p => {
          if(p.drinkType === defaultDrink 
            && p.happyHourId === activeHappyHour.id 
            && p.price < cheapestAmount) {
              happyHourPrice = p;
              cheapestAmount = p.price;
          }
        })
      }
      return happyHourPrice ? happyHourPrice : null;
    }

    const currentPrice : PriceDTO | null = getHappyHourPrice() ? getHappyHourPrice() : getNormalPrice();  

    return (
      <Box sx={{
        width: '100%',
        p: isMobile ? '8px 16px' : 2,
        position: 'relative',
        marginTop: isMobile ? 0 : '64px',
        maxWidth: isMobile ? '100%' : '318px',
        boxSizing: 'border-box'
      }}>
      {/* Close button */}
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


        {/* Bar + Drink layout */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'column',
            justifyContent: isMobile ? 'space-between' : 'flex-start',
            alignItems: 'flex-start',
            mb: 2,
            gap: 2,
          }}
        >
          {/* Bar Details */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ p: 1 }}>
              <Typography variant="h6">{bar.name}</Typography>
              <Typography><strong>Address:</strong> {bar.address}</Typography>
              <Typography><strong>Open:</strong> 
              <br/>
              {bar.openFrom} - {bar.openTo}</Typography>
            </Box>
          </Box>

          {/* Drink Info */}
            <Box
              sx={{
                ml: isMobile ? 2 : 0,
                mt: isMobile ? 0 : 1,
                p: 1,
                minWidth: '100px',
                textAlign: 'left',
              }}
            >
                <>
              <Typography variant="body2" sx={{ color: '#b57edc' }}>
                {currentPrice ? currentPrice.drinkName : ''}
              </Typography>
              <Typography
                  variant="h4"
                  sx={{
                    color:
                      activeHappyHour && getHappyHourPrice()
                        ? 'rgb(70, 234, 70)'
                        : theme.palette.primary.contrastText,
                    fontWeight: 'bold',
                  }}
                >
                {currentPrice ? `${currentPrice.price.toFixed(2)} €` : ''}
              </Typography>
              </>
              {activeHappyHour && (
                <>
                  <Typography variant= {currentPrice ? "caption" : 'h6'} sx={{ color: '#E6BE8A', marginRight: '20px'}}>
                    Happy Hour!
                  </Typography>
                  <Typography>
                    <strong>Until: </strong>
                    {activeHappyHour.endTime.slice(0, -3)}
                  </Typography>
                </>
              )}
            </Box>
        </Box>

        {/* More Button */}
        <Link to={`details`} style={{ textDecoration: 'none' }}>
          <Button
            variant="outlined"
            sx={{
              width: '100%',
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
          Created by {bar.createdBy ? bar.createdBy : "Unknown user"} at {formatTimestamp(bar.createdAt)}
        </Typography>
        <Typography variant="caption" display="block">
          Last updated by {bar.updatedBy ? bar.updatedBy : "Unknown user"} at {formatTimestamp(bar.updatedAt)}
        </Typography>
      </Box>

    );
  }

  const handleClose = () => {
    navigate("/");
  };

  return (
    <>
      {isMobile && (
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
              width: '100%',            // add this to fill the screen width
              maxHeight: '90vh',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              backgroundColor: 'primary.main',
              overflow: 'auto',
              boxSizing: 'border-box',  // ensure padding is included
            },
          }}
          sx={{
            '& .MuiDrawer-paper': {
              touchAction: 'pan-y pinch-zoom',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              '& > *': {
                overscrollBehaviorY: 'contain'
              }
            }
          }}
        >
  {renderDrawerContent()}
</Drawer>
      )}

      {!isMobile && (
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
              width: '30vh',
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
            },
          }}
          sx={{
            '& .MuiDrawer-paper': {
              touchAction: 'pan-y pinch-zoom',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              '& > *': {
                overscrollBehaviorY: 'contain'
              }
            }
          }}
        >
          {renderDrawerContent()}
        </Drawer>
      )}
    </>
  );
};

export default BarDetailsDrawer;
