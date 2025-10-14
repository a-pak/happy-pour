import {HappyHourDTO} from '../model/IHappyHourInterface'
import api from '../utils/axiosInstance';

const HAPPY_HOUR_URL : string = "/happyhours";

export const getHappyHour = async (id : number) => {
    const response = await api.get(HAPPY_HOUR_URL + `/${id}`);
    return response.data;
}

export const createHappyHour = async (happyHour: HappyHourDTO) => {
    console.log(happyHour);
    const response = await api.post(HAPPY_HOUR_URL, happyHour);
    return response.data;
}

export const updateHappyHour = async (happyHour: HappyHourDTO) => {
    console.log(happyHour);
    const response = await api.put(HAPPY_HOUR_URL, happyHour);
    return response.data;
}