/**
  This will require a client connection to the backend.
**/
import {useEffect, useState} from 'react';
import L from 'leaflet';
import type { MapRef } from 'react-leaflet/MapContainer';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';;

interface StateMapParameters {
  fipsCode?: string,
}

function StateMap(
  {
    fipsCode
  } : StateMapParameters) {
  if (!fipsCode) {
    return (
      <p>No FIPS code for state. No map!</p>
    );
  }

  return (
    <>
    </>
  );
}

export type {
  StateMapParameters
};

export default StateMap;
