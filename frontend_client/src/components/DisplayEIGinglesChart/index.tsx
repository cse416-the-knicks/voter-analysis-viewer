import { useState } from "react";
import BubbleChart from "../DataDisplays/BubbleChart";
import { getElectionResultsSummary, getCVAPStatisticsData } from "../../api/client";
import { Paper, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface DisplayEIGinglesChartProperties {
  fipsCode: string;
  width: number;
  height: number;
}

const CVAP_KEYS = ["asianTotal", "blackTotal", "hispanicTotal", "whiteTotal", "otherTotal"] as const;

function DisplayEIGinglesChart({ fipsCode, width, height }: DisplayEIGinglesChartProperties) {
  const [cvapDemographicSelection, setCvapDemographicSelection] = useState(0);
  const races = ["Asian", "Black", "Hispanic", "White", "Other"];
  return (
    <>
      <Paper>
        <FormControl sx={{ m: 1.2, position: "absolute", right: "2em", width: "10em", zIndex: 9999 }}>
          <InputLabel>CVAP Demographic</InputLabel>
          <Select
            onChange={(event) => setCvapDemographicSelection(event.target.value)}
            value={cvapDemographicSelection}
            label="CVAP Demographic"
            variant="standard"
          >
            {races.map((x, i) => (
              <MenuItem value={i}>{x}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <BubbleChart
          data={async () => {
            const cvapData = await getCVAPStatisticsData(fipsCode!, { granularity: "precinct" });
            const electionResultsData = await getElectionResultsSummary(fipsCode!, 2024, { granularity: "precinct" });
            const mergedData = electionResultsData.map((e, i) => ({ ...e, ...cvapData[i] }));

            const republicanBubbleColor = "#d73027";
            const democraticBubbleColor = "#4575b4";

            const republicanBubbles = mergedData.map((data) => ({
              x: (data[CVAP_KEYS[cvapDemographicSelection]]! / data.cvapTotal!) * 100,
              y: (data.republicanVotes! / data.totalVotes!) * 100.0 || 0,
              name: data.countyName!,
              size: 10,
              party: "Rep",
              color: republicanBubbleColor,
            }));

            const democratBubbles = mergedData.map((data) => ({
              x: (data[CVAP_KEYS[cvapDemographicSelection]]! / data.cvapTotal!) * 100,
              y: (data.democratVotes! / data.totalVotes!) * 100.0 || 0,
              name: data.countyName!,
              size: 10,
              party: "Dem",
              color: democraticBubbleColor,
            }));

            return republicanBubbles.concat(democratBubbles);
          }}
          width={width}
          height={height}
          title="Racially Polarized Voting"
          xAxisLabel={`${races[cvapDemographicSelection]} Population (%)`}
          yAxisLabel="Party Vote (%)"
          useRegression
        />
      </Paper>
    </>
  );
}

export default DisplayEIGinglesChart;
