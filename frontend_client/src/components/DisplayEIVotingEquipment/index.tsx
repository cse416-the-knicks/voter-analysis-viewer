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
  const [selectedRaces, setSelectedRaces] = useState([0, 1, 2, 3, 4]);
  const races = ["Asian", "Black", "Hispanic", "White", "Other"];
  const raceColorMap = {
    "Asian": "red",
    "Black": "blue",
    "Hispanic": "purple",
    "White": "green",
    "Other": "orange",
  };

  return (
    <>
      <Paper>
    {/* <FormControl sx={{ m: 1.2, position: "absolute", right: "2em", width: "10em", zIndex: 9999 }}>
        <InputLabel>CVAP Demographic</InputLabel>
        <Select
        onChange={(event) => setCvapDemographicSelection(event.target.value)}
        value={0}
        label="CVAP Demographic"
        variant="standard"
        >
        {races.map((x, i) => (
        <MenuItem value={i}>{x}</MenuItem>
        ))}
        </Select>
        </FormControl> */}
        <PDFChart
          width={width}
          height={height}
          title="Device Accessibility by CVAP Demographic"
          xAxisLabel="Device Probability"
          yAxisLabel="Device Quality"
          data={async () => {
            return await Promise.all(
              selectedRaces.map(async (r, i) => ({
                title: races[r],
                fillColor: raceColorMap[races[r]],
                samples: await getDeviceAccessibilityProbabilityByDemographicPDF(fipsCode, { race: r })
            })));
          }}
        />
      </Paper>
    </>
  );
}

export default DisplayEIVotingEquipment;
