import * as React from 'react';
import { useEffect, useState } from 'react';
import { TextField, Button, Grid, Typography, IconButton } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import barsService from '../services/bars';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import MapsComponent from '../components/MapsComponent';
import Bar from '../model/IbarInterface';


const SubmitPage: React.FC = () => {
  const [bars, setBars] = useState<Bar[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [barNames, setBarNames] = useState<string[] | null>(null);

  // Lomakkeen kenttien tilat
  const [newBar, setNewBar] = useState({
    name: '',
    address: '',
    lat: '',
    lng: '',
    beer05Price: '',
    wine075Price: '',
    coffeePrice: '',
    entryFee: '',
    cloakroomFee: '',
  });

  // Hakee baarit tietokannasta
  useEffect(() => {
    barsService
      .getAll()
      .then((data: Bar[]) => {
        setBars(data);
        setBarNames(data.map((bar) => bar.name));
      })
      .catch((err) => {
        setError(`Can't find any bars: ${err}`);
      });
  }, []);

  // Lomakkeen muutosten käsittely
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Lomakkeen lähetys
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const barToSubmit: Bar = {
      id: Math.random(), // Väliaikainen ID (backend-generoi lopullisen ID:n)
      name: newBar.name,
      address: newBar.address,
      coordLat: parseFloat(newBar.lat),
      coordLong: parseFloat(newBar.lng),
      beer05Price: parseFloat(newBar.beer05Price),
      wine075Price: parseFloat(newBar.wine075Price),
      coffeePrice: parseFloat(newBar.coffeePrice),
      entryFee: parseFloat(newBar.entryFee),
      cloakroomFee: parseFloat(newBar.cloakroomFee),
    };

    // Lisää uusi baari tietokantaan
    barsService
      .create(barToSubmit)
      .then(() => {
        console.log('Bar added successfully');
        setBars((prevBars) => (prevBars ? [...prevBars, barToSubmit] : [barToSubmit]));
        setBarNames((prevNames) => (prevNames ? [...prevNames, barToSubmit.name] : [barToSubmit.name]));
        // Tyhjennä lomake
        setNewBar({
          name: '',
          address: '',
          lat: '',
          lng: '',
          beer05Price: '',
          wine075Price: '',
          coffeePrice: '',
          entryFee: '',
          cloakroomFee: '',
        });
      })
      .catch((err: string) => {
        setError(`Failed to add bar: ${err}`);
      });
  };

  return (
    <div style={{ padding: '20px' }}>


      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={1}>

          <Grid item xs={2}>
            <Link to="/" >
              <IconButton  aria-label="delete" size="large" sx={{ color:'text.primary', position:'relative', left:'-10px', top:'-8px'}} >
                <ArrowBackIcon fontSize="inherit" />
              </IconButton>
            </Link>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h5" gutterBottom>
              Add or Update
            </Typography>
          </Grid>
          {/* <Grid item xs={12}>
            <Typography variant="subtitle1">Select Location on Map:</Typography>
            <MapsComponent />
          </Grid> */}
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bar Name"
              color='secondary'
              name="name"
              value={newBar.name}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={newBar.address}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Latitude"
              name="lat"
              type="number"
              value={newBar.lat}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Longitude"
              name="lng"
              type="number"
              value={newBar.lng}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Beer (0.5L) Price"
              name="beer05Price"
              type="number"
              value={newBar.beer05Price}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Wine (0.75L) Price"
              name="wine075Price"
              type="number"
              value={newBar.wine075Price}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Coffee Price"
              name="coffeePrice"
              type="number"
              value={newBar.coffeePrice}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Entry Fee"
              name="entryFee"
              type="number"
              value={newBar.entryFee}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Cloakroom Fee"
              name="cloakRoomFee"
              type="number"
              value={newBar.cloakroomFee}
              onChange={handleInputChange}
              
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default SubmitPage;
