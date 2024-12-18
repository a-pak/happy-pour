import React from 'react'
import { useState, useEffect } from 'react'

const MapsComponent: React.FC = () => {
    useEffect(() => {
        // Kun komponentti on ladattu, luodaan kartta
        const loadMap = () => {
          if (window.google && window.google.maps) {
            const map = new window.google.maps.Map(document.getElementById("map") as HTMLElement, {
              center: { lat: 37.4220656, lng: -122.0840897 },
              zoom: 10,
            });
          } else {
            console.error('Google Maps API ei ole ladattu.');
          }
        };
    
        loadMap();
      }, []);
    
      return (
        <div>
          <h2>Google Maps</h2>
          <div id="map" style={{ height: "400px", width: "100%" }}></div>
        </div>
      );
}

export default MapsComponent