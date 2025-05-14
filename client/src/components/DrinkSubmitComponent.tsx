import React, { useState, useEffect } from "react";
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IDrink, IDrinkPayload } from "../model/IdrinkInterface";
import { useUser } from "../store/UserContext.tsx";
import { useErrorStore } from "../store/errorStore.ts";
import { createDrink, getByBarId, updateDrinks } from "../services/drinks";

type Properties = { id: number; };
type DrinkFormItem = IDrink & { selectedDrinkId?: number | ""; };

const DrinkSubmitComponent: React.FC<Properties> = ({ id }) => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { showNotification } = useErrorStore.getState();
  const barId = Number(id);

  const [existingDrinks, setExistingDrinks] = useState<IDrink[]>([]);
  const [drinks, setDrinks] = useState<DrinkFormItem[]>([]);

  useEffect(() => {
    const loadDrinks = async () => {
      try {
        const data = await getByBarId(barId);
        setExistingDrinks(data);
      } catch (error) {
        console.error("Error loading existing drinks", error);
      }
    };
    loadDrinks();
  }, [barId]);

  const createEmptyDrink = (barId: number): DrinkFormItem => ({
    id: Date.now(),
    name: "",
    normalPrice: 5.5,
    bar: { id: barId },
    createdBy: { id: 1 },
    updatedBy: { id: 1 },
    updatedAt: new Date().toISOString(),
    selectedDrinkId: "",
  });
  
  const cleanDrink = (drink: IDrink): Omit<IDrink, 'barId'> => {
    const { barId, ...rest } = drink as any;
    return rest;
  };

  const handleInputChange = (index: number, field: keyof IDrink, value: any) => {
    const updated = [...drinks];
    updated[index][field] = value;
    setDrinks(updated);
  };

  const handleSelectChange = (index: number, drinkId: number | "") => {
    const updated = [...drinks];
  
    if (drinkId === "") {
     updated[index] = createEmptyDrink(barId);
    } else {
      const selected = existingDrinks.find(d => d.id === drinkId);
      if (selected) {
        updated[index] = {
          ...cleanDrink(selected),
          bar: { id: barId },
          updatedAt: new Date().toISOString(),
          selectedDrinkId: drinkId,
        };
      }
    }
  
    setDrinks(updated);
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
        selectedDrinkId: "",
      },
    ]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const newDrinks = drinks.filter(d => !existingDrinks.some(ed => ed.id === d.id));
    const updatedDrinks = drinks.filter(d => existingDrinks.some(ed => ed.id === d.id));
  
    try {
      if (newDrinks.length > 0) {
        const payload: IDrinkPayload = {
          drinks: newDrinks.map(d => ({
            ...d,
            updatedAt: new Date().toISOString(),
            updatedBy: { id: 1 } // Replace with logged-in user ID if available
          }))
        };
        await createDrink(payload); // Create new drinks
      }
  
      if (updatedDrinks.length > 0) {
        const payload: IDrinkPayload = {
          drinks: updatedDrinks.map(d => ({
            id: d.id,
            normalPrice: d.normalPrice,
            updatedBy: { id: 1 }, // Replace with logged-in user ID if available
            updatedAt: new Date().toISOString()
          }))
        };
        await updateDrinks(payload); // Update existing drinks
      }
  
      navigate(`/bar/${barId}`);
      showNotification("Drinks submitted successfully!", "success");
    } catch (error: any) {
      if (error.status === 401 || error.status === 403) {
        setUser(null);
        navigate("/login");
        showNotification("Session expired. Please log in again.", "warning");
      } else {
        console.error("Error submitting drinks:", error);
        showNotification("Error submitting drinks. Please try again.", "error");
      }
    }
  };

  return (
    <Box sx={{ backgroundColor: 'background.default', color: 'text.primary', padding: 3, maxWidth: 800, margin: "auto" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Submit / Update Drinks</Typography>
        <IconButton onClick={() => navigate(-1)} sx={{ color: '#b57edc' }}>
          <CloseIcon />
        </IconButton>
      </Stack>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {drinks.map((drink, index) => (
            <Paper key={index} elevation={3} sx={{ padding: 2, backgroundColor: 'background.paper' }}>
              <Typography variant="h6" gutterBottom>Drink {index + 1}</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Choose Existing Drink</InputLabel>
                    <Select
                      value={drink.selectedDrinkId ?? ""}
                      onChange={(e) => handleSelectChange(index, e.target.value)}
                      label="Choose Existing Drink"
                    >
                      <MenuItem value="">
                        <em>New Drink</em>
                      </MenuItem>
                      {existingDrinks.map((d) => (
                        <MenuItem key={d.id} value={d.id}>
                          {d.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Drink Name"
                    value={drink.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                    disabled={drink.selectedDrinkId !== ""}
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
            + Add Drink
          </Button>

          <Divider sx={{ my: 3 }} />

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