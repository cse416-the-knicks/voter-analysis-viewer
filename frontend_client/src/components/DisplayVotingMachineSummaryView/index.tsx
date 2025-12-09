import { useNavigate } from "react-router";
import useKeyDown from "../../hooks/useKeyDown";
import WindowTitled from "../WindowTitled";
import VotingMachineSummaryTable from "../VotingEquipmentSummaryTable";
import useCssCalc from "../../hooks/useCssCalc";

function DisplayVotingMachineSummaryView() {
  const navigate = useNavigate();
  const maxWidth = useCssCalc("75vw"); // pixels
  const tableHeight = useCssCalc("85vh");

  useKeyDown("Escape", () => navigate("/"));

  return (
    <WindowTitled title={"Voting Equipment Table Summary"} top={"0"} left={`calc(50vw - ${maxWidth / 2}px)`} onXout={() => navigate("/")}>
      <VotingMachineSummaryTable width={maxWidth} height={tableHeight} />
    </WindowTitled>
  );
}

export default DisplayVotingMachineSummaryView;
