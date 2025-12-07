import type { VotingEquipmentUsageStatisticsModel } from "../../api/client";
import VOTING_EQUIPMENT_TYPE_COLORS from "../../helpers/votingEquipmentColorBuckets";

function CountyGradientSet(data: VotingEquipmentUsageStatisticsModel, colorSet: string[]) {
  const colors = [];

  if (data.dreNoVvpatTotal! > 0) {
    colors.push(colorSet[0]);
  }

  if (data.dreVvpatTotal! > 0) {
    colors.push(colorSet[1]);
  }

  if (data.bmdTotal! > 0) {
    colors.push(colorSet[2]);
  }

  if (data.scannerTotal! > 0) {
    colors.push(colorSet[3]);
  }


  const x1 = 25;
  const y1 = 25;
  const x2 = (x1 * 1.2) / colors.length;
  const y2 = (y1 * 1.2) / colors.length;

  // Colorband thresholds are repeated because linear gradient
  // will try to interpolate between colors. So the duplicate "edge" color
  // is to force a "hard transition" so that the colors appear striped instead
  // of as a gradient.
  switch (colors.length) {
    case 1:
      return (
        <linearGradient id={`vt${data.fullRegionId}`} gradientTransform="">
          <stop offset="0" stop-color={colors[0]} />
          <stop offset="100%" stop-color={colors[0]} />
        </linearGradient>
      );
    case 2:
      return (
        <linearGradient
          id={`vt${data.fullRegionId}`}
          gradientTransform="rotate(0)"
          x1={x1 + "%"}
          y1={y1 + "%"}
          x2={x2 + "%"}
          y2={y2 + "%"}
          spreadMethod="repeat"
        >
          <stop offset="0" stop-color={colors[0]} />
          <stop offset="50%" stop-color={colors[0]} />
          <stop offset="50%" stop-color={colors[1]} />
          <stop offset="100%" stop-color={colors[1]} />
        </linearGradient>
      );
    case 3:
      return (
        <linearGradient
          id={`vt${data.fullRegionId}`}
          gradientTransform="rotate(0)"
          x1={x1 + "%"}
          y1={y1 + "%"}
          x2={x2 + "%"}
          y2={y2 + "%"}
          spreadMethod="repeat"
        >
          <stop offset="0" stop-color={colors[0]} />
          <stop offset="33%" stop-color={colors[0]} />
          <stop offset="33%" stop-color={colors[1]} />
          <stop offset="66%" stop-color={colors[1]} />
          <stop offset="66%" stop-color={colors[2]} />
          <stop offset="100%" stop-color={colors[2]} />
        </linearGradient>
      );
    case 4:
      return (
        <linearGradient
          id={`vt${data.fullRegionId}`}
          gradientTransform="rotate(0)"
          x1={x1 + "%"}
          y1={y1 + "%"}
          x2={x2 + "%"}
          y2={y2 + "%"}
          spreadMethod="repeat"
        >
          <stop offset="0" stop-color={colors[0]} />
          <stop offset="25%" stop-color={colors[0]} />
          <stop offset="25%" stop-color={colors[1]} />
          <stop offset="50%" stop-color={colors[1]} />
          <stop offset="50%" stop-color={colors[2]} />
          <stop offset="75%" stop-color={colors[2]} />
          <stop offset="75%" stop-color={colors[3]} />
          <stop offset="100%" stop-color={colors[3]} />
        </linearGradient>
      );
  }
};

function CountyGradientStyleClass(data: VotingEquipmentUsageStatisticsModel) {
  return (
    <style>
      {`
.vt${data.fullRegionId} {
fill: url("#vt${data.fullRegionId}");
fill-opacity: 0.55;
}
`}
    </style>
  );
};

interface EquipmentGradientSetProperties {
    dataRows: VotingEquipmentUsageStatisticsModel[]
}

function EquipmentGradientSet({
    dataRows
}: EquipmentGradientSetProperties) {
    return (
        <>
        <svg width="0" height="0">
        <defs>
            {dataRows.map((x) =>
                CountyGradientSet(
                x,
                VOTING_EQUIPMENT_TYPE_COLORS.map((c) => c.color)
                )
            )}
            </defs>
        </svg>
        {dataRows.map(CountyGradientStyleClass)}
    </>
    );
}
export default EquipmentGradientSet;