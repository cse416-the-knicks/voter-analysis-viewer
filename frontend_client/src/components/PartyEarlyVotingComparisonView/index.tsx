import type { ViewStateYearSummaryModel } from "../../api/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useKeyDown from "../../hooks/useKeyDown";

import { getViewStateYearSummaryByStateForYear } from "../../api/client";

import WindowTitledDataGrid from "../WindowTitledDataGrid";
import { comparisonRow } from "../../helpers/comparisonRow";

function PartyEarlyVotingComparisonTableView() {
  const navigate = useNavigate();
  const [rows, setDataRows] = useState<ViewStateYearSummaryModel[]>([]);
  const [cols, setColumnRows] = useState<any>([]);
  const maxWidth = 770;

  useKeyDown("Escape", () => navigate("/"));
  useEffect(function () {
    (async function () {
      const awaited = await Promise.all(["36", "40"].map((fips) => getViewStateYearSummaryByStateForYear(fips, 2024)));

      setColumnRows([
        {
          field: "metricName",
          headerName: "Metric",
          type: "string",
          width: 200,
        },
        {
          field: "a",
          headerName: awaited[0].stateName,
          type: "number",
          width: 160,
        },
        {
          field: "b",
          headerName: awaited[1].stateName,
          type: "number",
          width: 160,
        },
      ]);
      const transposedRows = [];
      transposedRows.push(
        comparisonRow("Type", "Democrat", "Republican"),
        comparisonRow("Early Voting Total", ...awaited.map((x) => x.earlyVotingTotal)),
        comparisonRow("Ballots By Mail", ...awaited.map((x) => x.ballotsByMail)),
        comparisonRow("Total Ballots Cast", ...awaited.map((x) => x.totalBallotsCast)),
        comparisonRow("Provisional Ballots", ...awaited.map((x) => x.totalProvisionalBallotsCast)),
        comparisonRow("Early Voting Share %", ...awaited.map((x) => (x.earlyVotingShareRate! * 100).toFixed(1) + "%")),
        comparisonRow("Mail-in Ballot Share %", ...awaited.map((x) => (x.mailinBallotVotingShareRate! * 100).toFixed(1) + "%"))
      );

      // @ts-expect-error, This is actually correctly an error
      // because the right fix is that we should be using a union type,
      // although this code was hacked together.
      //
      // TODO(frontend): proper type annotation.
      setDataRows(transposedRows);
    })();
  }, []);

  return (
    <WindowTitledDataGrid
      title={"Early Voting Comparisons"}
      width={maxWidth}
      maxWidth={maxWidth}
      pageSize={13}
      rows={rows}
      columns={cols}
      onXout={() => navigate("/")}
      left={`calc(50vw - ${maxWidth / 2}px)`}
      top={"2.7em"}
    />
  );

}

export default PartyEarlyVotingComparisonTableView;
