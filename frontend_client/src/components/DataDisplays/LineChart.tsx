import * as d3 from "d3";
import SimpleTooltip from "../SimpleTooltip";

interface LineChartDataPoint {
  x: string; // label county
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

// NOTE(jerry):
// this is not a very general purpose line-chart
// it was built to express the visualization for GUI 16. exclusively.
function LineChart({ data, width, height, title, xAxisLabel, yAxisLabel }: LineChartProperties) {
  const chartMargin = { top: 60, right: 40, bottom: 60, left: 70 };
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

  // I make a horrible assumption for GUI16 here.
  const xAxisLabels = actualData[0]?.points.map(x => x.x) || ["loading"];
  const xAxisScale = d3
    .scaleBand()
    .domain(xAxisLabels)
    .range([chartMargin.left, chartWidth - chartMargin.right]);
  const yAxisScale = d3
    .scaleLinear()
    .domain([0, d3.max(actualData, (x) => Math.max(...x.points.map(x1 => x1.y)))! + 5])
    .range([chartHeight - chartMargin.bottom, chartMargin.top]);

  // const xAxisTicks = xAxisScale.ticks(16);
  const yAxisTicks = yAxisScale.ticks(4);

  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [tooltipText, setTooltipText] = useState("TEXT!");

  // NOTE(jerry): unused currently
  const svgRef = useRef<SVGSVGElement>(null);
  const svgRef2 = useRef<SVGSVGElement>(null);


  useEffect(() => {
    const svg = d3.select(svgRef2.current);

    function handleZoom(e) {
      d3.select(svgRef.current)
	.attr('transform', e.transform);
    }

    const zoom = d3.zoom()
      .scaleExtent([1.0, 10.0])
      .translateExtent([[0,0], [width,height]])
      .on('zoom', handleZoom);
    svg.call(zoom);

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
  }, []);

  return (
    <>
      <svg ref={svgRef2} width={width} height={height} style={{ background: "#ffffff", borderRadius: "8px" }}>
	<svg ref={svgRef} width={width} height={height} style={{ background: "#ffffff", borderRadius: "8px" }}>
        {/* Bubble Chart Title */}
        <text x={width / 2} y={30} textAnchor="middle" fontSize={20}>
          {title}
        </text>

        <text x={chartWidth / 2 + 10} y={chartHeight+10} textAnchor="middle" fontSize={15} fontWeight="bold">
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

	{/* label x axis */}
	{xAxisLabels.map((x) => (
	  <text
	    key={x}
	    x={xAxisScale(x)}
	    y={chartHeight*0.99}
	    transform={`rotate(-45, ${xAxisScale(x)}, ${chartHeight*0.99})`}
	    textAnchor="start"
	    alignmentBaseline="middle"
	    fontWeight="bold"
	    fontSize={"0.5em"}
	  >
	    {x}
	  </text>
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

	{/* Graph Line for pointset */}
	{
	  actualData.map(
	    pointSet => (pointSet.points.map(
	      (_, index) => (
		(index+1 >= pointSet.points.length) ? <></> :
		<line
		  x1={xAxisScale(pointSet.points[index].x)}
		  y1={yAxisScale(pointSet.points[index].y)}
		  x2={xAxisScale(pointSet.points[index+1].x)}
		  y2={yAxisScale(pointSet.points[index+1].y)}
		  stroke={pointSet.color}
		/>
	      )))
	  )
	}
	{/* Plot Data Points*/}
	{
	  actualData.map(
	    pointSet => (pointSet.points.map(
	      point => (<circle
			  key={point.x+pointSet.label}
			  cx={xAxisScale(point.x)}
			  cy={yAxisScale(point.y)}
			  r={2}
			  fill={pointSet.color}
			  stroke={"black"}/>)))
	  )
	}
	  </svg>
      </svg>
      {/* Tooltip when moused over. */}
      <SimpleTooltip show={showTooltip}>{tooltipText}</SimpleTooltip>
    </>
  );
}

export type { LineChartDataMaker, LineChartDataPoint };

export default LineChart;
