import React from 'react';
import L from 'leaflet';
import type { MapRef } from 'react-leaflet/MapContainer';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import { FIPS_TO_STATES_MAP, STATES_BOUNDARIES_GEOMETRY } from './boundaryData';

// NOTE(jerry):
// These boundaries were given by ChatGPT
// although they can be googled from some Medium posts
// as well.
const UNITED_STATES_BOUNDARIES : L.LatLngTuple[] = [
  [24.396308, -125.0], // Southwest Corner
  [49.384358, -66.93457] // Northeast Corner
];

const MIN_ACCEPTABLE_ZOOM = 4;

type FipsCode = string; // It's really not just a string, but this is easier to keep.
type OnStateClickFn = (fipsCode: FipsCode) => void;

interface FullBoundedUSMapProperties {
  id: string;
  mapRef: React.RefObject<MapRef>;
  onStateClick?: OnStateClickFn;
  zoom?: number;
  children?: React.ReactNode;
};

/**
    Full Map of the United States as a component,
    the geometry data for the United States with state
    boundaries is going to be hard-coded as it's not that
    much data, relatively speaking.

    Will show state names and such, and allow registering
    callbacks on click.
**/
function FullBoundedUSMap(
  {
    id,
    mapRef,
    zoom,
    children,
    onStateClick,
  } : FullBoundedUSMapProperties) {
  const onFeatureClickHandler =
    (event: L.LeafletMouseEvent) => {
      const target = event.target as L.FeatureGroup;
      const featureData = target.feature as GeoJSON.Feature;
      if (onStateClick) {
	onStateClick(featureData.id! as FipsCode);
      }
    };
  const onEachFeatureHandler = 
    (feature: GeoJSON.Feature, layer: L.Layer) => {
      const { id } = feature; // Should not be null.
      const stateName = FIPS_TO_STATES_MAP[id!];
      const defaultHandlers = {
	click: onFeatureClickHandler
      };
      layer.bindTooltip(stateName);
      layer.on(defaultHandlers);
    };

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
      <GeoJSON
	data={STATES_BOUNDARIES_GEOMETRY as GeoJSON.GeoJSON}
	onEachFeature={onEachFeatureHandler}
      />
      {children}
    </MapContainer>
  )
}

export type {
    FipsCode,
    OnStateClickFn
};

export default FullBoundedUSMap;
