import { useState, useEffect } from "react";

import type { GeoUnitCentroidModel, VoterAffiliationStatisticsModel } from "../../api/client";

import { getCountyGeoUnitCentroids, getVoterAffiliations } from "../../api/client";

// Should have more stuff in the future, just
// not sure what that might look like right now.
interface GeoUnitBubbleChartProperties {
  fipsCode: string;
}

import { Circle } from "react-leaflet";

function GeoUnitBubbleChart({ fipsCode }: GeoUnitBubbleChartProperties) {
  const [geoUnitCenters, setGeoUnitCenters] = useState<GeoUnitCentroidModel[]>([]);
  const [regionData, setRegionData] = useState<VoterAffiliationStatisticsModel[]>([]);
  useEffect(
    function () {
      (async function () {
        const data = await getCountyGeoUnitCentroids(fipsCode);
        const data2 = await getVoterAffiliations(fipsCode);
        setRegionData(data2);
        setGeoUnitCenters(Object.values(data));
      })();
    },
    [fipsCode]
  );
  return (
    <>
      {geoUnitCenters.map(
        (guc) => (
          <Circle
            center={[guc.centerY!, guc.centerX!]}
            color={(() => {
              const matchingRow = regionData.find((c) => guc.fullRegionId === c.fullRegionId);
              if (matchingRow) {
                const { republicanTotal, democraticTotal } = matchingRow;
                if (republicanTotal! > democraticTotal!) {
                  return "red";
                }
                return "blue";
              }
              return "gray";
            })()}
            radius={16000}
          />
        ) /* What units are these? */
      )}
    </>
  );
}

export default GeoUnitBubbleChart;
