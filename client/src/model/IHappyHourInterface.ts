import { PriceDTO } from "./IPriceInterface";
export interface HappyHourDTO {
  id: number;
  weekDays: WeekDay[];
  startTime: string;
  endTime: string;
  barId: number;
  prices: PriceDTO[]; 
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  creatorId?: number;
}

export type WeekDay = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';