import { AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import React from 'react'

interface Coordinates {
    lat: number;
    lng: number;
}

    interface Bar {
    id: number;
    name: string;
    coordinates: Coordinates;
    address: string;
    beerPrice: number;
    winePrice: number;
    coffeePrice: number;
    entryFee: number;
    cloakroomFee: number;
}

interface LocationMarkerProps {
    bars: Bar[];
}

export const LocationMarkerComponent: React.FC<LocationMarkerProps> = ({ bars }) => {

  return (
    <div>
        {bars.map((bar) => {
            return(
            <AdvancedMarker key={bar.id} position={bar.coordinates}>
                <Pin background={"green"}/>
            </AdvancedMarker>
            )
        })}
    </div>
  )
}
