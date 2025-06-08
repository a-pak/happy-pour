import { create } from 'zustand';
import { Map } from 'leaflet';
/*
    * Zustand store for managing the Leaflet map instance.
    * This store allows components to access the map instance and perform actions like flying to a specific location.
*/
type MapStore = {
  map: Map | null;
  setMap: (map: Map) => void;
  flyTo: (lat: number, lng: number, zoom?: number) => void;
};

export const useMapStore = create<MapStore>((set, get) => ({
  map: null,
  setMap: (mapInstance) => set({ map: mapInstance }),
  flyTo: (lat, lng, zoom = 16) => {
    const map = get().map;
    if (map) {
      map.flyTo([lat, lng], zoom);
    }
  },
}));
