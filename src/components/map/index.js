import { GoogleMap, Marker, useLoadScript, Autocomplete } from '@react-google-maps/api'
import { useEffect, useRef, useState } from 'react'
import { handleMapClick } from '@/utils/mapUtils'
import { FcGoogle } from 'react-icons/fc'
import { TbLocationFilled } from 'react-icons/tb'

const libraries = ['places'];

const Map = ({ setCoordinates, setLocationUrl, setLocationId, setLocationName, initialCenter, setName }) => {
  const mapRef = useRef(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

  // mapCoordinates holds position of map marker
  const [mapCoordinates, setMapCoordinates] = useState(initialCenter);
  const [showMarker, setShowMarker] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [zoom, setZoom] = useState(15);

  // Update selected place object
  const handlePlaceSelect = (place) => {
    if (place.geometry) {
      setSelectedPlace(place);
    }
  };

  // Returns center of map to original position and remove marker
  const handleMapReturn = () => {
    setMapCoordinates(initialCenter);
    setZoom(15);
    setShowMarker(false);
  };

  // Update state variables when the selected place changes
  useEffect(() => {
    // Get university/location names, coordinates, location ID, and Google Maps URL
    if (selectedPlace) {
      const lat = selectedPlace.geometry.location.lat();
      const lng = selectedPlace.geometry.location.lng();
      setShowMarker(true);
      // Update location and university names to the selected place's name
      setName(selectedPlace.name);
      setLocationName(selectedPlace.name);
      // Update map marker coordinates AND selected coordinates
      setCoordinates({ lat: lat, lng: lng });
      setMapCoordinates({ lat: lat, lng: lng });
      setLocationId(selectedPlace.place_id);
      setLocationUrl(selectedPlace.url);
    }
  }, [selectedPlace]);

  if (loadError) return <p>Error loading maps</p>
  if (!isLoaded) return <p>Loading maps</p>

  return (
    <div className="map-container">
      <FcGoogle className="google-logo" />
      <Autocomplete
        className="google-search"
        onLoad={(autocomplete) => {
          autocomplete.setFields([
            'formatted_address',
            'geometry',
            'icon',
            'name',
            'place_id',
            'url',
          ])
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            handlePlaceSelect(place);
          });
        }}
      >
        <input type='text' placeholder='Search for a place' />
      </Autocomplete>
      {/* <hr /> */}
      <GoogleMap
        onLoad={(map) => mapRef.current = map}
        center={mapCoordinates}
        zoom={zoom}
        onClick={(e) => handleMapClick(e, setSelectedPlace, mapRef)}
        mapContainerClassName='google-map'
        options={{
          mapTypeControl: false, // disable the default map type control
          streetViewControl: false, // disable the default street view control
        }}
      >
        <div className="map-return" onClick={handleMapReturn}><TbLocationFilled className="map-return-logo" /></div>
        {showMarker && <Marker position={mapCoordinates} title="Click to select place" />}
      </GoogleMap>
    </div>
  )
}

export default Map;

// import { GoogleMap, Marker, useLoadScript, Autocomplete } from '@react-google-maps/api'
// import { useEffect, useRef, useState } from 'react'

// const zoom = 13
// const libraries = ['places'];

// const Select = () => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
//     libraries: libraries
//   });

//   const center = { lat: 28.6024, lng: -81.2001 };

//   const [coordinates, setCoordinates] = useState(null);
//   const [nearestPlace, setNearestPlace] = useState(null);
//   const mapRef = useRef(null);

//   console.log(coordinates, nearestPlace);

//   // Find the nearest place to the dropped marker
//   const handleMapClick = (event) => {
//     const lat = event.latLng.lat();
//     const lng = event.latLng.lng();

//     // Search for nearby places
//     const service = new window.google.maps.places.PlacesService(mapRef.current);
//     const request = {
//       location: { lat, lng },
//       radius: 100,
//       type: 'establishment',
//     };

//     service.nearbySearch(request, (results, status) => {
//       if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
//         const nearestResult = results[0];
//         setNearestPlace({
//           name: nearestResult.name,
//           address: nearestResult.vicinity,
//           location: nearestResult.geometry.location,
//         });
//       }
//     });

//     setCoordinates({ lat: lat, lng: lng });
//   };

//   const handlePlaceSelect = (place) => {
//     // TODO: Handle when a place is selected from the search box
//   };

//   if (loadError) return <p>Error loading maps</p>
//   if (!isLoaded) return <p>Loading maps</p>

//   return (
//     <>
//       <Autocomplete
//         onLoad={(autocomplete) => {
//           autocomplete.addListener('place_changed', () => {
//             const place = autocomplete.getPlace();
//             handlePlaceSelect(place);
//           });
//         }}
//       >
//         <input type='text' placeholder='Search for a place' />
//       </Autocomplete>
//       <GoogleMap
//         onLoad={(map) => mapRef.current = map}
//         center={center}
//         zoom={zoom}
//         onClick={handleMapClick}
//         mapContainerClassName='map-container'
//       >
//         {coordinates && <Marker position={coordinates} title="Dropped marker" />}
//         {nearestPlace && <Marker position={nearestPlace.location} title={nearestPlace.name} />}
//       </GoogleMap>
//     </>
//   )
// }

// export default Select;
