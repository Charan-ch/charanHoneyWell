import React, { useState, useEffect } from 'react';
import { withGoogleMap, GoogleMap, DirectionsRenderer } from 'react-google-maps';
import locationsData from './locations.json';

const MapComponent = withGoogleMap(({ directions }) => (
    <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: 17.375278, lng: 78.474444 }}
    >
        {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
));




const Map = () => {
    const [directions, setDirections] = useState(null);
    const [locations] = useState(locationsData);

    const [source, setSource] = useState(null)
    const [destinationLocation, setDestination] = useState(null)


    console.log(locations)

    const showDirections = () => {
        console.log(source, destinationLocation)
        const directionsService = new window.google.maps.DirectionsService();
        const origin = { lat: parseInt(source.lat), lng: parseInt(source.lon) };
        const destination = { lat: parseInt(destinationLocation.lat), lng: parseInt(destinationLocation.lon) };

        directionsService.route(
            {
                origin,
                destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                } else {
                    console.error(`Error fetching directions: ${status}`);
                }
            }
        );

        const data = {
            sourcename: source.name,
            sourcelat: source.lat,
            sourcelong: source.lon,
            destname: destinationLocation.name,
            destlat: destinationLocation.lat,
            destlong: destinationLocation.lon,
        };

        try {
            const response = fetch('http://localhost:400/insertLocations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // You might need additional headers based on your server requirements
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                console.log('Data sent successfully');
            } else {
                console.error('Failed to send data:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSoucreSearch = (sourceLocation) => {
        const foundLocation = locations.find(
            (location) =>
                location.name.toLowerCase() === sourceLocation.toLowerCase()
        );
        setSource(foundLocation)
        console.log(foundLocation)
    };

    const handleDestSearch = (destLocation) => {
        const foundLocation = locations.find(
            (location) =>
                location.name.toLowerCase() === destLocation.toLowerCase()
        );
        setDestination(foundLocation)
        console.log(foundLocation)

    };

    return (
        <div>
            <input placeholder='Source' onChange={(e) => { handleSoucreSearch(e.target.value) }} />
            <input placeholder='Destination' onChange={(e) => handleDestSearch(e.target.value)} />
            <button onClick={() => showDirections()}>Show Directions</button>
            <MapComponent
                containerElement={<div style={{ height: '400px' }} />}
                mapElement={<div style={{ height: '100%' }} />}
                directions={directions}

            />
        </div>
    );
};

export default Map;