export interface PriceDTO {
  id: number;
  price: number;
  barId: number;
  happyHourId?: number;
  drinkId: number;
  drinkName?: string;
  drinkType?: string;
  drinkSize?: number;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  creatorId?: number;
}