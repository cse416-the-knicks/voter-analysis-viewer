import type { GridColDef } from "@mui/x-data-grid";
import type { VotingEquipmentUsageStatisticsModel } from "../../api/client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useKeyDown from "../../hooks/useKeyDown";
import WindowTitledDataGrid from "../WindowTitledDataGrid";
import { getVotingEquipmentUsage } from "../../api/client";
import useMediaQuery from "@mui/material/useMediaQuery";

const columns: GridColDef<VotingEquipmentUsageStatisticsModel[]>[] = [
  {
    field: "stateName",
    headerName: "State",
    width: 190,
  },
  {
    field: "dreNoVvpatTotal",
    headerName: "DRE (No VVPAT)",
    width: 150,
  },
  {
    field: "dreVvpatTotal",
    headerName: "DRE (VVPAT)",
    width: 150,
  },
  {
    field: "bmdTotal",
    headerName: "BMD Total",
    width: 150,
  },
  {
    field: "scannerTotal",
    headerName: "Scanner Total",
    width: 150,
  },
];

function DisplayVotingMachineSummaryView() {
  const navigate = useNavigate();
  const [rows, setDataRows] = useState<VotingEquipmentUsageStatisticsModel[]>([]);
  const maxWidth = 800; // pixels

  useEffect(function () {
    (async function () {
      const equipmentList = await getVotingEquipmentUsage();
      setDataRows(equipmentList);
    })();
  }, []);

  useKeyDown("Escape", () => navigate("/"));

  return (
    <WindowTitledDataGrid
      title={"State Voting Equipment Usage Summary"}
      onXout={() => navigate("/")}
      width={maxWidth}
      maxWidth={maxWidth}
      rows={rows}
      columns={columns}
      getRowId={(x) => x.stateId}
      pageSize={12}
      left={`calc(50vw - ${maxWidth / 2}px)`}
      top={"0"}
    />
  );
}

export default DisplayVotingMachineSummaryView;
