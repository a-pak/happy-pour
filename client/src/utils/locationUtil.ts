export type Location = {latitude :number, longitude: number};
export function calculateDistance(locOne: Location, locTwo: Location): number {
    const deltaLon = locTwo.longitude - locOne.longitude;
    const deltaLat = locTwo.latitude - locOne.latitude;
    
    const x = deltaLon * 111320 * Math.cos((locOne.latitude + locTwo.latitude) / 2);
    const y = deltaLat * 111320;
    
    const distanceInMeters = Math.sqrt(x * x + y * y);
    
    return distanceInMeters / 1000; // Convert to kilometers
}
