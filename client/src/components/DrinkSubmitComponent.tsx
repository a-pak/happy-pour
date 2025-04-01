import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import DrinkService from "../services/drinks";
import { IDrink, IUser } from '../model/IdrinkInterface';

const DrinkSubmitComponent: React.FC = () => {
  const [drinks, setDrinks] = useState<IDrink[]>([
    { id: 7, name: "", barId: 1, normalPrice: 5.5, createdBy: { id: 1 }, updatedBy: { id: 1 }, updatedAt: new Date().toISOString() },
  ]);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (index: number, field: keyof IDrink, value: any) => {
    const newDrinks = [...drinks];
    (newDrinks[index] as any)[field] = value;
    setDrinks(newDrinks);
  };

  const addDrink = () => {
    setDrinks([
      ...drinks,
      { id: Date.now(), name: "", barId: 1, normalPrice: 5.5, createdBy: { id: 1 }, updatedBy: { id: 1 }, updatedAt: new Date().toISOString() },
    ]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await DrinkService.createDrink({ drinks });
      alert("Drinks added successfully!");
    } catch (err) {
      setError("Failed to submit drinks: " + err);
    }
  };

  return (
    <Box sx={{ padding: 2, maxWidth: 400, margin: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Submit New Drinks
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        {drinks.map((drink, index) => (
          <Box key={drink.id} sx={{ marginBottom: 2 }}>
            <TextField
              fullWidth
              label="Drink Name"
              value={drink.name}
              onChange={(e) => handleInputChange(index, "name", e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Bar ID"
              type="number"
              value={drink.barId}
              onChange={(e) => handleInputChange(index, "barId", Number(e.target.value))}
              required
            />
            <TextField
              fullWidth
              label="Price (€)"
              type="number"
              value={drink.normalPrice}
              onChange={(e) => handleInputChange(index, "normalPrice", Number(e.target.value))}
              required
            />
          </Box>
        ))}
        <Button onClick={addDrink} variant="outlined" color="primary" fullWidth>
          Add Another Drink
        </Button>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
          Submit Drinks
        </Button>
      </form>
    </Box>
  );
};

export default DrinkSubmitComponent;
