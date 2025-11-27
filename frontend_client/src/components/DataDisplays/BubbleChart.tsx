import * as d3 from "d3";
import SimpleTooltip from "../SimpleTooltip";

type PartyAffiliation = "Rep" | "Dem";

interface BubbleChartDataPoint {
  name: string;
  color: string;
  size: number;
  x: number;
  y: number;
}

type BubbleChartDataMaker = readonly BubbleChartDataPoint[] | (() => Promise<BubbleChartDataPoint[]>);

interface BubbleChartProperties {
  data: BubbleChartDataMaker;
  width: number;
  height: number;
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  useRegression?: boolean;
  maxXScale?: number;
  maxYScale?: number;
}

import { useState, useEffect, useRef } from "react";

function BubbleChart({
  data,
  width,
  height,
  title,
  xAxisLabel,
  yAxisLabel,
  useRegression,
  maxXScale,
  maxYScale
}: BubbleChartProperties) {
  const chartMargin = { top: 60, right: 50, bottom: 60, left: 70 };
  const chartWidth = width - chartMargin.left - chartMargin.right + 125;
  const chartHeight = height - chartMargin.top - chartMargin.bottom + 100;

  const [actualData, setActualData] = useState<readonly BubbleChartDataPoint[]>([]);
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
    .domain([0, maxXScale || d3.max(actualData, (x) => x.x)! + 5])
    .range([chartMargin.left, chartWidth - chartMargin.right]);
  const yAxisScale = d3
    .scaleLinear()
    .domain([0, maxYScale || d3.max(actualData, (x) => x.y)! + 5])
    .range([chartHeight - chartMargin.bottom, chartMargin.top]);
  const chartScale = d3
    .scaleSqrt()
    .domain([d3.min(actualData, (x) => x.size)!, d3.max(actualData, (x) => x.size)!])
    .range([5, 25]);

  const xAxisTicks = xAxisScale.ticks(16);
  const yAxisTicks = yAxisScale.ticks(16);

  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [tooltipText, setTooltipText] = useState("TEXT!");

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
        {actualData.map((x, y) => (
          <circle
            key={y}
            data-title={x.name}
            cx={xAxisScale(x.x)}
            cy={yAxisScale(x.y)}
            r={chartScale(x.size)}
            // fill={x.party === "Rep" ? "#d73027" : "#4575b4"}
            fill={x.color}
            opacity={0.5}
            stroke="#000"
          />
        ))}
      </svg>
      {/* Tooltip when moused over. */}
      <SimpleTooltip show={showTooltip}>{tooltipText}</SimpleTooltip>
    </>
  );
}

export type { BubbleChartDataPoint };

export default BubbleChart;
