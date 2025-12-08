import { useState } from "react";
import NotImplementedYet from "../NotImplementedYetDialog";

interface DisplayEIRejectedBallotsProperties {
  dummy?: number;
}

function DisplayEIRejectedBallots({ dummy }: DisplayEIRejectedBallotsProperties) {
  const showPopup = useState(true);

  return (
    <>
      <NotImplementedYet hook={showPopup} />
    </>
  );
}

export default DisplayEIRejectedBallots;
