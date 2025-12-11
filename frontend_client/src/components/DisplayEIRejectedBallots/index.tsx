import { getRejectionProbabilitiesByDemographicPDF } from "../../api/client";
import { useState, useEffect } from "react";
import { Box, Paper, Typography, Checkbox, ListItemText } from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { RACES, RACE_COLOR_MAP } from "../../helpers/ecologicalInferenceChartColors.ts";
import EIRaceSelector from "../EIRaceSelector";
import PDFChart from "../DataDisplays/PDFChart.tsx";

interface DisplayEIRejectedBallotsProperties {
  width: number;
  height: number;
  fipsCode: string;
}

function DisplayEIRejectedBallots({ fipsCode, width, height }: DisplayEIRejectedBallotsProperties) {
  const [selectedRaces, setSelectedRaces] = useState([]);

  function handleChange(event: SelectChangeEvent<typeof selectedRaces>) {
    const {
      target: { value },
    } = event;
    setSelectedRaces(value);
  }

  return (
    <>
      <Paper>
        <EIRaceSelector hook={[selectedRaces, setSelectedRaces]} />
        {selectedRaces.length === 0 && (
          <Typography variant="h4" sx={{ position: "absolute", width: "100%", top: "50%", textAlign: "center" }}>
            No Demographic Selected.
          </Typography>
        )}
        <PDFChart
          width={width}
          height={height}
          title="Ballot Rejection Probability by CVAP Demographic"
          xAxisLabel="Rejection Probability"
          yAxisLabel="Rejection (%)"
          data={async () => {
            return await Promise.all(
              selectedRaces.map(async (r, i) => ({
                title: RACES[r],
                fillColor: RACE_COLOR_MAP[RACES[r]],
                samples: await getRejectionProbabilitiesByDemographicPDF(fipsCode, { race: r }),
              }))
            );
          }}
        />
      </Paper>
    </>
  );
}

export default DisplayEIRejectedBallots;
