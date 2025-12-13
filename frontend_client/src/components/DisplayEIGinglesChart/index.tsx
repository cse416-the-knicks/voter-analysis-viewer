import { useState } from "react";
import BubbleChart from "../DataDisplays/BubbleChart";
import { getElectionResultsSummary, getCVAPStatisticsData } from "../../api/client";
import { Paper, FormControl, InputLabel, Select, MenuItem, Box, Tabs, Tab } from "@mui/material";

interface DisplayEIGinglesChartProperties {
  fipsCode: string;
  width: number;
  height: number;
}

const CVAP_KEYS = ["asianTotal", "blackTotal", "hispanicTotal", "whiteTotal", "otherTotal"] as const;

function DisplayEIGinglesChart({ fipsCode, width, height }: DisplayEIGinglesChartProperties) {
  const [cvapDemographicSelection, setCvapDemographicSelection] = useState(0);
  const [granularity, setGranularity] = useState(false);
  const races = ["Asian", "Black", "Hispanic", "White", "Other"];
  return (
    <>
      <Paper>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={granularity ? 1 : 0}
            onChange={(_, v) => {
              setGranularity(v === 0 ? false : true);
            }}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
          >
            <Tab label={"By Precinct"} />
            <Tab label={"By EAVS Geounit"} />
          </Tabs>
        </Box>

        <FormControl sx={{ m: 1.2, position: "absolute", right: "2em", width: "10em", zIndex: 9999 }}>
          <InputLabel>CVAP Demographic</InputLabel>
          <Select
            onChange={(event) => setCvapDemographicSelection(event.target.value)}
            value={cvapDemographicSelection}
            label="CVAP Demographic"
            variant="standard"
            color="secondary"
          >
            {races.map((x, i) => (
              <MenuItem value={i}>{x}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <BubbleChart
          data={async () => {
            const cvapData = await getCVAPStatisticsData(fipsCode!, { granularity: granularity ? "county" : "precinct" });
            const electionResultsData = await getElectionResultsSummary(fipsCode!, 2024, { granularity: granularity ? "county" : "precinct" });
            const mergedData = electionResultsData.map((e, i) => ({ ...e, ...cvapData[i] }));

            const republicanBubbleColor = "#d73027";
            const democraticBubbleColor = "#4575b4";

            const maxCvap = Math.max(...cvapData.map((x) => x.cvapTotal!));

            const republicanBubbles = mergedData.map((data) => ({
              x: (data[CVAP_KEYS[cvapDemographicSelection]]! / data.cvapTotal!) * 100,
              y: (data.republicanVotes! / data.totalVotes!) * 100.0 || 0,
              name: data.countyName!,
              size: Math.max((data.cvapTotal! / maxCvap) * 10 * (granularity ? 3 : 1.5), 5),
              party: "Rep",
              color: republicanBubbleColor,
            }));

            const democratBubbles = mergedData.map((data) => ({
              x: (data[CVAP_KEYS[cvapDemographicSelection]]! / data.cvapTotal!) * 100,
              y: (data.democratVotes! / data.totalVotes!) * 100.0 || 0,
              name: data.countyName!,
              size: Math.max((data.cvapTotal! / maxCvap) * 10 * (granularity ? 3 : 1.5), 5),
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
          degree={3}
          useRegression
        />
      </Paper>
    </>
  );
}

export default DisplayEIGinglesChart;
