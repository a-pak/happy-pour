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
  createdAt?: number;
  updatedBy?: string;
  updatedAt?: number;
  creatorId?: number;
}