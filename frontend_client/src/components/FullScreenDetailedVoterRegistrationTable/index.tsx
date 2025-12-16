import type { GridSortModel } from "@mui/x-data-grid";

import WindowTitledDataGrid from "../WindowTitledDataGrid";
import StyledDataGrid from "../StyledDataGrid";

import { Box, Tabs, Tab } from "@mui/material";
import { useState } from "react";

import { getDetailedVoterRegistrationData, getDetailedVoterRegistrationDataCount } from "../../api/client";

import { VOTER_REGISTRATION_INFO_COLUMNS } from "../StateInformationView/dataColumns";

import { useParams, useNavigate } from "react-router";

interface FullScreenDetailedVoterRegistrationTableProperties {
  pageSize?: number;
  width: number;
  height: number;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function FullScreenDetailedVoterRegistrationTable({ pageSize, width, height }: FullScreenDetailedVoterRegistrationTableProperties) {
  const { fipsCode, countyCode } = useParams();
  const navigate = useNavigate();
  const [partyFilterId, setPartyFilterId] = useState(0);

  const rowDataProvider = {
    getPage: async (pageSize: number, page: number, sortModel: GridSortModel) =>
      await getDetailedVoterRegistrationData({
        state: fipsCode!,
        county: countyCode,
        pageSize: pageSize,
        pageIndex: page,
        party: partyFilterId,
        // Due to the way orval works, without more configuration
        // we have to break our abstractions and send an encoded string :/
        sort: JSON.stringify({ fields: sortModel || [] }),
      }),
    getTotalElements: async () =>
      await getDetailedVoterRegistrationDataCount({
        state: fipsCode!,
        county: countyCode,
        party: partyFilterId,
      }),
  };

  const customCssRules = {
    ".republican-cell": {
      color: "red",
      fontWeight: "bolder",
    },
    ".democrat-cell": {
      color: "blue",
      fontWeight: "bolder",
    },
  };

  return (
    <Box width={width} p={0} m={0} sx={{ background: "white", borderBottom: 1, borderColor: "divider" }}>
      <Tabs
        value={partyFilterId}
        onChange={function (_, x) {
          setPartyFilterId(x);
        }}
        textColor="secondary"
        indicatorColor="secondary"
        variant="fullWidth"
      >
        <Tab label={"All"} {...a11yProps(0)} />
        <Tab label={"Democrat"} {...a11yProps(1)} />
        <Tab label={"Republican"} {...a11yProps(2)} />
        <Tab label={"Unaffiliated"} {...a11yProps(4)} />
        <Tab label={"Affiliated"} {...a11yProps(3)} />
      </Tabs>
      {countyCode != null ? (
        <WindowTitledDataGrid
          title={"Voter Registration Data"}
          rows={rowDataProvider}
          columns={VOTER_REGISTRATION_INFO_COLUMNS}
          width={width}
          height={height}
          pageSize={pageSize}
          onXout={function () {
            navigate(`/state/${fipsCode!}/voter-registration`);
          }}
          getRowId={(r) => r.regionId + r.firstName + r.middleName + r.partyAffiliation + r.lastName + r.status}
          customCssRules={customCssRules}
        />
      ) : (
        <StyledDataGrid
          rows={rowDataProvider}
          columns={VOTER_REGISTRATION_INFO_COLUMNS}
          width={width}
          height={height}
          pageSize={pageSize}
          getRowId={(r) => r.regionId + r.firstName + r.middleName + r.partyAffiliation + r.lastName + r.status}
          customCssRules={customCssRules}
        />
      )}
    </Box>
  );
}

export default FullScreenDetailedVoterRegistrationTable;
