import { AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import React, { useState } from 'react'
import theme from '../Theme';

interface Coordinates {
    lat: number;
    lng: number;
}

interface Bar {
    id: number;
    name: string;
    coordinates: Coordinates;
    address: string;
    beer05Price: number;
    wine075Price: number;
    coffeePrice: number;
    entryFee: number;
    cloakroomFee: number;
}

interface LocationMarkerProps {
    bars: Bar[] | null;
}

export const LocationMarkerComponent: React.FC<LocationMarkerProps> = ({ bars }) => {

    const [openInfoWindowId, setOpenInfoWindowId] = useState<number | null>(null)

    return (
        <div>
            {bars && bars.map((bar) => {
                return(
                    <React.Fragment key={bar.id}>
                    <AdvancedMarker 
                        key={bar.id} 
                        position={bar.coordinates}
                        onClick={() => setOpenInfoWindowId(bar.id)} 
                        title={'Tittelituure'}
                        >
                        <Pin background={""}/>
                    </AdvancedMarker>
                    {openInfoWindowId === bar.id && (
                        <InfoWindow
                            position={bar.coordinates}
                            maxWidth={200}
                            onCloseClick={() => setOpenInfoWindowId(null)} 
                            >
                                <div
                                    style={{
                                        backgroundColor: 'grey',
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
                        </InfoWindow>
                    )}
                    </React.Fragment>
                )
            })}
        </div>
    )
}
