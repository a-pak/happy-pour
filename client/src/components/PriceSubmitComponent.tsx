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
  const { user } = useUserStore();
  const { showNotification } = useErrorStore.getState();
  const navigate = useNavigate();
  // ---------- State ----------
  const [selectedDrinkId, setSelectedDrinkId] = useState<number | ''>('');
  const [selectedHappyHourId, setSelectedHappyHourId] = useState<number | ''>(happyHourId ?? '');
  const [amount, setAmount] = useState<number | ''>('');
  const [drinks, setDrinks] = useState<DrinkDTO[]>([]);
  const [existingPrices, setExistingPrices] = useState<PriceDTO[]>([]);
  const [happyhours, setHappyhours] = useState<HappyHourDTO[]>([]);

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
    fetchPrices();
    fetchDrinks();
    fetchHappyHours();
  }, [barId])

  // ---------- Selected Drink / HappyHour ----------
  const selectedDrink = selectedDrinkId !== '' ? drinks.find(d => d.id === Number(selectedDrinkId)) : null;
  const selectedHappyHour = selectedHappyHourId !== '' ? happyhours.find(h => h.id === Number(selectedHappyHourId)) : null;

  // ---------- Update price input when selection changes ----------
  useEffect(() => {
    if (!selectedDrinkId) {
      setAmount('');
      return;
    }

    const drinkIdNumber = Number(selectedDrinkId);
    const happyHourIdNumber = selectedHappyHourId === '' ? undefined : Number(selectedHappyHourId);

    const existingPrice = existingPrices.find(
      p => p.drinkId === drinkIdNumber && (p.happyHourId ?? undefined) === happyHourIdNumber
    );

    setAmount(existingPrice ? existingPrice.price : '');
  }, [selectedDrinkId, selectedHappyHourId, existingPrices]);

  // ---------- Submit Handler ----------
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedDrink || amount === '') return;

  const drinkIdNumber = Number(selectedDrinkId);
  const happyHourIdNumber = selectedHappyHourId === '' ? undefined : Number(selectedHappyHourId);

  const existingPrice = existingPrices.find(
    p => p.drinkId === drinkIdNumber && (p.happyHourId ?? undefined) === happyHourIdNumber
  );

  const priceDto: PriceDTO = {
    id: existingPrice ? existingPrice.id : -1,
    price: Number(amount),
    barId,
    happyHourId: happyHourIdNumber,
    drinkId: drinkIdNumber,
    drinkName: selectedDrink.name,
    drinkType: selectedDrink.type,
    drinkSize: selectedDrink.size,
    creatorId: user?.id
  };

  try {
    await createPrice([priceDto]);
    navigate("/");
    showNotification("Price submitted successfully!", "success");
  } catch (error) {
    console.error("Error submitting price:", error);
    showNotification("Error submitting price", "error");
  }
}

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
            // setExistingPrice(newDrinkId, selectedHappyHourId);
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
            // setExistingPrice(selectedDrinkId, newHhId === 0 ? 0 : newHhId);
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
            value={amount}
            onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
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