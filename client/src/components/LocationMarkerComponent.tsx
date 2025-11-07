import React, { useState, useEffect } from 'react';
import theme from '../Theme';
import { BarData } from '../model/IbarInterface.ts';
import { Marker, Tooltip } from 'react-leaflet';
import { ThemeProvider } from '@emotion/react';
import L from 'leaflet';
import { useDrinkStore } from "../store/drinkStore";
import barsService from '../services/bars.ts';
import { useNavigate } from 'react-router-dom';
import { getCurrentHappyHour } from '../utils/happyHourUtil.ts';
import { PriceDTO } from '../model/IPriceInterface.ts';
import { getCheapestPrice } from '../utils/priceUtil.ts';
import '../App.css';

const customIcon = L.icon({
    iconUrl: '/beer-icon.png', // You'll need to add this image to your public folder
    iconSize: [30, 31], // Scaled down from 236x212 while maintaining aspect ratio
    iconAnchor: [15, 27], // Half width and full height to anchor at bottom center
    popupAnchor: [0, -27], // Center horizontally and place above the icon
    shadowSize: [30, 27]
});

// Invisible div icon: used when you want no visible marker, only a tooltip
const invisibleIcon = L.divIcon({
    //iconUrl: '/location-marker1.png',
    className: 'invisible-div-icon',
    html:'<span>',
    iconSize: [30, 31], // Scaled down from 236x212 while maintaining aspect ratio
    iconAnchor: [15, 27], // Half width and full height to anchor at bottom center
    popupAnchor: [0, -27], // Center horizontally and place above the icon
    shadowSize: [30, 27]
});

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
                    barEntity.prices.some((price) => {
                        if (price.drinkType === defaultDrink) hasDrink = true;    
                    });
                    // Check Happy Hour Prices
                    const activeHappyHour = getCurrentHappyHour(barEntity);
                    if(activeHappyHour) {
                        if (activeHappyHour.prices.find((p : PriceDTO) => (p.drinkType === defaultDrink))) hasDrink = true;
                    }


                    if (!hasDrink && !showAll) return null;

                    if(getCurrentHappyHour(barEntity)) {
                        return (
                            <ThemeProvider theme={theme} key={barEntity.bar.id}>
                            {/* Use invisibleIcon here so the marker itself is not visible but still clickable
                                Tooltip will be the visible element with downward-pointing angle (direction='top') */}
                            <Marker 
                                position={[barEntity.bar.coordLat, barEntity.bar.coordLong]} 
                                icon={customIcon}
                                eventHandlers={{
                                    click: () => navigate(`/bars/${barEntity.bar.id}`)
                                }}>
                            </Marker>
                        </ThemeProvider>
                        );
                    }

                    return (
                        <ThemeProvider theme={theme} key={barEntity.bar.id}>
                            <Marker 
                            position={[barEntity.bar.coordLat, barEntity.bar.coordLong]} 
                            icon={invisibleIcon}
                            eventHandlers={{
                                click: () => navigate(`/bars/${barEntity.bar.id}`)
                            }}>
                                <Tooltip
                                    className="marker-tooltip"
                                    direction="top"
                                    offset={[0, 10]}
                                    permanent
                                    >
                                    {getCheapestPrice(barEntity, defaultDrink)}€
                                </Tooltip>
                                
                            </Marker>
                        </ThemeProvider>
                    );
                })}
        </>
    );
};