import * as d3 from "d3";
import SimpleTooltip from "../SimpleTooltip";

interface LineChartDataPoint {
  x: number;
  y: number;
}

interface LineChartDataPointSet {
  points: LineChartDataPoint[];
  color: string;
  label: string; // Used for legends
};

type LineChartDataMaker = readonly LineChartDataPointSet[] | (() => Promise<LineChartDataPointSet[]>);

interface LineChartProperties {
  data: LineChartDataMaker;
  width: number;
  height: number;
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
}

import { useState, useEffect, useRef } from "react";

function LineChart({ data, width, height, title, xAxisLabel, yAxisLabel }: LineChartProperties) {
  const chartMargin = { top: 60, right: 50, bottom: 60, left: 70 };
  const chartWidth = width - chartMargin.left - chartMargin.right + 125;
  const chartHeight = height - chartMargin.top - chartMargin.bottom + 100;

  const [actualData, setActualData] = useState<readonly LineChartDataPointSet[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(
    function () {
      if (typeof data === "function") {
        (async function () {
          const actualData = await data();
          setActualData(actualData);
          setIsLoaded(true);
        })();
      } else {
        setActualData(data);
        setIsLoaded(true);
      }
    },
    [data]
  );

  const xAxisScale = d3
    .scaleLinear()
    .domain([0, d3.max(actualData, (x) => Math.max(...x.points.map(x1 => x1.x)))! + 5])
    .range([chartMargin.left, chartWidth - chartMargin.right]);
  const yAxisScale = d3
    .scaleLinear()
    .domain([0, d3.max(actualData, (x) => Math.max(...x.points.map(x1 => x1.y)))! + 5])
    .range([chartHeight - chartMargin.bottom, chartMargin.top]);

  const xAxisTicks = xAxisScale.ticks(16);
  const yAxisTicks = yAxisScale.ticks(4);

  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [tooltipText, setTooltipText] = useState("TEXT!");

  // NOTE(jerry): unused currently
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

	{/* Plot Data Points*/}
	{
	  actualData.map(
	    pointSet => (pointSet.points.map(
	      point => (<circle
			  key={point.x+pointSet.label}
			  cx={xAxisScale(point.x)}
			  cy={yAxisScale(point.y)}
			  r={4}
			  fill={"red"}
			  stroke={"blue"}/>)))
	  )
	}
      </svg>
      {/* Tooltip when moused over. */}
      <SimpleTooltip show={showTooltip}>{tooltipText}</SimpleTooltip>
    </>
  );
}

export type { LineChartDataMaker, LineChartDataPoint };

export default LineChart;
