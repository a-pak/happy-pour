import React from 'react'
import { useState, useEffect } from 'react'
import barsService from '../services/bars'
import { LocationMarkerComponent } from './LocationMarkerComponent'
import Bar from '../model/IbarInterface';
import { MapContainer, Popup, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import locationService from '../services/location'
import L from 'leaflet'

interface MapEventsHandlerProps {
  handleMapClick: (event: L.LeafletMouseEvent) => void;
}

const MapsComponent: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);  
  const [bars, setBars] = useState<Bar[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tempMarker, setTempMarker] = useState<[number, number] | null>(null);

  ////////// Asks the location of the user using locationService
  useEffect(() => {
    locationService
      .getUserLocation()
      .then((location) => {
        setUserLocation(location);
      })
      .catch((err: string) => {
        setError(err);
        console.error(err);
      });
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

  ////////////////Add bar to map

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    setTempMarker([lat, lng]); 
    //alert(`Clicked at: ${lat}, ${lng}`);
  };

  const MapEventsHandler: React.FC<MapEventsHandlerProps> = ({ handleMapClick }) => {
    useMapEvents({
      dblclick: (e) => handleMapClick(e),
    });
    return null;
  };

  
  const openAddBarWindow = () => {
    if (tempMarker) {
      const [lat, lng] = tempMarker;
      // Redirect to submit
      const addBarUrl = `/add-bar?lat=${lat}&lng=${lng}`;
      window.open(addBarUrl, '_blank');
    }
  };


  return (
    <div>        
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
        <MapEventsHandler handleMapClick={handleMapClick}/>

        {userLocation && (
          <Marker zIndexOffset={1000} position={userLocation} icon={L.icon({
            iconUrl: "/user.png",
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          })}
          >
          </Marker>
        )}

        {tempMarker && (
          <Marker position={tempMarker}>
            <Popup>
              <div>
                <p>Do you want to add a new bar to this Location?</p>
                <button onClick={openAddBarWindow}>Add bar</button>
              </div>
            </Popup>
          </Marker>
        )}

        {error ? (<p>{error}</p>)
          :<LocationMarkerComponent bars={bars} />
        }
      </MapContainer>
      </div>

    </div>
  );
}

export default MapsComponent