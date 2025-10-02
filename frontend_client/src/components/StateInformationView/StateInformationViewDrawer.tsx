import type { ReactNode } from 'react'
import type { DetailStateType } from '../FullBoundedUSMap/detailedStatesInfo';
import {
  DETAIL_STATE_TYPE_OPTIN,
  DETAIL_STATE_TYPE_OPTOUT,
  DETAIL_STATE_TYPE_DEMOCRAT,
  DETAIL_STATE_TYPE_REPUBLICAN,
  DETAIL_STATE_TYPE_VOTER_REGISTRATION,
} from '../FullBoundedUSMap/detailedStatesInfo';

import {
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Typography
} from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useNavigate } from 'react-router';

interface StateInformationViewDrawerItem {
  id: number;
  iconComponent?: ReactNode;
  textContent: string;
};

interface StateInformationViewDrawerSection {
  title: string;
  iconComponent?: ReactNode;
  items: StateInformationViewDrawerItem[];
};

interface StateInformationViewDrawerProperties {
  stateHook: [number, (arg0: number) => void];
  sections: StateInformationViewDrawerSection[];
  stateType: DetailStateType;
};

interface StateInformationViewDrawerListItemProperties {
  stateHook: [number, (arg0: number) => void];
  item: StateInformationViewDrawerItem;
};

function BasicStateTypeInfoCard(
  title: string,
  text: string) {
  return (
    <Card sx={{m: 2}} variant="outlined">
      <CardContent>
	<Typography variant="h6" component="div">
	  {title}
	</Typography>
	<Typography sx={{ color: 'text.secondary', m:0, fontSize: 12 }}>
	  {text}
	</Typography>
      </CardContent>
    </Card>
  );
}

const EAVsStateCard = () => BasicStateTypeInfoCard(
  "EAVS-Only State",
  "This is not a detail state, so information will be limited compared to select states.");
const VoterRegistrationStateCard = () => BasicStateTypeInfoCard(
  "Voter Registration State",
  "This is a selected detail state for voter registration data, you can also view voter records for this state.");
const OptInStateCard = () => BasicStateTypeInfoCard(
  "Opt-In Voting State",
  "This is a selected detail state for opt-in voting data.");
const OptOutStateCard = () => BasicStateTypeInfoCard(
  "Opt-Out Voting State",
  "This is a selected detail state for opt-out voting data.");
const RepublicanStateCard = () => BasicStateTypeInfoCard(
  "Republican Dominated State",
  "This is a selected detail state that is Republican dominated, you can compare this against our Democrat state.");
const DemocratStateCard = () => BasicStateTypeInfoCard(
  "Democrat Dominated State",
  "This is a selected detail state that is Democrat dominated, you can compare this against our Republican state.");

interface StateInfoCardProperties {
  type: DetailStateType;
};

function StateInfoCard({ type }: StateInfoCardProperties) {
  switch (type) {
    case DETAIL_STATE_TYPE_OPTIN: {
      return OptInStateCard();
    } break;
    case DETAIL_STATE_TYPE_OPTOUT: {
      return OptOutStateCard();
    } break;
    case DETAIL_STATE_TYPE_DEMOCRAT: {
      return DemocratStateCard();
    } break;
    case DETAIL_STATE_TYPE_REPUBLICAN: {
      return RepublicanStateCard();
    } break;
    case DETAIL_STATE_TYPE_VOTER_REGISTRATION: {
      return VoterRegistrationStateCard();
    } break;
  }
  return EAVsStateCard();
}

function StateInformationViewDrawerListItem(
  {
    item,
    stateHook,
  }: StateInformationViewDrawerListItemProperties) {
  const [stateValue, setStateValue] = stateHook;

  return (
    <ListItem>
	<ListItemButton
	  key={item.id}
	  onClick={() => setStateValue(item.id)}
	  selected={stateValue == item.id}>
	    {((item.iconComponent) && <ListItemIcon>{item.iconComponent}</ListItemIcon>)}
	    <ListItemText primary={item.textContent}/>
	</ListItemButton>
    </ListItem>
  );
}

function StateInformationViewDrawer(
  {
    sections,
    stateHook,
    stateType, 
  }: StateInformationViewDrawerProperties) {
  const navigate = useNavigate();
  const sectionComponents = sections.map(
    (section) => (
      <>
	<ListItem>
	    {((section.iconComponent) && <ListItemIcon>{section.iconComponent}</ListItemIcon>)}
	    <ListItemText primary={section.title}/>
	</ListItem>
	{
	  section.items.map(item => <StateInformationViewDrawerListItem stateHook={stateHook} item={item}/>)
	}
      </>
    )
  );

  const finalComponentsWithDividers = [];
  for (let i = 0; i < sectionComponents.length; ++i) {
    finalComponentsWithDividers.push(sectionComponents[i]);
    if (i+1 >= sectionComponents.length) {
      continue;
    } else {
      finalComponentsWithDividers.push(<Divider/>);
    }
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
	'& .MuiDrawer-paper': {
	  width: '14em',
	  height: 'auto',
	  margin: 2,
	},
      }}
    >
    <StateInfoCard type={stateType}/>
    <List dense>
      {finalComponentsWithDividers}
    </List>
    <Button onClick={() => navigate("/")} variant='contained' color='secondary'>
      <HighlightOffIcon/> Exit State Display
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

export {
    StateInformationViewDrawer
};
