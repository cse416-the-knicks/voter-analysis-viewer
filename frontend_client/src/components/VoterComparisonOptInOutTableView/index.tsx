import type { ViewStateYearSummaryModel } from '../../api/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useKeyDown from '../../hooks/useKeyDown';

import { getViewStateYearSummaryByStateForYear } from '../../api/client';

import WindowTitledDataGrid from '../WindowTitledDataGrid';

function VoterComparisonOptInOptOutTableView() {
  const navigate = useNavigate();
  const [rows, setDataRows] = useState<ViewStateYearSummaryModel[]>([]);
  const [cols, setColumnRows] = useState<any>([]);
  const maxWidth = 770;

  useKeyDown('Escape', () => navigate('/'));

  useEffect(
    function () {
      (async function () {
        const promises = [
          getViewStateYearSummaryByStateForYear("48", 2024),
          getViewStateYearSummaryByStateForYear("26", 2024),
          getViewStateYearSummaryByStateForYear("13", 2024),
        ]
        const awaited = await Promise.all(promises);

        console.log(awaited);
        setColumnRows(
          [
            {
              field: 'name',
              headerName: "Metric",
              type: "string",
              width: 200,
            },
            {
              field: 'x',
              headerName: awaited[0].stateName,
              type: 'number',
              width: 160,
            },
            {
              field: 'y',
              headerName: awaited[1].stateName,
              type: 'number',
              width: 160,
            }, {
              field: 'z',
              headerName: awaited[2].stateName,
              type: 'number',
              width: 160,
            },
          ]);
        let transposedRows = [];
        transposedRows.push(
          {
            name: "Type",
            x: "Opt-In",
            y: "Opt-Out (SDR)",
            z: "Opt-Out",
          },
          {
            name: "Active Registered",
            x: awaited[0].activeRegistered,
            y: awaited[1].activeRegistered,
            z: awaited[2].activeRegistered,
          },
          {
            name: "Inactive Registered",
            x: awaited[0].inactiveRegistered,
            y: awaited[1].inactiveRegistered,
            z: awaited[2].inactiveRegistered,
          },
          {
            name: "Total Registered",
            x: awaited[0].totalRegistered,
            y: awaited[1].totalRegistered,
            z: awaited[2].totalRegistered,
          },
          {
            name: "Total Ballots Cast",
            x: awaited[0].totalBallotsCast,
            y: awaited[1].totalBallotsCast,
            z: awaited[2].totalBallotsCast,
          },
          {
            name: "Early Voting Total",
            x: awaited[0].earlyVotingTotal,
            y: awaited[1].earlyVotingTotal,
            z: awaited[2].earlyVotingTotal,
          },
          {
            name: "Ballots By Mail",
            x: awaited[0].ballotsByMail,
            y: awaited[1].ballotsByMail,
            z: awaited[2].ballotsByMail,
          },
          {
            name: "Provisional Ballots",
            x: awaited[0].totalProvisionalBallotsCast,
            y: awaited[1].totalProvisionalBallotsCast,
            z: awaited[2].totalProvisionalBallotsCast,
          },
          {
            name: "Active Voter Rate %",
            x: (awaited[0].activeVoterRate! * 100).toFixed(1) + "%",
            y: (awaited[1].activeVoterRate! * 100).toFixed(1) + "%",
            z: (awaited[2].activeVoterRate! * 100).toFixed(1) + "%",
          },
          {
            name: "Inactive Voter Rate %",
            x: (awaited[0].inactiveVoterRate! * 100).toFixed(1) + "%",
            y: (awaited[1].inactiveVoterRate! * 100).toFixed(1) + "%",
            z: (awaited[2].inactiveVoterRate! * 100).toFixed(1) + "%",
          },
          {
            name: "Turnout Rate %",
            x: (awaited[0].turnOutRate! * 100).toFixed(1) + "%",
            y: (awaited[1].turnOutRate! * 100).toFixed(1) + "%",
            z: (awaited[2].turnOutRate! * 100).toFixed(1) + "%",
          },
          {
            name: "Early Voting Share %",
            x: (awaited[0].earlyVotingShareRate! * 100).toFixed(1) + "%",
            y: (awaited[1].earlyVotingShareRate! * 100).toFixed(1) + "%",
            z: (awaited[2].earlyVotingShareRate! * 100).toFixed(1) + "%",
          },
          {
            name: "Mail-in Ballot Share %",
            x: (awaited[0].mailinBallotVotingShareRate! * 100).toFixed(1) + "%",
            y: (awaited[1].mailinBallotVotingShareRate! * 100).toFixed(1) + "%",
            z: (awaited[2].mailinBallotVotingShareRate! * 100).toFixed(1) + "%",
          },
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
      getRowId={(x) => x.name}
      rows={rows}
      columns={cols}
      onXout={() => navigate("/")}
    />
  );
}

export default VoterComparisonOptInOptOutTableView;