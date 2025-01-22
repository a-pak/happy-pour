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
    cloakroomFee: 0,
};