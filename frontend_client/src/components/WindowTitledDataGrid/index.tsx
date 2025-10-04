import {
  Box,
  Paper,
  AppBar,
  Typography,
  Button,
  Grid,
} from '@mui/material';

import type {
  GridRowClassNameParams, 
  GridRowIdGetter, 
  GridValidRowModel,
  GridColDef,
} from '@mui/x-data-grid';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import StyledDataGrid from '../StyledDataGrid';

type getRowClassNameFn = (r: GridRowClassNameParams<GridValidRowModel>) => string;
interface WindowTitledDataGridProperties {
  title: string;
  rows: readonly any[];
  columns: readonly GridColDef[];
  getRowId: GridRowIdGetter;
  pageSize: number;
  left?: string;
  top?: string;
  customGetRowClassName?: getRowClassNameFn;
  onXout?: () => void;
  width?: number;
  height?: number;
  maxWidth?: number;
  maxHeight?: number;
};

function WindowTitledDataGrid(
  {
    title,
    rows,
    columns,
    getRowId,
    pageSize,
    left,
    top,
    customGetRowClassName,
    width,
    height,
    maxWidth,
    maxHeight,
    onXout
  }: WindowTitledDataGridProperties) {
  return (
    <Box
      sx={{
        position: "fixed",
        display: "flex",
        left: left,
        top: top,
        zIndex: 1200
      }}
      width={width}
      height={height}
      maxWidth={maxWidth}
      maxHeight={maxHeight}>
      <Paper
        sx={{ mt: 2, ml: 'auto' }}
        elevation={9}>
        <AppBar sx={{ position: "static" }} color="secondary">
          <Grid container justifyContent="space-between">
            <Grid size={3.25}>
              <Typography variant="h6">{title}</Typography>
            </Grid>
            <Grid>
              <Button onClick={onXout} variant='text' sx={{ color: "white" }}>
                <HighlightOffIcon />
              </Button>
            </Grid>
          </Grid>
        </AppBar>
        <StyledDataGrid
          width={maxWidth}
          maxWidth={maxWidth}
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          pageSize={pageSize}
          customGetRowClassName={customGetRowClassName}
        />
      </Paper>
    </Box>
  );
}

export type {
  WindowTitledDataGridProperties
};
export default WindowTitledDataGrid;