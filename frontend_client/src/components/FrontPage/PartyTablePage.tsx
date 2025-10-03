import React from "react";
import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

// Mock data from GPT
const columns = [
  { field: "Data", headerName: "Data", flex: 2 },
  { field: "Rep", headerName: "Oklahoma", flex: 3 },
  { field: "Dem", headerName: "New York", flex: 3 }
];

const rows = [
  {
    id: 1,
    Data: "Felony Voting Rights",
    Rep: "Restored after sentence served",
    Dem: "Restored upon release",
  },
  {
    id: 2,
    Data: "Mail Ballots (%)",
    Rep: "8",
    Dem: "28",
  },
  {
    id: 3,
    Data: "Drop Box Ballots (%)",
    Rep: "2",
    Dem: "14",
  },
  {
    id: 4,
    Data: "Voter Turnout",
    Rep: "60",
    Dem: "66",
  },
  {
    id: 5,
    Data: "ID Requirement",
    Rep: "Strict Photo ID Required",
    Dem: "No ID Required",
  },
  {
    id: 6,
    Data: "Same-Day Registration",
    Rep: "Not Available",
    Dem: "Available",
  },
  {
    id: 7,
    Data: "Early Voting Days",
    Rep: "10",
    Dem: "27",
  },
  {
    id: 8,
    Data: "Population",
    Rep: "29,145,000",
    Dem: "19,835,000",
  },
  {
    id: 9,
    Data: "Citizens of Voting Age Population",
    Rep: "21,000,000",
    Dem: "15,500,000",
  },
  {
    id: 10,
    Data: "Republican House Seats",
    Rep: "25",
    Dem: "8",
  },
  {
    id: 11,
    Data: "Democratic House Seats",
    Rep: "13",
    Dem: "18",
  },
];

function PartyTablePage() {
  return (
    <React.Fragment>
      <Typography variant="h3" gutterBottom>Republican vs Democratic States</Typography>
      <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
          pagination: {
        paginationModel: {
        pageSize: 7,
        page: 1
        },
          },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
      />
  </React.Fragment>
  );
}

export default PartyTablePage;