import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import barsService from '../services/bars.ts';
import { useTheme } from '@mui/material/styles';
import { useDrinkStore } from '../store/drinkStore.ts';

const BarListPage: React.FC = () => {
  const [bars, setBars] = useState<any[]>([]);
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



  const getDrinkPrice = (bar: any) => {
    const drink = bar.drinks.find((d: any) => d.name === defaultDrink);
    const happyHourDrink = bar.happyHourDrinks.find((d: any) => d.drinkName === defaultDrink);
    
    if (happyHourDrink) return happyHourDrink.happyHourPrice;
    return drink ? drink.normalPrice : null;
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
                onClick={() => navigate(`/bar/${bar.bar.id}`)}
              >
                <TableCell>{bar.bar.name}</TableCell>
                <TableCell align="right">{getDrinkPrice(bar) ? getDrinkPrice(bar).toFixed(2) : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BarListPage;
