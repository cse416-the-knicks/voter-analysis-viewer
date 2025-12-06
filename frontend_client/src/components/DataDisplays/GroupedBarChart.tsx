import { useEffect, useState } from "react";
import * as d3 from "d3";
import SimpleTooltip from "../SimpleTooltip";
import { Box, Paper, Typography } from "@mui/material";

interface GroupedBarChartEntry {
  value: number;
  title: string;
  category: string;
}

type GroupedBarChartDataMaker = readonly GroupedBarChartEntry[] | (() => Promise<GroupedBarChartEntry[]>);

interface GroupedBarChartProperties {
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  colorMap: Record<string, string>;
  data: GroupedBarChartDataMaker;
  width: number;
  height: number;
}

interface SimpleD3LegendProperties {
  colorMap: Record<string, string>;
  left: number | string;
  top: number | string;
}

function SimpleD3Legend({ colorMap, left, top }: SimpleD3LegendProperties) {
  const keys = Object.keys(colorMap);
  return (
    <Box
      sx={{
        position: "absolute",
        left: left,
        top: top,
      }}
    >
      <Paper elevation={4}>
        <b>Chart Key</b>
        {keys.map((x) => (
          <>
            <span style={{ paddingLeft: "4px", paddingRight: "4px", paddingBottom: "0", margin: "auto", height: "3px", display: "flex" }}>
              <i
                style={{ background: colorMap[x], width: "18px", height: "18px", display: "inline-block", marginRight: "8px", border: "1.5px solid black" }}
              ></i>
              <Typography>{x}</Typography>
            </span>
            <br />
          </>
        ))}
      </Paper>
    </Box>
  );
}

function GroupedBarChart({ title, xAxisLabel, yAxisLabel, colorMap, data, width, height }: GroupedBarChartProperties) {
  const chartMargin = { top: 60, right: 40, bottom: 60, left: 70 };
  const chartWidth = width - chartMargin.left - chartMargin.right + 125;
  const chartHeight = height - chartMargin.top - chartMargin.bottom + 100;

  const [actualData, setActualData] = useState<readonly GroupedBarChartEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState("");

  useEffect(() => {
    if (typeof data === "function") {
      (async () => {
        const loaded = await data();
        setActualData(loaded);
        setIsLoaded(true);
      })();
    } else {
      setActualData(data);
      setIsLoaded(true);
    }
  }, [data]);

  const groups = Array.from(new Set(actualData.map((d) => d.title)));
  const categories = Array.from(new Set(actualData.map((d) => d.category)));

  const x0 = d3
    .scaleBand()
    .domain(groups)
    .range([chartMargin.left, chartWidth - chartMargin.right])
    .paddingInner(0.2);

  const x1 = d3.scaleBand().domain(categories).range([0, x0.bandwidth()]).padding(0.05);

  const maxValue = d3.max(actualData, (d) => d.value) || 0;

  const y = d3
    .scaleLinear()
    .domain([0, maxValue + maxValue * 0.1])
    .range([chartHeight - chartMargin.bottom, chartMargin.top]);

  const yTicks = y.ticks(5);

  return (
    <>
      <svg width={width} height={height} style={{ background: "#ffffff", borderRadius: "8px" }}>
        <text x={width / 2} y={30} textAnchor="middle" fontSize={20}>
          {" "}
          {title}{" "}
        </text>

        {/* X axis */}
        {groups.map((g) => (
          <text key={g} x={x0(g)! + x0.bandwidth() / 2} y={chartHeight - 35} textAnchor="middle" fontSize={16} fontWeight="bold">
            {g}
          </text>
        ))}

        {/* Y axis ticks and grid lines */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={chartMargin.left} x2={chartWidth - chartMargin.right} y1={y(t)} y2={y(t)} stroke="#ccc" />
            <text x={chartMargin.left - 10} y={y(t) + 4} textAnchor="end" fontSize={12}>
              {t}
            </text>
          </g>
        ))}

        {/* Bars */}
        {isLoaded &&
          groups.map((g, gi) => (
            <g key={g} transform={`translate(${x0(g)}, 0)`}>
              {categories.map((c, ci) => {
                const entry = actualData.find((d) => d.title === g && d.category === c);
                if (!entry) return null;
                const barX = x1(c)!;
                const barY = y(entry.value);
                const barH = chartHeight - chartMargin.bottom - barY;

                return (
                  <rect
                    key={c}
                    x={barX}
                    y={barY}
                    width={x1.bandwidth()}
                    height={barH}
                    fill={colorMap[c] || "#999"}
                    onMouseOver={() => {
                      setTooltipText(`${entry.title} - ${entry.category}: ${entry.value.toLocaleString(navigator.language)}`);
                      setShowTooltip(true);
                    }}
                    onMouseOut={() => setShowTooltip(false)}
                  />
                );
              })}
            </g>
          ))}

        {/* X label */}
        <text x={width / 2} y={height - 30} textAnchor="middle" fontSize={16} fontWeight="bold">
          {xAxisLabel}
        </text>

        {/* Y label */}
        <text x={-height / 2} y={20} transform="rotate(-90)" textAnchor="middle" fontSize={15} fontWeight="bold">
          {yAxisLabel}
        </text>
      </svg>

      {isLoaded && <SimpleD3Legend left={"0.5em"} top={"3.5em"} colorMap={colorMap} />}
      <SimpleTooltip show={showTooltip}>{tooltipText}</SimpleTooltip>
    </>
  );
}

export default GroupedBarChart;
