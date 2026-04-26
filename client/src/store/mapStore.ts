import { create } from 'zustand';
import { Map } from 'leaflet';
import { Location } from '../utils/locationUtil';
/*
    * Zustand store for managing the Leaflet map instance.
    * This store allows components to access the map instance and perform actions like flying to a specific location.
*/
type MapStore = {
  map: Map | null;
  mapCenter: Location;
  mapZoom: number;
  hasInitialized: boolean;

  setMap: (map: Map) => void;
  storeMapPosition: (location: Location, zoom: number) => void;
  flyTo: (lat: number, lng: number, zoom?: number) => void;
  setView: (lat: number, lng: number, zoom?: number) => void;
  initialize: () => void;
};

export const defaultLocation: Location = { 
  latitude: 60.1707485, 
  longitude: 24.9416647 
}; // (Helsinki Center)

export const useMapStore = create<MapStore>((set, get) => ({
  map: null,
  mapCenter: defaultLocation,
  mapZoom: 15,
  hasInitialized: false,
  
  initialize: () => set({ hasInitialized: true}),
  setMap: (mapInstance) => set({ map: mapInstance }),
  storeMapPosition(newLocation, zoom) {
      set({mapCenter: newLocation, mapZoom: zoom})
  },
  flyTo: (lat, lng, zoom = 16) => {
    const map = get().map;
    if (map) {
      map.flyTo([lat, lng], zoom);
    }
  },
  setView: (lat, lng, zoom = 16) => {
    const map = get().map;
    if (map) {
      map.setView([lat, lng], zoom);
    }
  },
}));
