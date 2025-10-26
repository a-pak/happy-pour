import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  Paper,
} from '@mui/material';
import { DrinkDTO } from '../model/IdrinkInterface.ts';
import { PriceDTO } from '../model/IPriceInterface.ts';
import { useUserStore } from '../store/userStore.ts';
import { useErrorStore } from '../store/errorStore.ts';
import { getAllDrinks } from '../services/drinks.ts';
import { getByBarId, createPrice } from '../services/prices.ts';
import { getHappyHoursByBar } from '../services/happyhours.ts';
import { Link, useNavigate } from 'react-router-dom';
import { HappyHourDTO } from '../model/IHappyHourInterface.ts';
import { ArrowBack } from '@mui/icons-material';
import theme from '../Theme.tsx';

// ...existing code...
interface PriceSubmitComponentProps { barId: number; happyHourId?: number;}

const PriceSubmitComponent: React.FC<PriceSubmitComponentProps> = ({barId, happyHourId}) => {
  const [selectedDrinkId, setSelectedDrinkId] = useState<number | ''>('');
  const [selectedHappyHourId, setSelectedHappyHourId] = useState<number | ''>(happyHourId ?? '');
  const [price, setPrice] = useState<number | ''>('');
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { showNotification } = useErrorStore.getState();

  const [drinks, setDrinks] = useState<DrinkDTO[]>();
  const [existingPrices, setExistingPrices] = useState<PriceDTO[]>();
  const [happyhours, setHappyhours] = useState<HappyHourDTO[]>();

  useEffect(() => {
    const fetchDrinks = async () => {
      const data = await getAllDrinks();
      setDrinks(data);
    };
    const fetchPrices = async () => {
      const data = await getByBarId(barId);
      setExistingPrices(data);
      console.log("Prices: " + data)
    };
    const fetchHappyHours = async () => {
      const data = await getHappyHoursByBar(barId);
      setHappyhours(data);
    }
    fetchDrinks();
    fetchPrices();
    fetchHappyHours();
  }, [barId])

  const selectedDrink = drinks ? drinks.find((drink) => drink.id === selectedDrinkId) : null;
  const selectedHappyHour = happyhours ? happyhours.find(h => h.id === selectedHappyHourId) : null;

  const setExistingPrice = (drinkId : number | '', hhId: number | '') => {
    const existingPriceDto = existingPrices?.find(
      (p : PriceDTO) => (p.drinkId === drinkId && (p.happyHourId ?? null) == (hhId ?? null)));
    
    console.log('Existing price lookup:', { drinkId, hhId, found: existingPriceDto })
    setPrice(existingPriceDto ? existingPriceDto.price : '');
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDrink || price === '') return;

    let newPriceId : number = -1;

    // Check if a price exists for drink.
    existingPrices?.forEach(p => {
      if(p.drinkId === selectedDrink.id && (p.happyHourId ?? null) == (selectedHappyHourId ?? null)) {
        newPriceId = p.id;
      }
    })

    const priceDto: PriceDTO = {
      id: newPriceId,
      price: Number(price),
      barId,
      happyHourId: selectedHappyHourId === '' ? undefined : selectedHappyHourId,
      drinkId: selectedDrink.id,
      drinkName: selectedDrink.name,
      drinkType: selectedDrink.type,
      drinkSize: selectedDrink.size,
      creatorId: user?.id
    };
    try {
      createPrice([priceDto]);
      navigate("/")
      showNotification("Price Submitted succesfully!", "success")
    } catch (error) {
      console.error("Error submitting orice: ", error);
      showNotification("Error submitting price", "error")
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 500,
        margin: "4vh auto",
        padding: 4,
        position: "relative",
        borderRadius: 4,
        backgroundColor: theme.palette.background.default,
      }}
    ><Button component={Link} to={`/bars/${barId}/details`} variant="outlined" sx={{ mb: 2 }} startIcon={<ArrowBack/>} >Back to Bar </Button>
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Submit Price
      </Typography>
      {/* Drink picker */}
      <FormControl fullWidth margin="normal">
        <Select
          labelId="drink-select-label"
          value={selectedDrinkId}
          onChange={(e) => {
            const newDrinkId = Number(e.target.value);
            setSelectedDrinkId(newDrinkId);
            setExistingPrice(newDrinkId, selectedHappyHourId);
          }}
          displayEmpty // <-- Key to show placeholder
          renderValue={(selected) => {
            if (!selected) {
              return <em>Select a drink</em>;
            }
            const drink = drinks?.find((d) => d.id === selected);
            return `${drink?.name} (${drink?.type}, ${drink?.size}ml)`;
          }}
        >
          <MenuItem disabled value="">
            <em>Select a drink</em>
          </MenuItem>
          {drinks?.map((drink) => (
            <MenuItem key={drink.id} value={drink.id}>
              {drink.name} ({drink.type}, {drink.size}ml)
            </MenuItem>
          ))}
          <MenuItem value={0}>
            <Link to={"/drinks/update"}>
              Add a new drink!
            </Link>
          </MenuItem>
        </Select>
      </FormControl>
      
      {/* Happy Hour picker */}
      <FormControl fullWidth margin="normal">
        <Select
          labelId="happyhour-select-label"
          value={selectedHappyHourId}
          onChange={(e) => {
            const newHhId = Number(e.target.value) === 0 ? 0 : Number(e.target.value);
            setSelectedHappyHourId(newHhId === 0 ? 0 : newHhId);
            setExistingPrice(selectedDrinkId, newHhId === 0 ? 0 : newHhId);
          }}
          displayEmpty
          renderValue={(selected) => {
            if (!selected) {
              return <em>Select a happy hour (optional)</em>;
            }
            const hh = happyhours?.find((h) => h.id === selected);
            return hh ? `${hh.weekDays.join(', ')} ${hh.startTime}-${hh.endTime}` : 'Select a happy hour (optional)';
          }}
        >
          <MenuItem disabled value="">
            <em>Select a happy hour (optional)</em>
          </MenuItem>
          {happyhours?.map((hh) => (
            <MenuItem key={hh.id} value={hh.id}>
              {hh.weekDays.join(', ')} {hh.startTime}-{hh.endTime}
            </MenuItem>
          ))}
          <MenuItem value={0}>
            <Link to={`/bars/${barId}/happy-hours/create`}>
              Add a new happy hour!
            </Link>
          </MenuItem>
        </Select>
      </FormControl>

      {selectedDrink && (
        <>
          <Box mt={2}>
            <Typography variant="body1"><strong>Drink Name:</strong> {selectedDrink.name}</Typography>
            <Typography variant="body1"><strong>Type:</strong> {selectedDrink.type}</Typography>
            <Typography variant="body1"><strong>Size:</strong> {selectedDrink.size} ml</Typography>
            {selectedHappyHour && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Happy Hour:</strong> {selectedHappyHour.weekDays.join(', ')} {selectedHappyHour.startTime}-{selectedHappyHour.endTime}
              </Typography>
            )}
          </Box>

          <TextField
            fullWidth
            margin="normal"
            label="Price"
            inputProps={{ min: 0, step: 0.01 }}
            value={price}
            onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
            required
          />
          
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
          >
            Submit Price
          </Button>
        </>
      )}
    </Box>
    </Paper>
  );
};

export default PriceSubmitComponent;
// ...existing code...