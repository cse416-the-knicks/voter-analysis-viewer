import type { CssUnitValue } from "../../helpers/CssUnits";
import { useEffect, useState } from "react";
import L from "leaflet";
import type { MapRef } from "react-leaflet/MapContainer";
import { GeoJSON, MapContainer, TileLayer, Pane, useMap } from "react-leaflet";
import { getStateGeometry } from "../../api/client";
import useMediaQuery from "@mui/material/useMediaQuery";

interface MapFitsToBoundsInternalParameters {
  boundsToFit: L.LatLngBoundsExpression;
}

type StateMapOnFeatureClickHandler = (feature: GeoJSON.Feature, layer: L.Layer) => void;
type StateMapOnFeatureHoverHandler = (feature: GeoJSON.Feature, layer: L.Layer, on: boolean) => void;

interface StateMapParameters {
  mapKey?: any;
  fipsCode?: string;
  mapRef?: React.RefObject<MapRef>;
  width: CssUnitValue;
  height: CssUnitValue;
  styleFunction: L.StyleFunction;
  children: React.ReactNode;
  onFeatureClick?: StateMapOnFeatureClickHandler;
  onFeatureHover?: StateMapOnFeatureHoverHandler;
}

function MapFitToBoundsInternal({ boundsToFit }: MapFitsToBoundsInternalParameters) {
  const map = useMap();
  useEffect(
    function () {
      const minStateZoom = map.getBoundsZoom(boundsToFit);
      map.fitBounds(boundsToFit);
      map.setMinZoom(minStateZoom);
    },
    [map, boundsToFit]
  );

  return null;
}

function StateMap({ mapKey, fipsCode, mapRef, width, height, styleFunction, onFeatureClick, onFeatureHover, children }: StateMapParameters) {
  const [stateGeoJson, setStateGeoJson] = useState<GeoJSON.GeoJSON | null>(null);
  const [readyToDisplay, setReadyToDisplay] = useState(false);
  const [stateMapBounds, setStateMapBounds] = useState<L.LatLngBoundsExpression | null>();
  const useDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(function () {
    (async function () {
      if (!fipsCode) {
        return;
      }

      const response = await getStateGeometry(fipsCode);
      if (response) {
        setStateGeoJson(response as GeoJSON.GeoJSON);
        setStateMapBounds([
          [response.bbox![1], response.bbox![0]],
          [response.bbox![3], response.bbox![2]],
        ]);
        setReadyToDisplay(true);
      }
    })();
  }, []);

  if (!fipsCode) {
    return <p>No FIPS code for state. No map!</p>;
  }

  if (readyToDisplay) {
    const onEachFeatureHandler = (feature: GeoJSON.Feature, layer: L.Layer) => {
      const { properties } = feature;
      if (properties!.NAMELSAD) {
        // layer.bindTooltip(properties!.NAMELSAD);
        if (onFeatureClick) {
          layer.on("click", function () {
            onFeatureClick(feature, layer);
          });
        }
        if (onFeatureHover) {
          layer.on("mouseover", function () {
            onFeatureHover(feature, layer, true);
          });
          layer.on("mouseout", function () {
            onFeatureHover(feature, layer, false);
          });
        }
      } else {
        // no tool, tip we just have the whole state
      }
    };

    return (
      <MapContainer
        ref={mapRef}
        bounds={stateMapBounds!}
        maxBounds={stateMapBounds!}
        maxBoundsViscosity={1.0}
        style={{
          width: width,
          height: height,
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={"https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"}
        />
        <GeoJSON key={mapKey} style={styleFunction} onEachFeature={onEachFeatureHandler} data={stateGeoJson!} />
        <MapFitToBoundsInternal boundsToFit={stateMapBounds!} />
        {children}
        <Pane name="labels" style={{ zIndex: 499 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={"https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"}
          />
        </Pane>
      </MapContainer>
    );
  } else {
    return (
      <>
        <p>Loading map...</p>
      </>
    );
  }
}

export type { StateMapParameters };

export default StateMap;
