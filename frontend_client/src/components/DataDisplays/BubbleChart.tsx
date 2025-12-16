import * as d3 from "d3";
import SimpleTooltip from "../SimpleTooltip";
import { getRegressionCoefficients } from "../../api/client";
import makePolynomial from "../../helpers/makePolynomial";

type PartyAffiliation = "Rep" | "Dem" | "NONE";

interface BubbleChartDataPoint {
  name: string;
  color: string;
  size: number;
  x: number;
  y: number;
  party: PartyAffiliation;
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
  degree?: number;
}

interface RegressionLine {
  party: PartyAffiliation;
  data: string;
  color: string;
}

import { useState, useEffect, useRef } from "react";

function BubbleChart({ data, width, height, title, xAxisLabel, yAxisLabel, useRegression, maxXScale, maxYScale, degree }: BubbleChartProperties) {
  const chartMargin = { top: 60, right: 50, bottom: 60, left: 70 };
  const chartWidth = width - chartMargin.left - chartMargin.right + 125;
  const chartHeight = height - chartMargin.top - chartMargin.bottom + 100;

  const [actualData, setActualData] = useState<readonly BubbleChartDataPoint[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const emptyData = actualData.length === 0;

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
    .domain([0, maxXScale || d3.max(actualData, (x) => x.x)! * 1.015])
    .range([chartMargin.left, chartWidth - chartMargin.right]);
  const yAxisScale = d3
    .scaleLinear()
    .domain([0, maxYScale || d3.max(actualData, (x) => x.y)!])
    .range([chartHeight - chartMargin.bottom, chartMargin.top]);

  const xAxisTicks = xAxisScale.ticks(emptyData ? 0 : 1 * 30);
  const yAxisTicks = yAxisScale.ticks(emptyData ? 0 : 1 * 30);

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
  }, [actualData]);

  const [regressionLines, setRegressionLines] = useState<RegressionLine[]>([]);

  useEffect(() => {
    if (!useRegression || actualData.length === 0) return;

    async function calcRegression() {
      try {
        const parties = [...new Set(actualData.map((d) => d.party))];
        const partyLines = [];

        for (const party of parties) {
          const actualPoints = actualData.filter((d) => d.party === party && d.y !== 0);

          const xVals = actualPoints.map((d) => d.x);
          const yVals = actualPoints.map((d) => d.y);

          const regressionCoefficients = await getRegressionCoefficients(
            {
              pointsCount: actualPoints.length,
              xs: xVals,
              ys: yVals,
            },
            { degree: degree ?? 8 }
          );
          const regressionFunction = makePolynomial(regressionCoefficients);

          const minXVal = Math.min(...xVals);
          const maxXVal = Math.max(...xVals);

          const regressionPoints: [number, number][] = [];
          for (let i = -400; i <= 400; i++) {
            const setValX = minXVal + (i / 100) * (maxXVal - minXVal);
            const setValY = regressionFunction(setValX);
            regressionPoints.push([setValX, setValY]);
          }

          const regressionLine = d3
            .line<[number, number]>()
            .x((d) => xAxisScale(d[0]))
            .y((d) => yAxisScale(d[1]))
            .curve(d3.curveBasis);

          partyLines.push({
            party,
            data: regressionLine(regressionPoints),
            color: party === "Dem" ? d3.color("blue")?.darker(1) : party === "Rep" ? d3.color("red")?.darker(1) : actualData[0].color,
          });
        }

        setRegressionLines(partyLines.filter((line) => line.data !== null) as RegressionLine[]);
      } catch (err) {
        console.error("Error calculating regression: ", err);
      }
    }

    calcRegression();
  }, [actualData, width, height, title, xAxisLabel, yAxisLabel, useRegression, maxXScale, maxYScale, degree, xAxisScale, yAxisScale]);

  return (
    <>
      <svg ref={svgRef} width={width} height={height} style={{ background: "#ffff", borderRadius: "8px" }}>
        <defs>
          <clipPath id="svg-clip-rect">
            <rect
              x={xAxisScale(0)}
              y={chartMargin.top}
              width={chartWidth - chartMargin.right - xAxisScale(0)}
              height={chartHeight - chartMargin.top - chartMargin.bottom}
            />
          </clipPath>
        </defs>
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
            <text x={chartMargin.left - 25} y={yAxisScale(x) + 5} textAnchor="middle" fontSize={15}>
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
          transform={`rotate(-90, ${chartMargin.left - 50}, ${chartHeight / 2})`}
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
            r={x.size}
            stroke="white"
            strokeWidth={1.5}
            fill={x.color}
            opacity={0.55}
          />
        ))}

        {/* Bubble Chart Linear Regression */}
        {useRegression &&
          regressionLines.map((lines) => (
            <path key={lines.party} d={lines.data} stroke={lines.color} fill="none" strokeWidth={3} opacity={0.85} clipPath="url(#svg-clip-rect)" />
          ))}
        {emptyData && (
          <text x={chartWidth / 2} y={chartHeight / 2} textAnchor="middle" fontSize={45}>
            {isLoaded ? "No data available." : "Loading data."}
          </text>
        )}
      </svg>

      {/* Tooltip when moused over. */}
      <SimpleTooltip show={showTooltip}>{tooltipText}</SimpleTooltip>
    </>
  );
}

export type { BubbleChartDataPoint };

export default BubbleChart;
