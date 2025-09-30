import * as d3 from "d3";
import { provisionalCategories } from "./DisplayData";

interface BarChartProperties {
    stateInfo: {
        stateName: string;
        data: {category: string; value: number}[];
    }
}

function BarChart({stateInfo}: BarChartProperties) {
    const barMargin = { top: 25, right: 45, bottom: 25, left: 200 }
    const barWidth = 700 - barMargin.left - barMargin.right
    const barHeight = 500 - barMargin.top - barMargin.bottom

    const horizontalAxis = d3.scaleLinear().domain([0, d3.max(stateInfo.data, (x) => x.value)!]).range([0, barWidth]);
    const verticalAxis = d3.scaleBand().domain(stateInfo.data.map((x) => x.category)).range([0, barHeight]).padding(0.3);
    
    return (
        <svg width={700} height={500} style={{ background: "#ffffff" }}>
            <g transform={`translate(${barMargin.left}, ${barMargin.top})`}>
                {stateInfo.data.map((x) => (
                    <rect key={x.category} y={verticalAxis(x.category)!} width={horizontalAxis(x.value)} height={verticalAxis.bandwidth()} fill="#1590d6"/>
                ))}
                
                {stateInfo.data.map((x) => (
                    <text key={x.category} x={-7} y={(verticalAxis(x.category)! ?? 0) + verticalAxis.bandwidth()/2} textAnchor="end" alignmentBaseline="middle" fontSize={13}>{provisionalCategories[x.category]}</text>
                ))}
                

                {/* Title */}
                <text x={barWidth-250} y={0} textAnchor="middle" fontSize={20} fontWeight="bold">Provisional Ballots Cast - {stateInfo.stateName}</text>

                {horizontalAxis.ticks().map((tick => (
                    <g key={tick} transform={`translate(${horizontalAxis(tick)},${barHeight})`}>
                        <line x1="0" y1={barHeight-10} y2={barHeight} stroke="black"></line>
                        <text x={0} y={barHeight+15} textAnchor="middle" fontSize={12}>{tick.toString()}</text>
                    </g>
                )))}

                <line x1={0} y1={barHeight} x2={barWidth} y2={barHeight} stroke="black"/>

                <text transform={`rotate(-90)`} x={barHeight} y={barMargin.left} textAnchor="middle" fontSize={10}>Ballots Cast</text>

                <text x={barWidth-295} y={barHeight+20} fontSize={15}>Ballots Cast</text>
            </g>
        </svg>
    )   
}

export default BarChart;