import { gradientMapNearest, type GradientMap } from "../helpers/GradientMap";
import { useTheme } from "@mui/material";

type ValueFunction = (feature: GeoJSON.Feature) => number | null;

function useChoroplethStylingFunction(valueFn: ValueFunction, gradientMap: GradientMap) {
  const theme = useTheme();
  return (feature: GeoJSON.Feature) => {
    const style = {
      color: theme.palette.secondary.main,
      fillColor: theme.palette.secondary.main,
      fillOpacity: 0.5,
      weight: 2.5,
    };

    const densityValue = valueFn(feature);
    if (densityValue != null) {
      style.fillOpacity = 1.0;
      style.fillColor = gradientMapNearest(densityValue, gradientMap);
    } else {
      style.fillOpacity = 0.15;
      style.weight = 1;
    }

    return style;
  }
}

export default useChoroplethStylingFunction;
