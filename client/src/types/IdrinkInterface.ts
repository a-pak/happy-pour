export interface DrinkDTO {
  id: number;
  name: string;
  type: DrinkType;
  size: number;
  createdBy?: string;
  createdAt?: number;
  updatedBy?: string;
  updatedAt?: number;
  creatorId?: number;
}

export type DrinkType = 'BEER' | 'WINE' | 'COFFEE';