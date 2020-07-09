import React, { useState } from 'react';

interface Props {
  address: string
  caseId?: string
  caseStatus?: string
  isActive?: boolean,
  lat: number
  lng: number
  onClick: () => unknown
  onClose: () => unknown
}

const widthRegex = new RegExp(/width:\s\d*px;/g);

export const Marker = ({ address, caseId, caseStatus, isActive = false, lat, lng, onClick = () => {}, onClose = () => {} }: Props) => {
  const [data, setData] = useState("");

  const fetchData = async () => {
    const response = await fetch(`https://kc-covid-violations-api.herokuapp.com/api/${caseId}`);
    const json = await response.json();
    return json.data as string;
  }

  return (
    <div 
      onClick={async () => { 
        onClick();
        if(!data) {
          setData(await fetchData());
        } 
      }} className={`Marker ${isActive ? 'Active' : ''} ${caseStatus === 'RESOL' ? 'Resolved' : '' }`} {...{lat,lng}}>
        {isActive && <div className="Marker-Text" >
          <h1 className="Marker-Address">Address <span className="Marker-Close" onClick={(event) => {event.stopPropagation(); onClose()}}>X</span></h1>
          <p>{address}</p>
          {!data && <p>Fetching Data...</p>}
          <div dangerouslySetInnerHTML={{__html: data.replace(widthRegex, '') }} />
        </div>}
    </div>
  );
}
