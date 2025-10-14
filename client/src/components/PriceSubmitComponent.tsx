import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
} from '@mui/material';
import { DrinkDTO } from '../model/IdrinkInterface.ts';
import { PriceDTO } from '../model/IPriceInterface.ts';
import { useUserStore } from '../store/userStore.ts';
import { useErrorStore } from '../store/errorStore.ts';
import { getAllDrinks } from '../services/drinks.ts';
import { getByBarId, createPrice } from '../services/prices.ts';
import { Link, useNavigate } from 'react-router-dom';

interface PriceSubmitComponentProps { barId: number; happyHourId?: number;}

const PriceSubmitComponent: React.FC<PriceSubmitComponentProps> = ({barId, happyHourId}) => {
  const [selectedDrinkId, setSelectedDrinkId] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { showNotification } = useErrorStore.getState();

  const [drinks, setDrinks] = useState<DrinkDTO[]>();
  const [existingPrices, setExistingPrices] = useState<PriceDTO[]>();
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

    fetchDrinks();
    fetchPrices();
  }, [])

  const selectedDrink = drinks ? drinks.find((drink) => drink.id === selectedDrinkId) : null;

  const setExistingPrice = (drinkId : number | '') => {
    const existingPriceDto = existingPrices?.find((p : PriceDTO) => (p.drinkId === drinkId));
    console.log(existingPriceDto)
    setPrice(existingPriceDto ? existingPriceDto.price : '');
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDrink || price === '') return;

    let newPriceId : number = -1;

    // Check if a price exists for drink.
    existingPrices?.forEach(p => {
      if(p.drinkId == selectedDrink.id) {
        newPriceId = p.id;
      }
    })

    const priceDto: PriceDTO = {
      id: newPriceId,
      price: Number(price),
      barId,
      happyHourId,
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
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <FormControl fullWidth margin="normal">
        <Select
          labelId="drink-select-label"
          value={selectedDrinkId}
          onChange={(e) => {setSelectedDrinkId(Number(e.target.value)); setExistingPrice(selectedDrinkId)}}
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


      {selectedDrink && (
        <>
          <Box mt={2}>
            <Typography variant="body1"><strong>Drink Name:</strong> {selectedDrink.name}</Typography>
            <Typography variant="body1"><strong>Type:</strong> {selectedDrink.type}</Typography>
            <Typography variant="body1"><strong>Size:</strong> {selectedDrink.size} ml</Typography>
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
  );
};

export default PriceSubmitComponent;
