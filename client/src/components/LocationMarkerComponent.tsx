import React, { useState, useEffect } from 'react';
import theme from '../Theme';
import { BarDataResponse } from '../model/IbarInterface';
import { Marker, Popup } from 'react-leaflet';
import { ThemeProvider } from '@emotion/react';
import { Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDrinkStore } from "../drinkStore";
import barsService from '../services/bars.ts';

export const LocationMarkerComponent: React.FC = () => {
    const [bars, setBars] = useState<BarDataResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const defaultDrink = useDrinkStore((state) => state.defaultDrink);
    
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

                    if (!hasDrink) return null;

                    return (
                        <ThemeProvider theme={theme} key={barEntity.bar.id}>
                            <Marker position={[barEntity.bar.coordLat, barEntity.bar.coordLong]}>
                                <Popup className="custom-popup">
                                    <Box
                                        sx={{
                                            backgroundColor: theme.palette.secondary.light,
                                            color: theme.palette.common.white,
                                            padding: '10px',
                                            marginTop: '20px',
                                            borderRadius: '8px',
                                            fontFamily: 'Arial, sans-serif',
                                            textAlign: 'center',
                                            minWidth: '200px',
                                        }}
                                    >
                                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                            {barEntity.bar.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                                            {barEntity.bar.address}
                                        </Typography>
                                        <Box sx={{ textAlign: 'left', marginBottom: '10px' }}>
                                            <Typography variant="body2">
                                                <strong>Prices:</strong>
                                            </Typography>
                                            <Typography variant="body2">
                                                {defaultDrink}: {drinkPrice ? `${drinkPrice} €` : "Not available"}
                                            </Typography>
                                            {isHappyHour && (
                                                <Typography variant="body2" color="success.main">
                                                    🎉 Happy Hour Price!
                                                </Typography>
                                            )}
                                        </Box>
                                        <Link to={`/bar/${barEntity.bar.id}`}>
                                            <Button>More Details</Button>
                                        </Link>
                                    </Box>
                                </Popup>
                            </Marker>
                        </ThemeProvider>
                    );
                })}
        </>
    );
};
