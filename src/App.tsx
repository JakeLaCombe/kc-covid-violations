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

type StatusChoices = 'ALL' | 'OPEN' | 'RESOL'
interface QueryParams {
  status: StatusChoices
  date: Date
}

const buildQuery = ({status, date}: QueryParams) => {
  let query = `creation_date > '${date.toISOString().substring(0,19)}'`

  if (status !== 'ALL') {
    query += ` AND status='${status}'`
  }

  return query;
};

const firstDate = new Date();

const App = () => {
    const [currentMarker, setCurrentMarker] = useState<string>("");
    const [formData, setFormData] = useState<QueryParams>({status: 'OPEN', date: new Date(
      firstDate.getFullYear(),
      firstDate.getMonth() - 1,
      firstDate.getDay(),
    )});
  
    const { data, refetch } = useQuery<FeatureCollection, 'violations'>('violations', async function() {
      const response = await fetch(`https://data.kcmo.org/resource/ti6s-47nz.geojson?$where=${buildQuery(formData)}`);
      console.log(`https://data.kcmo.org/resource/ti6s-47nz.geojson?$where=${buildQuery(formData)}`);
      const data = await response.json();
      return data;
    });

    return (
      <div style={{ height: '100vh', width: '100%' }}>
        <div className="Navigation">
          <h1 className="Navigation-Header">KC Covid Violations</h1>
          <hr className="Navigation-Divider"/>
          <form className="Query-Form" onSubmit={(e) => {
              e.preventDefault(); 
              refetch();
            }}>
            <label htmlFor="status">Case Status:</label>
            <span className="form-spacer-1" />
            <select id="status" value={formData.status} onChange={(e) => {
              const formDataDup:QueryParams = Object.assign({}, formData);
              formDataDup.status = e.currentTarget.value as StatusChoices;
              setFormData(formDataDup);
            }}>
              <option value='ALL'>All</option>
              <option value='OPEN'>Open</option>
              <option value='RESOL'>Resolved</option>
            </select>
            <span className="form-spacer-2" />
            <input type="submit" />
          </form>
        </div>
        
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