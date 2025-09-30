// Mock data for displays
export interface DisplayData {
    state: string;
    population: number;
    mailin: number;
}

export const provisionalCategories: Record<string, string> = {
    E2a: "Voter Not on List",
    E2b: "Voter Lacked ID",
    E2c: "Challenged Eligibility",
    E2d: "Challenged Eligibility",
    E2e: "Not Resident",
    E2f: "Registration Not Updated",
    E2g: "Did Not Surrender Mail Ballot",
    E2h: "Judge Extended Voting Hours",
    E2i: "Voter Used SDR",
    Other: "Other"
};


export const mockData: DisplayData[] = [
  {state: "NY", population: 239, mailin: 223}, 
  {state: "TX", population: 121, mailin: 546}, 
  {state: "MN", population: 283, mailin: 879}, 
  {state: "WV", population: 191, mailin: 735}, 
  {state: "OR", population: 132, mailin: 934}
];


export const provisionalBallotData = {
  "DETAIL_STATE_TYPE_OPTOUT": {
    stateName: "Georgia",
    XTitle: "Ballots Cast",
    Title: "Provisional Ballots",
    data: [
      {category: "E2a", value: 1200},
      {category: "E2b", value: 950},
      {category: "E2c", value: 500},
      {category: "E2d", value: 200},
      {category: "E2e", value: 400},
      {category: "E2f", value: 800},
      {category: "E2g", value: 350},
      {category: "E2h", value: 150},
      {category: "E2i", value: 250},
      {category: "Other", value: 125}
    ],
  },
  "DETAIL_STATE_TYPE_OPTIN": {
    stateName: "Texas",
    XTitle: "Ballots Cast",
    Title: "Provisional Ballots",
    data: [
      {category: "E2a", value: 1800},
      {category: "E2b", value: 850},
      {category: "E2c", value: 700},
      {category: "E2d", value: 300},
      {category: "E2e", value: 300},
      {category: "E2f", value: 500},
      {category: "E2g", value: 650},
      {category: "E2h", value: 350},
      {category: "E2i", value: 550},
      {category: "Other", value: 250}
    ],
  },
  "DETAIL_STATE_TYPE_DEMOCRAT": {
    stateName: "New York",
    XTitle: "Ballots Cast",
    Title: "Provisional Ballots",
    data: [
      {category: "E2a", value: 1300},
      {category: "E2b", value: 750},
      {category: "E2c", value: 550},
      {category: "E2d", value: 345},
      {category: "E2e", value: 450},
      {category: "E2f", value: 675},
      {category: "E2g", value: 120},
      {category: "E2h", value: 760},
      {category: "E2i", value: 750},
      {category: "Other", value: 375}
    ],
  },
  "DETAIL_STATE_TYPE_REPUBLICAN": {
    stateName: "Oklahoma",
    XTitle: "Ballots Cast",
    Title: "Provisional Ballots",
    data: [
      {category: "E2a", value: 1100},
      {category: "E2b", value: 980},
      {category: "E2c", value: 560},
      {category: "E2d", value: 250},
      {category: "E2e", value: 470},
      {category: "E2f", value: 890},
      {category: "E2g", value: 550},
      {category: "E2h", value: 850},
      {category: "E2i", value: 950},
      {category: "Other", value: 500}
    ],
  },
  "DETAIL_STATE_TYPE_VOTER_REGISTRATION": {
    stateName: "Indiana",
    XTitle: "Ballots Cast",
    Title: "Provisional Ballots",
    data: [
      {category: "E2a", value: 1400},
      {category: "E2b", value: 635},
      {category: "E2c", value: 345},
      {category: "E2d", value: 675},
      {category: "E2e", value: 560},
      {category: "E2f", value: 235},
      {category: "E2g", value: 450},
      {category: "E2h", value: 645},
      {category: "E2i", value: 765},
      {category: "Other", value: 625}
    ],
  },
  "DETAIL_STATE_TYPE_NONE": {
    stateName: "Other",
    XTitle: "Ballots Cast",
    Title: "Provisional Ballots",
    data: [
      {category: "E2a", value: 1250},
      {category: "E2b", value: 450},
      {category: "E2c", value: 325},
      {category: "E2d", value: 685},
      {category: "E2e", value: 345},
      {category: "E2f", value: 725},
      {category: "E2g", value: 965},
      {category: "E2h", value: 650},
      {category: "E2i", value: 395},
      {category: "Other", value: 750}
    ],
  },
};


export const activeVoterData = {
  "DETAIL_STATE_TYPE_OPTOUT": {
    stateName: "Georgia",
    XTitle: "Voter Count",
    Title: "Active Voter Data",
    data: [
      { category: "Active Voters", value: 4200000 },
      { category: "Inactive Voters", value: 350000 },
      { category: "Total Voters", value: 4550000 },
    ],
  },
  "DETAIL_STATE_TYPE_OPTIN": {
    stateName: "Texas",
    XTitle: "Voter Count",
    Title: "Active Voter Data",
    data: [
      { category: "Active Voters", value: 11200000 },
      { category: "Inactive Voters", value: 950000 },
      { category: "Total Voters", value: 12150000 },
    ],
  },
  "DETAIL_STATE_TYPE_DEMOCRAT": {
    stateName: "New York",
    XTitle: "Voter Count",
    Title: "Active Voter Data",
    data: [
      { category: "Active Voters", value: 6200000 },
      { category: "Inactive Voters", value: 540000 },
      { category: "Total Voters", value: 6740000 },
    ],
  },
  "DETAIL_STATE_TYPE_REPUBLICAN": {
    stateName: "Oklahoma",
    XTitle: "Voter Count",
    Title: "Active Voter Data",
    data: [
      { category: "Active Voters", value: 1850000 },
      { category: "Inactive Voters", value: 210000 },
      { category: "Total Voters", value: 2060000 },
    ],
  },
  "DETAIL_STATE_TYPE_VOTER_REGISTRATION": {
    stateName: "Indiana",
    XTitle: "Voter Count",
    Title: "Active Voter Data",
    data: [
      { category: "Active Voters", value: 3100000 },
      { category: "Inactive Voters", value: 280000 },
      { category: "Total Voters", value: 3380000 },
    ],
  },
  "DETAIL_STATE_TYPE_NONE": {
    stateName: "Other",
    XTitle: "Voter Count",
    Title: "Active Voter Data",
    data: [
      { category: "Active Voters", value: 2400000 },
      { category: "Inactive Voters", value: 300000 },
      { category: "Total Voters", value: 2700000 },
    ],
  },
};

