const getUserLocation = (): Promise<[number, number]> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve([latitude, longitude]);
          },
          (error) => {
            reject(`${error}: Problem getting the location. Allow the browser to use your location.?`);
          }
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  };
  
  export default {
    getUserLocation,
  }