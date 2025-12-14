import React from "react";
import L from "leaflet";
import type { MapRef } from "react-leaflet/MapContainer";
import { GeoJSON, MapContainer, TileLayer, Pane } from "react-leaflet";
import { FIPS_TO_STATES_MAP, STATES_BOUNDARIES_GEOMETRY } from "./boundaryData";
import { DETAIL_STATE_TYPE_DEMOCRAT, getDetailStateType, getHumanReadableStateType, isDetailState } from "./detailedStatesInfo";
import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import GenericTooltip from "../GenericTooltip";
import { BarChart } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { STATE_INFORMATION_VIEW_TYPE_SIMPLE } from "../StateInformationView/dataViewConfigTypes";
import { FACT_VIEW_CONFIGURATIONS } from "../StateInformationView/dataViewModeConfig";
import type { ID_SELECTION_VOTING_EQUIPMENT_BY_AGE, ID_SELECTION_VOTING_EQUIPMENT_BY_TYPE } from "../StateInformationView/views/viewIds";
import { StateCVAPInfoCard, StateEAVsInfoCard, StateInfoCard } from "../StateInformationView/DrawerCards";

// NOTE(jerry):
// These boundaries were given by ChatGPT
// although they can be googled from some Medium posts
// as well.
const UNITED_STATES_BOUNDARIES: L.LatLngTuple[] = [
  [24.396308, -125.0], // Southwest Corner
  [49.384358, -66.93457], // Northeast Corner
];

const MIN_ACCEPTABLE_ZOOM = 4;

type FipsCode = string; // It's really not just a string, but this is easier to keep.
type OnStateClickFn = (fipsCode: FipsCode) => void;
type FullBoundedUSMapStylingFn = (highlightedStateFipsId: string, feature: GeoJSON.Feature) => L.StyleFunction;

interface FullBoundedUSMapProperties {
  id: string;
  mapRef: React.RefObject<MapRef>;
  onStateClick?: OnStateClickFn;
  zoom?: number;
  children?: React.ReactNode;
  styleFunction: FullBoundedUSMapStylingFn;
}

/**
    Full Map of the United States as a component,
    the geometry data for the United States with state
    boundaries is going to be hard-coded as it's not that
    much data, relatively speaking.

    Will show state names and such, and allow registering
    callbacks on click.
**/
function FullBoundedUSMap({ id, mapRef, zoom, children, styleFunction, onStateClick }: FullBoundedUSMapProperties) {
  const [highlightedStateFipsId, setHighlightedStateFipsId] = useState<string | null>(null);
  const useDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const onFeatureClickHandler = (event: L.LeafletMouseEvent) => {
    const target = event.target as L.FeatureGroup;
    const featureData = target.feature as GeoJSON.Feature;
    if (onStateClick) {
      onStateClick(featureData.id! as FipsCode);
    }
  };
  const onMouseOverHandler = (event: L.LeafletMouseEvent) => {
    const target = event.target as L.FeatureGroup;
    const featureData = target.feature as GeoJSON.Feature;
    setHighlightedStateFipsId(featureData.id! as FipsCode);
  };
  const onMouseOutHandler = (event: L.LeafletMouseEvent) => {
    setHighlightedStateFipsId(null);
  };
  const onEachFeatureHandler = (feature: GeoJSON.Feature, layer: L.Layer) => {
    const { id } = feature; // Should not be null.
    const stateName = FIPS_TO_STATES_MAP[id!];
    const stateType = getDetailStateType(id! as string);
    const defaultHandlers = {
      click: onFeatureClickHandler,
      mouseover: onMouseOverHandler,
      mouseout: onMouseOutHandler,
    };

    // if (isDetailState(id! as string)) {
    //   layer.bindTooltip(stateName + " - " + stateType.map(getHumanReadableStateType).join(", "));
    // } else {
    //   layer.bindTooltip(stateName);
    // }

    layer.on(defaultHandlers);
  };

  const stylingFunctionWrapper = (feature: GeoJSON.Feature) => styleFunction(highlightedStateFipsId!, feature);

  return (
    <>
      <MapContainer
        zoom={Math.max(zoom ?? 0, MIN_ACCEPTABLE_ZOOM)}
        minZoom={MIN_ACCEPTABLE_ZOOM}
        bounds={UNITED_STATES_BOUNDARIES}
        maxBounds={UNITED_STATES_BOUNDARIES}
        maxBoundsViscosity={1.0}
        ref={mapRef}
        className={"full-bounded-us-map"}
        id={id}
      >
        <Pane name="everythingelse" style={{ zIndex: 399 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={"https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"}
          />
          <GeoJSON style={stylingFunctionWrapper} data={STATES_BOUNDARIES_GEOMETRY as GeoJSON.GeoJSON} onEachFeature={onEachFeatureHandler} />
          {children}
        </Pane>
        <Pane name="labels" style={{ zIndex: 499 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={"https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"}
          />
        </Pane>
      </MapContainer>
      <GenericTooltip show={highlightedStateFipsId !== null}>
        {
          // NOTE(jerry);
          // This should be it's own function, however I do want to keep
          // lots of the closure properties, so here we are.
          (function () {
            const id = highlightedStateFipsId?.toString();
            const stateName = FIPS_TO_STATES_MAP[id!];
            const stateType = getDetailStateType(id! as string);
            return (
              <>
                <Typography variant="h4">{stateName}</Typography>
                <Stack spacing={0.5} sx={{ p: 1 }}>
                  {stateType.map((x) => (
                    <StateInfoCard fipsCode={id!} type={x} fill />
                  ))}

                  <StateEAVsInfoCard fipsCode={id!} type={stateType[0]} fill />
                  {/* conditional rendering logic, means it will only show up exactly once for the party states. */}
                  {stateType.map((x) => (
                    <StateCVAPInfoCard fipsCode={id!} type={x} fill />
                  ))}
                </Stack>
              </>
            );
          })()
        }
      </GenericTooltip></>
  );
}

export type { FipsCode, OnStateClickFn, FullBoundedUSMapStylingFn };

export default FullBoundedUSMap;
