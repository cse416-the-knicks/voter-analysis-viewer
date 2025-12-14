import { Paper, Grow } from "@mui/material";

import useMousePosition from "../../hooks/useMousePosition";

interface GenericTooltipProperties {
  children: React.ReactNode; // Assume nothing, it is okay.
  show: boolean;
}

function GenericTooltip({ children, show }: GenericTooltipProperties) {
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
            zIndex: 9999,
          }}
          elevation={3}
        >
          {children}
        </Paper>
      </Grow>
    );
  }
  return <> </>;
}

export default GenericTooltip;
