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
} from '@mui/material';
import { useParams } from 'react-router-dom';
import barsService from '../services/bars.ts';
import { BarData } from '../model/IbarInterface.ts';
import { getCurrentHappyHour } from '../utils/happyHourUtil.ts';
import FloatingEditMenu from '../components/FloatingEditMenu.tsx';

const BarDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [barData, setBarData] = useState<BarData | null>(null);

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
  /**************************************************
   TODO: implement advertisement of current happy hour

   ***************************************************/
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
        <Card sx={{ marginBottom: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: 'success.main' }}>
              🎉 Happy Hour!
            </Typography>
            <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
              {activeHH.startTime} to {activeHH.endTime}
            </Typography>
            <List>
              {activeHH.prices.map(price => (
                <ListItem key={price.id} sx={{ paddingY: 0.5 }}>
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
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* All Happy Hours */}
      <Card sx={{ marginBottom: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>🍻 Happy Hours</Typography>
          {happyHours && happyHours.length > 0 ? (
            happyHours.map(hh => (
              <Box key={hh.id} sx={{ marginBottom: 3 }}>
                <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                  {hh.weekDays.join(', ')} — {hh.startTime} to {hh.endTime}
                </Typography>
                <List>
                  {hh.prices.map(price => (
                    <ListItem key={price.id} sx={{ paddingY: 0.5 }}>
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

      {/* Regular Prices */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>🥂 Regular Prices</Typography>
          <List>
            {prices.map(price => (
              <ListItem key={price.id} sx={{ paddingY: 0.5 }}>
                <ListItemText
                  primary={
                    <Typography variant="body1">
                      {price.drinkName} ({price.drinkType}, {price.drinkSize}ml)
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      €{price.price.toFixed(2)}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  </>
);
};

export default BarDetailsPage;
