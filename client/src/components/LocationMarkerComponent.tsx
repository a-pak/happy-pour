import React from 'react';
import theme from '../Theme';
import Bar from '../model/IbarInterface';
import { Marker, Popup } from 'react-leaflet';
import { ThemeProvider } from '@emotion/react';
import { Typography, Box } from '@mui/material';

interface LocationMarkerProps {
    bars: Bar[] | null;
}

export const LocationMarkerComponent: React.FC<LocationMarkerProps> = ({ bars }) => {
    return (
        <>
            {bars &&
                bars.map((bar) => (
                    <ThemeProvider theme={theme} key={bar.id}>
                        <Marker position={[bar.coordLat, bar.coordLong]}>
                            <Popup 
                                className="custom-popup"
                            >
                                <Box
                                    sx={{
                                        backgroundColor: theme.palette.secondary.light,
                                        color: theme.palette.common.white,
                                        padding: '10px',
                                        borderRadius: '8px',
                                        fontFamily: 'Arial, sans-serif',
                                        textAlign: 'center',
                                        minWidth: '200px',
                                    }}
                                >
                                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                        {bar.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                                        {bar.address}
                                    </Typography>
                                    <Box sx={{ textAlign: 'left', marginBottom: '10px' }}>
                                        <Typography variant="body2">
                                            <strong>Prices:</strong>
                                        </Typography>
                                        <Typography variant="body2">🍺 Beer (0.5L): {bar.beer05Price} €</Typography>
                                        <Typography variant="body2">🍷 Wine (0.75L): {bar.wine075Price} €</Typography>
                                        <Typography variant="body2">☕ Coffee: {bar.coffeePrice} €</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'left' }}>
                                        <Typography variant="body2">
                                            <strong>Fees:</strong>
                                        </Typography>
                                        <Typography variant="body2">🎟 Entry: {bar.entryFee} €</Typography>
                                        <Typography variant="body2">🧥 Cloakroom: {bar.cloakroomFee} €</Typography>
                                    </Box>
                                </Box>
                            </Popup>
                        </Marker>
                    </ThemeProvider>
                ))}
        </>
    );
};
