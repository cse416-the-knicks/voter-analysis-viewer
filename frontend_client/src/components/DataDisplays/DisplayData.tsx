// Mock data for displays
export interface DisplayData {
    state: string;
    population: number;
    mailin: number;
}

export const mockData: DisplayData[] = [
  {state: "NY", population: 239, mailin: 223}, 
  {state: "TX", population: 121, mailin: 546}, 
  {state: "MN", population: 283, mailin: 879}, 
  {state: "WV", population: 191, mailin: 735}, 
  {state: "OR", population: 132, mailin: 934}
];
