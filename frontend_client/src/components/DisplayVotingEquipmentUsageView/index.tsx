import type { GridColDef } from "@mui/x-data-grid";
import type { VotingEquipmentUsageStatisticsModel } from "../../api/client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useKeyDown from "../../hooks/useKeyDown";
import WindowTitledDataGrid from "../WindowTitledDataGrid";
import { getDetailedVotingEquipmentUsage, getVotingEquipmentUsage } from "../../api/client";
import WindowTitled from "../WindowTitled";
import { Backdrop } from "@mui/material";
import GroupedBarChart from "../DataDisplays/GroupedBarChart";
import zip from "../../helpers/zip";
import VOTING_EQUIPMENT_TYPE_COLORS from "../../helpers/votingEquipmentColorBuckets";
import useCssCalc from "../../hooks/useCssCalc";

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

function DisplayVotingEquipmentHistoryChart({ stateName, stateFips, onXout }: DisplayVotingEquipmentHistoryChartProperties) {
  const maxWidth = useCssCalc("75vw"); // pixels
  const maxHeight = useCssCalc("80vh");
  const electionYears = [2016, 2018, 2020, 2022, 2024];
  const electionYearColors = {
    2016: "#1f77b4ff", // 2016
    2018: "#ff7f0eff", // 2018
    2020: "#2ca02cff", // 2020
    2022: "#d62728ff", // 2022
    2024: "#9467bdff", // 2024
  };
  return (
    <>
      <WindowTitled title={`${stateName} Voting Equipment History`} width={maxWidth} maxWidth={maxWidth} onXout={onXout}>
        <GroupedBarChart
          title={"Equipment History"}
          xAxisLabel={"Category"}
          yAxisLabel={"Quantity"}
          colorMap={electionYearColors}
          data={async () => {
            const promises = electionYears.map((year) => getDetailedVotingEquipmentUsage(stateFips.toString(), { year: year, aggregate: true }));
            const votingEquipmentUsages = (await Promise.all(promises)).map((x) => x[0]);

            const scannerUsages = votingEquipmentUsages.map((e, i) => {
              return {
                value: e?.scannerTotal ?? 0,
                title: electionYears[i].toString(),
                category: "Scanner",
              };
            });
            const bmdUsages = votingEquipmentUsages.map((e, i) => {
              return {
                value: e?.bmdTotal ?? 0,
                title: electionYears[i].toString(),
                category: "BMD",
              };
            });
            const dreVvpatUsages = votingEquipmentUsages.map((e, i) => {
              return {
                value: e?.dreVvpatTotal ?? 0,
                title: electionYears[i].toString(),
                category: "DRE (VVPAT)",
              };
            });
            const dreNoVvpatUsages = votingEquipmentUsages.map((e, i) => {
              return {
                value: e?.dreNoVvpatTotal ?? 0,
                title: electionYears[i].toString(),
                category: "DRE (No VVPAT)",
              };
            });

            const dataEntries = [...dreVvpatUsages, ...dreNoVvpatUsages, ...bmdUsages, ...scannerUsages];
            return dataEntries;
          }}
          width={maxWidth}
          height={maxHeight}
          transpose
        />
      </WindowTitled>
    </>
  );
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

  useKeyDown("Escape", () => {
    if (targetState) {
      setTargetState(null);
    } else {
      navigate(-1);
    }
  });

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
      <Backdrop open={targetState != null} sx={{ zIndex: 1200 }}>
        {targetState != null && (
          <DisplayVotingEquipmentHistoryChart onXout={() => setTargetState(null)} stateName={targetState.stateName!} stateFips={targetState.stateId!} />
        )}
      </Backdrop>
    </>
  );
}

export default DisplayVotingMachineSummaryView;
