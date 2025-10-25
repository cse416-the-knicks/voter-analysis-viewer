import {
  Box,
  Paper,
  AppBar,
  Typography,
  Button,
  Grid,
} from '@mui/material';

import type {
  StyledDataGridProperties,
} from '../StyledDataGrid';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import StyledDataGrid from '../StyledDataGrid';

interface WindowTitledDataGridProperties extends StyledDataGridProperties {
  title: string;
  left?: string;
  top?: string;
  onXout?: () => void;
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
            <Grid size={11}>
              <Typography variant="h5" align="center">{title}</Typography>
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
