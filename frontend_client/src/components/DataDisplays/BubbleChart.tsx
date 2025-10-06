import * as d3 from "d3";

export interface BubbleChartDataPoint {
  name: string,
  party: "Rep" | "Dem"
  size: number,
  xValue: number,
  yValue: number
}

export interface RegressionDataPoint {
  xValue: number,
  yValue: number
}

export interface RegressionDataLine {
  party: "Rep" | "Dem"
  points: {xValue: number, yValue: number}[]
}

interface BubbleChartProperties {
  data: BubbleChartDataPoint[],
  width: number, 
  height: number, 
  title: string, 
  xAxisLabel: string, 
  yAxisLabel: string,
  useRegression?: boolean, 
  regressionData?: RegressionDataLine[]
}

export function BubbleChart({data, width, height, title, xAxisLabel, yAxisLabel, useRegression, regressionData = []}: BubbleChartProperties) {
  const chartMargin = { top: 50, right: 30, bottom: 60, left: 70 };
  const chartWidth = width - chartMargin.left - chartMargin.right;
  const chartHeight = height - chartMargin.top - chartMargin.bottom;

  const xAxisScale = d3.scaleLinear().domain([0, d3.max(data, (x) => x.xValue)! + 5]).range([chartMargin.left, chartWidth - chartMargin.right])
  const yAxisScale = d3.scaleLinear().domain([0, d3.max(data, (x) => x.yValue)! + 5]).range([chartHeight - chartMargin.bottom, chartMargin.top])
  const chartScale = d3.scaleSqrt().domain([d3.min(data, (x) => x.size)!, d3.max(data, (x) => x.size)!]).range([5, 25]);

  const xAxisTicks = xAxisScale.ticks(3);
  const yAxisTicks = yAxisScale.ticks(3);

  return (
    <svg width={width} height={height} style={{ background: "#ffff", borderRadius: "8px"}}>
      
      {/* Bubble Chart Title */}
      <text x={width/2} y={30} textAnchor="middle" fontSize={20}>
        {title}
      </text>

      {/* x axis */}
      {xAxisTicks.map((x, y) => ( 
        <g key={y}>
          <line x1={xAxisScale(x)} x2={xAxisScale(x)} y1={chartMargin.top} y2={chartHeight - chartMargin.bottom} stroke="#000"/>
            <text x={xAxisScale(x)} y={chartHeight - chartMargin.bottom + 20} textAnchor="middle" fontSize={15}>
              {x}
            </text>
        </g>        
      ))}
      <text x={chartWidth/2+10} y={chartHeight - 5} textAnchor="middle" fontSize={15} fontWeight="bold">
        {xAxisLabel}
      </text>

      {/* y axis */}
      {yAxisTicks.map((x, y) => ( 
        <g key={y}>
          <line x1={chartMargin.left} x2={chartWidth - chartMargin.right} y1={yAxisScale(x)} y2={yAxisScale(x)} stroke="#000"/>
            <text x={chartMargin.left - 15} y={yAxisScale(x) + 5} textAnchor="middle" fontSize={15}>
              {x}
            </text>
        </g>        
      ))}
      <text x={chartMargin.left-50} y={chartHeight/2} textAnchor="middle" fontSize={15} fontWeight="bold" transform={`rotate(-90, ${chartMargin.left-40}, ${chartHeight/2})`}>
        {yAxisLabel}
      </text>

      {/* Bubble Chart Bubbles */}
      {data.map((x, y) => (
        <circle key={y} cx={xAxisScale(x.xValue)} cy={yAxisScale(x.yValue)} r={chartScale(x.size)} fill={x.party === "Rep" ? "#d73027" : "#4575b4"} opacity={0.5} stroke="#000">
        </circle>
      ))}

      {/* Bubble Chart Linear Regression */}
      {useRegression && regressionData.map((regLine, x) => {
        const color = "#000";
        const setRegressionPoints = regLine.points.map(p => ({ x: p.xValue, y: p.yValue }));
        const regressionLine = d3.line<{x: number, y: number}>().x((x) => xAxisScale(x.x)).y((x) => yAxisScale(x.y)).curve(d3.curveBasis)(setRegressionPoints);
        return(<path key={x} d={regressionLine || ""} fill="none" stroke={color} strokeWidth={5} opacity={1}/>);
      })}

    </svg>
  );
}

export default BubbleChart;
