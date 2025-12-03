import { Box, Paper, AppBar, Typography, Button, Grid } from "@mui/material";

import HighlightOffIcon from "@mui/icons-material/HighlightOff";

interface WindowTitledProperties {
  title: string;
  left?: string;
  top?: string;
  width?: number | string;
  height?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  onXout?: () => void;
  children?: React.ReactNode;
}

function WindowTitled({ title, left, top, width, height, maxWidth, maxHeight, onXout, children }: WindowTitledProperties) {
  return (
    <Box
      sx={{
        position: "fixed",
        display: "flex",
        left: left,
        top: top,
        zIndex: 1200,
      }}
      width={width}
      height={height}
      maxWidth={maxWidth}
      maxHeight={maxHeight}
    >
      <Paper sx={{ mt: 2 }} elevation={9}>
        <AppBar sx={{ position: "static" }} color="secondary">
          <Grid container justifyContent="space-between">
            <Grid size={11}>
              <Typography variant="h5" align="center">
                {title}
              </Typography>
            </Grid>
            <Grid>
              <Button onClick={onXout} variant="text" sx={{ color: "white" }}>
                <HighlightOffIcon />
              </Button>
            </Grid>
          </Grid>
        </AppBar>
        {children}
      </Paper>
    </Box>
  );
}

export type { WindowTitledProperties };
export default WindowTitled;
