import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText, IconButton, Grid, Button } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import barsService from '../services/bars';
import Bar from '../model/IbarInterface';
import theme from '../Theme';
import CloseIcon from '@mui/icons-material/Close';


const BarDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [bar, setBar] = useState<Bar | null>(null);
  const navigate = useNavigate();


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

  const removeBar = () => {
    if (window.confirm("Are you sure you want to delete this bar?")) {
      if(id) {
        barsService
          .removeById(bar.id)
          .then((res: String) => { 
            console.log(res)
            navigate('/')
          })

      }
    }
  } 

  return (
    <Box sx={{ padding: 2 }}>
      <Paper sx={{ padding: 2, backgroundColor:theme.palette.secondary.main }}>
        <Grid container spacing={1}>
        <Grid item xs={10}>
        <Typography variant="h4" gutterBottom>
          {bar.name}
        </Typography>
        </Grid>
        <Grid item xs={2}>
          <IconButton  aria-label="delete" size="large" sx={{ color:'text.primary', position:'relative', left:'20px', }} onClick={() => navigate(-1)}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Grid>
        </Grid>
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

        <Link to={`/submit?name=${bar.name}&lat=${bar.coordLat}&lng=${bar.coordLong}`}>
            <Button sx={{backgroundColor:theme.palette.secondary.light}}>Update Prices</Button>
        </Link>
        <Button onClick={() => removeBar()}>Delete Bar (please don't)</Button>
      </Paper>
    </Box>
  );
};

export default BarDetailsPage;
