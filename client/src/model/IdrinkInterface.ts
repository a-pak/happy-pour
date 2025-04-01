export interface IDrink {
    id: number;
    name: string;
    bar: IBar;
    normalPrice: number;
    createdBy: IUser;
    updatedBy: IUser;
    updatedAt: string;
}

export interface IBar{
    id: number;
}

export interface IUser {
    id: number;
    name?: string;
}