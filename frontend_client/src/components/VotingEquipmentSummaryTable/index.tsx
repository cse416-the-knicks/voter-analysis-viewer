import type { GridColDef } from "@mui/x-data-grid";
import type { VotingEquipmentModel } from "../../api/client";

import { useEffect, useState } from "react";
import { getAllVotingEquipment } from "../../api/client";

import styles from "../DisplayVotingMachineSummaryView/DisplayVotingMachineSummaryView.module.css";
import StyledDataGrid from "../StyledDataGrid";
import { Check, Close } from "@mui/icons-material";
import { Chip } from "@mui/material";

const chipScoreRender = (value) => {
  if (value.value === null || value.value === undefined) {
    return <Chip label="N/A" size="small" color="error" />;
  }
  return <Chip label={value.value.toFixed(2)} size="small" color={value.value > 0.45 ? (value.value > 0.7 ? "success" : "warning") : "error"} />;
};

const columns: GridColDef<VotingEquipmentModel[]>[] = [
  {
    field: "manufacturer",
    headerName: "Manufacturer",
    width: 190,
  },
  {
    field: "equipmentType",
    headerName: "Type",
    width: 220,
  },
  {
    field: "modelName",
    headerName: "Name",
    width: 150,
  },
  {
    field: "firstManufactured",
    headerName: "First Manufactured",
    width: 150,
    renderCell: (value) => {
      if (value.value === null || value.value === undefined) {
        return <Chip size="small" label="Missing" color="error" />;
      }
      const parsedDate = new Date(value.value);
      const INVALID_DATE = -2208970800000;
      const INVALID_DATE_UNIX = 0;
      if (INVALID_DATE === parsedDate.valueOf() || INVALID_DATE_UNIX === parsedDate.valueOf()) {
        return <Chip size="small" label="Missing" color="error" />;
      }
      return parsedDate.toLocaleDateString(navigator.language);
    },
  },
  {
    field: "age",
    headerName: "Age",
    width: 80,
    valueFormatter: (value) => {
      return value + " years";
    },
    renderCell: (value) => {
      if (value.value === null || value.value === undefined) {
        return <Chip label="N/A" size="small" color="error" />;
      }

      return value.value + " years";
    },
  },
  {
    field: "discontinued",
    headerName: "Discontinued",
    type: "boolean",
    width: 120,
    renderCell: (value) => {
      if (value.value === null || value.value === undefined) {
        return <Chip label="Unknown" size="small" color="error" />;
      }
      return value.value ? <Check color="error" /> : <Close color="success" />;
    },
  },
  {
    field: "operatingSystem",
    headerName: "Operating System",
    width: 280,
    renderCell: (value) => {
      if (value.value === null || value.value === undefined) {
        return <Chip label="N/A" size="small" color="error" />;
      }

      if (value.value.includes("Windows")) {
        if (value.value.includes("10") || value.value.includes("11")) {
          return (
            <>
              <img width={24} height={24} src="/src/assets/windows10.png" />
              {value.value}
            </>
          );
        } else {
          return (
            <>
              <img width={24} height={24} src="/src/assets/windows.png" />
              {value.value}
            </>
          );
        }
      } else if (value.value.includes("Linux")) {
        return (
          <>
            <img width={24} height={24} src="/src/assets/linux.png" />
            {value.value}
          </>
        );
      } else if (value.value.includes("Android")) {
        return (
          <>
            <img width={24} height={24} src="/src/assets/android.png" />
            {value.value}
          </>
        );
      }
      return value.value;
    },
  },
  {
    field: "certificationLevel",
    headerName: "Certification",
    width: 150,
    renderCell: (params) => {
      const value = params.value;
      if (value === null || value === undefined) {
        return <Chip label="Unknown" size="small" color="error" />;
      }
      if (value === "Not Applicable") {
        return <Chip label="N/A" size="small" color="error" />;
      }
      return <strong>{value}</strong>;
    },
  },
  {
    field: "vvpat",
    headerName: "VVPAT?",
    type: "boolean",
    width: 100,
    renderCell: (value) => {
      if (value.value === null || value.value === undefined) {
        return <Chip label="Unknown" size="small" color="error" />;
      }
      return value.value ? <Check color="success" /> : <Close color="error" />;
    },
  },
  {
    field: "quantity",
    headerName: "Quantity",
    type: "number",
    width: 80,
  },
  {
    field: "scanRate",
    headerName: "Scan Rate",
    type: "number",
    width: 100,
  },
  {
    field: "reliabilityScore",
    headerName: "Reliability",
    type: "number",
    renderCell: chipScoreRender,
    width: 100,
  },
  {
    field: "errorRate",
    headerName: "Error Rate",
    type: "number",
    renderCell: chipScoreRender,
    width: 100,
  },
  {
    field: "equipmentQuality",
    headerName: "Quality",
    type: "number",
    width: 80,
    renderCell: chipScoreRender,
  },
  {
    field: "securityRisks",
    headerName: "Security Notes",
    width: 500,
  },
  {
    field: "notesMisc",
    headerName: "Notes",
    width: 500,
  },
];

interface VotingMachineSummaryTableProperties {
  fipsCode?: string;
  width?: number;
  height?: number;
}

function VotingMachineSummaryTable({ fipsCode, width, height }: VotingMachineSummaryTableProperties) {
  const [rows, setDataRows] = useState<VotingEquipmentModel[]>([]);
  // Used to approximate height of a row to dynamically calculate good page size to minimize pagination
  useEffect(function () {
    (async function () {
      const equipmentList = await getAllVotingEquipment({ stateFips: fipsCode });
      setDataRows(equipmentList);
    })();
  }, []);

  return (
    <StyledDataGrid
      width={width}
      maxWidth={width}
      height={height}
      maxHeight={height}
      rows={rows}
      columns={columns}
      getRowId={(x) => x.modelName}
      getRowHeight={() => "auto"}
      customGetRowClassName={(r) => (rows.find((x) => x.modelName === r.id)?.discontinued ? styles.discontinuedRow : "")}
    />
  );
}

export default VotingMachineSummaryTable;
