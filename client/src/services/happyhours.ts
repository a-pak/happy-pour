import HappyHour from '../model/IHappyHourInterface'
import api from '../utils/axiosInstance';

const HAPPY_HOUR_URL : string = "/happyhours";

export const getHappyHour = async (id : number) => {
    const response = await api.get<HappyHour>(HAPPY_HOUR_URL + `/${id}`);
    return response.data;
}

export const createHappyHour = async (happyHour: HappyHour) => {
    const response = await api.post<HappyHour>(HAPPY_HOUR_URL, happyHour);
    return response.data;
}