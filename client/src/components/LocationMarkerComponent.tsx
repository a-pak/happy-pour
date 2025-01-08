import { AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import React, { useState } from 'react'
import theme from '../Theme';
import Bar from '../model/IbarInterface';


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
                        position={{lat: bar.coordLat, lng: bar.coordLong}}
                        onClick={() => setOpenInfoWindowId(bar.id)} 
                        title={'Tittelituure'}
                        >
                        <Pin background={""}/>
                    </AdvancedMarker>
                    {openInfoWindowId === bar.id && (
                        <InfoWindow
                            position={{lat: bar.coordLat, lng: bar.coordLong}}
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
