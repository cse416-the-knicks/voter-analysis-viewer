import { Typography } from "@mui/material";
import GenericTooltip from "../GenericTooltip";

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
  if (show) {
    return (
      <GenericTooltip show={show}>
        <Typography
          sx={{
            fontSize: "0.76em",
            fontWeight: "bolder",
          }}
        >
          {" "}
          {children}{" "}
        </Typography>
      </GenericTooltip>
    );
  }
  return <> </>;
}

export default SimpleTooltip;
