import React from 'react'
import { useState, useEffect } from 'react'
import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
    InfoWindow,
} from '@vis.gl/react-google-maps'

"use client"

const MapsComponent: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const position = { lat: 60.10, lng: 24.55}


  useEffect(() => {
    // Hakee käyttäjän sijainnin, kun komponentti on ladattu
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (err) => {
          setError('Sijainnin haku epäonnistui. Salli sijainnin käyttö selaimen asetuksista.');
          console.error(err);
        }
      );
    } else {
      setError('Sijainnin haku ei ole tuettu tässä selaimessa.');
    }
  }, []);


  return (
    <div>
      {error ? (<p>{error}</p>)
      : !userLocation ? ( <p>Ladataan käyttäjän sijaintia...</p>)
      : (
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <div style={{ height: "100vh" }}>
          <Map 
            zoom={12} 
            center={userLocation}
            draggable={true}
            zoomControl={true}

          >

          </Map>

        </div>
        
      </APIProvider>
        )
      }
    </div>
  );
}

export default MapsComponent