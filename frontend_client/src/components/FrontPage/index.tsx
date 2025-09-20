import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import type { MapRef } from 'react-leaflet/MapContainer';
import { useNavigate } from 'react-router';
import FullBoundedUSMap from '../FullBoundedUSMap/';
import type { FipsCode } from '../FullBoundedUSMap/';

/**
 * This is the map used for the landing / splash page of the viewer.
 * 
 * Submaps will be defined as separate components.
 */
function FrontPage() {
  const mapState = useRef<MapRef>(null);
  const navigate = useNavigate();

  const onStateClick = (fipsCode: FipsCode) => {
    window.alert(fipsCode);
    navigate(`state/${fipsCode}`);
  }

  return (
    <React.Fragment>
      <FullBoundedUSMap
	mapRef={mapState}
	id="main-map"
	onStateClick={onStateClick}>
      </FullBoundedUSMap>
    </React.Fragment>
  );
}

export default FrontPage;
