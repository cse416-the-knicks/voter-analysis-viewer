import { getDeviceAccessibilityProbabilityByDemographicPDF } from "../../api/client";
import { useState, useEffect, } from "react";
import { Box, Paper, Typography, Checkbox, ListItemText } from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import PDFChart from "../DataDisplays/PDFChart.tsx";

interface DisplayEIVotingEquipmentProperties {
  width: number;
  height: number;
  fipsCode: string;
}

function DisplayEIVotingEquipment({ fipsCode, width, height }: DisplayEIVotingEquipmentProperties) {
  const [selectedRaces, setSelectedRaces] = useState([]);
  const races = ["Asian", "Black", "Hispanic", "White", "Other"];
  const raceColorMap = {
    "Asian": "red",
    "Black": "blue",
    "Hispanic": "purple",
    "White": "green",
    "Other": "orange",
  };

  function handleChange(event: SelectChangeEvent<typeof selectedRaces>) {
    const {
      target: { value },
    } = event;
    setSelectedRaces(value);
  }

  return (
    <>
      <Paper>
        <FormControl sx={{ m: 1.2, position: "absolute", right: "2em", width: "10em", zIndex: 9999 }}>
        <InputLabel>CVAP Demographic</InputLabel>
        <Select
        onChange={handleChange}
          color="secondary"
        value={selectedRaces}
          renderValue={(selection) => selection.map((s) => races[s]).join(', ') }
          multiple
        label="CVAP Demographic"
        variant="standard"
        >
        {races.map((x, i) => (
          <MenuItem key={i} value={i}>
            <Checkbox color="secondary" checked={selectedRaces.some((x) => x===i)} />
            <ListItemText primary={x} />
          </MenuItem>
        ))}
        </Select>
        </FormControl>
        {(selectedRaces.length === 0) && (<Typography variant="h4" sx={{position: 'absolute', width: '100%', top: '50%', textAlign: 'center'}}>No Demographic Selected.</Typography>)}
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
