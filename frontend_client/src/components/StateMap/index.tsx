/**
  This will require a client connection to the backend.
**/
import {useEffect, useState} from 'react';
import L from 'leaflet';
import type { MapRef } from 'react-leaflet/MapContainer';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';;

import { getGeometry } from '../../api/client';

interface StateMapParameters {
  fipsCode?: string,
  mapRef?: React.RefObject<MapRef>;
}

function StateMap(
  {
    fipsCode,
    mapRef,
  } : StateMapParameters) {
  const [stateGeoJson, setStateGeoJson] = useState<GeoJSON.GeoJSON | null>(null);
  const [readyToDisplay, setReadyToDisplay] = useState(false);

  useEffect(
    function() {
      (async function() {
	if (!fipsCode) {
	  return;
	}

	const response = await getGeometry(fipsCode);
	if (response) {
	  console.log(response);
	  setStateGeoJson(response.data as GeoJSON.GeoJSON);
	  setReadyToDisplay(true);
	}
      })();
    }, []);

  if (!fipsCode) {
    return (
      <p>No FIPS code for state. No map!</p>
    );
  }

  const mapBounds: L.LatLngBoundsExpression = 
    (readyToDisplay) ? [
      [stateGeoJson!.bbox![1], stateGeoJson!.bbox![0]],
      [stateGeoJson!.bbox![3], stateGeoJson!.bbox![2]],
    ] : [[0,0],[0,0]];

  if (readyToDisplay) {
    return (
      <MapContainer
	ref={mapRef}
	bounds={mapBounds}
	maxBounds={mapBounds}
	style={
	  {
	    width: "500px",
	    height: "400px",
	  }
	}
      >
	<TileLayer
	  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
	/>
	<GeoJSON
	  data={stateGeoJson!}
	/>
      </MapContainer>
    )
  } else {
    return (
      <>
	<p>Loading map...</p>
      </>
    );
  }
}

export type {
  StateMapParameters
};

export default StateMap;
