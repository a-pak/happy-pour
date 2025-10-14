// DrinkPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import { createDrink } from '../services/drinks';
import { DrinkDTO, DrinkType } from '../model/IdrinkInterface';
import { useNavigate } from 'react-router-dom';
import { useErrorStore } from '../store/errorStore';
import { useUserStore } from '../store/userStore';

// Typical drink sizes by type (in liters)
const TYPICAL_SIZES: Record<DrinkType, number[]> = {
  BEER: [0.25, 0.33, 0.5, 0.66, 1.0],
  WINE: [0.12, 0.16, 0.25],
  COFFEE: [0.125, 0.25, 0.5],
};

const DrinkPage: React.FC = () => {
  const [formData, setFormData] = useState<Omit<DrinkDTO, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'creatorId'>>({
    name: '',
    type: 'BEER',
    size: TYPICAL_SIZES.BEER[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useErrorStore.getState();
  const { user } = useUserStore();

  // For TextField and other regular inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // For Select components
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name!]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newDrink: DrinkDTO = {
        ...formData,
        id: 0,
        createdBy: 'currentUser', // Replace with actual user logic
        updatedBy: 'currentUser',
        creatorId: user?.id
      };
      const array = [newDrink]
      await createDrink(array);
      navigate(-1);
      showNotification('Drinks submitted succesfully!', 'success')
    } catch (error) {
      showNotification('Failed to submit drink. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Submit a New Drink
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Drink Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange} // no idea why it's red.
            required
            fullWidth
          />
          <FormControl fullWidth required>
            <InputLabel>Drink Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              label="Drink Type"
              onChange={handleSelectChange}
            >
              <MenuItem value="BEER">Beer</MenuItem>
              <MenuItem value="WINE">Wine</MenuItem>
              <MenuItem value="COFFEE">Coffee</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel>Size (l)</InputLabel>
            <Select
              name="size"
              value={String(formData.size)}
              label="Size (l)"
              onChange={handleSelectChange}
            >
              {TYPICAL_SIZES[formData.type].map(size => (
                <MenuItem key={size} value={size}>{size}l</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            fullWidth
            size="large"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Drink'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default DrinkPage;
