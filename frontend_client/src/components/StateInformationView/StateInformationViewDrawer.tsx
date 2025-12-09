import { useEffect, useState, type ReactNode } from "react";
import type { DetailStateType } from "../FullBoundedUSMap/detailedStatesInfo";
import {
  DETAIL_STATE_TYPE_OPTIN,
  DETAIL_STATE_TYPE_OPTOUT,
  DETAIL_STATE_TYPE_DEMOCRAT,
  DETAIL_STATE_TYPE_REPUBLICAN,
  DETAIL_STATE_TYPE_VOTER_REGISTRATION,
  DETAIL_STATE_TYPE_PRECLEARANCE_STATE,
} from "../FullBoundedUSMap/detailedStatesInfo";

import { Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Chip, Stack } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useNavigate } from "react-router";
import { getCVAPStatisticsData, getVoterRegistrationCounts } from "../../api/client";

interface StateInformationViewDrawerItem {
  id: number;
  iconComponent?: ReactNode;
  textContent: string;
  requiresStateType?: DetailStateType[];
}

interface StateInformationViewDrawerSection {
  title: string;
  iconComponent?: ReactNode;
  items: StateInformationViewDrawerItem[];
}

type OnSelectionFn = (id: number) => void;
interface StateInformationViewDrawerProperties {
  stateHook: [number, (arg0: number) => void];
  fipsCode: string;
  onSelection: OnSelectionFn;
  sections: StateInformationViewDrawerSection[];
  stateType: DetailStateType[];
  topMargin: string | number;
  drawerWidth: string | number;
}

interface StateInformationViewDrawerListItemProperties {
  stateHook: [number, (arg0: number) => void];
  onSelection: OnSelectionFn;
  stateType: DetailStateType[];
  item: StateInformationViewDrawerItem;
}

function BasicStateTypeInfoCard(title: string, text: string) {
  return (
    <Tooltip title={text}>
      <Chip color="secondary" variant="outlined" label={title} />
    </Tooltip>
  );
}

function EAVsDataQualityInfoCard(title: string, text: string) {
  return (
    <Tooltip title={text}>
      <Chip color="info" variant="outlined" label={title} />
    </Tooltip>
  );
}

const EAVsStateCard = () => BasicStateTypeInfoCard("EAVS-Only State", "This is not a detail state, so information will be limited compared to select states.");

function qualityScore(value: number) {
  return (value / (value + 14)).toPrecision(2);
}

const EAVSQualityCard = (qualityValue: number) => {
  return EAVsDataQualityInfoCard(`EAVS Data Measure: ${qualityScore(qualityValue)}`, "EAVs data quality score");
};

const VoterRegistrationStateCard = () =>
  BasicStateTypeInfoCard(
    "Voter Registration State",
    "This is a selected detail state for voter registration data, you can also view voter records for this state."
  );
const OptInStateCard = () => BasicStateTypeInfoCard("Opt-In Voting State", "This is a selected detail state for opt-in voting data.");
const OptOutStateCard = () => BasicStateTypeInfoCard("Opt-Out Voting State", "This is a selected detail state for opt-out voting data.");
const RepublicanStateCard = () =>
  BasicStateTypeInfoCard(
    "Republican Dominated State",
    "This is a selected detail state that is Republican dominated, you can compare this against our Democrat state."
  );
const DemocratStateCard = () =>
  BasicStateTypeInfoCard(
    "Democrat Dominated State",
    "This is a selected detail state that is Democrat dominated, you can compare this against our Republican state."
  );
const PreclearanceStateCard = () =>
  BasicStateTypeInfoCard(
    "Preclearance State",
    "This is a selected detail state that is subject to 'preclearance requirements' under the Voting Rights Act, due to historical voting discrimination."
  );

interface StateInfoCardProperties {
  fipsCode: string;
  type: DetailStateType;
}

