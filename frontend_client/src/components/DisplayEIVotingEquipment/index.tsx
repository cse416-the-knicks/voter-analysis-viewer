import { getDeviceAccessibilityProbabilityByDemographicPDF } from "../../api/client";
import { useState, useEffect, } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import PDFChart from "../DataDisplays/PDFChart.tsx";

interface DisplayEIVotingEquipmentProperties {
  width: number;
  height: number;
  fipsCode: string;
}

function DisplayEIVotingEquipment({ fipsCode, width, height }: DisplayEIVotingEquipmentProperties) {
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
        <PDFChart
          width={width}
          height={height}
          title="Device Accessibility by CVAP Demographic"
          xAxisLabel="Device Probability"
          yAxisLabel="Device Quality"
          data={async () => {
            const points1 = await getDeviceAccessibilityProbabilityByDemographicPDF(fipsCode, { race: 0 });
            return [
              {
                title: "White",
                fillColor: "red",
                samples: points1.map(({ x, y }) => ({ x: x, y: Math.max(0, y - 0.15) })),
              },
              {
                title: "Black",
                fillColor: "blue",
                samples: points1.map(({ x, y }) => ({ x: x + 0.25, y: Math.max(0, y - 0.25) })),
              },
            ];
          }}
        />
      </Paper>
    </>
  );
}

export default DisplayEIVotingEquipment;
