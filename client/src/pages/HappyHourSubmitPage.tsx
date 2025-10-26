import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormGroup,
  FormControlLabel,
  TextField,
  Typography,
  Container,
  Paper,
  Grid2,
  Card
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {HappyHourDTO, WeekDay } from '../model/IHappyHourInterface'
import { createHappyHour } from '../services/happyhours'; // Adjust import path
import { useUserStore } from '../store/userStore';
import { useErrorStore } from '../store/errorStore';
import ArrowBack from '@mui/icons-material/ArrowBack';
import theme from '../Theme';

const weekDays: WeekDay[] = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY',
];

const HappyHourSubmitPage: React.FC = () => {
  const { barid } = useParams<{ barid: string }>();
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>([]);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const {user} = useUserStore();
  const {showNotification} = useErrorStore();
  const navigate = useNavigate();
  // Add state for prices if needed

  const handleDayChange = (day: WeekDay) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const happyHour: HappyHourDTO = {
      id: 0, // Will be set by backend
      weekDays: selectedDays,
      startTime,
      endTime,
      barId: Number(barid),
      prices: [], // Populate as needed
      creatorId: user?.id,
    };
    try {
      const newHH : HappyHourDTO = await createHappyHour(happyHour);
      showNotification("Happy hour submitted successfully", "success")
      navigate(`/happy-hours/update/${newHH.barId}`)
    } catch (error) {
      showNotification('Failed to create happy hour', "error");
    }
  };

  return (
    <Container maxWidth="md">
      
      
      {/*Raksalla 👷*/}
        <Card sx={{ bgcolor: 'yellow', marginTop: '20px'}}>
            <Typography padding="10px"variant="h5" gutterBottom color='black' align='center'>
                🚧 Page under construcion! 🚧
            </Typography>
        </Card>
      
      
      
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
      >
        
       
        <Button component={Link} to={`/`} variant="outlined" sx={{ mb: 2 }} startIcon={<ArrowBack/>} >Back to Map </Button>
        <Typography variant="h5" gutterBottom>
          When is the Happy Hour? 
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={3}>
            <Grid2>
              <FormControl component="fieldset">
                <Typography variant="subtitle1">Select Days</Typography>
                <FormGroup row>
                  {weekDays.map(day => (
                    <FormControlLabel
                      key={day}
                      control={
                        <Checkbox
                          checked={selectedDays.includes(day)}
                          onChange={() => handleDayChange(day)}
                        />
                      }
                      label={day}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Grid2>
            <Grid2>
              <TextField
                label="Start Time"
                type="time"
                fullWidth
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid2>
            <Grid2>
              <TextField
                label="End Time"
                type="time"
                fullWidth
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid2>
            {/* Add fields for prices if needed */}
            <Grid2>
              <Box sx={{ mt: 2 }}>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Box>
            </Grid2>
          </Grid2>
        </form>
      </Paper>
    </Container>
  );
};

export default HappyHourSubmitPage;
