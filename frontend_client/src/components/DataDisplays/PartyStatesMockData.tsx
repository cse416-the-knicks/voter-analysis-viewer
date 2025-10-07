import type { BubbleChartDataPoint, RegressionDataLine } from "./BubbleChart";

export const dropBoxData: BubbleChartDataPoint[] = [
  { name: "Oklahoma County", xValue: 63, yValue: 6.8, size: 8, party: "Rep" },
  { name: "Tulsa County", xValue: 65, yValue: 4.2, size: 7, party: "Rep" },
  { name: "Cleveland County", xValue: 59, yValue: 5.9, size: 6, party: "Rep" },
  { name: "Canadian County", xValue: 73, yValue: 3.4, size: 5, party: "Rep" },
  { name: "Payne County", xValue: 61, yValue: 7.3, size: 6, party: "Rep" },
  { name: "Comanche County", xValue: 68, yValue: 4.6, size: 6, party: "Rep" },
  { name: "Pottawatomie County", xValue: 76, yValue: 2.2, size: 4, party: "Rep" },
  { name: "Grady County", xValue: 71, yValue: 3.1, size: 5, party: "Rep" },
  { name: "Muskogee County", xValue: 64, yValue: 5.4, size: 5, party: "Rep" },
  { name: "Garfield County", xValue: 67, yValue: 3.7, size: 4, party: "Rep" },
  { name: "Kings County", xValue: 21, yValue: 17.6, size: 10, party: "Dem" },
  { name: "Queens County", xValue: 29, yValue: 14.9, size: 9, party: "Dem" },
  { name: "New York County", xValue: 18, yValue: 19.2, size: 10, party: "Dem" },
  { name: "Bronx County", xValue: 13, yValue: 18.5, size: 9, party: "Dem" },
  { name: "Richmond County", xValue: 39, yValue: 12.1, size: 8, party: "Dem" },
  { name: "Westchester County", xValue: 34, yValue: 13.9, size: 8, party: "Dem" },
  { name: "Nassau County", xValue: 43, yValue: 9.7, size: 8, party: "Dem" },
  { name: "Suffolk County", xValue: 46, yValue: 10.6, size: 8, party: "Dem" },
  { name: "Erie County", xValue: 37, yValue: 11.5, size: 7, party: "Dem" },
  { name: "Monroe County", xValue: 35, yValue: 10.9, size: 7, party: "Dem" },
];

export const equipmentQualityData: BubbleChartDataPoint[] = [
  { name: "Oklahoma County", xValue: 8.3, yValue: 0.9, size: 8, party: "Rep" },
  { name: "Tulsa County", xValue: 9.0, yValue: 0.7, size: 7, party: "Rep" },
  { name: "Cleveland County", xValue: 7.8, yValue: 1.2, size: 7, party: "Rep" },
  { name: "Canadian County", xValue: 9.4, yValue: 0.5, size: 6, party: "Rep" },
  { name: "Payne County", xValue: 7.4, yValue: 1.3, size: 6, party: "Rep" },
  { name: "Comanche County", xValue: 8.5, yValue: 0.8, size: 6, party: "Rep" },
  { name: "Pottawatomie County", xValue: 8.9, yValue: 0.6, size: 5, party: "Rep" },
  { name: "Grady County", xValue: 8.1, yValue: 1.0, size: 5, party: "Rep" },
  { name: "Muskogee County", xValue: 7.2, yValue: 1.4, size: 6, party: "Rep" },
  { name: "Garfield County", xValue: 8.7, yValue: 0.7, size: 5, party: "Rep" },
  { name: "Kings County", xValue: 9.4, yValue: 0.5, size: 9, party: "Dem" },
  { name: "Queens County", xValue: 9.7, yValue: 0.4, size: 9, party: "Dem" },
  { name: "New York County", xValue: 9.9, yValue: 0.3, size: 10, party: "Dem" },
  { name: "Bronx County", xValue: 8.9, yValue: 0.6, size: 9, party: "Dem" },
  { name: "Richmond County", xValue: 8.5, yValue: 0.9, size: 8, party: "Dem" },
  { name: "Westchester County", xValue: 9.1, yValue: 0.5, size: 9, party: "Dem" },
  { name: "Nassau County", xValue: 9.0, yValue: 0.7, size: 8, party: "Dem" },
  { name: "Suffolk County", xValue: 8.7, yValue: 0.8, size: 8, party: "Dem" },
  { name: "Erie County", xValue: 8.3, yValue: 1.1, size: 8, party: "Dem" },
  { name: "Monroe County", xValue: 8.0, yValue: 1.0, size: 7, party: "Dem" },
];

export const regressionData: RegressionDataLine[] = [
  {
    party: "Rep",
    points: [
      { xValue: 7.0, yValue: 1.0 },
      { xValue: 7.5, yValue: 0.9 },
      { xValue: 8.0, yValue: 0.8 },
      { xValue: 8.5, yValue: 0.7 },
      { xValue: 9.0, yValue: 0.6 },
      { xValue: 9.5, yValue: 0.5 },
    ],
  },
  {
    party: "Dem",
    points: [
      { xValue: 8.0, yValue: 0.5 },
      { xValue: 8.5, yValue: 0.45 },
      { xValue: 9.0, yValue: 0.4 },
      { xValue: 9.5, yValue: 0.35 },
      { xValue: 10.0, yValue: 0.3 },
    ],
  },
];
