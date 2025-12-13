import type { GridColDef } from "@mui/x-data-grid";
import type { DataFact } from "./dataViewConfigTypes";
import { Box } from "@mui/material";
import { useRef, useEffect } from "react";
import StyledDataGrid from "../StyledDataGrid";

interface StateEAVSDataTableProperties {
  dataRows: DataFact[];
  dataCols: GridColDef[];
  maxWidthForTable: number;
  maxHeightForTable: number;
}

function StateEAVSDataTable({ dataRows, dataCols, maxWidthForTable, maxHeightForTable }: StateEAVSDataTableProperties) {
  const topGridRef = useRef<HTMLDivElement>(null);
  const mainGridRef = useRef<HTMLDivElement>(null);

  /*
      Pinned rows are only available for MUI-X pro, so this
      is a slightly hacky way of emulating that behavior ourselves.
  
      It involves drawing two datagrids on top of each other, with the second
      one containing the target rows, and then hiding all elements except for the row itself
      (and the row has to be hidden in a specific way, as otherwise it causes strange redrawing glitches.)
  
      As the "pinned" datagrid is on top of the "main" one, the scroll events will only be picked up by the
      pinned datagrid, and so we have this side-effect to synchronize the scrolling between both datagrids.

      This generally looks okay.
    */
  useEffect(() => {
    const topGrid = topGridRef.current?.querySelector(".MuiDataGrid-virtualScroller");
    const mainGrid = mainGridRef.current?.querySelector(".MuiDataGrid-virtualScroller");

    if (!topGrid || !mainGrid) return;

    const syncScroll = (source: HTMLDivElement, target: HTMLDivElement) => {
      target.scrollTop = source.scrollTop;
      target.scrollLeft = source.scrollLeft;
    };

    const onTopScroll = () => syncScroll(topGrid, mainGrid);
    topGrid.addEventListener("scroll", onTopScroll);

    return () => {
      topGrid.removeEventListener("scroll", onTopScroll);
    };
  }, []);

  return (
    <>
      <Box ref={mainGridRef}>
        <StyledDataGrid
          rows={dataRows.slice(0, dataRows.length - 1)}
          columns={dataCols}
          width={maxWidthForTable}
          maxWidth={maxWidthForTable}
          height={maxHeightForTable}
          maxHeight={maxHeightForTable}
          getRowHeight={() => 45}
          getRowId={(r) => r.id}
        />
      </Box>
      <Box
        sx={{
          position: "fixed",
          top: maxHeightForTable - 95,
        }}
        ref={topGridRef}
      >
        <StyledDataGrid
          rows={[dataRows[dataRows.length - 1]]}
          columns={dataCols}
          width={maxWidthForTable}
          maxWidth={maxWidthForTable}
          maxHeight={50}
          getRowId={(_) => "whyNoDataGridProMui"}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              opacity: "0",
              pointerEvents: "none",
            },
          }}
          columnHeaderHeight={0}
          hideFooter={true}
        />
      </Box>
    </>
  );
}

export default StateEAVSDataTable;
