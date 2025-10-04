import type { ViewStateYearSummaryModel } from '../../api/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useKeyDown from '../../hooks/useKeyDown';

import { getViewStateYearSummaryByStateForYear } from '../../api/client';

import WindowTitledDataGrid from '../WindowTitledDataGrid';
import { comparisonRow } from '../../helpers/comparisonRow';

function VoterComparisonOptInOptOutTableView() {
  const navigate = useNavigate();
  const [rows, setDataRows] = useState<ViewStateYearSummaryModel[]>([]);
  const [cols, setColumnRows] = useState<any>([]);
  const maxWidth = 770;

  useKeyDown('Escape', () => navigate('/'));
  useEffect(
    function () {
      (async function () {
        const awaited = await Promise.all(
          ["48", "26", "13"].map((fips) => getViewStateYearSummaryByStateForYear(fips, 2024))
        );

        setColumnRows(
          [
            {
              field: 'metricName',
              headerName: "Metric",
              type: "string",
              width: 200,
            },
            {
              field: 'a',
              headerName: awaited[0].stateName,
              type: 'number',
              width: 160,
            },
            {
              field: 'b',
              headerName: awaited[1].stateName,
              type: 'number',
              width: 160,
            }, {
              field: 'c',
              headerName: awaited[2].stateName,
              type: 'number',
              width: 160,
            },
          ]);
        let transposedRows = [];
        transposedRows.push(
          comparisonRow("Type", "Opt-In", "Opt-Out (SDR)", "Opt-Out"),
          comparisonRow("Active Registered",...awaited.map((x) => x.activeRegistered)),
          comparisonRow("Inactive Registered",...awaited.map((x) => x.inactiveRegistered)),
          comparisonRow("Total Registered",...awaited.map((x) => x.totalRegistered)),
          comparisonRow("Total Ballots Cast",...awaited.map((x) => x.totalBallotsCast)),
          comparisonRow("Early Voting Total",...awaited.map((x) => x.earlyVotingShareRate)),
          comparisonRow("Ballots By Mail",...awaited.map((x) => x.ballotsByMail)),
          comparisonRow("Provisional Ballots",...awaited.map((x) => x.totalProvisionalBallotsCast)),
          comparisonRow("Active Voter Rate %",...awaited.map((x) => (x.activeVoterRate! * 100).toFixed(1) + "%")),
          comparisonRow("Inactive Voter Rate %",...awaited.map((x) => (x.inactiveVoterRate! * 100).toFixed(1) + "%")),
          comparisonRow("Turnout Rate %",...awaited.map((x) => (x.turnOutRate! * 100).toFixed(1) + "%")),
          comparisonRow("Early Voting Share %",...awaited.map((x) => (x.earlyVotingShareRate! * 100).toFixed(1) + "%")),
          comparisonRow("Mail-in Ballot Share %",...awaited.map((x) => (x.mailinBallotVotingShareRate! * 100).toFixed(1) + "%")),
        );
        
        // @ts-expect-error
        setDataRows(transposedRows);
      })();
    },
    []);

  return (
    <WindowTitledDataGrid
      title={"Opt-in / Opt-out Voting Data Comparison"}
      width={maxWidth}
      maxWidth={maxWidth}
      left={"35em"}
      top={"0"}
      pageSize={13}
      rows={rows}
      columns={cols}
      onXout={() => navigate("/")}
    />
  );
}

export default VoterComparisonOptInOptOutTableView;