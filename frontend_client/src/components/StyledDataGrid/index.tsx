import type {
  MuiEvent,
  GridColDef,
  GridRowClassNameParams,
  GridRowIdGetter,
  GridValidRowModel,
  GridSortModel,
  GridRowParams,
  GridCallbackDetails,
  DataGridProps,
} from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";

type getRowClassNameFn = (r: GridRowClassNameParams<GridValidRowModel>) => string;
type getServerSidePageFn = (pageSize: number, pageIndex: number, sortModel: GridSortModel) => Promise<object[]>;
type getServerSideDataTotalElementsFn = () => Promise<number>;
type onRowDoubleClickFn = (params: GridRowParams, event: MuiEvent, details: GridCallbackDetails) => void;

interface ServerSidePageDataProvider {
  // pageSize is filled out by the pageSize parameter
  getPage: getServerSidePageFn;
  getTotalElements: getServerSideDataTotalElementsFn;
}

type RowMaker = readonly object[] | (() => Promise<object[]>) | ServerSidePageDataProvider;
type StyledDataGridProperties = {
  rows: RowMaker;
  columns: readonly GridColDef[];
  getRowId?: GridRowIdGetter;
  pageSize?: number;
  customGetRowClassName?: getRowClassNameFn;
  width?: number | string;
  height?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  customCssRules?: object;
  onRowDoubleClick?: onRowDoubleClickFn;
} & Omit<DataGridProps, "rows" | "columns">;

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
  customCssRules,
  onRowDoubleClick,
  ...props
}: StyledDataGridProperties) {
  const getRowClassNameFunction: getRowClassNameFn = function (r) {
    const colorAsAlternatingRows: getRowClassNameFn = (r) => (r.indexRelativeToCurrentPage % 2 == 0 ? "oddRowStyle" : "");
    return (customGetRowClassName && customGetRowClassName(r)) + " " + colorAsAlternatingRows(r);
  };

  const [actualRows, setActualRows] = useState<readonly object[]>([]);
  const [isServerSide, setServerSideData] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [paginationState, setPaginationState] = useState({ page: 0, pageSize });
  const [sortModelState, setSortModelState] = useState<GridSortModel>([]);
  const [rowCount, setRowCount] = useState(0);

  useEffect(
    function () {
      if (typeof rows === "function") {
        (async function () {
          const actualData = await rows();
          setActualRows(actualData);
          setRowCount(actualData.length);
          setIsLoaded(true);
          setServerSideData(false);
        })();
      } else if (typeof rows === "object") {
        if ("getPage" in rows && "getTotalElements" in rows) {
          setServerSideData(true);
          setRowCount(0);
          setIsLoaded(false);
        } else {
          setActualRows(rows);
          setRowCount(rows.length);
          setIsLoaded(true);
          setServerSideData(false);
        }
      }
    },
    [rows]
  );

  useEffect(
    function () {
      if (isServerSide) {
        (async function () {
          const dataProvider = rows as ServerSidePageDataProvider;

          setIsLoaded(false);
          // NOTE: this could be memoized, but I don't think there's a need
          // to do so.
          const totalElements = await dataProvider.getTotalElements();
          const currentPageDataSet = await dataProvider.getPage(paginationState.pageSize, paginationState.page, sortModelState);

          setActualRows(currentPageDataSet);
          setRowCount(totalElements);
          setIsLoaded(true);
        })();
      }
    },
    [rows, paginationState, sortModelState, isServerSide]
  );

  if (pageSize) {
    return (
      <Box width={width} height={height} maxWidth={maxWidth} maxHeight={maxHeight}>
        <DataGrid
          loading={!isLoaded}
          rows={actualRows}
          rowCount={rowCount}
          columns={columns}
          getRowId={getRowId}
          getRowClassName={getRowClassNameFunction}
          paginationMode={isServerSide ? "server" : "client"}
          sortingMode={isServerSide ? "server" : "client"} // NOTE(jerry): filtering stuff is a bit more complicated cause it's so general purpose.
          sortModel={sortModelState}
          onSortModelChange={setSortModelState}
          paginationModel={paginationState}
          onPaginationModelChange={setPaginationState}
          pageSizeOptions={[pageSize]}
          onRowDoubleClick={onRowDoubleClick}
          sx={{
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bolder",
            },
            ".oddRowStyle": {
              backgroundColor: "hsl(225, 35%, 93%)",
            },
            ...customCssRules,
          }}
          disableRowSelectionOnClick
          {...props}
        />
      </Box>
    );
  } else {
    return (
      <Box width={width} height={height} maxWidth={maxWidth} maxHeight={maxHeight}>
        <DataGrid
          loading={!isLoaded}
          rows={actualRows}
          rowCount={rowCount}
          columns={columns}
          getRowId={getRowId}
          getRowClassName={getRowClassNameFunction}
          paginationMode={isServerSide ? "server" : "client"}
          sortingMode={isServerSide ? "server" : "client"} // NOTE(jerry): filtering stuff is a bit more complicated cause it's so general purpose.
          sortModel={sortModelState}
          onSortModelChange={setSortModelState}
          paginationModel={paginationState}
          onPaginationModelChange={setPaginationState}
          autoPageSize
          onRowDoubleClick={onRowDoubleClick}
          sx={{
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bolder",
            },
            ".oddRowStyle": {
              backgroundColor: "hsl(225, 35%, 93%)",
            },
            ...customCssRules,
          }}
          disableRowSelectionOnClick
          {...props}
        />
      </Box>
    );
  }
}

export default StyledDataGrid;
export type { RowMaker, StyledDataGridProperties };
