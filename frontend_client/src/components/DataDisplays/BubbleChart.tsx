import * as d3 from "d3";
import React from "react";
import type { DisplayData } from "./DisplayData";

interface BubbleChartAttributes {
    data: DisplayData[];
    width: number;
    height: number;
}

const BubbleChart: React.FC<BubbleChartAttributes> = ({data, width, height}) => {
    const pop = d3.max(data, x => x.population)!;
    const radius = d3.scaleSqrt().domain([0, pop]).range([0, 50]);
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    return (
        <svg width={width} height={height} style={{ background: "white" }}>
            <g transform={`translate(${width/2}, ${height/2})`}>
            {data.map((a, b) => (
                <g key={a.state} transform={`translate(${(b - data.length / 2) * 120}, 0)`}>
                    <circle r={radius(a.population)} fill={color(a.state)} opacity={2}></circle>
                    <text y={radius(a.population)-3} textAnchor="middle" fontSize={12}>
                        {a.state}
                    </text>
                     <text y={radius(a.population) + 30} textAnchor="middle" fontSize={12}>
                        Population: {a.population}
                    </text>
                        <text y={radius(a.population) + 20} textAnchor="middle" fontSize={12}>
                        Mail In: {a.mailin}
                    </text>
                </g>
            ))} 
            </g>
        </svg>
    )   
}
 
export default BubbleChart;
