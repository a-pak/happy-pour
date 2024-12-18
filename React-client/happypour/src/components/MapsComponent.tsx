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

  const position = { lat: 60.10, lng: 24.55}
  console.log(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

  return (
    <div>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <div style={{ height: "100vh" }}>
          <Map zoom={12} center={position}>
            <AdvancedMarker position={position}>
              <Pin />
            </AdvancedMarker>
          </Map>

        </div>
        
      </APIProvider>
    </div>
  );
}

export default MapsComponent