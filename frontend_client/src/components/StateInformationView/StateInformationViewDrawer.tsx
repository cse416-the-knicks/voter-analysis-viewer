import { type ReactNode } from "react";
import type { DetailStateType } from "../FullBoundedUSMap/detailedStatesInfo";

import { Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Stack } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useNavigate } from "react-router";
import { StateInfoCard, StateEAVsInfoCard, StateCVAPInfoCard } from "./DrawerCards";

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

function StateInformationViewDrawer({ fipsCode, sections, stateHook, onSelection, stateType, drawerWidth }: StateInformationViewDrawerProperties) {
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
