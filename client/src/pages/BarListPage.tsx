import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import barsService from '../services/bars'; // Oletus palvelu baaridatalle
import Bar from '../model/IbarInterface'; // Baari-interface
import { useTheme } from '@mui/material/styles'; // Hook teemavärien käyttämiseen
import { SelectChangeEvent } from '@mui/material';

const BarListPage: React.FC = () => {
  const [bars, setBars] = useState<Bar[]>([]);
  const [selectedAttribute, setSelectedAttribute] = useState<'beer05Price' | 'wine075Price' | 'coffeePrice'>('beer05Price');
  const navigate = useNavigate();
  const theme = useTheme(); // Teeman käyttöönotto

  // Hakee baareja tietokannasta
  useEffect(() => {
    barsService
      .getAll()
      .then((data: Bar[]) => {
        setBars(data);
      })
      .catch((err) => console.error('Failed to fetch bars:', err));
  }, []);

  // Käsittelee attribuutin valinnan muutoksen
  const handleAttributeChange = (event: SelectChangeEvent<'beer05Price' | 'wine075Price' | 'coffeePrice'>) => {
    setSelectedAttribute(event.target.value as 'beer05Price' | 'wine075Price' | 'coffeePrice');
  };

  // Järjestää baarit valitun attribuutin perusteella   
  const sortedBars = [...bars].sort((a, b) => {
    const priceA = a[selectedAttribute] || Infinity;
    const priceB = b[selectedAttribute] || Infinity;
    return priceA - priceB;
  });

  return (
    <Box sx={{ padding: 2 }}>

      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 2 
        }}
      >
        <Typography variant="h6" >Sort by:</Typography>
        <Select 
          value={selectedAttribute} 
          onChange={handleAttributeChange} 
          sx={{
            width: 220,
            '& .MuiOutlinedInput-root': {
                border: 'none',
                color: 'primary.main'
            }}}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: "grey.900", 
                  color: "white",
                },
              },
            }}
        >
          <MenuItem value="beer05Price">Beer (0.5L)</MenuItem>
          <MenuItem value="wine075Price">Wine (0.75L)</MenuItem>
          <MenuItem value="coffeePrice">Coffee</MenuItem>
        </Select>
      </Box>

      <TableContainer component={Paper} sx={{ border: `none` }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.secondary.light }}>
              <TableCell sx={{ color: theme.palette.primary.contrastText }}>Bar Name</TableCell>
              <TableCell align="right" sx={{ color: theme.palette.secondary.contrastText }}>
                {selectedAttribute === 'beer05Price' ? 'Beer (0.5L) Price (€)' : selectedAttribute === 'wine075Price' ? 'Wine (0.75L) Price (€)' : 'Coffee Price (€)'}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedBars.map((bar) => (
              <TableRow
                key={bar.id}
                hover
                sx={{ 
                  backgroundColor: theme.palette.primary.light,
                  cursor: 'pointer', 
                  '&:hover': { backgroundColor: theme.palette.action.hover } 
                }}
                onClick={() => {
                  navigate(`/bar/${bar.id}`)
                  //console.log("navigating to bar details page in the future!")
              }}
              >
                <TableCell>{bar.name}</TableCell>
                <TableCell align="right">
                  {bar[selectedAttribute] ? bar[selectedAttribute].toFixed(2) : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BarListPage;
