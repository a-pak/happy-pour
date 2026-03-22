import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  Container,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from '@mui/material';
import { DrinkDTO } from '../types/IdrinkInterface.ts';
import { PriceDTO } from '../types/IPriceInterface.ts';
import { useUserStore } from '../store/userStore.ts';
import { useErrorStore } from '../store/errorStore.ts';
import { getAllDrinks } from '../services/drinks.ts';
import { getByBarId, createPrice } from '../services/prices.ts';
import { getHappyHoursByBar } from '../services/happyhours.ts';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { HappyHourDTO } from '../types/IHappyHourInterface.ts';
import { ArrowBack, Add, Delete } from '@mui/icons-material';

// ...existing code...
interface PriceSubmitComponentProps { barId: number; priceDrinkId?: number; happyHourId?: number;}

interface PriceInput {
  drinkId: number;
  happyHourId?: number;
  price: number;
}

const PriceSubmitComponent: React.FC<PriceSubmitComponentProps> = ({barId, priceDrinkId, happyHourId}) => {
  const [searchParams] = useSearchParams();
  const happyHourParam = searchParams.get("hhId")
  const { user } = useUserStore();
  const { showNotification } = useErrorStore.getState();
  const navigate = useNavigate();
  // ---------- State ----------
  const [currentDrinkId, setCurrentDrinkId] = useState<number | ''>(priceDrinkId ?? '');
  const [currentHappyHourId, setCurrentHappyHourId] = useState<number | ''>(happyHourId ?? '');
  const [currentAmount, setCurrentAmount] = useState<string>('');
  const [drinks, setDrinks] = useState<DrinkDTO[]>([]);
  const [existingPrices, setExistingPrices] = useState<PriceDTO[]>([]);
  const [happyhours, setHappyhours] = useState<HappyHourDTO[]>([]);
  const [priceList, setPriceList] = useState<PriceInput[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);


  useEffect(() => {
    const fetchDrinks = async () => {
      const data = await getAllDrinks();
      setDrinks(data);
    };
    const fetchPrices = async () => {
      const data = await getByBarId(barId);
      setExistingPrices(data);
    };
    const fetchHappyHours = async () => {
      const data = await getHappyHoursByBar(barId);
      setHappyhours(data);
    }
    fetchPrices();
    fetchDrinks();
    fetchHappyHours();
    if(happyHourParam) setCurrentHappyHourId(Number(happyHourParam));
  }, [barId])

  // ---------- Selected Drink / HappyHour ----------
  const currentDrink = currentDrinkId !== '' ? drinks.find(d => d.id === Number(currentDrinkId)) : null;
  const currentHappyHour = currentHappyHourId !== '' ? happyhours.find(h => h.id === Number(currentHappyHourId)) : null;

  // ---------- Update price input when selection changes ----------
  useEffect(() => {
    if (!currentDrinkId) {
      setCurrentAmount('');
      return;
    }

    const drinkIdNumber = Number(currentDrinkId);
    const happyHourIdNumber = currentHappyHourId === '' ? undefined : Number(currentHappyHourId);

    const existingPrice = existingPrices.find(
      p => p.drinkId === drinkIdNumber && (p.happyHourId ?? undefined) === happyHourIdNumber
    );

    setCurrentAmount(existingPrice ? String(existingPrice.price) : '');
  }, [currentDrinkId, currentHappyHourId, existingPrices]);

  // ---------- Add to list Handler ----------
  const handleAddToList = () => {
    if (!currentDrink || currentAmount === '') {
      showNotification("Please select a drink and enter a price", "warning");
      return;
    }
    const finalAmount = Number(currentAmount);
    if (Number.isNaN(finalAmount)) {
      showNotification("Please insert a valid number", "warning");
      return;
    }
    const newItem: PriceInput = {
      drinkId: Number(currentDrinkId),
      happyHourId: currentHappyHourId === '' ? undefined : Number(currentHappyHourId),
      price: finalAmount,
    };
    setPriceList([...priceList, newItem]);
    // Clear form
    setCurrentDrinkId('');
    setCurrentHappyHourId('');
    setCurrentAmount('');
  };

  // ---------- Remove from list ----------
  const handleRemoveFromList = (index: number) => {
    setPriceList(priceList.filter((_, i) => i !== index));
  };

  // ---------- Submit Handler ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (priceList.length === 0) {
      showNotification("Please add at least one price to the list", "warning");
      return;
    }
    setIsSubmitting(true);

    const priceDtos: PriceDTO[] = priceList.map(item => {
      const drink = drinks.find(d => d.id === item.drinkId)!;
      return {
        id: -1,
        price: item.price,
        barId,
        happyHourId: item.happyHourId,
        drinkId: item.drinkId,
        drinkName: drink.name,
        drinkType: drink.type,
        drinkSize: drink.size,
        creatorId: user?.id
      };
    });

    try {
      await createPrice(priceDtos);
      navigate(`/bars/${barId}/details`);
      showNotification("Prices submitted successfully!", "success");
    } catch (error) {
      console.error("Error submitting prices:", error);
      showNotification("Error submitting prices", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container
      sx={{
        maxWidth: 500,
        margin: "4vh auto",
        padding: 4,
        position: "relative"
      }}
    ><Button component={Link} to={`/bars/${barId}/details`} variant="outlined" sx={{ mb: 2 }} startIcon={<ArrowBack/>} >Back to Bar </Button>
    <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Compose Price List
      </Typography>
      {/* Drink picker */}
      <FormControl fullWidth margin="normal">
        <Select
          labelId="drink-select-label"
          value={currentDrinkId}
          onChange={(e) => {
            const newDrinkId = Number(e.target.value);
            setCurrentDrinkId(newDrinkId);
          }}
          displayEmpty
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
          value={currentHappyHourId}
          onChange={(e) => {
            const newHhId = Number(e.target.value) === 0 ? 0 : Number(e.target.value);
            setCurrentHappyHourId(newHhId === 0 ? 0 : newHhId);
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

      {currentDrink && (
        <>
          <Box mt={2}>
            <Typography variant="body1"><strong>Drink Name:</strong> {currentDrink.name}</Typography>
            <Typography variant="body1"><strong>Type:</strong> {currentDrink.type}</Typography>
            <Typography variant="body1"><strong>Size:</strong> {currentDrink.size} l</Typography>
            {currentHappyHour && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Happy Hour:</strong> {currentHappyHour.weekDays.join(', ')} {currentHappyHour.startTime}-{currentHappyHour.endTime}
              </Typography>
            )}
          </Box>

          <TextField
            fullWidth
            margin="normal"
            label="Price"
            type='number'
            inputProps={{ min: 0, step: 0.01 }}
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            required
          />
          
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAddToList}
            fullWidth
            startIcon={<Add />}
            sx={{ mt: 2 }}
          >
            Add to List
          </Button>

        </>
      )}
    </Box>

    {/* Price List */}
    {priceList.length > 0 && (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Prices to Submit
        </Typography>
        <List>
          {priceList.map((item, index) => {
            const drink = drinks.find(d => d.id === item.drinkId)!;
            const hh = item.happyHourId ? happyhours.find(h => h.id === item.happyHourId) : null;
            return (
              <ListItem key={index} secondaryAction={
                <IconButton edge="end" onClick={() => handleRemoveFromList(index)}>
                  <Delete />
                </IconButton>
              }>
                <ListItemText
                  primary={`${drink.name} (${drink.type}, ${drink.size}ml) - ${item.price}€`}
                  secondary={hh ? `${hh.weekDays.join(', ')} ${hh.startTime}-${hh.endTime}` : 'No Happy Hour'}
                />
              </ListItem>
            );
          })}
        </List>
        <Divider sx={{ my: 2 }} />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          sx={{ mt: 2 }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit All Prices'}
        </Button>
      </Box>
    )}
    </Container>
  );
};


export default PriceSubmitComponent;