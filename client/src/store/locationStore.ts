import { create } from 'zustand'
import {Location} from '../utils/locationUtil';

interface LocationStore {
    userLocation: Location | null;
    hasInitialized: boolean;
    storeUserLocation: (location: Location) => void;
    clearLocation: () => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
    userLocation: null,
    hasInitialized: false,
    storeUserLocation: (newLocation: Location) => {
        set({ userLocation: newLocation });
    },
    clearLocation: () => set({ userLocation: null }),
}));
