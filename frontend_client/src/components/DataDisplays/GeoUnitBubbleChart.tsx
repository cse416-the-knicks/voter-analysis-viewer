import { useState, useEffect } from "react";

import type { GeoUnitCentroidModel } from "../../api/client";

import { getCountyGeoUnitCentroids } from "../../api/client";

// Should have more stuff in the future, just
// not sure what that might look like right now.
interface GeoUnitBubbleChartProperties {
  fipsCode: string;
}

import { Circle } from "react-leaflet";

function GeoUnitBubbleChart({ fipsCode }: GeoUnitBubbleChartProperties) {
  const [geoUnitCenters, setGeoUnitCenters] = useState<GeoUnitCentroidModel[]>([]);
  useEffect(
    function () {
      (async function () {
        const data = await getCountyGeoUnitCentroids(fipsCode);
        setGeoUnitCenters(Object.values(data));
      })();
    },
    [fipsCode]
  );
  return (
    <>
      {geoUnitCenters.map(
        (guc) => (
          <Circle center={[guc.centerY!, guc.centerX!]} color={"red"} radius={16000} />
        ) /* What units are these? */
      )}
    </>
  );
}

export default GeoUnitBubbleChart;
