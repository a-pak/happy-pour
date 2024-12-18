require('dotenv').config()
const express = require('express')
const axios = require('axios')
const app = express()
const PORT = 3000


app.get('/', (req, res) => {
    res.send('react app')
})

app.get('/api/maps', async (req, res) => {
    try {
        const url = `https://maps.googleapis.com/maps/api/js`;
        const params = {
          key: process.env.G_MAPS_API_KEY,
          libraries: 'maps',
          v: 'beta',
        };
    
        const response = await axios.get(url, { params });
        res.send(response.data);
        console.log('Maps requrest sent to client.')
    } catch (error) {
        console.error('Error fetching Google Maps API:', error.message);
        res.status(500).send('Error fetching Google Maps API');
    }
})


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})