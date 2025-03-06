export default interface Bar {
    id: number;
    name: string;
    coordLong: number;
    coordLat: number;
    address: string;
    beer05Price: number;
    wine075Price: number;
    coffeePrice: number;
    entryFee: number;
    cloakroomFee: number;
  }

export const defaultBar: Bar = {
    id: 0,
    name: "",
    coordLong: 0,
    coordLat: 0,
    address: "",
    beer05Price: 0,
    wine075Price: 0,
    coffeePrice: 0,
    entryFee: 0,
    cloakroomFee: 0
};

export interface User {
  id: number;
  username: string;
}

export interface BarB {
  id: number;
  name: string;
  coordLong: number;
  coordLat: number;
  address: string;
  openFrom: string;
  openTo: string;
  entryFee: number;
  cloakroomFee: number;
  createdBy: User;
  updatedBy: User;
  createdAt: string;
  updatedAt: string;
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
  bar: BarB;
  happyHour: HappyHour | null;
  happyHourDrinks: HappyHourDrink[];
  drinks: Drink[];
}

export type BarDataResponse = BarData[];
