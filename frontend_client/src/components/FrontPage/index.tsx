import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import type { MapRef } from 'react-leaflet/MapContainer';
import { useNavigate } from 'react-router';
import FullBoundedUSMap from '../FullBoundedUSMap/';
import type { FipsCode } from '../FullBoundedUSMap/';

import styles from './FrontPage.module.css';

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
	id={styles.mainMap}
	onStateClick={onStateClick}>
      </FullBoundedUSMap>
    </React.Fragment>
  );
}

export default FrontPage;
