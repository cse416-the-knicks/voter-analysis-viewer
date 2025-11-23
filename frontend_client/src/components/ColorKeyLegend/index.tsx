import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { useTheme } from "@mui/material";

interface ColorKeyLegendProperties {
  colors: string[];
  labels: string[];
}

function ColorKeyLegend({ colors, labels }: ColorKeyLegendProperties) {
  const leafletMap = useMap();
  const theme = useTheme();

  useEffect(() => {
    if (!leafletMap) return;

    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      const toggleButton = L.DomUtil.create("button", "toggleHider", div);
      toggleButton.textContent = "collapse legend";
      toggleButton.style.padding = "2px";
      toggleButton.style.margin = "0";
      toggleButton.style.marginBottom = "8px";
      toggleButton.style.background = theme.palette.secondary.main;
      toggleButton.style.color = "white";

      // White background + padding + rounded corners
      div.style.background = "white";
      div.style.padding = "8px";
      div.style.borderRadius = "6px";
      div.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";

      const subDiv = L.DomUtil.create("div", "", div);
      subDiv.style.overflow = "hidden";

      toggleButton.onclick = function () {
        if (subDiv.style.maxHeight !== "0px") {
          subDiv.style.maxHeight = "0px";
          toggleButton.style.marginBottom = "0";
          toggleButton.textContent = "show legend";
        } else {
          subDiv.style.maxHeight = "unset";
          toggleButton.style.marginBottom = "8px";
          toggleButton.textContent = "collapse legend";
        }
      };

      for (let i = 0; i < colors.length; i++) {
        subDiv.innerHTML += `
                    <span style="margin: auto; height: 5px; display:flex;">
                    <i style="
                        background:${colors[i]};
                        width:18px;
                        height:18px;
                        display:inline-block;
                        margin-right:8px;
                        opacity:0.9;
                        border: 1.5px solid black;
                    "></i>
                        <b>${labels[i]}</b>
                    </span><br/>`;
      }

      return div;
    };

    legend.addTo(leafletMap);

    // Cleanup on unmount
    return () => legend.remove();
  }, [leafletMap, theme.palette.secondary.main]);

  return null;
}

export default ColorKeyLegend;
