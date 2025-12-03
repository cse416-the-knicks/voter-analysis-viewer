import type { GridColDef } from "@mui/x-data-grid";
import type { VotingEquipmentUsageStatisticsModel } from "../../api/client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useKeyDown from "../../hooks/useKeyDown";
import WindowTitledDataGrid from "../WindowTitledDataGrid";
import { getVotingEquipmentUsage } from "../../api/client";
import WindowTitled from "../WindowTitled";
import { Backdrop } from "@mui/material";

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

interface DisplayVotingEquipmentHistoryChartProperties {
  stateName: string;
  stateFips: number;
  onXout: () => void;
}

function DisplayVotingEquipmentHistoryChart(
  {
    stateName,
    stateFips,
    onXout,
  }: DisplayVotingEquipmentHistoryChartProperties) {
  const navigate = useNavigate();
  const maxWidth = 800; // pixels

  return <>
    <WindowTitled 
      title={`${stateName} Voting Equipment History`}
      width={maxWidth}
      maxWidth={maxWidth}
      onXout={onXout}>
    </WindowTitled>
  </>;
}

function DisplayVotingMachineSummaryView() {
  const navigate = useNavigate();
  const [rows, setDataRows] = useState<VotingEquipmentUsageStatisticsModel[]>([]);
  const [targetState, setTargetState] = useState<VotingEquipmentUsageStatisticsModel | null>(null);
  const maxWidth = 800; // pixels

  useEffect(function () {
    (async function () {
      const equipmentList = await getVotingEquipmentUsage();
      setDataRows(equipmentList);
    })();
  }, []);

  useKeyDown("Escape", () => navigate(-1));

  return (
    <>
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
        onRowDoubleClick={(params, _event, _details) => {
          const targetRow = params.row;
          setTargetState(targetRow);
        }}
      />
      <Backdrop open={targetState!=null} sx={{ zIndex: 1200 }}>
        {
          (targetState != null) && <DisplayVotingEquipmentHistoryChart onXout={() => setTargetState(null)} stateName={targetState.stateName!} stateFips={targetState.stateId!} />
        }
      </Backdrop>
    </>
  );
}

export default DisplayVotingMachineSummaryView;
