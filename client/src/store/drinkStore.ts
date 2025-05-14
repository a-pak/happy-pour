import  { create } from "zustand";

interface DrinkStore {
  defaultDrink: string;
  setDefaultDrink: (drink: string) => void;
}

export const useDrinkStore = create<DrinkStore>((set) => ({
  defaultDrink: "Beer",
  setDefaultDrink: (drink) => set({ defaultDrink: drink }),
}));
