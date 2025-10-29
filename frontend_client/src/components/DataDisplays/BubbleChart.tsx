import * as d3 from "d3";
import SimpleTooltip from "../SimpleTooltip";

type PartyAffiliation = "Rep" | "Dem";

interface BubbleChartDataPoint {
  name: string;
  party: PartyAffiliation;
  size: number;
  xValue: number;
  yValue: number;
}

interface RegressionDataLine {
  party: PartyAffiliation;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface BubbleChartProperties {
  data: BubbleChartDataPoint[];
  width: number;
  height: number;
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  useRegression?: boolean;
}

import { useState, useEffect, useRef } from "react";

function BubbleChart({ data, width, height, title, xAxisLabel, yAxisLabel, useRegression }: BubbleChartProperties) {
  const chartMargin = { top: 60, right: 50, bottom: 60, left: 70 };
  const chartWidth = width - chartMargin.left - chartMargin.right + 125;
  const chartHeight = height - chartMargin.top - chartMargin.bottom + 100;

  const xAxisScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (x) => x.xValue)! + 5])
    .range([chartMargin.left, chartWidth - chartMargin.right]);
  const yAxisScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (x) => x.yValue)! + 5])
    .range([chartHeight - chartMargin.bottom, chartMargin.top]);
  const chartScale = d3
    .scaleSqrt()
    .domain([d3.min(data, (x) => x.size)!, d3.max(data, (x) => x.size)!])
    .range([5, 25]);

  const xAxisTicks = xAxisScale.ticks(16);
  const yAxisTicks = yAxisScale.ticks(16);

  const getX = function (p: BubbleChartDataPoint): number {
    return p.xValue;
  };
  const getY = function (p: BubbleChartDataPoint): number {
    return p.yValue;
  };

  const calculateLineOfBestFit = function (points: BubbleChartDataPoint[]): { slope: number; intercept: number } | null {
    if (points.length < 2) {
      return null;
    }

    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumX2 = 0;
    const len = points.length;

    for (const point of points) {
      const x = getX(point);
      const y = getY(point);
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }

    const slope = (len * sumXY - sumX * sumY) / (len * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / len;
    return { slope, intercept };
  };

  const parties = [
    ...new Set(
      data.map(function (x) {
        return x.party;
      })
    ),
  ];
  const calculatedRegressionLines: RegressionDataLine[] = parties
    .map(function (party) {
      const partyData = data.filter(function (x) {
        return x.party === party;
      });

      const regression = calculateLineOfBestFit(partyData);
      if (!regression) {
        return null;
      }

      const { slope, intercept } = regression;
      const [x1, x2] = xAxisScale.domain();
      const y1 = slope * x1 + intercept;
      const y2 = slope * x2 + intercept;

      return { party, x1, y1, x2, y2 };
    })
    .filter((line): line is RegressionDataLine => line !== null);

  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [tooltipText, setTooltipText] = useState("TEXT!");

  const defaultBlockColor = "hsl(288, 90%, 44%)";
  const defaultHighlightColor = "hsl(288, 90%, 90%)";

  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const circleSelector = svg.selectAll("circle");
    circleSelector
      .on("mouseover", function (_event, _d) {
        const element = this as Element;
        setShowTooltip(true);
        setTooltipText(element.getAttribute("data-title")!);
      })
      .on("mouseout", function (_event, _d) {
        setShowTooltip(false);
      });
    return () => {
      circleSelector.on("mouseover", null).on("mouseout", null);
    };
  }, [data]);

  return (
    <>
      <svg ref={svgRef} width={width} height={height} style={{ background: "#ffff", borderRadius: "8px" }}>
        {/* Bubble Chart Title */}
        <text x={width / 2} y={30} textAnchor="middle" fontSize={20}>
          {title}
        </text>

        {/* x axis */}
        {xAxisTicks.map((x, y) => (
          <g key={y}>
            <line x1={xAxisScale(x)} x2={xAxisScale(x)} y1={chartMargin.top} y2={chartHeight - chartMargin.bottom} stroke="#808080" />
            <text x={xAxisScale(x)} y={chartHeight - chartMargin.bottom + 20} textAnchor="middle" fontSize={15}>
              {x}
            </text>
          </g>
        ))}
        <text x={chartWidth / 2 + 10} y={chartHeight - 5} textAnchor="middle" fontSize={15} fontWeight="bold">
          {xAxisLabel}
        </text>

        {/* y axis */}
        {yAxisTicks.map((x, y) => (
          <g key={y}>
            <line x1={chartMargin.left} x2={chartWidth - chartMargin.right} y1={yAxisScale(x)} y2={yAxisScale(x)} stroke="#808080" />
            <text x={chartMargin.left - 15} y={yAxisScale(x) + 5} textAnchor="middle" fontSize={15}>
              {x}
            </text>
          </g>
        ))}
        <text
          x={chartMargin.left - 50}
          y={chartHeight / 2}
          textAnchor="middle"
          fontSize={15}
          fontWeight="bold"
          transform={`rotate(-90, ${chartMargin.left - 40}, ${chartHeight / 2})`}
        >
          {yAxisLabel}
        </text>

        {/* Bubble Chart Bubbles */}
        {data.map((x, y) => (
          <circle
            key={y}
            data-title={x.name}
            cx={xAxisScale(x.xValue)}
            cy={yAxisScale(x.yValue)}
            r={chartScale(x.size)}
            fill={x.party === "Rep" ? "#d73027" : "#4575b4"}
            opacity={0.5}
            stroke="#000"
          />
        ))}

        {/* Bubble Chart Linear Regression */}
        {useRegression &&
          calculatedRegressionLines.map(function (line) {
            const color = line.party === "Rep" ? "#FF0000" : "#2980b9";
            return (
              <line
                key={line.party}
                x1={xAxisScale(line.x1)}
                y1={yAxisScale(line.y1)}
                x2={xAxisScale(line.x2)}
                y2={yAxisScale(line.y2)}
                stroke={color}
                strokeWidth={3}
                opacity={0.8}
              />
            );
          })}
      </svg>
      {/* Tooltip when moused over. */}
      <SimpleTooltip show={showTooltip}>{tooltipText}</SimpleTooltip>
    </>
  );
}

export type { BubbleChartDataPoint };

export default BubbleChart;
