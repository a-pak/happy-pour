import { HappyHourDTO } from "./IHappyHourInterface";
import { PriceDTO } from "./IPriceInterface";

export default interface Bar {
  id: number;
  name: string;
  address: string;
  coordLong: number;
  coordLat: number;
  openFrom: string;
  openTo: string;
  //entryFee: number;
  //cloakRoomFee: number;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
  creatorId?: number;
}

export interface BarData {
  bar: Bar;
  happyHours: HappyHourDTO[] | null;
  prices: PriceDTO[];
}
