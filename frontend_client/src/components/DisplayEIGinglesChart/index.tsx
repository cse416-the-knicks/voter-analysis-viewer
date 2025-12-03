import { useState } from "react";
import NotImplementedYet from "../NotImplementedYetDialog";

interface DisplayEIGinglesChartProperties {
  dummy?: number;
}

function DisplayEIGinglesChart({ dummy }: DisplayEIGinglesChartProperties) {
  const showPopup = useState(true);

  return (
    <>
      <NotImplementedYet hook={showPopup} />
    </>
  );
}

export default DisplayEIGinglesChart;
