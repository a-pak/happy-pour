export default interface HappyHour {
  id: number;
  bar: IBar;
  startTime: string;
  endTime: string;
  createdBy: IUser;
  updatedBy: IUser;
  createdAt: string;
  updatedAt: string;
}

interface IBar{
    id: number;
}

interface IUser {
    id: number;
    name?: string;
}