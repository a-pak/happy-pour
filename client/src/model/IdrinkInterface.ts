export interface DrinkDTO {
  id: number;
  name: string;
  type: DrinkType;
  size: number;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  creatorId?: number;
}

export type DrinkType = 'BEER' | 'WINE' | 'COFFEE';