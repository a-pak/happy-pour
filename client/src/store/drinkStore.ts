import  { create } from "zustand";

interface DrinkStore {
  defaultDrink: string;
  setDefaultDrink: (drink: string) => void;
}

const initialDrink = document.cookie.split("; ").find((row) => row.startsWith("drink="))?.split("=")[1] || "View all";

export const useDrinkStore = create<DrinkStore>((set) => ({
  defaultDrink: initialDrink,
  setDefaultDrink: (drink: string) => {
    document.cookie = "drink=" + drink + "; path=/; max-age=" + 60 * 60 * 24 * 7; // Week
    set({ defaultDrink: drink });
  },
}));
