import React, { useState } from 'react';
import { useQuery } from 'react-query';
import GoogleMapReact from 'google-map-react';
import './App.css';
import { FeatureCollection, Point } from "geojson";
import { Marker } from "./Marker";

const center = {
 lat: 39.093349,
  lng: -94.580345,
};

const App = () => {
    const [currentMarker, setCurrentMarker] = useState<string>("");
    const { data } = useQuery<FeatureCollection, 'violations'>('violations', async function() {
      const response = await fetch('https://data.kcmo.org/resource/ti6s-47nz.geojson');
      const data = await response.json();
      return data;
    });

    return (
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyBSRItjUte9j61pdvxwwVHKeY72fbACnZY' }}
          defaultCenter={center}
          defaultZoom={14}
        >
          {data?.features.map(feature => <Marker
              address={feature?.properties?.street_address}
              caseId={feature?.properties?.case_id}
              onClick={() => {
                setCurrentMarker(feature?.properties?.case_id || "");
              }}
              onClose={() => {
                setCurrentMarker("");
              }}
              isActive={currentMarker === feature?.properties?.case_id}
              lat={(feature.geometry as Point).coordinates[1]}
              lng={(feature.geometry as Point).coordinates[0]}
              />)}   
        </GoogleMapReact>
      </div>
    );
}

export default App;
