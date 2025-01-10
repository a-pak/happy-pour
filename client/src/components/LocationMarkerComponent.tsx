import React, { useState } from 'react'
import theme from '../Theme';
import Bar from '../model/IbarInterface';
import { Marker, Popup } from 'react-leaflet';
import { ThemeProvider } from '@emotion/react';


interface LocationMarkerProps {
    bars: Bar[] | null;
}

export const LocationMarkerComponent: React.FC<LocationMarkerProps> = ({ bars }) => {
    return (
        <>
            {bars && bars.map((bar) => {
                return(
                    <>
                    <ThemeProvider theme={theme}>
                    <Marker position={[bar.coordLat, bar.coordLong]}>
                    <Popup>
                        <div
                            style={{
                                color: 'white',
                                backgroundColor:'primary',
                                padding: '10px',
                                borderRadius: '8px',
                            }}
                        >
                            <strong>{bar.name}</strong>
                            <p>{bar.address}</p>
                            <p>
                                Beer: {bar.beer05Price} € | Wine: {bar.wine075Price} € | Coffee: {bar.coffeePrice} €
                            </p>
                            <p>Entry Fee: {bar.entryFee} € | Cloakroom Fee: {bar.cloakroomFee} €</p>
                        </div>
                    </Popup>
                  </Marker>
                  </ThemeProvider>
                  </>
                )
            })}
        </>
    )
}
