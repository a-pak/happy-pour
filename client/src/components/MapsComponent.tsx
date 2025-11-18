import React, { useState, useEffect } from 'react';
import { MapContainer, Popup, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import NearMeIcon from '@mui/icons-material/NearMe';
import theme from '../Theme';
import { useNavigate } from 'react-router-dom';
import locationService from '../services/location';
import { LocationMarkerComponent } from './LocationMarkerComponent';
import MapEffect from './MapEffect';
import { useDrinkStore } from '../store/drinkStore';
import { useLocationStore } from '../store/locationStore';
import { useMapStore } from '../store/mapStore';
import { useErrorStore } from '../store/errorStore';

interface MapEventsHandlerProps {
  handleMapClick: (event: L.LeafletMouseEvent) => void;
  handleMapMoveEnd: (center: [lat : number, lng: number], zoom:number) => void;
}

const MapsComponent: React.FC = () => {
  const {mapCenter, mapZoom, setMapPosition} = useMapStore();
  const {userLocation, setUserLocation} = useLocationStore();
  const {showNotification} = useErrorStore();
  const [refreshLocation, setRefreshLocation] = useState<"REFRESH" | "DEFAULT">("DEFAULT"); 
  const [popupPosition, setPopupPosition] = useState<[number, number] | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const {defaultDrink} = useDrinkStore();

  useEffect(() => {
    if (!userLocation) {   
      locationService
        .getUserLocation()
        .then((location) => {
          setUserLocation({latitude: location[0], longitude: location[1]});
          setMapPosition({latitude: location[0], longitude: location[1]}, 15);
          setRefreshLocation("REFRESH");
        })
        .catch((err: string) => {
          console.error(err);
        });
    }
  }, []);

  /* --- Map Event Handlers --- */
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    setPopupPosition([lat, lng]);
  };
  const handleMapMoveEnd = (center: [number, number], zoom:number) => {
    setMapPosition({latitude: center[0], longitude: center[1]}, zoom);
  };
  const MapEventsHandler: React.FC<MapEventsHandlerProps> = ({ handleMapClick }) => {
    useMapEvents({
      dblclick: (e) => handleMapClick(e),
      moveend: (e) => {
        const map = e.target;
        const center = map.getCenter();
        const zoom = map.getZoom();
        handleMapMoveEnd([center.lat, center.lng], zoom);   
    },
    });
    return null;
  };

  const centerMapToUser = () => {
    if (!userLocation) {   
      locationService
        .getUserLocation()
        .then((location) => {
          setUserLocation({latitude: location[0], longitude: location[1]});
        })
        .catch((err: string) => {
          console.error(err);
        });
    }
    if(userLocation) {
      setMapPosition(userLocation, 16);
      refreshLocation=="DEFAULT" ? setRefreshLocation("REFRESH") : setRefreshLocation("DEFAULT");
    } else {
      showNotification("Please allow the browser to use your location","warning");
    }
  }
  const openAddBarWindow = () => {
    if (popupPosition) {
      const [lat, lng] = popupPosition;
      navigate(`/bars/create?lat=${lat}&lng=${lng}`)
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
          <Button 
            onClick={centerMapToUser} 
            variant='contained'
            sx={{
              position: 'absolute',
              top: '12px',
              right: '12px',           // <-- stick to right edge
              backgroundColor: 'white',
              zIndex: 1000,
              width: '5px',
              minHeight: '50px',
              borderRadius: '5px',
            }}
          >
            <NearMeIcon fontSize='medium' color='primary'/>
          </Button>

        

        <MapContainer
          key={refreshLocation}
          center={mapCenter ? [mapCenter.latitude, mapCenter?.longitude] : [60.192059, 24.945841]}
          zoom={mapZoom ? mapZoom : 15}
          className="leaflet-container"
          style={{ height: '100%', width: '100%' }}
        >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEventsHandler handleMapClick={handleMapClick} handleMapMoveEnd={handleMapMoveEnd}/>

        {userLocation && (
          <Marker zIndexOffset={1000} position={[userLocation?.latitude, userLocation?.longitude]} icon={L.icon({
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
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                boxShadow: 0,
                padding: 1,
                marginTop: 1,
                borderRadius: 2,
                fontFamily: 'Roboto, sans-serif',
                textAlign: 'center',
                minWidth: 240,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Do you want to add a new bar to this location?
              </Typography>

              <Button
                variant="contained"
                color="secondary"
                onClick={openAddBarWindow}
                sx={{
                  mt: 1,
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 3,
                  borderRadius: 2,
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                }}
              >
                Add Bar
              </Button>
            </Box>
          </Popup>
        )}
        
        <LocationMarkerComponent key={defaultDrink} />
        <MapEffect />
      </MapContainer>
      </Box>
    </div>
  );
}

export default MapsComponent;
