import type { GridColDef } from "@mui/x-data-grid";
import type { VotingEquipmentModel } from "../../api/client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useKeyDown from "../../hooks/useKeyDown";
import WindowTitledDataGrid from "../WindowTitledDataGrid";
import { getAllVotingEquipment } from "../../api/client";
import useMediaQuery from "@mui/material/useMediaQuery";

import styles from "./DisplayVotingMachineSummaryView.module.css";

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

function DisplayVotingMachineSummaryView() {
  const navigate = useNavigate();
  const [rows, setDataRows] = useState<VotingEquipmentModel[]>([]);
  const useLargerMaxWidth = useMediaQuery("(min-width:1600px)");
  const maxWidth = useLargerMaxWidth ? 1400 : 1000; // pixels

  useEffect(function () {
    (async function () {
      const equipmentList = await getAllVotingEquipment();
      setDataRows(equipmentList);
    })();
  }, []);

  useKeyDown("Escape", () => navigate("/"));

  return (
    <WindowTitledDataGrid
      title={"Voting Equipment Table Summary"}
      onXout={() => navigate("/")}
      width={maxWidth}
      maxWidth={maxWidth}
      rows={rows}
      columns={columns}
      getRowId={(x) => x.modelName}
      pageSize={12}
      customGetRowClassName={(r) => (rows.find((x) => x.modelName === r.id)?.discontinued ? styles.discontinuedRow : "")}
      left={`calc(50vw - ${maxWidth / 2}px)`}
      top={"0"}
    />
  );
}

export default DisplayVotingMachineSummaryView;
