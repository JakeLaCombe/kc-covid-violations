import React, { useState } from 'react';
import { useQuery } from 'react-query';
import GoogleMapReact from 'google-map-react';
import './App.css';
import { FeatureCollection, Point } from "geojson";
import { Marker } from "./Marker";
import Loader from 'react-loader-spinner';

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

const formatDate = (date: Date) => (date.toISOString().substring(0,10));

const firstDate = new Date();

const App = () => {
    const [displayFilters, setDisplayFilters] = useState(true);
    const [currentMarker, setCurrentMarker] = useState<string>("");
    const [formData, setFormData] = useState<QueryParams>({status: 'OPEN', date: new Date(
      firstDate.getFullYear(),
      firstDate.getMonth() - 1,
      firstDate.getDate(),
    )});
  
    const { isFetching, data, refetch } = useQuery<FeatureCollection, 'violations'>('violations', async function() {
      const response = await fetch(`https://data.kcmo.org/resource/ti6s-47nz.geojson?$where=${buildQuery(formData)}`);
      const data = await response.json();
      return data;
    });

    return (
      <div style={{ height: '100vh', width: '100%' }}>
        <div className="Navigation">
          <h1 className="Navigation-Header">KCMO Covid Violations</h1>
          <hr className="Navigation-Divider"/>
          <p onClick={() => setDisplayFilters(!displayFilters)} className="Trigger-Filters">{`${displayFilters ? 'Hide Filters' : 'Display Filters'}`}</p>
          {isFetching && <div className="Loading-Container">
            <Loader type="Puff" color="#666" height={25} width={25} />
          </div>}
          {!isFetching && (
            <form className="Query-Form" onSubmit={(e) => {
              e.preventDefault(); 
              refetch();
            }}>
            <div className={`Input-Elements ${displayFilters ? '' : 'Hide'}`}>
              <div className="Input-Group">
                <label htmlFor="status">Case Status:</label>
                <select id="status" value={formData.status} onChange={(e) => {
                  const formDataDup:QueryParams = Object.assign({}, formData);
                  formDataDup.status = e.currentTarget.value as StatusChoices;
                  setFormData(formDataDup);
                }}>
                  <option value='ALL'>All</option>
                  <option value='OPEN'>Open</option>
                  <option value='RESOL'>Resolved</option>
                </select>
              </div>
              <div className="Input-Group">
                <label htmlFor="date">Start Date:</label>
                <input name="date" type="date" value={formatDate(formData.date)} onChange={(e) => {
                  const formDataDup:QueryParams = Object.assign({}, formData);
                  formDataDup.date = new Date(e.currentTarget.value);;
                  setFormData(formDataDup);
                }} />
              </div>
              <div className="Input-Group">
                <input type="submit" value="Search" />
              </div>
            </div>
            <div className="Legend">
            <span>Open</span>
            <span className="Marker-Legend" />
            <span className="form-spacer-1" />
            <span>Resolved</span>
            <span className="Marker-Legend Resolved" />
            </div>
          </form>)}
        </div>
        
        <GoogleMapReact
          options={{
            clickableIcons: false,
            draggableCursor: 'default',
          }}
          bootstrapURLKeys={{ key: 'AIzaSyBSRItjUte9j61pdvxwwVHKeY72fbACnZY' }}
          defaultCenter={center}
          defaultZoom={14}
        >
          {!isFetching && data?.features.map(feature => <Marker
              address={feature?.properties?.street_address}
              caseId={feature?.properties?.case_id}
              caseStatus={feature?.properties?.status}
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
