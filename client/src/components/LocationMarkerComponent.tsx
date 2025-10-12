import React, { useState, useEffect } from 'react';
import theme from '../Theme';
import { BarData } from '../model/IbarInterface.ts';
import { Marker } from 'react-leaflet';
import { ThemeProvider } from '@emotion/react';
import { useDrinkStore } from "../store/drinkStore";
import barsService from '../services/bars.ts';
import { useNavigate } from 'react-router-dom';
import { getCurrentHappyHour } from '../utils/happyHourUtil.ts';
import { PriceDTO } from '../model/IPriceInterface.ts';

export const LocationMarkerComponent: React.FC = () => {
    const [bars, setBars] = useState<BarData[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const defaultDrink = useDrinkStore((state) => state.defaultDrink);
    const navigate = useNavigate();
    

    useEffect(() => {
        barsService
          .getAll()
          .then((data: BarData[]) => {
            setBars(data);
          })
          .catch((err) => {
            setError(`Can't find any bars: ${err}`);
          });
      }, []);

    if (error) return <p>{error}</p>;

    return (
        <>
            {bars &&
                bars.map((barEntity) => {
                    let hasDrink = false;

                    // Jos drinkki on 'View all', näytetään baari joka tapauksessa
                    const showAll = defaultDrink === "View all";
                    // Check normal prices
                    barEntity.prices.forEach((price) => {
                        if (price.drinkType === defaultDrink) hasDrink = true;    
                    });
                    // Check Happy Hour Prices
                    const activeHappyHour = getCurrentHappyHour(barEntity);
                    if(activeHappyHour) {
                        if (activeHappyHour.prices.find((p : PriceDTO) => (p.drinkType === defaultDrink))) hasDrink = true;
                    }


                    if (!hasDrink && !showAll) return null;

                    return (
                        <ThemeProvider theme={theme} key={barEntity.bar.id}>
                            <Marker 
                            position={[barEntity.bar.coordLat, barEntity.bar.coordLong]} 
                            eventHandlers={{
                                click: () => navigate(`/bar/${barEntity.bar.id}`)
                            }
                            }/>
                        </ThemeProvider>
                    );
                })}
        </>
    );
};