import * as d3 from "d3";
import { useState, useEffect, useRef } from "react";

import SimpleTooltip from "../SimpleTooltip";

interface BarChartDataEntry {
  category: string;
  value: number;
}

interface BarChartMargins {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
}

interface BarChartProperties {
  title: string;
  xTitle: string;
  data: BarChartDataEntry[];
  width: number;
  height: number;
  margins?: BarChartMargins;
  small?: boolean; // used for hover preview
}

function BarChart({ title, xTitle, data, width, height, margins, small }: BarChartProperties) {
  const barMargin = {
    top: margins?.top || 25,
    right: margins?.right || 45,
    bottom: margins?.bottom || 25,
    left: margins?.left || 170,
  };

  const barWidth = width - barMargin.left - barMargin.right;
  const barHeight = height - barMargin.top - barMargin.bottom;

  const horizontalAxis = d3
    .scaleLinear()
    .domain([0, d3.max(data, (x) => x.value)! || 1])
    .range([0, barWidth]);
  const verticalAxis = d3
    .scaleBand()
    .domain(data.map((x) => x.category))
    .range([0, barHeight])
    .padding(small ? 0.2 : 0.3);

  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [tooltipText, setTooltipText] = useState("TEXT!");

  // NOTE(jerry):
  // in "small" mode it's not possible to highlight the bars, so
  // highlighting doesn't matter.
  const defaultBlockColor = small ? "hsl(288, 90%, 90%)" : "hsl(288, 90%, 44%)";
  const defaultHighlightColor = small ? "white" : "hsl(288, 90%, 90%)";

  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const rectangleSelector = svg.selectAll("rect");
    rectangleSelector
      .on("mouseover", function (_event, _d) {
        const element = this as Element;
        d3.select(this).attr("fill", defaultHighlightColor);
        setShowTooltip(true);
        setTooltipText(element.getAttribute("data-title") + ": " + parseInt(element.getAttribute("data-value") || "0", 10).toLocaleString(navigator.language));
      })
      .on("mouseout", function (_event, _d) {
        d3.select(this).attr("fill", defaultBlockColor);
        setShowTooltip(false);
      });
    return () => {
      rectangleSelector.on("mouseover", null).on("mouseout", null);
    };
  }, [data]);

  return (
    <>
      <svg ref={svgRef} width={width} height={height} style={{ background: small ? "#0000000" : "#ffffff" }}>
        <g transform={`translate(${barMargin.left}, ${barMargin.top})`}>
          {data.map((x) => (
            <>
              <rect
                key={x.category}
                data-title={x.category}
                y={verticalAxis(x.category)!}
                data-value={x.value}
                width={horizontalAxis(x.value)}
                height={verticalAxis.bandwidth()}
                fill={defaultBlockColor}
              />
              <text 
              x={barWidth*1.05} 
              y={verticalAxis(x.category)! + verticalAxis.bandwidth()/2 + (verticalAxis.bandwidth()*0.35)/2} 
              fill="white"
              stroke="black"
              strokeWidth={0.2} 
              textAnchor="start" 
              fontSize={(small) ? 14: 0} fontWeight="bolder">
                {x.value.toLocaleString(navigator.language)}
              </text>
            </>
          ))}
          {data.map((x) => (
            <text
              key={x.category}
              x={-7}
              y={(verticalAxis(x.category)! ?? 0) + verticalAxis.bandwidth() / 2}
              textAnchor="end"
              alignmentBaseline="middle"
              fontSize={13}
              fill={small ? "white" : "black"}
            >
              {x.category}
            </text>
          ))}
          {/* Title */}
          <text x={barWidth / 2} y={0} textAnchor="middle" fill={small ? "white" : "black"} fontSize={small ? 10 : 20} fontWeight="bold">
            {title}
          </text>
          {horizontalAxis.ticks().map((tick) => (
            <g key={tick} transform={`translate(${horizontalAxis(tick)},${barHeight})`}>
              <line x1="0" y1={barHeight - 10} y2={barHeight} stroke="black"></line>
              <text x={0} y={barHeight + 15} textAnchor="middle" fontSize={small ? 10 : 12}>
                {tick.toString()}
              </text>
            </g>
          ))}
          <line x1={0} y1={barHeight} x2={barWidth} y2={barHeight} stroke="darkgray" />
          <line x1={0} y1={barHeight} x2={0} y2={0} stroke="darkgray" />

          <text textAnchor="middle" fill={small ? "white" : "black"} x={barWidth / 2} y={barHeight + 20} fontSize={15}>
            {xTitle}
          </text>
        </g>
      </svg>
      {/* Tooltip when moused over. */}
      <SimpleTooltip show={showTooltip}>{tooltipText}</SimpleTooltip>
    </>
  );
}

export type { BarChartDataEntry };
export default BarChart;
