import { useNavigate } from "react-router";
import useKeyDown from "../../hooks/useKeyDown";
import WindowTitledDataGrid from "../WindowTitledDataGrid";
import { Stack } from "@mui/material";

// All data below is mock data
const columns = [
  {
    field: "category",
    headerName: "Category",
    width: 300,
  },
  {
    field: "repState",
    headerName: "Oklahoma",
    width: 250,
  },
  {
    field: "demState",
    headerName: "New York",
    width: 250,
  },
];

const rows = [
  {
    id: 1,
    category: "Total Voting-Age Population",
    repState: "22,350,000",
    demState: "15,750,000",
  },
  {
    id: 2,
    category: "Registered Voters",
    repState: "17,500,000",
    demState: "13,800,000",
  },
  {
    id: 3,
    category: "Registration Rate (VAP)",
    repState: "78.3%",
    demState: "87.6%",
  },
  {
    id: 4,
    category: "Ballots Cast",
    repState: "11,400,000",
    demState: "10,200,000",
  },
  {
    id: 5,
    category: "Turnout Rate (Registered Voters)",
    repState: "65.1%",
    demState: "73.9%",
  },
  {
    id: 6,
    category: "Turnout Rate (VAP)",
    repState: "51.0%",
    demState: "64.8%",
  },
  {
    id: 7,
    category: "Mail Ballots Submitted",
    repState: "1,950,000",
    demState: "3,650,000",
  },
  {
    id: 8,
    category: "Mail Ballot Submission Rate",
    repState: "17.1%",
    demState: "35.8%",
  },
  {
    id: 9,
    category: "Provisional Ballots Counted",
    repState: "45,000",
    demState: "72,000",
  },
  {
    id: 10,
    category: "Same-Day Registration Use",
    repState: "Not Permitted",
    demState: "Permitted",
  },
];

function PartyComparisonView() {
  const navigate = useNavigate();
  const maxWidth = 850; // pixels

  useKeyDown("Escape", () => navigate("/"));

  return (
    <Stack>
      <WindowTitledDataGrid
        title={"Democratic vs Republican Voter Registration Rates"}
        onXout={() => navigate("/")}
        width={maxWidth}
        maxWidth={maxWidth}
        rows={rows}
        columns={columns}
        pageSize={10}
        left={`calc(50vw - ${maxWidth / 2}px)`}
        top={"0"}
      />
    </Stack>
  );
}

export default PartyComparisonView;
