import { useNavigate } from 'react-router';
import useKeyDown from '../../hooks/useKeyDown';
import WindowTitledDataGrid from '../WindowTitledDataGrid';
import { Stack } from '@mui/material';

// All data below is mock data
const columns = [
  { 
    field: 'category', 
    headerName: 'Category', 
    width: 300 ,
  },
  {
    field: 'repState',
    headerName: 'Oklahoma',
    width: 250,
  },
  {
    field: 'demState',
    headerName: 'New York',
    width: 250,
  }
];

const rows = [
  {
    id: 1,
    category: "Total Ballots Cast",
    repState: "11,400,000",
    demState: "17,950,000",
  },
  {
    id: 2,
    category: "Early In-Person Ballots Cast",
    repState: "4,250,000 (37.3%)",
    demState: "2,850,000 (15.9%)",
  },
  {
    id: 3,
    category: "Mail Ballots Requested",
    repState: "2,050,000 (18.0%)",
    demState: "9,600,000 (53.5%)",
  },
  {
    id: 4,
    category: "Mail Ballots Returned & Counted",
    repState: "1,950,000 (17.1%)",
    demState: "8,900,000 (49.6%)",
  },
  {
    id: 5,
    category: "Drop Box Submissions",
    repState: "150,000 (1.3%)",
    demState: "2,300,000 (12.8%)",
  },
  {
    id: 6,
    category: "Election Day In-Person Voting",
    repState: "5,200,000 (45.6%)",
    demState: "6,200,000 (34.5%)",
  },
  {
    id: 7,
    category: "Total Early Voting",
    repState: "6,200,000 (54.4%)",
    demState: "11,750,000 (65.5%)",
  },
  {
    id: 8,
    category: "Rejected or Uncounted Mail Ballots",
    repState: "22,000 (0.19%)",
    demState: "48,000 (0.27%)",
  },
];

function EarlyVotingComparisonTableView() {
  const navigate = useNavigate();
  const maxWidth = 850; // pixels

  useKeyDown("Escape", () => navigate("/"));

  return (
    <Stack>
      <WindowTitledDataGrid
        title={"Democratic vs Republican Early Voting Rates"}
        onXout={() => navigate("/")}
        width={maxWidth}
        maxWidth={maxWidth}
        rows={rows}
        columns={columns}
        pageSize={10}
	left={`calc(50vw - ${maxWidth/2}px)`}
	top={'0'}
      />
    </Stack>
  );
}

export default EarlyVotingComparisonTableView;
