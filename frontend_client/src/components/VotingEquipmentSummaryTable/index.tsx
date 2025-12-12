import type { GridColDef } from "@mui/x-data-grid";
import type { VotingEquipmentModel } from "../../api/client";

import { useEffect, useState } from "react";
import { getAllVotingEquipment } from "../../api/client";

import styles from "../DisplayVotingMachineSummaryView/DisplayVotingMachineSummaryView.module.css";
import StyledDataGrid from "../StyledDataGrid";
import useCssCalc from "../../hooks/useCssCalc";

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
    valueFormatter: (value) => {
      const parsedDate = new Date(value);
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
  },
  {
    field: "discontinued",
    headerName: "Discontinued",
    type: "boolean",
    width: 120,
  },
  {
    field: "operatingSystem",
    headerName: "Operating System",
    width: 160,
  },
  {
    field: "vvpat",
    headerName: "VVPAT?",
    type: "boolean",
    width: 100,
  },
  {
    field: "quantity",
    headerName: "Quantity",
    type: "number",
    width: 80,
  },
  {
    field: "reliabilityScore",
    headerName: "Reliability",
    type: "number",
    width: 100,
  },
  {
    field: "errorRate",
    headerName: "Error Rate",
    type: "number",
    width: 100,
  },
  {
    field: "scanRate",
    headerName: "Scan Rate",
    type: "number",
    width: 100,
  },
  {
    field: "equipmentQuality",
    headerName: "Quality",
    type: "number",
    width: 80,
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
      customGetRowClassName={(r) => (rows.find((x) => x.modelName === r.id)?.discontinued ? styles.discontinuedRow : "")}
    />
  );
}

export default VotingMachineSummaryTable;
