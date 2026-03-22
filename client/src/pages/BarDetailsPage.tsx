import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Divider,
  Button,
  IconButton,
  Collapse,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import barsService from '../services/bars.ts';
import { BarData } from '../types/IbarInterface.ts';
import { getCurrentHappyHour } from '../utils/happyHourUtil.ts';
import FloatingEditMenu from '../components/FloatingEditMenu.tsx';
import theme from '../Theme.tsx';

const BarDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [barData, setBarData] = useState<BarData | null>(null);
    const [showHH, setShowHH] = useState(false);


  useEffect(() => {
    if (id) {
      barsService
        .getById(parseInt(id))
        .then((data) => setBarData(data))
        .catch((err) => console.error('Failed to fetch bar:', err));
    }
  }, [id]);

  if (!barData) {
    return (
      <Box sx={{ color: '#b57edc', textAlign: 'center', mt: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const { bar, prices, happyHours } = barData;
  const activeHH = getCurrentHappyHour(barData);

  return (
    <>
      <FloatingEditMenu barId={bar.id} />
      <Box sx={{ padding: 4 }}>
        {/* Bar Info */}
        <Card sx={{ marginBottom: 4 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>{bar.name}</Typography>

            <Box sx={{ marginBottom: 2 }}>
              <Typography variant="body1" sx={{ marginBottom: 0.5 }}>
                <strong>Address:</strong> {bar.address}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 0.5 }}>
                <strong>Coordinates:</strong> {bar.coordLat}, {bar.coordLong}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 0.5 }}>
                <strong>Opening Hours:</strong> {bar.openFrom} - {bar.openTo}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary">
              Created by <strong>{bar.createdBy}</strong> on {new Date(bar.createdAt).toLocaleDateString()}<br />
              Last updated by <strong>{bar.updatedBy}</strong> on {new Date(bar.updatedAt).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>

        {/* Active Happy Hour */}
        {activeHH && (
          <Card sx={{ marginBottom: 4, backgroundColor: theme.palette.secondary.light }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" gutterBottom sx={{ color: 'success.main' }}>
                  🎉 Happy Hour!
                </Typography>
                <IconButton
                  component={Link}
                  to={`/bars/${bar.id}/happy-hours/update/${activeHH.id}`}
                  sx={{ color: 'white' }}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
              </Box>

              <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                {activeHH.startTime} to {activeHH.endTime}
              </Typography>

              <List>
                {activeHH.prices.map(price => (
                  <ListItem
                    key={price.id}
                    sx={{
                      paddingY: 0.5,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body1">
                          {price.drinkName} ({price.drinkType}, {price.drinkSize}ml)
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {price.price.toFixed(2)}€
                        </Typography>
                      }
                    />
                          <IconButton
                            component={Link}
                            to={`/bars/${bar.id}/prices/update/${price.id}`}
                            sx={{ color: 'white' }}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}


        {/* Regular Prices */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>🥂 Regular Prices</Typography>
            <List>
              {prices.map(price => (
                <ListItem
                  key={price.id}
                  sx={{
                    paddingY: 0.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        {price.drinkName} ({price.drinkType}, {price.drinkSize}l)
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {price.price.toFixed(2)}€
                      </Typography>
                    }
                  />
                  <IconButton
                    component={Link}
                    to={`/bars/${bar.id}/prices/update/${price.drinkId}`}
                    sx={{ color: 'grey' }}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
            {activeHH && (
              <Card>
                <CardContent>
                  <Typography variant="h6">🎉 Happy Hour is active!</Typography>
                  <Typography variant="body2">
                    {activeHH.startTime} — {activeHH.endTime}
                  </Typography>
                </CardContent>
              </Card>
            )}
            <Box>
              {!activeHH && (
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 2 }}
                  onClick={() => setShowHH((prev) => !prev)}
                >
                  {showHH ? 'Hide Happy Hour Prices' : 'View Happy Hour Prices!'}
                </Button>

              )}
             
            <Collapse in={showHH}>
        <Card sx={{ marginTop: 3, marginBottom: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🍻 Happy Hours
            </Typography>

            {happyHours && happyHours.length > 0 ? (
              happyHours.map((hh) => (
                <Box key={hh.id} sx={{ marginBottom: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                      {Array.isArray(hh.weekDays)
                        ? hh.weekDays.join(', ')
                        : Array.from(hh.weekDays).join(', ')}{' '}
                      — {hh.startTime} to {hh.endTime}
                    </Typography>

                    <IconButton
                      component={Link}
                      to={`/bars/${bar.id}/happy-hours/update/${hh.id}`}
                      sx={{ color: 'white' }}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>

                  <List>
                    {hh.prices?.map((price) => (
                      <ListItem
                        key={price.id}
                        sx={{
                          paddingY: 0.5,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="body1">
                              {price.drinkName} ({price.drinkType}, {price.drinkSize}l)
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              {price.price.toFixed(2)}€
                            </Typography>
                          }
                        />
                        <IconButton
                          component={Link}
                          to={`/bars/${bar.id}/prices/update/${price.id}`}
                          sx={{ color: 'white' }}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ marginY: 2 }} />
                </Box>
              ))
            ) : (
              <Typography variant="body2">No happy hours available.</Typography>
            )}
          </CardContent>
        </Card>
      </Collapse>
            </Box>
          </CardContent>
        </Card>

        
        <Box>
          <Button
            component={Link}
            to={`/bars/${bar.id}/delete`}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            Delete Bar 🗑️
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default BarDetailsPage;
