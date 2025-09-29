// Mock data for displays
export interface DisplayData {
    state: string;
    population: number;
    mailin: number;
}

export const mockData: DisplayData[] = [
  {state: "NY", population: 239, mailin: 123}, 
  {state: "TX", population: 121, mailin: 346}, 
  {state: "MN", population: 283, mailin: 679}, 
  {state: "WV", population: 191, mailin: 235}, 
  {state: "OR", population: 132, mailin: 234}
];
