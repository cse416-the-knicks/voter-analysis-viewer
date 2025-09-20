import React from 'react';
import L from 'leaflet';
import type { MapRef } from 'react-leaflet/MapContainer';
import { MapContainer, TileLayer } from 'react-leaflet';


// NOTE(jerry):
// These boundaries were given by ChatGPT
// although they can be googled from some Medium posts
// as well.
const UNITED_STATES_BOUNDARIES : L.LatLngTuple[] = [
  [24.396308, -125.0], // Southwest Corner
  [49.384358, -66.93457] // Northeast Corner
];

// Any more than this, and we'll see Alaska.
const MIN_ACCEPTABLE_ZOOM = 4;

interface FullBoundedUSMapProperties {
  id: string;
  mapRef: React.RefObject<MapRef>;
  zoom?: number;
  children?: React.ReactNode;
};

/**
    Full Map of the United States as a component,
    the geometry data for the United States with state
    boundaries is going to be hard-coded as it's not that
    much data, relatively speaking.

    Has hooks so we can identify when we click on a state,
    and perform actions based on the state.
**/
function FullBoundedUSMap(
  {
    id,
    mapRef,
    zoom,
    children,
  } : FullBoundedUSMapProperties) {
  return (
    <MapContainer
      zoom={Math.max(zoom ?? 0, MIN_ACCEPTABLE_ZOOM)}
      minZoom={MIN_ACCEPTABLE_ZOOM}
      bounds={UNITED_STATES_BOUNDARIES}
      maxBounds={UNITED_STATES_BOUNDARIES}
      maxBoundsViscosity={1.0}
      ref={mapRef}
      className={"full-bounded-us-map"}
      id={id}>
      <TileLayer
	attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  )
}

export default FullBoundedUSMap;
