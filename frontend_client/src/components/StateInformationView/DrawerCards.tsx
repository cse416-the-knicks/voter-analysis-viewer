import { Chip, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { getEAVSDataQualityScore, getCVAPStatisticsData, getVoterRegistrationCounts } from "../../api/client";
import {
  type DetailStateType,
  DETAIL_STATE_TYPE_OPTIN,
  DETAIL_STATE_TYPE_OPTOUT,
  DETAIL_STATE_TYPE_DEMOCRAT,
  DETAIL_STATE_TYPE_REPUBLICAN,
  DETAIL_STATE_TYPE_VOTER_REGISTRATION,
  DETAIL_STATE_TYPE_PRECLEARANCE_STATE,
} from "../FullBoundedUSMap/detailedStatesInfo";

function BasicStateTypeInfoCard(title: string, text: string, fill?: boolean) {
  return (
    <Tooltip title={text}>
      <Chip color="secondary" variant={fill ? "filled" : "outlined"} label={title} />
    </Tooltip>
  );
}

function EAVsDataQualityInfoCard(title: string, text: string, fill?: boolean) {
  return (
    <Tooltip title={text}>
      <Chip color="info" variant={fill ? "filled" : "outlined"} label={title} />
    </Tooltip>
  );
}

const EAVsStateCard = (fill?: boolean) =>
  BasicStateTypeInfoCard("EAVS-Only State", "This is not a detail state, so information will be limited compared to select states.", fill);

const VoterRegistrationStateCard = (fill?: boolean) =>
  BasicStateTypeInfoCard(
    "Voter Registration State",
    "This is a selected detail state for voter registration data, you can also view voter records for this state.",
    fill
  );
const OptInStateCard = (fill?: boolean) => BasicStateTypeInfoCard("Opt-In Voting State", "This is a selected detail state for opt-in voting data.", fill);
const OptOutStateCard = (fill?: boolean) => BasicStateTypeInfoCard("Opt-Out Voting State", "This is a selected detail state for opt-out voting data.", fill);
const RepublicanStateCard = (fill?: boolean) =>
  BasicStateTypeInfoCard(
    "Republican Dominated State",
    "This is a selected detail state that is Republican dominated, you can compare this against our Democrat state.",
    fill
  );
const DemocratStateCard = (fill?: boolean) =>
  BasicStateTypeInfoCard(
    "Democrat Dominated State",
    "This is a selected detail state that is Democrat dominated, you can compare this against our Republican state.",
    fill
  );
const PreclearanceStateCard = (fill?: boolean) =>
  BasicStateTypeInfoCard(
    "Preclearance State",
    "This is a selected detail state that is subject to 'preclearance requirements' under the Voting Rights Act, due to historical voting discrimination.",
    fill
  );

interface StateInfoCardProperties {
  fipsCode: string;
  type: DetailStateType;
  fill?: boolean;
}

function StateInfoCard({ type, fill }: StateInfoCardProperties) {
  switch (type) {
    case DETAIL_STATE_TYPE_OPTIN:
      return OptInStateCard(fill);
    case DETAIL_STATE_TYPE_OPTOUT:
      return OptOutStateCard(fill);
    case DETAIL_STATE_TYPE_DEMOCRAT:
      return DemocratStateCard(fill);
    case DETAIL_STATE_TYPE_REPUBLICAN:
      return RepublicanStateCard(fill);
    case DETAIL_STATE_TYPE_VOTER_REGISTRATION:
      return VoterRegistrationStateCard(fill);
    case DETAIL_STATE_TYPE_PRECLEARANCE_STATE:
      return PreclearanceStateCard(fill);
  }
  return EAVsStateCard(fill);
}

function StateEAVsInfoCard({ fipsCode, fill }: StateInfoCardProperties) {
  const [score, setScore] = useState(0.0);

  useEffect(function () {
    (async function () {
      const score = await getEAVSDataQualityScore(fipsCode);
      setScore(score);
    })();
  });

  return EAVsDataQualityInfoCard(`EAVS Data Score: ${score.toPrecision(4)}`, "Measure of present EAVS 2024 data", fill);
}

function StateCVAPInfoCard({ fipsCode, type, fill }: StateInfoCardProperties) {
  const [cvapPercent, setCvapPercent] = useState(0.0);

  useEffect(function () {
    (async function () {
      const cvapData = await getCVAPStatisticsData(fipsCode, { aggregate: true });
      const voterStatistics = await getVoterRegistrationCounts(fipsCode, { aggregate: true });
      setCvapPercent(voterStatistics[0].active! / cvapData[0].cvapTotal!);
    })();
  });

  if (!(type === DETAIL_STATE_TYPE_REPUBLICAN || type === DETAIL_STATE_TYPE_DEMOCRAT)) {
    return <></>;
  }

  return EAVsDataQualityInfoCard(`Active CVAP: ${(cvapPercent * 100).toPrecision(4)}%`, "Ratio of active registered voters against 2023 ACS CVAP", fill);
}

export {
  BasicStateTypeInfoCard,
  EAVsDataQualityInfoCard,
  StateCVAPInfoCard,
  DemocratStateCard,
  RepublicanStateCard,
  OptInStateCard,
  OptOutStateCard,
  VoterRegistrationStateCard,
  PreclearanceStateCard,
  StateInfoCard,
  StateEAVsInfoCard,
};
