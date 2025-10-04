import type { GridColDef, GridRowClassNameParams, GridRowIdGetter, GridValidRowModel } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

type getRowClassNameFn = (r: GridRowClassNameParams<GridValidRowModel>) => string;
interface StyledDataGridProperties {
  rows: readonly any[];
  columns: readonly GridColDef[];
  getRowId: GridRowIdGetter;
  pageSize: number;
  customGetRowClassName?: getRowClassNameFn;
  width?: number;
  height?: number;
  maxWidth?: number;
  maxHeight?: number;
};

function StyledDataGrid(
  {
    rows,
    columns,
    getRowId,
    pageSize,
    customGetRowClassName,
    width,
    height,
    maxWidth,
    maxHeight,
  }: StyledDataGridProperties
) {
  const getRowClassNameFunction: getRowClassNameFn = function (r) {
    const colorAsAlternatingRows: getRowClassNameFn =
      (r) => (r.indexRelativeToCurrentPage % 2) == 0 ? "oddRowStyle" : "";
    return (customGetRowClassName && customGetRowClassName(r)) + " " + colorAsAlternatingRows(r);
  }
  return (
    <Box
      width={width}
      height={height}
      maxWidth={maxWidth}
      maxHeight={maxHeight}>
      <DataGrid
        rows={rows}
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
            fontWeight: "bolder"
          },
          ".oddRowStyle": {
            backgroundColor: "hsl(225, 35%, 93%)",
          }
        }}
        disableRowSelectionOnClick
      />
    </Box>
  );
}

export default StyledDataGrid;
