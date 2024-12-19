require('dotenv').config()
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const app = express()
const PORT = 3000

app.use(cors())

let bars =  [
        {
        "id": 1,
        "name": "Pub Helsinki",
        "coordinates": { "lat": 60.1695, "lng": 24.9354 },
        "address": "Mannerheimintie 10, 00100 Helsinki",
        "beerPrice": 6.5,
        "winePrice": 12,
        "coffeePrice": 4,
        "entryFee": 5,
        "cloakroomFee": 3
        },
        {
        "id": 2,
        "name": "Kaisla",
        "coordinates": { "lat": 60.1722, "lng": 24.9444 },
        "address": "Vilhonkatu 4, 00100 Helsinki",
        "beerPrice": 7.5,
        "winePrice": 13,
        "coffeePrice": 4.5,
        "entryFee": 0,
        "cloakroomFee": 2
        },
        {
        "id": 3,
        "name": "Teerenpeli Kamppi",
        "coordinates": { "lat": 60.1699, "lng": 24.9305 },
        "address": "Olavinkatu 2, 00100 Helsinki",
        "beerPrice": 7,
        "winePrice": 14,
        "coffeePrice": 3.5,
        "entryFee": 0,
        "cloakroomFee": 2
        }
    ]

app.get('/', (req, res) => {
    res.send('react app')
})

app.get('/api/bars', async (req, res) => {
    console.log('Request from the client')
    res.json(bars)
})


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})