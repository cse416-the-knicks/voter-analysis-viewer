import * as d3 from "d3";
import type { DisplayData } from "./DisplayData";

interface BubbleChartProps {
    data: DisplayData[];
    width: number;
    height: number;
}

function BubbleChart({data, width, height}: BubbleChartProps) {
    const pop = d3.max(data, x => x.population)!;
    const radius = d3.scaleSqrt().domain([0, pop]).range([0, 50]);
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    return (
        <svg width={width} height={height} style={{ background: "white" }}>
            <g transform={`translate(${width-345}, ${height-200})`}>
            {data.map((x, y) => (
                <g key={x.state} transform={`translate(${(y - data.length / 2) * 120}, 0)`}>
                    <circle r={radius(x.population)} fill={color(x.state)} opacity={2}></circle>
                    <text y={radius(x.population)-35} textAnchor="middle" fontSize={12}>
                        {x.state}
                    </text>
                     <text y={radius(x.population) + 35} textAnchor="middle" fontSize={12}>
                        Population: {x.population}
                    </text>
                        <text y={radius(x.population) + 20} textAnchor="middle" fontSize={12}>
                        Mail In: {x.mailin}
                    </text>
                </g>
            ))} 
            </g>
        </svg>
    )   
}

export default BubbleChart;
