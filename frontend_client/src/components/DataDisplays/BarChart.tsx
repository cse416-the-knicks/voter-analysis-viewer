import * as d3 from "d3";
import { useState, useEffect, useRef } from 'react';

interface BarChartDataEntry {
  category: string;
  value: number;
};

interface BarChartMargins {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
};

interface BarChartProperties {
  title: string;
  xTitle: string;
  data: BarChartDataEntry[];
  width: number;
  height: number;
  margins?: BarChartMargins;
}

function BarChart({ 
  title,
  xTitle,
  data,
  width,
  height,
  margins
 }: BarChartProperties) {
  const barMargin = { 
    top: margins?.left || 25, 
    right: margins?.right || 45, 
    bottom: margins?.bottom || 25, 
    left: margins?.left || 150 
  };
  
  const barWidth = width - barMargin.left - barMargin.right;
  const barHeight = height - barMargin.top - barMargin.bottom;

  const horizontalAxis = d3.scaleLinear().domain([0, d3.max(data, (x) => x.value)!]).range([0, barWidth]);
  const verticalAxis = d3.scaleBand().domain(data.map((x) => x.category)).range([0, barHeight]).padding(0.3);

  const [boundingRectangle, setBoundingRectangle] = useState<DOMRect | null>(null);
  const [tooltipText, setTooltipText] = useState("TEXT!");

  const defaultBlockColor = "hsl(288, 90%, 44%)";
  const defaultHighlightColor = "hsl(288, 90%, 90%)";

  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(
    // @ts-expect-error
    () => {
      const svg = d3.select(svgRef.current);
      const rectangleSelector = svg.selectAll("rect");
      rectangleSelector
        .on("mouseover",
          function (event, d) {
            const element = this as Element;
            d3.select(this).attr("fill", defaultHighlightColor);
            const r = element.getBoundingClientRect();
            setBoundingRectangle(r);
            setTooltipText(element.getAttribute("data-title") + ": " + element.getAttribute("data-value"));
          })
        .on("mouseout",
          function (event, d) {
            d3.select(this).attr("fill", defaultBlockColor);
            setBoundingRectangle(null);
          });
      return () => rectangleSelector.on("mouseover", null).on("mouseout", null);
    }, [data]);

  return (
    <>
      <svg ref={svgRef} width={width} height={height} style={{ background: "#ffffff" }}>
        <g transform={`translate(${barMargin.left}, ${barMargin.top})`}>
          {data.map((x) => (
            <rect key={x.category} 
                  data-title={x.category} 
                  y={verticalAxis(x.category)!} 
                  data-value={x.value} 
                  width={horizontalAxis(x.value)} 
                  height={verticalAxis.bandwidth()} 
                  fill={defaultBlockColor} />
          ))}
          {data.map((x) => (
            <text
              key={x.category}
              x={-7}
              y={(verticalAxis(x.category)! ?? 0) + verticalAxis.bandwidth() / 2}
              textAnchor="end"
              alignmentBaseline="middle"
              fontSize={13}
            >
              {x.category}
            </text>
          ))}
          {/* Title */}
          <text x={barWidth/2} y={0} textAnchor="middle" fontSize={20} fontWeight="bold">{title}</text>
          {horizontalAxis.ticks().map((tick => (
            <g key={tick} transform={`translate(${horizontalAxis(tick)},${barHeight})`}>
              <line x1="0" y1={barHeight - 10} y2={barHeight} stroke="black"></line>
              <text x={0} y={barHeight + 15} textAnchor="middle" fontSize={12}>{tick.toString()}</text>
            </g>
          )))}
          <line x1={0} y1={barHeight} x2={barWidth} y2={barHeight} stroke="darkgray" />
          <line x1={0} y1={barHeight} x2={0} y2={0} stroke="darkgray" />
          <text transform={`rotate(-90)`} x={barHeight} y={barMargin.left} textAnchor="middle" fontSize={10}>{xTitle}</text>
          <text x={barWidth/2} y={barHeight + 20} fontSize={15}>{xTitle}</text>
        </g>
      </svg>
      {/* Tooltip when moused over. */}
      {boundingRectangle &&
        <p style={{
          position: "absolute", left: (boundingRectangle.x - barWidth / 2) + "px", top: boundingRectangle.y + "px", background: "white",
          borderRadius: "8px",
          padding: "8px",
          paddingLeft: "16px",
          paddingRight: "16px",
          pointerEvents: "none",
          fontSize: "16px",
          boxShadow: "5px 5px 15px gray",
        }}><b>{tooltipText}</b></p>}
    </>
  )
}

export type {
  BarChartDataEntry
};
export default BarChart;