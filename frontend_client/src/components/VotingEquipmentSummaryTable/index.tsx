import type { GridColDef } from "@mui/x-data-grid";
import type { VotingEquipmentModel } from "../../api/client";

import { useEffect, useState } from "react";
import { getAllVotingEquipment } from "../../api/client";

import styles from "../DisplayVotingMachineSummaryView/DisplayVotingMachineSummaryView.module.css";
import StyledDataGrid from "../StyledDataGrid";

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
    }
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
  maxWidth: number;
}

function VotingMachineSummaryTable({
  fipsCode,
  maxWidth
}: VotingMachineSummaryTableProperties) {
  const [rows, setDataRows] = useState<VotingEquipmentModel[]>([]);

  useEffect(function () {
    (async function () {
      const equipmentList = await getAllVotingEquipment({ stateFips: fipsCode });
      setDataRows(equipmentList);
    })();
  }, []);

  return (
    <StyledDataGrid
      width={maxWidth}
      maxWidth={maxWidth}
      rows={rows}
      columns={columns}
      getRowId={(x) => x.modelName}
      pageSize={12}
      customGetRowClassName={(r) => (rows.find((x) => x.modelName === r.id)?.discontinued ? styles.discontinuedRow : "")}
    />
  );
}

export default VotingMachineSummaryTable;