import { create } from 'zustand';
import { Map } from 'leaflet';
import { Location } from '../utils/locationUtil';
/*
    * Zustand store for managing the Leaflet map instance.
    * This store allows components to access the map instance and perform actions like flying to a specific location.
*/
type MapStore = {
  map: Map | null;
  mapCenter: Location | null;
  mapZoom: number;

  setMap: (map: Map) => void;
  setMapPosition: (location: Location, zoom: number) => void;
  flyTo: (lat: number, lng: number, zoom?: number) => void;
};

export const useMapStore = create<MapStore>((set, get) => ({
  map: null,
  mapCenter: null,
  mapZoom: 15,
  setMap: (mapInstance) => set({ map: mapInstance }),
  setMapPosition(newLocation, zoom) {
      set({mapCenter: newLocation, mapZoom: zoom})
  },
  flyTo: (lat, lng, zoom = 16) => {
    const map = get().map;
    if (map) {
      map.flyTo([lat, lng], zoom);
    }
  },
}));
