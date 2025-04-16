export interface IDrinkPayload {
    drinks: IDrink[];
}

export interface IDrink {
    id: number;
    name: string;
    bar: IBar;
    normalPrice: number;
    createdBy: IUser;
    updatedBy: IUser;
    updatedAt: string;
}

interface IBar{
    id: number;
}

interface IUser {
    id: number;
    name?: string;
}