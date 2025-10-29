import { useState } from "react";

import { Paper, Typography, Grow } from "@mui/material";

import useMousePosition from "../../hooks/useMousePosition";

interface SimpleTooltipProperties {
  children: React.ReactNode; // Assume this is text, otherwise it might not look right.
  show: boolean;
}

/**
    This component is a really simple tooltip that follows the
    mouse automatically.

    This is the tooltip used to highlight the charts when you highlight an
    element.
**/

function SimpleTooltip({ children, show }: SimpleTooltipProperties) {
  const mousePosition = useMousePosition();

  if (show) {
    return (
      <Grow in={show}>
        <Paper
          sx={{
            position: "fixed",
            left: mousePosition.x + "px",
            top: mousePosition.y + 16 + "px",
            background: "rgba(0.8,0.8,0.8,0.7)",
            borderRadius: "8px",
            padding: "6px",
            pointerEvents: "none",
            color: "white",
          }}
          elevation={3}
        >
          <Typography
            sx={{
              fontSize: "0.76em",
              fontWeight: "bolder",
            }}
          >
            {" "}
            {children}{" "}
          </Typography>
        </Paper>
      </Grow>
    );
  }
  return <> </>;
}

export default SimpleTooltip;
