import React from 'react'
import { useState, useEffect } from 'react'
import barsService from '../services/bars'
import { LocationMarkerComponent } from './LocationMarkerComponent'
import Bar from '../model/IbarInterface';
import { MapContainer, TileLayer } from 'react-leaflet';

"use client"

const MapsComponent: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);  
  const [bars, setBars] = useState<Bar[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const position = { lat: 60.192059, lng: 24.945841 }

  //////////Asks the location of the user
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);        },
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
              <div id='map' style={{ height: `calc(100vh - 56px)` }}>
              <MapContainer 
                center={userLocation || [60.192059, 24.945841]}                
                zoom={13} 
                className="leaflet-container"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarkerComponent bars={bars} />
              </MapContainer>
              </div>
          )
      }
    </div>
  );
}

export default MapsComponent