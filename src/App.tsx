import React from 'react';
import GoogleMapReact from 'google-map-react';
import './App.css';

const center = {
 lat: 39.093349,
  lng: -94.580345,
};

interface Props {
  text: JSX.Element | string
  lat: number
  lng: number
}

const AnyReactComponent = ({ text, lat, lng }: Props) => <div>{text}</div>;

const App = () => {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyBSRItjUte9j61pdvxwwVHKeY72fbACnZY' }}
          defaultCenter={center}
          defaultZoom={14}
        >
          <AnyReactComponent
            lat={39.0915837}
            lng={-94.8559049}
            text="My Marker"
          />
        </GoogleMapReact>
      </div>
    );
}

export default App;
