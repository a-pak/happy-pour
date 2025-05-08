import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Stack,
} from "@mui/material";
import DrinkService from "../services/drinks";
import { IDrink, IDrinkPayload } from "../model/IdrinkInterface";

type Properties = {
  id: number;
};

const DrinkSubmitComponent: React.FC<Properties> = ({ id }) => {
  const navigate = useNavigate();
  const barId = Number(id);
  const [drinks, setDrinks] = useState<IDrink[]>([
    {
      id: 7,
      name: "",
      bar: { id: barId },
      normalPrice: 5.5,
      createdBy: { id: 1 },
      updatedBy: { id: 1 },
      updatedAt: new Date().toISOString(),
    },
  ]);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    index: number,
    field: keyof IDrink,
    value: any
  ) => {
    const newDrinks = [...drinks];
    (newDrinks[index][field] as string | number) = value;
    setDrinks(newDrinks);
  };

  const addDrink = () => {
    setDrinks([
      ...drinks,
      {
        id: Date.now(),
        name: "",
        bar: { id: barId },
        normalPrice: 5.5,
        createdBy: { id: 1 },
        updatedBy: { id: 1 },
        updatedAt: new Date().toISOString(),
      },
    ]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const drinkPayload: IDrinkPayload = { drinks };
    try {
      await DrinkService.createDrink(drinkPayload);
      navigate("/bar/" + barId);
    } catch (err) {
      setError("Failed to submit drinks: " + err);
    }
  };

  return (
    <Box sx={{  backgroundColor: 'background.default', color: 'text.primary', padding: 3, maxWidth: 600, margin: "auto" }}>
      <Typography variant="h4" gutterBottom align="center">
        Submit New Drinks
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {drinks.map((drink, index) => (
            <Paper key={drink.id} elevation={3} sx={{ padding: 2, backgroundColor: 'background.paper'  }}>
              <Typography variant="h6" gutterBottom>
                Drink {index + 1}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Drink Name"
                    value={drink.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Price (€)"
                    type="number"
                    inputProps={{ min: 0, step: 0.1 }}
                    value={drink.normalPrice}
                    onChange={(e) =>
                      handleInputChange(index, "normalPrice", Number(e.target.value))
                    }
                    required
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Button
            onClick={addDrink}
            variant="outlined"
            color="secondary"
            fullWidth
          >
            + Add Another Drink
          </Button>

          <Divider />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
          >
            Submit Drinks
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default DrinkSubmitComponent;