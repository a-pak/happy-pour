import React from 'react'
import { useState, useEffect } from 'react'
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  ColorScheme
} from '@vis.gl/react-google-maps'
import barsService from '../services/bars'
import { LocationMarkerComponent } from './LocationMarkerComponent';

interface Coordinates {
  lat: number;
  lng: number;
}

interface Bar {
  id: number;
  name: string;
  coordinates: Coordinates;
  address: string;
  beerPrice: number;
  winePrice: number;
  coffeePrice: number;
  entryFee: number;
  cloakroomFee: number;
}


"use client"

const MapsComponent: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [bars, setBars] = useState<Bar[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const position = { lat: 60.192059, lng: 24.945841 }

  //////////Asks the location of the user
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (err) => {
          setError('Problem getting the location. Allow the broser to use your location.');
          console.error(err);
        }
      );
    } else {
      setError('Problem getting the location.');
    }
  }, []);

  ///////////////GET all bars from database
  useEffect(() => {
    barsService
      .getAll()
      .then((data: Bar[]) => {
        setBars(data)
        console.log(`bars requested ${data}`)
        console.log(bars)
      })
      .catch((err) => {
        setError(`Can't find any bars: ${err}`)
      })
  }, [navigator.geolocation])

  return (
    <div>
      {error ? (<p>{error}</p>)
        : !userLocation ? (<p>Loading User Location...</p>)
          : (
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
              <div style={{ height: `calc(100vh - 56px)` }}>
                <Map
                  mapId={import.meta.env.VITE_MAP_ID_API}
                  defaultZoom={12}
                  defaultCenter={position}
                  zoomControl={true}
                  gestureHandling='greedy'
                  colorScheme='DARK'
                >
                  <LocationMarkerComponent bars={bars} />

                </Map>

              </div>

            </APIProvider>
          )
      }
    </div>
  );
}

export default MapsComponent