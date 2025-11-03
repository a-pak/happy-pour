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
import { PriceDTO } from '../model/IPriceInterface';
import { getCurrentHappyHour } from '../utils/happyHourUtil';
import CloseIcon from '@mui/icons-material/Close';

const BarListPage: React.FC = () => {
  const [bars, setBars] = useState<BarData[]>([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const defaultDrink = useDrinkStore((state) => state.defaultDrink);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    barsService
      .getAll()
      .then((data: any[]) => {
        setBars(data);
      })
      .catch((err) => console.error('Failed to fetch bars:', err));
  }, []);

  const getDrinkPrice = (bar: BarData) => {
    const drinkPrice = bar.prices.find((d: PriceDTO) => d.drinkType === defaultDrink);
    const hh = getCurrentHappyHour(bar);
    let happyHourPrice = hh ? hh.prices.find(hhPrice => hhPrice.drinkType === defaultDrink) : null;
      
    if (happyHourPrice) return happyHourPrice.price;
    return drinkPrice ? drinkPrice.price : null;
  };

  const sortedBars = [...bars].sort((a, b) => {
    const priceA = getDrinkPrice(a) || Infinity;
    const priceB = getDrinkPrice(b) || Infinity;
    return priceA - priceB;
  });

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
                  {defaultDrink} Price (€)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedBars.map((bar) => (
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
                    {getDrinkPrice(bar) ? getDrinkPrice(bar)?.toFixed(2) : 'N/A'}
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
