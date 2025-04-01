export interface IDrink {
    id: number;
    name: string;
    barId: number;
    normalPrice: number;
    createdBy: IUser;
    updatedBy: IUser;
    updatedAt: string;
}

export interface IUser {
    id: number;
    name?: string;
}