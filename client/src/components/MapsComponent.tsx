import React, { useState, useEffect } from 'react';
import { MapContainer, Popup, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import theme from '../Theme';
import { useNavigate } from 'react-router-dom';
import locationService from '../services/location';
import { LocationMarkerComponent } from './LocationMarkerComponent';

interface MapEventsHandlerProps {
  handleMapClick: (event: L.LeafletMouseEvent) => void;
}

const MapsComponent: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);  
  const [error, setError] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<[number, number] | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

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

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    setPopupPosition([lat, lng]);
  };

  const MapEventsHandler: React.FC<MapEventsHandlerProps> = ({ handleMapClick }) => {
    useMapEvents({
      dblclick: (e) => handleMapClick(e),
    });
    return null;
  };

  const openAddBarWindow = () => {
    if (popupPosition) {
      const [lat, lng] = popupPosition;
      navigate(`/submit?lat=${lat}&lng=${lng}`)
    }
  };

  return (
    <div>        
      <Box
        sx={{
          height: isMobile ? 'calc(100vh - 56px)' : 'calc(100vh - 64px)',
          width: '100%',
        }}
      >
        <MapContainer
          center={userLocation || [60.192059, 24.945841]}
          zoom={13}
          className="leaflet-container"
          style={{ height: '100%', width: '100%' }}
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

        {popupPosition && (
          <Popup position={popupPosition}>
            <Box
              sx={{
                  backgroundColor: theme.palette.secondary.light,
                  color: theme.palette.common.white,
                  padding: '5px',
                  marginTop: '5px',
                  borderRadius: '8px',
                  fontFamily: 'Arial, sans-serif',
                  textAlign: 'center',
                  minWidth: '200px',
              }}
              >
              <Typography variant="h6">Do you want to add a new bar to this Location?</Typography>
              <Button sx={{ marginTop: '10px', backgroundColor: theme.palette.secondary.main, }} onClick={openAddBarWindow}>Add bar</Button>
            </Box>
          </Popup>
        )}

        {error ? <p>{error}</p> : <LocationMarkerComponent />}
      </MapContainer>
      </Box>
    </div>
  );
}

export default MapsComponent;
