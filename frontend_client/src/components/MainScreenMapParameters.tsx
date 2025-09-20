import type React from 'react';
import type { MapRef } from 'react-leaflet/MapContainer';

export interface MainScreenMapParameters {
    leafletMap: React.RefObject<MapRef>;
    data: any; // The type is very complicated to annotate here.
}
