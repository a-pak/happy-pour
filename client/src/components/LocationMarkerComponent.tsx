import React, { useState, useEffect } from 'react';
import theme from '../Theme';
import { BarDataResponse } from '../model/IbarInterface.ts';
import { Marker, Popup } from 'react-leaflet';
import { ThemeProvider } from '@emotion/react';
import { Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDrinkStore } from "../store/drinkStore";
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
                                    backgroundColor: '#1e1e1e', // Syvä tumma tausta
                                    color: '#b57edc', // Purppura teksti
                                    padding: '14px',
                                    borderRadius: '12px',
                                    fontFamily: 'Arial, sans-serif',
                                    minWidth: '240px',
                                    textAlign: 'center',
                                    }}
                                >
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#d1b3ff' }}>
                                    {barEntity.bar.name}
                                    </Typography>

                                    <Typography variant="body2" sx={{ mb: 2, color: '#a38acc' }}>
                                    {barEntity.bar.address}
                                    </Typography>

                                    <Box
                                    sx={{
                                        backgroundColor: '#1f1f1f',
                                        border: '1px solid #b57edc',
                                        borderRadius: '8px',
                                        padding: '8px',
                                        mb: 2,
                                    }}
                                    >
                                    <Typography variant="subtitle2" sx={{ color: '#b57edc', fontWeight: 500 }}>
                                        {defaultDrink}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                        color: '#ffffff',
                                        fontWeight: 'bold',
                                        fontSize: '1.3rem',
                                        }}
                                    >
                                        {drinkPrice ? `${drinkPrice} €` : "Not available"}
                                    </Typography>
                                    {isHappyHour && (
                                        <Typography
                                        variant="body2"
                                        sx={{
                                            mt: 1,
                                            color: '#00e676',
                                            fontWeight: 'bold',
                                        }}
                                        >
                                        🎉 Happy Hour!
                                        </Typography>
                                    )}
                                    </Box>

                                    <Link to={`/bar/${barEntity.bar.id}`} style={{ textDecoration: 'none' }}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                        borderColor: '#b57edc',
                                        color: '#b57edc',
                                        fontWeight: 500,
                                        '&:hover': {
                                            backgroundColor: '#b57edc22',
                                            borderColor: '#b57edc',
                                        },
                                        }}
                                    >
                                        More Details
                                    </Button>
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
