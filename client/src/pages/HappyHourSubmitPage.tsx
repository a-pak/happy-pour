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
import { HappyHourDTO, WeekDay } from '../model/IHappyHourInterface'
import { createHappyHour } from '../services/happyhours'; // Adjust import path
import { useUserStore } from '../store/userStore';
import { useErrorStore } from '../store/errorStore';
import ArrowBack from '@mui/icons-material/ArrowBack';
import theme from '../Theme';
import { BorderColor } from '@mui/icons-material';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const weekDays: WeekDay[] = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY',
];

const HappyHourSubmitPage: React.FC = () => {
  const { barId } = useParams<{ barId: string }>();
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>([]);
  const [startTime, setStartTime] = useState<dayjs.Dayjs | null>(dayjs());
  const [endTime, setEndTime] = useState<dayjs.Dayjs | null>(dayjs());
  const { user } = useUserStore();
  const { showNotification } = useErrorStore();
  const navigate = useNavigate();
  // Add state for prices if needed

  const handleDayChange = (day: WeekDay) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(selectedDays.length === 0);
    console.log(startTime?.isSame(endTime))
    if (selectedDays.length === 0 || !startTime || !endTime) {
      showNotification('Please select days and times', "warning");
      return;
    }

    if (startTime.isSame(endTime) || startTime.isAfter(endTime)) {
      showNotification('End time must be after start time', "warning");
      return;
    }

    if (barId || startTime || endTime) {
      const happyHour: HappyHourDTO = {
        id: 0, // Will be set by backend
        weekDays: selectedDays,
        startTime: startTime.format('HH:mm:ss'),
        endTime: endTime.format('HH:mm:ss'),
        barId: Number(barId),
        prices: [], // Populate as needed
        creatorId: user?.id,
      };
      try {
        await createHappyHour(happyHour);
        showNotification("Happy hour submitted successfully", "success")
        navigate(-1);
      } catch (error) {
        showNotification('Failed to create happy hour', "error");
      }
    } else {
      showNotification('Please fill all fields correctly', "warning");
    }
  };

  function pageUnderConstruction() {
    return (
      <>
        {/* Raksalla 👷*/}
        <Card sx={{ bgcolor: 'yellow', marginTop: '20px' }}>
          <Typography padding="10px" variant="h5" gutterBottom color='black' align='center'>
            🚧 Page under construcion! 🚧
          </Typography>
        </Card> 
      </>
    )
  }

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          maxWidth: 500,
          margin: "2vh auto",
          padding: 2,
          position: "relative",
        }}
      >
        <Button component={Link} to={`/`} variant="outlined" sx={{ mb: 2, mt: 1 }} startIcon={<ArrowBack />}>
          Back to Map
        </Button>
        <Typography variant="h5" gutterBottom>
          When is the Happy Hour?
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={2}>
            <Grid2 container spacing={0} sx={{ overflowX: 'auto', flexWrap: 'nowrap', py: 1, mb: 2 }}>
              {weekDays.map(day => (
                <Box
                  key={day}
                  onClick={() => handleDayChange(day)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: { xs: 40, sm: 60 }, // Smaller on mobile (xs), normal on sm+
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 1,
                    "&:hover": {
                      boxShadow: 3,
                      cursor: "pointer",
                    },
                    marginRight: 0.3,
                    flexShrink: 0,
                  }}
                >
                  {/* Label */}
                  <Box
                    sx={{
                      backgroundColor: "darkred",
                      color: "white",
                      width: "100%",
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: { xs: 10, sm: 12 }, // Smaller font on mobile
                      padding: { xs: "2px 0", sm: "4px 0" }, // Less padding on mobile
                    }}
                  >
                    {day.slice(0, 3)}
                  </Box>
                  {/* Checkmark Area */}
                  <Box
                    sx={{
                      backgroundColor: "white",
                      width: "100%",
                      height: { xs: 40, sm: 40 }, // Shorter height on mobile
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {selectedDays.includes(day) && (
                      <Box
                        sx={{
                          width: { xs: 23, sm: 24 }, // Smaller checkmark circle on mobile
                          height: { xs: 23, sm: 24 },
                          backgroundColor: "midnightblue",
                          borderRadius: "50%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: { xs: 12, sm: 16 }, // Smaller checkmark on mobile
                        }}
                      >
                        ✓
                      </Box>
                    )}
                  </Box>
                </Box>
              ))}
            </Grid2>

            <Grid2 container spacing={1} alignItems="center">
              <Grid2 container spacing={1}>
                <Grid2 size={{ xs: 6 }}>
                  <TimePicker
                    label="Start Time"
                    value={startTime}
                    onChange={(newValue) => setStartTime(newValue)}
                  />
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                  <TimePicker
                    label="End Time"
                    value={endTime}
                    onChange={(newValue) => setEndTime(newValue)}
                  />
                </Grid2>
              </Grid2>
              <Grid2 size={12}>
                <Box sx={{ mt: 2, width: '100%' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ width: '100%' }}
                  >
                    Submit
                  </Button>
                </Box>
              </Grid2>
            </Grid2>

          </Grid2>
        </form>
      </Box>
    </Container>
  );
};

export default HappyHourSubmitPage;
