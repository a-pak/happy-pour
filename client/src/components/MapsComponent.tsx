import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, Popup, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import NearMeIcon from '@mui/icons-material/NearMe';
import theme from '../Theme';
import { useNavigate, useParams } from 'react-router-dom';
import locationService from '../services/location';
import { LocationMarkerComponent } from './LocationMarkerComponent';
import MapEffect from './MapEffect';
import { useDrinkStore } from '../store/drinkStore';
import { useLocationStore } from '../store/locationStore';
import { useMapStore } from '../store/mapStore';
import { useErrorStore } from '../store/errorStore';

interface MapEventsHandlerProps {
  handleMapClick: (event: L.LeafletMouseEvent) => void;
}

const MapsComponent: React.FC = () => {
  const { id: barId } = useParams<{ id: string }>();
  const {
    map,
    mapCenter,
    mapZoom,
    storeMapPosition,
    setView,
    hasInitialized,
    initialize
  } = useMapStore();
  const { userLocation, storeUserLocation } = useLocationStore();
  const { showNotification } = useErrorStore();
  const [popupPosition, setPopupPosition] = useState<[number, number] | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { defaultDrink } = useDrinkStore();
  const [isComponentReady, setIsComponentReady] = useState(false);
  const currentMapPositionRef = useRef({ center: mapCenter, zoom: mapZoom });

  // Track current map position in real-time
  useEffect(() => {
    currentMapPositionRef.current = { center: mapCenter, zoom: mapZoom };
  }, [mapCenter, mapZoom]);

  // Listen to map pan/zoom events to update ref in real-time
  useEffect(() => {
    if (!map) return;

    const handleMapMove = () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      currentMapPositionRef.current = { center: { latitude: center.lat, longitude: center.lng }, zoom };
    };

    map.on('moveend', handleMapMove);
    map.on('zoomend', handleMapMove);

    return () => {
      map.off('moveend', handleMapMove);
      map.off('zoomend', handleMapMove);
    };
  }, [map]);

  // Initialize map position on first load
  useEffect(() => {
    if (!hasInitialized) {
      initialize();
      // Don't center to user if viewing a specific bar - let BarDetailsDrawer handle it
      if (!barId) {
        centerMapToUser();
      }
    }
    setIsComponentReady(true);
  }, [hasInitialized, initialize, barId]);

  // Store map position on unmount
  useEffect(() => {
    return () => {
      if (isComponentReady) {
        console.log("UNMOUNT - Storing map position:", currentMapPositionRef.current);
        storeMapPosition(
          currentMapPositionRef.current.center,
          currentMapPositionRef.current.zoom
        );
      }
    }
  }, [isComponentReady, storeMapPosition]);



  /* --- Map Event Handlers --- */
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

  const centerMapToUser = () => {
    if (!userLocation) {
      locationService.getUserLocation()
        .then((location) => {
          storeUserLocation({ latitude: location[0], longitude: location[1] });
          setView(location[0], location[1], 16);
        })

        .catch((err: string) => {
          showNotification('Unable to retrieve your location. Please allow location access and try again.', 'error');
          console.error(`Error retrieving user location: ${err}`);
        });

    } else {
      setView(userLocation.latitude, userLocation.longitude, 16);
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
        <button
          onClick={centerMapToUser}
          style={{
            position: 'absolute',
            zIndex: '5000',
            width: '30px',
            height: '30px',
            marginLeft: '12px',
            marginTop: '80px',
            paddingTop: '6px',
            display: 'block',
            lineHeight: '26px',
            backgroundColor: "white",
            borderRadius: '3px',
            border: 'none',
            backgroundClip: 'padding-box',
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.52)',
            cursor: 'pointer'
          }}
        >
          <NearMeIcon fontSize="small" color='primary'
            sx={{
              width: '17px'
            }} />
        </button>



        <MapContainer
          center={mapCenter ? [mapCenter.latitude, mapCenter?.longitude] : [60.192059, 24.945841]}
          zoom={mapZoom ? mapZoom : 15}
          className="leaflet-container"
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapEventsHandler handleMapClick={handleMapClick} />

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
