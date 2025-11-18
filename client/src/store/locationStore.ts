import { create } from 'zustand'
import {Location} from '../utils/locationUtil';

interface LocationStore {
    userLocation: Location | null;
    setUserLocation: (location: Location) => void;
    clearLocation: () => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
    userLocation: null,
    setUserLocation: (newLocation: Location) => {
        set({ userLocation: newLocation });
    },
    clearLocation: () => set({ userLocation: null }),
}));
