import * as d3 from "d3";
import { useState, useEffect, useRef } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import SimpleTooltip from "../SimpleTooltip";

interface PDFSample {
  x: number;
  y: number;
}

interface PDFChartData {
  title: string;
  fillColor: string;
  strokeColor?: string;
  opacity?: string;
  samples: PDFSample[];
}

type PDFChartDataMaker = readonly PDFChartData[] | (() => Promise<PDFChartData[]>);

interface PDFChartProperties {
  width: number;
  height: number;
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  maxXScale?: number;
  maxYScale?: number;
  data: PDFChartDataMaker;
}

interface SimplePDFChartLegendProperties {
  data: readonly PDFChartData[];
  chartWidth: number;
}

function SimplePDFChartLegend({ data }: SimplePDFChartLegendProperties) {
  const [legendVisibility, setLegendVisibility] = useState(true);

  return (
    <Box
      sx={{
        position: "absolute",
        left: "90px",
        top: "0.5em",
      }}
    >
      <Paper elevation={4}>
        <Button
          variant="contained"
          size="small"
          onClick={() => setLegendVisibility(!legendVisibility)}
          sx={{ mb: 2, borderRadius: "20px", top: "0.5em", textTransform: "none", p: 0.15 }}
          color="secondary"
        >
          {legendVisibility ? "collapse legend" : "show legend"}
        </Button>
        <Box sx={{ display: legendVisibility ? "block" : "none" }}>
          {data.map((x) => (
            <>
              <span style={{ paddingLeft: "8px", paddingRight: "8px", paddingBottom: "0", margin: "auto", height: "5px", display: "flex" }}>
                <i
                  style={{ background: x.fillColor, width: "18px", height: "18px", display: "inline-block", marginRight: "8px", border: "1.5px solid black" }}
                ></i>
                <Typography>{x.title}</Typography>
              </span>
              <br />
            </>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}

function PDFChart({ width, height, title, xAxisLabel, yAxisLabel, maxXScale, maxYScale, data }: PDFChartProperties) {
  const chartMargin = { top: 60, right: 50, bottom: 60, left: 70 };
  const chartWidth = width - chartMargin.left - chartMargin.right + 125;
  const chartHeight = height - chartMargin.top - chartMargin.bottom + 100;

  const [actualData, setActualData] = useState<readonly PDFChartData[]>([]);
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

  const dataMinX = d3.min(actualData, (x) => Math.min(...x.samples.map((x1) => x1.x)))! || 0;
  const dataMaxX = maxXScale || d3.max(actualData, (x) => Math.max(...x.samples.map((x1) => x1.x)))!;

  const dataMinY = d3.min(actualData, (x) => Math.min(...x.samples.map((x1) => x1.y)))! || 0;
  const dataMaxY = maxYScale || d3.max(actualData, (x) => Math.max(...x.samples.map((x1) => x1.y)))!;

  const xAxisScale = d3
    .scaleLinear()
    .domain([dataMinX, dataMaxX])
    .range([chartMargin.left, chartWidth - chartMargin.right]);
  const yAxisScale = d3
    .scaleLinear()
    .domain([dataMinY, dataMaxY])
    .range([chartHeight - chartMargin.bottom, chartMargin.top]);

  const xAxisTicks = xAxisScale.ticks(32);
  const yAxisTicks = yAxisScale.ticks(32);

  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [tooltipText, setTooltipText] = useState("TEXT!");

  const svgRef = useRef<SVGSVGElement>(null);
  const curveArea = d3
    .area()
    .x((d) => xAxisScale(d.x))
    .y0(() => yAxisScale(0))
    .y1((d) => yAxisScale(d.y))
    .curve(d3.curveBasis);
  const curveLine = d3
    .line()
    .x((d) => xAxisScale(d.x))
    .y((d) => yAxisScale(d.y))
    .curve(d3.curveBasis);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const pathSelector = svg.selectAll("path");
    pathSelector
      .on("mouseover", function (_event, _d) {
        const element = this as Element;
        if (element.getAttribute("data-title").length > 0) {
          setShowTooltip(true);
          setTooltipText(element.getAttribute("data-title")!);
        }
      })
      .on("mouseout", function (_event, _d) {
        setShowTooltip(false);
      });
    return () => {
      pathSelector.on("mouseover", null).on("mouseout", null);
    };
  }, [actualData]);

  /* useEffect(() => {}, []);
   */
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
            <text x={xAxisScale(x)} y={chartHeight - chartMargin.bottom + 20} textAnchor="middle" fontSize={14}>
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
            <text x={chartMargin.left - 20} y={yAxisScale(x) + 5} textAnchor="middle" fontSize={14}>
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

        {/* PDF Curves */}
        {actualData.map((x) => (<>
          <path d={curveLine(x.samples)} fill={"none"} pointerEvents={"none"} opacity={1.0} strokeOpacity="1.0" strokeWidth={3} stroke={x.strokeColor ?? x.fillColor} />
          <path data-title={x.title} d={curveArea(x.samples)} opacity={x.opacity ?? "0.35"} fill={x.fillColor} stroke={x.strokeColor ?? x.fillColor} />
          </>
        ))}
      </svg>
      {/* Tooltip when moused over. */}
      {isLoaded && <SimplePDFChartLegend chartWidth={chartWidth} data={actualData} />}
      <SimpleTooltip show={showTooltip}>{tooltipText}</SimpleTooltip>
    </>
  );
}

export default PDFChart;
export type { PDFSample };
