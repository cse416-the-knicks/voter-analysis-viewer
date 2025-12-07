import { useNavigate } from "react-router";
import useKeyDown from "../../hooks/useKeyDown";
import WindowTitled from "../WindowTitled";
import useMediaQuery from "@mui/material/useMediaQuery";
import VotingMachineSummaryTable from "../VotingEquipmentSummaryTable";

function DisplayVotingMachineSummaryView() {
  const navigate = useNavigate();
  const useLargerMaxWidth = useMediaQuery("(min-width:1600px)");
  const maxWidth = useLargerMaxWidth ? 1400 : 1000; // pixels

  useKeyDown("Escape", () => navigate("/"));

  return (
    <WindowTitled title={"Voting Equipment Table Summary"} top={"0"} left={`calc(50vw - ${maxWidth / 2}px)`} onXout={() => navigate("/")}>
      <VotingMachineSummaryTable width={maxWidth} />
    </WindowTitled>
  );
}

export default DisplayVotingMachineSummaryView;
