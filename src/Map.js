import React, {Component, StrictMode} from "react";
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import GoogleMapReact from 'google-map-react';
import { DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

class Map extends Component {
    state = {
        directions: null
    }

    directionsCallback = (response) => {
        if (response !== null) {
            this.setState(() => ({
                directions: response
            }));
        }
    }

    render() {
        const { directions } = this.state;
        const { origin, destination } = this.props;

        return (
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyBqfs6zdlsTE9iDA28nD3pVaLstyOuDz3c' }}
                    defaultCenter={{ lat: origin.lat, lng: origin.lng }}
                    defaultZoom={10}>
                    {directions && <DirectionsRenderer directions={directions} />}
                    <DirectionsService
                        options={{
                            destination: destination,
                            origin: origin,
                            travelMode: 'DRIVING'
                        }}
                        callback={this.directionsCallback}
                    />
                </GoogleMapReact>
            </div>
        );
    }
}
export default Map;