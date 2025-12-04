import { useState } from "react";
import NotImplementedYet from "../NotImplementedYetDialog";

interface DisplayEIVotingEquipmentProperties {
  dummy?: number;
}

function DisplayEIVotingEquipment({ dummy }: DisplayEIVotingEquipmentProperties) {
  const showPopup = useState(true);

  return (
    <>
      <NotImplementedYet hook={showPopup} />
    </>
  );
}

export default DisplayEIVotingEquipment;
