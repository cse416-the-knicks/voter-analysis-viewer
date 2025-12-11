import { useState, } from "react";
import { Box, Paper, Typography, Checkbox, ListItemText } from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { RACES, } from "../../helpers/ecologicalInferenceChartColors.ts";

interface EIRaceSelectorProperties {
  hook: useState<number[]>;
}

function EIRaceSelector({ hook }: EIRaceSelectorProperties) {
  function handleChange(event: SelectChangeEvent<typeof selectedRaces>) {
    const {
      target: { value },
    } = event;
    hook[1](value);
  }

  return (
    <>
      <FormControl sx={{ m: 1.2, position: "absolute", right: "2em", width: "10em", zIndex: 9999 }}>
        <InputLabel>CVAP Demographic</InputLabel>
    <Select
      onChange={handleChange}
      color="secondary"
      value={hook[0]}
      renderValue={(selection) => selection.map((s) => RACES[s]).join(', ') }
      multiple
      label="CVAP Demographic"
      variant="standard"
    >
      {RACES.map((x, i) => (
        <MenuItem key={i} value={i}>
          <Checkbox color="secondary" checked={hook[0].some((x) => x===i)} />
          <ListItemText primary={x} />
        </MenuItem>
      ))}
    </Select>
    </FormControl>
    </>
  );
}

export default EIRaceSelector;
