import type { CssUnitValue } from '../../helpers/CssUnits';
import {useEffect, useState} from 'react';
import React from 'react';
import L from 'leaflet';
import type { MapRef } from 'react-leaflet/MapContainer';
import { GeoJSON, MapContainer, TileLayer, useMap } from 'react-leaflet';
import { getStateGeometry } from '../../api/client';

interface MapFitsToBoundsInternalParameters {
  boundsToFit: L.LatLngBoundsExpression;
};

interface StateMapParameters {
  fipsCode?: string;
  mapRef?: React.RefObject<MapRef>;
  width: CssUnitValue;
  height: CssUnitValue;
  // TODO(jerry): TEMPORARY!!!! I NEED TO THINK OF A BETTER PLACE TO PUT THIS!
  styleFunction: L.StyleFunction;
  children: React.ReactNode;
};

function MapFitToBoundsInternal(
  { boundsToFit }: MapFitsToBoundsInternalParameters) {
  const map = useMap();
  useEffect(
    function () {
      const minStateZoom = map.getBoundsZoom(boundsToFit);
      map.fitBounds(boundsToFit);
      map.setMinZoom(minStateZoom);
    },
    [map, boundsToFit]);

  return null;
}

function StateMap(
  {
    fipsCode,
    mapRef,
    width,
    height,
    styleFunction,
    children
  } : StateMapParameters) {
  const [stateGeoJson, setStateGeoJson] = useState<GeoJSON.GeoJSON | null>(null);
  const [readyToDisplay, setReadyToDisplay] = useState(false);
  const [stateMapBounds, setStateMapBounds] = useState<L.LatLngBoundsExpression | null>();

  useEffect(
    function() {
      (async function() {
	if (!fipsCode) {
	  return;
	}

	const response = await getStateGeometry(fipsCode);
	if (response) {
	  setStateGeoJson(response as GeoJSON.GeoJSON);
	  setStateMapBounds(
	    [
	      [response.bbox![1], response.bbox![0]],
	      [response.bbox![3], response.bbox![2]],
	    ]
	  );
	  setReadyToDisplay(true);
	}
      })();
    }, []);

  if (!fipsCode) {
    return (
      <p>No FIPS code for state. No map!</p>
    );
  }

  if (readyToDisplay) {
    const onEachFeatureHandler =
      (feature: GeoJSON.Feature, layer: L.Layer) => {
	const { properties } = feature;
	if (properties!.NAMELSAD) {
	  layer.bindTooltip(properties!.NAMELSAD);
	} else {
	  // no tool, tip we just have the whole state
	}
      }
    return (
      <MapContainer
	ref={mapRef}
	bounds={stateMapBounds!}
	maxBounds={stateMapBounds!}
	maxBoundsViscosity={1.0}
	style={
	  {
	    width: width,
	    height: height,
	  }
	}
      >
	<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
	<GeoJSON
	  style={styleFunction}
	  data={stateGeoJson!}
	  onEachFeature={onEachFeatureHandler}/>
	<MapFitToBoundsInternal boundsToFit={stateMapBounds!}/>
	{children}
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
