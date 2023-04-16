
export const handleMapClick = (event, setSelectedPlace, mapRef) => {
  // Get place details from latitude and longitude
  const lat = event.latLng.lat();
  const lng = event.latLng.lng();
  const geocoder = new window.google.maps.Geocoder();

  // Get place information
  geocoder.geocode({ location: { lat, lng } }, (results, status) => {
    if (status === 'OK' && results[0]) {
      const placeId = results[0].place_id;
      const service = new google.maps.places.PlacesService(mapRef.current);
      const request = {
        placeId: placeId,
        fields: [
          'formatted_address',
          'geometry',
          'icon',
          'id',
          'name',
          'place_id',
          'url',
        ]
      };

      // Updated selected place state
      service.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          if (place.geometry) {
            setSelectedPlace(place);
          }
        }
      });
    } else {
      console.error('Geocoder failed due to: ' + status);
    }
  });
}