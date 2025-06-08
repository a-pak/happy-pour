import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useMapStore } from '../store/mapStore';
/*
    * This component is responsible for setting the Leaflet map instance in the Zustand store.
    * It uses the useMap hook from react-leaflet to get the map instance and updates the Zustand store.
*/
const MapEffect = () => {
  const map = useMap();
  const setMap = useMapStore((state) => state.setMap);

  useEffect(() => {
    setMap(map);
  }, [map, setMap]);

  return null;
};

export default MapEffect;
