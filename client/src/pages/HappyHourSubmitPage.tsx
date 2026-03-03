import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Grid2,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MobileTimePicker, DesktopTimePicker } from '@mui/x-date-pickers';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { HappyHourDTO, WeekDay } from '../model/IHappyHourInterface'
import { createHappyHour, getHappyHour, updateHappyHour } from '../services/happyhours'; // added fetch/update
import { useUserStore } from '../store/userStore';
import { useErrorStore } from '../store/errorStore';
import ArrowBack from '@mui/icons-material/ArrowBack';
import dayjs from 'dayjs';
import { PriceDTO } from '../model/IPriceInterface';

const weekDays: WeekDay[] = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY',
];

const HappyHourSubmitPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { barId, hhId } = useParams<{ barId: string; hhId?: string }>();
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>([]);
  const [startTime, setStartTime] = useState<dayjs.Dayjs | null>(dayjs());
  const [endTime, setEndTime] = useState<dayjs.Dayjs | null>(dayjs());
  const [prices, setPrices] = useState<PriceDTO[]>([]);
  const { user } = useUserStore();
  const { showNotification } = useErrorStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hhId) return;
    (async () => {
      try {
        const hh = await getHappyHour(Number(hhId));
        setSelectedDays(hh.weekDays || []);
        setStartTime(hh.startTime ? dayjs(hh.startTime, 'HH:mm:ss') : null);
        setEndTime(hh.endTime ? dayjs(hh.endTime, 'HH:mm:ss') : null);
        setPrices(hh.prices || []);
      } catch (err) {
        showNotification('Failed to load happy hour', 'error');
        console.error(err);
      }
    })();
  }, [hhId, showNotification]);

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

    const isEditing = Boolean(hhId);

    if (barId && startTime && endTime) {
      const happyHour: HappyHourDTO = {
        id: isEditing ? Number(hhId) : -1, // backend will set id when creating
        weekDays: selectedDays,
        startTime: startTime.format('HH:mm:ss'),
        endTime: endTime.format('HH:mm:ss'),
        barId: Number(barId),
        prices: prices,
        creatorId: user?.id,
      };
      try {
        if (isEditing) {
          await updateHappyHour(happyHour);
          showNotification('Happy hour updated successfully', 'success');
        } else {
          await createHappyHour(happyHour);
          showNotification('Happy hour submitted successfully', 'success');
        }
        navigate(-1);
      } catch (error) {
        showNotification(isEditing ? 'Failed to update happy hour' : 'Failed to create happy hour', 'error');
      }
    } else {
      showNotification('Please fill all fields correctly', 'warning');
    }
  };

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
        <Button component={Link} to={`/bars/${barId}/details`} variant="outlined" sx={{ mb: 2, mt: 1 }} startIcon={<ArrowBack />}>
          BACK TO BAR
        </Button>
        <Typography variant="h5" gutterBottom>
          {hhId ? 'Edit Happy Hour' : 'When is the Happy Hour?'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={2}>
            <Typography gutterBottom sx={{mt:'15px', mb:'-15px'}}>
              Select days when the Happy Hour takes place:
            </Typography>
            <Grid2 container spacing={0} sx={{ overflowX: 'auto', flexWrap: 'nowrap', py: 1, mb: 2 }}>
              {weekDays.map(day => (
                <Box
                  key={day}
                  onClick={() => handleDayChange(day)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: { xs: 42, sm: 69.9 }, // Smaller on mobile (xs), normal on sm+
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 1,
                    "&:hover": {
                      boxShadow: 3,
                      cursor: "pointer",
                    },
                    marginRight: 0.2,
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
              <Typography gutterBottom sx={{mt:'-5px'}}>
              Enter the start and end times for the Happy Hour:
            </Typography>
            <Grid2 container spacing={1} alignItems="center">
              <Grid2 container spacing={1}>
                <Grid2 size={{ xs: 6 }}>
                  {isMobile ? (
                    <MobileTimePicker
                      label="Start Time"
                      ampm={false}
                      value={startTime}
                      onChange={(newValue) => setStartTime(newValue)}
                    />
                  ) : (
                    <DesktopTimePicker
                      label="Start Time"
                      ampm={false}
                      value={startTime}
                      onChange={(newValue) => setStartTime(newValue)}
                    />
                  )}
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                  {isMobile ? (
                    <MobileTimePicker
                      label="End Time"
                      ampm={false}
                      value={endTime}
                      onChange={(newValue) => setEndTime(newValue)}
                    />
                  ) : (
                    <DesktopTimePicker
                      label="End Time"
                      ampm={false}
                      value={endTime}
                      onChange={(newValue) => setEndTime(newValue)}
                    />
                  )}
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
