import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText } from '@mui/material';
import { useParams } from 'react-router-dom';
import barsService from '../services/bars';
import Bar from '../model/IbarInterface';

const BarDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [bar, setBar] = useState<Bar | null>(null);

  useEffect(() => {
    if (id) {
      barsService
        .getById(parseInt(id))
        .then((data: Bar) => setBar(data))
        .catch((err) => console.error('Failed to fetch bar:', err));
    }
  }, [id]);

  if (!bar) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          {bar.name}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Address: {bar.address}
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Beer (0.5L)" secondary={`${bar.beer05Price} €`} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Wine (0.75L)" secondary={`${bar.wine075Price} €`} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Coffee" secondary={`${bar.coffeePrice} €`} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Entry Fee" secondary={`${bar.entryFee} €`} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Cloakroom Fee" secondary={`${bar.cloakroomFee} €`} />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default BarDetailsPage;
