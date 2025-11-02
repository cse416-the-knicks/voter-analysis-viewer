import WindowTitledDataGrid from "../WindowTitledDataGrid";
import StyledDataGrid from "../StyledDataGrid";

import { Box, useTheme, Tabs, Tab } from "@mui/material";
import { useState, useEffect } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import type { VoterRegistrationDataModel } from "../../api/client";

import { getDetailedVoterRegistrationData, getDetailedVoterRegistrationDataCount } from "../../api/client";

import { VOTER_REGISTRATION_INFO_COLUMNS } from "../StateInformationView/dataColumns";

import { useParams, useNavigate } from "react-router";

interface FullScreenDetailedVoterRegistrationTableProperties {
  pageSize: number;
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
  const theme = useTheme();
  const [partyFilterId, setPartyFilterId] = useState(0);

  if (countyCode != null) {
    // Having a county code means it was triggered from
    // the choropleth, so we need a way to X-out.
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
          <Tab label={"Unaffiliated"} {...a11yProps(3)} />
        </Tabs>
        <WindowTitledDataGrid
          title={"Voter Registration Data"}
          rows={{
            getPage: async (pageSize, page) =>
              await getDetailedVoterRegistrationData({
                state: fipsCode!,
                county: countyCode,
                pageSize: pageSize,
                pageIndex: page,
              }),
            getTotalElements: async () =>
              await getDetailedVoterRegistrationDataCount({
                state: fipsCode!,
                county: countyCode,
              }),
          }}
          columns={VOTER_REGISTRATION_INFO_COLUMNS}
          width={width}
          height={height}
          pageSize={pageSize}
          onXout={function () {
            navigate(`/state/${fipsCode!}/`);
          }}
          getRowId={(r) => r.regionId + r.firstName + r.middleName + r.partyAffiliation + r.lastName + r.status}
          customCssRules={{
            ".republican-cell": {
              color: "red",
              fontWeight: "bolder",
            },
            ".democrat-cell": {
              color: "blue",
              fontWeight: "bolder",
            },
          }}
        />
      </Box>
    );
  } else {
    return (
      <StyledDataGrid
        rows={{
          getPage: async (pageSize, page) =>
            await getDetailedVoterRegistrationData({
              state: fipsCode!,
              county: countyCode,
              pageSize: pageSize,
              pageIndex: page,
            }),
          getTotalElements: async () =>
            await getDetailedVoterRegistrationDataCount({
              state: fipsCode!,
              county: countyCode,
            }),
        }}
        columns={VOTER_REGISTRATION_INFO_COLUMNS}
        width={width}
        height={height}
        pageSize={pageSize}
        getRowId={(r) => r.regionId + r.firstName + r.middleName + r.partyAffiliation + r.lastName + r.status}
        customCssRules={{
          ".republican-cell": {
            color: "red",
            fontWeight: "bolder",
          },
          ".democrat-cell": {
            color: "blue",
            fontWeight: "bolder",
          },
        }}
      />
    );
  }
}

export default FullScreenDetailedVoterRegistrationTable;
