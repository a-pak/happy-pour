import React from 'react';
import theme from '../Theme';
import { BarDataResponse } from '../model/IbarInterface';
import { Marker, Popup } from 'react-leaflet';
import { ThemeProvider } from '@emotion/react';
import { Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDrinkStore } from "../drinkStore";

interface LocationMarkerProps {
    bars: BarDataResponse | null;
}

export const LocationMarkerComponent: React.FC<LocationMarkerProps> = ({ bars }) => {
    const defaultDrink = useDrinkStore((state) => state.defaultDrink);
    
    // Apufunktio tarkistamaan, onko Happy Hour käynnissä
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

    return (
        <>
            {bars &&
                bars.map((barEntity) => {
                    let hasDrink = false;
                    let drinkPrice = null;
                    let isHappyHour = false;

                    console.log(`Checking bar: ${barEntity.bar.name}`);

                    try {
                        // Tarkistetaan onko juoma saatavilla
                        barEntity.drinks.forEach((drink) => {
                            if (drink.name === defaultDrink) {
                                console.log('Found drink:', drink.name);
                                hasDrink = true;
                                drinkPrice = drink.normalPrice;
                            }
                        });

                        // Jos Happy Hour on voimassa, tarkistetaan Happy Hour -juoma
                        if (barEntity.happyHour?.startTime && barEntity.happyHour?.endTime) {
                            isHappyHour = isHappyHourActive(barEntity.happyHour.startTime, barEntity.happyHour.endTime);

                            if (isHappyHour) {
                                barEntity.happyHourDrinks.forEach((hhDrink) => {
                                    if (hhDrink.drinkName === defaultDrink) {
                                        console.log('Happy Hour drink found!', hhDrink.drinkName);
                                        drinkPrice = hhDrink.happyHourPrice;
                                    }
                                });
                            }
                        }
                    } catch (error) {
                        console.log('Error checking drinks:', error);
                    }

                    if (!hasDrink) {
                        console.log(`Drink not found in ${barEntity.bar.name}, skipping...`);
                        return null;
                    }

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
                                                🍺 {defaultDrink}: {drinkPrice ? `${drinkPrice} €` : "Not available"}
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
