import type { GridColDef, GridRowClassNameParams, GridRowIdGetter, GridValidRowModel } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";

type getRowClassNameFn = (r: GridRowClassNameParams<GridValidRowModel>) => string;
type getServerSidePageFn = (pageSize: number, pageIndex: number) => object[];

interface ServerSidePageDataProvider {
  // pageSize is filled out by the pageSize parameter
  getPage: getServerSidePageFn;
};

type RowMaker = readonly object[] | (() => Promise<object[]>) | ServerSidePageDataProvider;
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
  const [isServerSide, setServerSideData] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(
    function () {
      if (typeof rows === "function") {
        (async function () {
          const actualData = await rows();
          setActualRows(actualData);
          setIsLoaded(true);
	  setServerSideData(false);
        })();
      } else if (typeof rows === "object") {
	// NOTE(jerry):
	// lack of strong type checking ability at runtime
	// means I'm practically guessing that it is the right type of object.
	setServerSideData(true);
	setIsLoaded(true);
      } else {
        setActualRows(rows);
        setIsLoaded(true);
	setServerSideData(false);
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
	paginationMode={isServerSide ? "server" : "client"}
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
