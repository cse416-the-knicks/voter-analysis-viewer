import * as d3 from "d3";
import type { DisplayData } from "./DisplayData";

interface BarChartAttributes {
    data: DisplayData[];
    width: number;
    height: number;
}

function BarChart({data, width, height}: BarChartAttributes) {

    const barMargin = { top: 80, right: 50, bottom: 50, left: 90 }
    const barWidth = 600 - barMargin.left - barMargin.right
    const barHeight = 375 - barMargin.top - barMargin.bottom

    const horizontalAxis = d3.scaleLinear().domain([0, d3.max(data, (x) => x.population)!]).range([0, barWidth]);
    const verticalAxis = d3.scaleBand().domain(data.map((x) => x.state)).range([0, barHeight]).padding(0.5);
    
    return (
        <svg width={width} height={height} style={{ background: "#ffffff" }}>
            <g transform={`translate(${barMargin.left}, ${barMargin.top})`}>
                {/* Title */}
                <text x={barWidth-250} y={-25} textAnchor="middle" fontSize={20} fontWeight="bold">State Populations</text>
                
                {data.map((x) => (
                    <rect key={x.state} y={verticalAxis(x.state)!} width={horizontalAxis(x.population)} height={verticalAxis.bandwidth()} fill="#1590d6"/>
                ))}
                {data.map((x) => (
                    <text key={x.state} x={-7} y={(verticalAxis(x.state)! ?? 0) + verticalAxis.bandwidth()/2} textAnchor="end" alignmentBaseline="middle" fontSize={13}>{x.state}</text>
                ))}
                {horizontalAxis.ticks().map((tick => (
                    <g key={tick} transform={`translate(${horizontalAxis(tick)},0)`}>
                        <line x1="0" y1={barHeight-10} y2={barHeight} stroke="black"></line>
                        <text x={0} y={barHeight+15} textAnchor="middle" fontSize={12}>{tick.toString()}</text>
                    </g>
                )))}

                <line x1={0} y1={barHeight} x2={barWidth-5} y2={barHeight} stroke="black"/>

                <text transform={`rotate(-90)`} x={barHeight-365} y={barMargin.left-145} textAnchor="middle" fontSize={20}>State</text>

                <text x={barWidth-295} y={barHeight+43} fontSize={20}>Population</text>
            </g>
        </svg>
    )   
}

export default BarChart;