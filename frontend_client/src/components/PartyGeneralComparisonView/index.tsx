import type { ViewStateYearSummaryModel, StateInformationModel, } from "../../api/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useKeyDown from "../../hooks/useKeyDown";

import { getStateInformationTableForState, getViewStateYearSummaryByStateForYear, StateInformationModelFelonyDisenfranchisement, StateInformationModelRegistrationMethod,  } from "../../api/client";

import WindowTitledDataGrid from "../WindowTitledDataGrid";
import { comparisonRow } from "../../helpers/comparisonRow";

type PartyStateData = (ViewStateYearSummaryModel | StateInformationModel);

function felonyDisenfranchisementReadableString(x: StateInformationModelFelonyDisenfranchisement) {
  switch (x) {
    case StateInformationModelFelonyDisenfranchisement.UNKNOWN: return "Unknown";
    case StateInformationModelFelonyDisenfranchisement.NO_DENIAL_OF_VOTING: return "No Disenfranchisement";
    case StateInformationModelFelonyDisenfranchisement.RESTORATION_UPON_RELEASE_FROM_PRISON: return "Voting Restoration Upon Release";
    case StateInformationModelFelonyDisenfranchisement.RESTORATION_AFTER_PAROLE_AND_PROBATION: return "Voting Restoration After Parole & Probation";
    case StateInformationModelFelonyDisenfranchisement.ADDITIONAL_ACTION_FOR_RESTORATION: return "Voting Restoration After Addition Action";
  }
  return "Unknown";
}

function registrationMethodReadableString(x: StateInformationModelRegistrationMethod) {
  switch (x) {
    case StateInformationModelRegistrationMethod.NONE: return 'None';
    case StateInformationModelRegistrationMethod.OPT_IN: return 'Opt-In';
    case StateInformationModelRegistrationMethod.OPT_OUT: return 'Opt-Out';
  }
  return "Unknown";
}

function PartyGeneralComparisonView() {
  const navigate = useNavigate();
  const [rows, setDataRows] = useState<PartyStateData[]>([]);
  const [cols, setColumnRows] = useState<any>([]);
  const maxWidth = 950;

  useKeyDown("Escape", () => navigate("/"));
  useEffect(function () {
    (async function () {
      const stateSummary = await Promise.all(["36", "40"].map((fips) => getViewStateYearSummaryByStateForYear(fips, 2024)));
      const stateInfo = await Promise.all(["36", "40"].map((fips) => getStateInformationTableForState(fips)));

      setColumnRows([
        {
          field: "metricName",
          headerName: "Metric",
          type: "string",
          width: 200,
        },
        {
          field: "a",
          headerName: stateSummary[0].stateName,
          type: "number",
          width: 360,
        },
        {
          field: "b",
          headerName: stateSummary[1].stateName,
          type: "number",
          width: 360,
        },
      ]);
      const transposedRows = [];
      transposedRows.push(
        comparisonRow("Type", "Democrat", "Republican"),
        comparisonRow("Felony Disenfranchisement", ...stateInfo.map((x) => felonyDisenfranchisementReadableString(x.felonyDisenfranchisement))),
        comparisonRow("Registration Method", ...stateInfo.map((x) => registrationMethodReadableString(x.registrationMethod))),
        comparisonRow("Total Population", ...stateInfo.map((x) => x.populationTotal)),
        comparisonRow("Voting Age Population", ...stateInfo.map((x) => x.cvapTotal)),
        comparisonRow("Total Registered", ...stateSummary.map((x) => x.totalRegistered)),
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
      title={"General Comparisons"}
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

export default PartyGeneralComparisonView;