function StateInfoCard({ type }: StateInfoCardProperties) {
  switch (type) {
    case DETAIL_STATE_TYPE_OPTIN:
      return OptInStateCard();
    case DETAIL_STATE_TYPE_OPTOUT:
      return OptOutStateCard();
    case DETAIL_STATE_TYPE_DEMOCRAT:
      return DemocratStateCard();
    case DETAIL_STATE_TYPE_REPUBLICAN:
      return RepublicanStateCard();
    case DETAIL_STATE_TYPE_VOTER_REGISTRATION:
      return VoterRegistrationStateCard();
    case DETAIL_STATE_TYPE_PRECLEARANCE_STATE:
      return PreclearanceStateCard();
  }
  return EAVsStateCard();
}

function StateEAVsInfoCard({ type }: StateInfoCardProperties) {
  return EAVSQualityCard(type.length);
}

function StateCVAPInfoCard({ fipsCode, type }: StateInfoCardProperties) {
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

  return EAVsDataQualityInfoCard(`Active CVAP: ${(cvapPercent * 100).toPrecision(4)}%`, "Ratio of active registered voters against 2023 ACS CVAP");
}

function StateInformationViewDrawerListItem({ item, stateType, onSelection, stateHook }: StateInformationViewDrawerListItemProperties) {
  const [stateValue, setStateValue] = stateHook;

  if (item.requiresStateType) {
    if (!item.requiresStateType.some((x) => stateType.some((y) => x === y))) {
      return <></>;
    }
  }

  return (
    <ListItem>
      <Tooltip title={"View " + item.textContent} placement="right" arrow>
        <ListItemButton
          key={item.id}
          onClick={() => {
            setStateValue(item.id);
            onSelection(item.id);
          }}
          selected={stateValue == item.id}
        >
          {item.iconComponent && <ListItemIcon>{item.iconComponent}</ListItemIcon>}
          <ListItemText primary={item.textContent} />
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
}

function dropdownHasAnyItems(section: StateInformationViewDrawerSection, stateType: DetailStateType[]) {
  return section.items.some((v) => (v.requiresStateType ? v.requiresStateType.some((x) => stateType.some((y) => y === x)) : true));
}

function StateInformationViewDrawer({ fipsCode, sections, stateHook, onSelection, stateType, topMargin, drawerWidth }: StateInformationViewDrawerProperties) {
  const navigate = useNavigate();
  const sectionComponents = sections.map((section) =>
    dropdownHasAnyItems(section, stateType) ? (
      <>
        <ListItem>
          {section.iconComponent && <ListItemIcon>{section.iconComponent}</ListItemIcon>}
          <ListItemText primary={section.title} />
        </ListItem>
        {section.items.map((item) => (
          <StateInformationViewDrawerListItem stateType={stateType} onSelection={onSelection} stateHook={stateHook} item={item} />
        ))}
      </>
    ) : (
      <></>
    )
  );

  const finalComponentsWithDividers = [];
  for (let i = 0; i < sectionComponents.length; ++i) {
    finalComponentsWithDividers.push(sectionComponents[i]);
    if (i + 1 >= sectionComponents.length) {
      continue;
    } else {
      finalComponentsWithDividers.push(<Divider />);
    }
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          marginTop: "topMargin",
        },
      }}
    >
      <Stack spacing={0.5} sx={{ p: 1 }}>
        {stateType.map((x) => (
          <StateInfoCard fipsCode={fipsCode} type={x} />
        ))}
        <StateEAVsInfoCard fipsCode={fipsCode} type={stateType[0]} />
        {/* conditional rendering logic, means it will only show up exactly once for the party states. */}
        {stateType.map((x) => (
          <StateCVAPInfoCard fipsCode={fipsCode} type={x} />
        ))}
      </Stack>
      <Divider />
      <List disablePadding dense>
        {finalComponentsWithDividers}
      </List>
      <Divider />
      <Button sx={{ mt: 2, ml: 2, mr: 2, p: 1.5 }} onClick={() => navigate("/")} variant="contained" color="secondary">
        <HighlightOffIcon /> Exit State Display
      </Button>
    </Drawer>
  );
}

export type {
  StateInformationViewDrawerItem,
  StateInformationViewDrawerSection,
  StateInformationViewDrawerProperties,
  StateInformationViewDrawerListItemProperties,
};

export { StateInformationViewDrawer };
