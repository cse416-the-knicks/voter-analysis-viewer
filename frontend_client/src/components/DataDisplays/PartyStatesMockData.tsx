import type { BubbleChartDataPoint, RegressionDataLine } from "./BubbleChart";

export const dropBoxData: BubbleChartDataPoint[] = [
  { name: "Oklahoma County, OK", xValue: 65, yValue: 3, size: 150000, party: "Rep" },
  { name: "Tulsa County, OK", xValue: 62, yValue: 2.8, size: 130000, party: "Rep" },
  { name: "Cleveland County, OK", xValue: 55, yValue: 3.2, size: 110000, party: "Rep" },
  { name: "Monroe County, NY", xValue: 42, yValue: 12.5, size: 140000, party: "Dem" },
  { name: "Onondaga County, NY", xValue: 45, yValue: 13.1, size: 120000, party: "Dem" },
  { name: "Westchester County, NY", xValue: 38, yValue: 15.2, size: 160000, party: "Dem" },
  { name: "Erie County, NY", xValue: 44, yValue: 11.9, size: 150000, party: "Dem" },
  { name: "Canadian County, OK", xValue: 68, yValue: 2.1, size: 90000, party: "Rep" },
  { name: "Suffolk County, NY", xValue: 47, yValue: 13.5, size: 170000, party: "Dem" },
];

export const equipmentQualityData: BubbleChartDataPoint[] = [
  { name: "Oklahoma County, OK", xValue: 8.5, yValue: 0.7, size: 180000, party: "Rep" },
  { name: "Tulsa County, OK", xValue: 8.2, yValue: 0.9, size: 150000, party: "Rep" },
  { name: "Cleveland County, OK", xValue: 7.9, yValue: 1.1, size: 120000, party: "Rep" },
  { name: "Canadian County, OK", xValue: 8.0, yValue: 1.3, size: 95000, party: "Rep" },
  { name: "Monroe County, NY", xValue: 9.2, yValue: 0.6, size: 140000, party: "Dem" },
  { name: "Erie County, NY", xValue: 9.1, yValue: 0.8, size: 160000, party: "Dem" },
  { name: "Westchester County, NY", xValue: 9.5, yValue: 0.4, size: 180000, party: "Dem" },
  { name: "Suffolk County, NY", xValue: 9.0, yValue: 0.5, size: 175000, party: "Dem" },
];

export const regressionData: RegressionDataLine[] = [
  {
    party: "Rep",
    points: [
      { xValue: 7.5, yValue: 1.4 },
      { xValue: 8.0, yValue: 1.1 },
      { xValue: 8.5, yValue: 0.9 },
    ],
  },
  {
    party: "Dem",
    points: [
      { xValue: 8.8, yValue: 0.9 },
      { xValue: 9.2, yValue: 0.6 },
      { xValue: 9.6, yValue: 0.4 },
    ],
  },
];
