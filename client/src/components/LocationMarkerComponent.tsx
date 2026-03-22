import React, { useState, useEffect } from 'react';
import theme from '../Theme';
import { BarData } from '../types/IbarInterface.ts';
import { Marker, Tooltip } from 'react-leaflet';
import { ThemeProvider } from '@emotion/react';
import L from 'leaflet';
import { useDrinkStore } from "../store/drinkStore";
import barsService from '../services/bars.ts';
import { useNavigate } from 'react-router-dom';
import { getCurrentHappyHour } from '../utils/happyHourUtil.ts';
import { PriceDTO } from '../types/IPriceInterface.ts';
import { getCheapestPrice, getPriceRank, PriceRank } from '../utils/priceUtil.ts';
import '../App.css';
/* Icon tempalte with a png */
// const customIcon = L.icon({
//     iconUrl: '/beer-icon.png',
//     iconSize: [30, 31],
//     iconAnchor: [15, 27],
//     popupAnchor: [0, -27],
//     shadowSize: [30, 27]
// });

// Invisible div icon: used with no visible marker, only a tooltip
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
    const {defaultDrink} = useDrinkStore();
    const navigate = useNavigate();
    const showAll = defaultDrink === "View all";

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
                    /* Set color of marker tooltip to indicate affordability of price
                     compared to average */
                    let colorClass = [];
                    const cheapestPrice = getCheapestPrice(barEntity, defaultDrink);
                    
                    // Only apply price-based coloring if not in "View All" mode
                    let priceRank : PriceRank = PriceRank.DEFAULT;
                    if (!showAll && cheapestPrice) {
                        priceRank = getPriceRank(bars, cheapestPrice, defaultDrink)
                        switch (priceRank) {
                            case PriceRank.LOW:
                                colorClass.push("marker-tt-green");
                                break;
                            case PriceRank.MIDDLE:
                                colorClass.push("marker-tt-yellow");
                                break;
                            case PriceRank.HIGH:
                                colorClass.push("marker-tt-red");
                                break;
                            default:
                                break;
                        }
                    }
                    //  else if (showAll) 
                    //     priceRank = getBarColor(barEntity.bar)
                    
                    
                    // Add glow effect for happy hour
                    if (activeHappyHour) {
                        colorClass.push("marker-tt-glow");
                    }
                    
                    // Join classes with space, or use empty string if no classes
                    return (
                        <ThemeProvider theme={theme} key={barEntity.bar.id}>
                            <Marker 
                            position={[barEntity.bar.coordLat, barEntity.bar.coordLong]} 
                            icon={invisibleIcon}
                            eventHandlers={{
                                click: () => navigate(`/bars/${barEntity.bar.id}`)
                            }}>
                                <Tooltip
                                    className={`${colorClass.join(" ")} marker-tooltip`}
                                    direction="top"
                                    offset={[0, 10]}
                                    permanent
                                    >
                                        <div className="tooltip-container">
                                        <div className="emoji-background">
                                            {activeHappyHour ? "🎉" : ""}
                                        </div>
                                        <div className="price-text">
                                            {hasDrink ? `${cheapestPrice}€` : `${barEntity.bar.name.substring(0,1)}`}
                                        </div>
                                    </div>
                                </Tooltip>
                                
                            </Marker>
                        </ThemeProvider>
                    );
                })
            }    
        </>
    );
};