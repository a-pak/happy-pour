export default interface Bar {
  id: number;
  name: string;
  coordLong: number;
  coordLat: number;
  address: string;
  openFrom: string; // "HH:mm:ss" muotoisena
  openTo: string;   // "HH:mm:ss" muotoisena
  entryFee: number;
  cloakroomFee: number;
  createdBy: User | null;
  updatedBy: User | null;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

  export const defaultBar: Bar = {
    id: 0,
    name: "",
    coordLong: 0,
    coordLat: 0,
    address: "",
    openFrom: "00:00:00",
    openTo: "00:00:00",
    entryFee: 0,
    cloakroomFee: 0,
    createdBy: { id: 1, username: "admin" },
    updatedBy: { id: 1, username: "admin" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

interface User {
  id: number;
  username: string;
}

export interface HappyHour {
  id: number;
  startTime: string;
  endTime: string;
  createdBy: User;
  updatedBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface HappyHourDrink {
  happyHourId: number;
  drinkId: number;
  drinkName: string;
  happyHourPrice: number;
  updatedBy: User;
  updatedAt: string;
}

export interface Drink {
  id: number;
  name: string;
  barId: number;
  normalPrice: number;
  updatedBy: User;
  updatedAt: string;
}

export interface BarData {
  bar: Bar;
  happyHour: HappyHour | null;
  happyHourDrinks: HappyHourDrink[];
  drinks: Drink[];
}

export type BarDataResponse = BarData[];
