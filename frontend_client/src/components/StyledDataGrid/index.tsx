import type { GridColDef, GridRowClassNameParams, GridRowIdGetter, GridValidRowModel } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";

type getRowClassNameFn = (r: GridRowClassNameParams<GridValidRowModel>) => string;
type RowMaker = readonly object[] | (() => Promise<object[]>);
interface StyledDataGridProperties {
  rows: RowMaker;
  columns: readonly GridColDef[];
  getRowId?: GridRowIdGetter;
  pageSize: number;
  customGetRowClassName?: getRowClassNameFn;
  width?: number | string;
  height?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  customCssRules?: object;
}

function StyledDataGrid({
  rows,
  columns,
  getRowId,
  pageSize,
  customGetRowClassName,
  width,
  height,
  maxWidth,
  maxHeight,
  customCssRules
}: StyledDataGridProperties) {
  const getRowClassNameFunction: getRowClassNameFn = function (r) {
    const colorAsAlternatingRows: getRowClassNameFn = (r) => (r.indexRelativeToCurrentPage % 2 == 0 ? "oddRowStyle" : "");
    return (customGetRowClassName && customGetRowClassName(r)) + " " + colorAsAlternatingRows(r);
  };

  // TODO(jerry): handle loading states. I don't care
  // enough about this to do it here though, I think it's fine to
  // pop-in if I'm being honest...
  const [actualRows, setActualRows] = useState<readonly object[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(
    function () {
      if (typeof rows === "function") {
        (async function () {
          const actualData = await rows();
          setActualRows(actualData);
          setIsLoaded(true);
        })();
      } else {
        setActualRows(rows);
        setIsLoaded(true);
      }
    },
    [rows]
  );

  return (
    <Box width={width} height={height} maxWidth={maxWidth} maxHeight={maxHeight}>
      <DataGrid
        rows={actualRows}
        columns={columns}
        getRowId={getRowId}
        getRowClassName={getRowClassNameFunction}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: pageSize,
            },
          },
        }}
        pageSizeOptions={[pageSize]}
        sx={{
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bolder",
          },
          ".oddRowStyle": {
            backgroundColor: "hsl(225, 35%, 93%)",
          },
	  ...customCssRules
        }}
        disableRowSelectionOnClick
      />
    </Box>
  );
}

export default StyledDataGrid;
export type { RowMaker, StyledDataGridProperties };
