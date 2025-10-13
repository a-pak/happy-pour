import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import barsService from '../services/bars.ts';
import { useTheme } from '@mui/material/styles';
import { useDrinkStore } from '../store/drinkStore.ts';
import { BarData } from '../model/IbarInterface.ts';
import { PriceDTO } from '../model/IPriceInterface.ts';
import { getCurrentHappyHour } from '../utils/happyHourUtil.ts';

const BarListPage: React.FC = () => {
  const [bars, setBars] = useState<BarData[]>([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const defaultDrink = useDrinkStore((state) => state.defaultDrink);

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

  return (
    <Box sx={{ padding: 2 }}>
      <TableContainer component={Paper} sx={{ border: 'none' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.secondary.light }}>
              <TableCell sx={{ color: theme.palette.primary.contrastText }}>Bar Name</TableCell>
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
                sx={{ backgroundColor: theme.palette.primary.light, cursor: 'pointer', '&:hover': { backgroundColor: theme.palette.action.hover } }}
                onClick={() => navigate(`/bars/${bar.bar.id}`)}
              >
                <TableCell>{bar.bar.name}</TableCell>
                <TableCell align="right">{getDrinkPrice(bar) ? getDrinkPrice(bar)?.toFixed(2) : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BarListPage;
