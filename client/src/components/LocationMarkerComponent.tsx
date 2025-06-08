import React, { useState, useEffect } from 'react';
import theme from '../Theme';
import { BarDataResponse } from '../model/IbarInterface.ts';
import { Marker } from 'react-leaflet';
import { ThemeProvider } from '@emotion/react';
import { useDrinkStore } from "../store/drinkStore";
import barsService from '../services/bars.ts';
import { useNavigate } from 'react-router-dom';

export const LocationMarkerComponent: React.FC = () => {
    const [bars, setBars] = useState<BarDataResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const defaultDrink = useDrinkStore((state) => state.defaultDrink);
    const navigate = useNavigate();

    useEffect(() => {
        barsService
          .getAll()
          .then((data: BarDataResponse) => {
            setBars(data);
          })
          .catch((err) => {
            setError(`Can't find any bars: ${err}`);
          });
      }, []);

    const isHappyHourActive = (startTime: string, endTime: string): boolean => {
        const now = new Date();
        const start = new Date();
        const end = new Date();

        const [startHours, startMinutes] = startTime.split(":").map(Number);
        const [endHours, endMinutes] = endTime.split(":").map(Number);

        start.setHours(startHours, startMinutes, 0);
        end.setHours(endHours, endMinutes, 0);

        return now >= start && now <= end;
    };

    if (error) return <p>{error}</p>;

    return (
        <>
            {bars &&
                bars.map((barEntity) => {
                    let hasDrink = false;
                    let drinkPrice = null;
                    let isHappyHour = false;

                    // Jos drinkki on 'View all', näytetään baari joka tapauksessa
                    const showAll = defaultDrink === "View all";

                    barEntity.drinks.forEach((drink) => {
                        if (drink.name === defaultDrink) {
                            hasDrink = true;
                            drinkPrice = drink.normalPrice;
                        }
                    });

                    if (barEntity.happyHour?.startTime && barEntity.happyHour?.endTime) {
                        isHappyHour = isHappyHourActive(barEntity.happyHour.startTime, barEntity.happyHour.endTime);

                        if (isHappyHour) {
                            barEntity.happyHourDrinks.forEach((hhDrink) => {
                                if (hhDrink.drinkName === defaultDrink) {
                                    drinkPrice = hhDrink.happyHourPrice;
                                }
                            });
                        }
                    }

                    if (!hasDrink && !showAll) return null;

                    return (
                        <ThemeProvider theme={theme} key={barEntity.bar.id}>
                            <Marker 
                            position={[barEntity.bar.coordLat, barEntity.bar.coordLong]} 
                            eventHandlers={{
                                click: (e) => {
                                    navigate(`/bar/${barEntity.bar.id}`)
                                }
                            }
                            }/>
                        </ThemeProvider>
                    );
                })}
        </>
    );
};