export const pollbookDeletionData = {
  "DETAIL_STATE_TYPE_OPTOUT": {
    stateName: "Georgia",
    XTitle: "Pollbooks",
    Title: "Pollbook Deletions",
    data: [
      { category: "Deleted Pollbooks", value: 850 },
      { category: "Remaining Pollbooks", value: 9150 },
      { category: "Total Pollbooks", value: 10000 },
    ],
  },
  "DETAIL_STATE_TYPE_OPTIN": {
    stateName: "Texas",
    XTitle: "Pollbooks",
    Title: "Pollbook Deletions",
    data: [
      { category: "Deleted Pollbooks", value: 1250 },
      { category: "Remaining Pollbooks", value: 10750 },
      { category: "Total Pollbooks", value: 12000 },
    ],
  },
  "DETAIL_STATE_TYPE_DEMOCRAT": {
    stateName: "New York",
    XTitle: "Pollbooks",
    Title: "Pollbook Deletions",
    data: [
      { category: "Deleted Pollbooks", value: 950 },
      { category: "Remaining Pollbooks", value: 8050 },
      { category: "Total Pollbooks", value: 9000 },
    ],
  },
  "DETAIL_STATE_TYPE_REPUBLICAN": {
    stateName: "Oklahoma",
    XTitle: "Pollbooks",
    Title: "Pollbook Deletions",
    data: [
      { category: "Deleted Pollbooks", value: 720 },
      { category: "Remaining Pollbooks", value: 5280 },
      { category: "Total Pollbooks", value: 6000 },
    ],
  },
  "DETAIL_STATE_TYPE_VOTER_REGISTRATION": {
    stateName: "Indiana",
    XTitle: "Pollbooks",
    Title: "Pollbook Deletions",
    data: [
      { category: "Deleted Pollbooks", value: 640 },
      { category: "Remaining Pollbooks", value: 4360 },
      { category: "Total Pollbooks", value: 5000 },
    ],
  },
  "DETAIL_STATE_TYPE_NONE": {
    stateName: "Other",
    XTitle: "Pollbooks",
    Title: "Pollbook Deletions",
    data: [
      { category: "Deleted Pollbooks", value: 580 },
      { category: "Remaining Pollbooks", value: 4420 },
      { category: "Total Pollbooks", value: 5000 },
    ],
  },
};
export const mailBallotRejectionData = {
  "DETAIL_STATE_TYPE_OPTOUT": {
    stateName: "Georgia",
    XTitle: "Ballots",
    Title: "Mail Ballot Rejections",
    data: [
      { category: "Rejected Ballots", value: 3200 },
      { category: "Accepted Ballots", value: 97200 },
      { category: "Total Ballots", value: 100400 },
    ],
  },
  "DETAIL_STATE_TYPE_OPTIN": {
    stateName: "Texas",
    XTitle: "Ballots",
    Title: "Mail Ballot Rejections",
    data: [
      { category: "Rejected Ballots", value: 5400 },
      { category: "Accepted Ballots", value: 114600 },
      { category: "Total Ballots", value: 120000 },
    ],
  },
  "DETAIL_STATE_TYPE_DEMOCRAT": {
    stateName: "New York",
    XTitle: "Ballots",
    Title: "Mail Ballot Rejections",
    data: [
      { category: "Rejected Ballots", value: 2800 },
      { category: "Accepted Ballots", value: 87200 },
      { category: "Total Ballots", value: 90000 },
    ],
  },
  "DETAIL_STATE_TYPE_REPUBLICAN": {
    stateName: "Oklahoma",
    XTitle: "Ballots",
    Title: "Mail Ballot Rejections",
    data: [
      { category: "Rejected Ballots", value: 950 },
      { category: "Accepted Ballots", value: 5050 },
      { category: "Total Ballots", value: 6000 },
    ],
  },
  "DETAIL_STATE_TYPE_VOTER_REGISTRATION": {
    stateName: "Indiana",
    XTitle: "Ballots",
    Title: "Mail Ballot Rejections",
    data: [
      { category: "Rejected Ballots", value: 1200 },
      { category: "Accepted Ballots", value: 3800 },
      { category: "Total Ballots", value: 5000 },
    ],
  },
  "DETAIL_STATE_TYPE_NONE": {
    stateName: "Other",
    XTitle: "Ballots",
    Title: "Mail Ballot Rejections",
    data: [
      { category: "Rejected Ballots", value: 1100 },
      { category: "Accepted Ballots", value: 3900 },
      { category: "Total Ballots", value: 5000 },
    ],
  },
};
