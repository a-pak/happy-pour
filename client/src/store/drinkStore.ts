import  { create } from "zustand";

interface DrinkStore {
  defaultDrink: string;
  setDefaultDrink: (drink: string) => void;
}

export const useDrinkStore = create<DrinkStore>((set) => ({
  defaultDrink: "View all",
  setDefaultDrink: (drink) => set({ defaultDrink: drink }),
}));
