import { Link, useParams } from 'react-router';
import styles from './StateInformationView.module.css';
import StateMap from '../StateMap';
import { FIPS_TO_STATES_MAP } from '../FullBoundedUSMap/boundaryData';
import { mockData } from '../DataDisplays/DisplayData';
import DataTable from '../DataDisplays/DataTable';
import BubbleChart from '../DataDisplays/BubbleChart';

function StateInformationView() {
  const { fipsCode } = useParams();
  console.log(fipsCode);
  return (
    <div className={styles.stateInformationPopup}>
      {/* These are the contents of the drop-down. */}
      <div className={styles.stateInformationSideModal}>
        <ul className={styles.stateInformationSideModalOptions}>
          <li>Provisional Ballots</li>
          <li>Mail-in Ballots</li>
          <li>Absentee Ballots</li>
          <li>Voter Machine Information</li>
          <li><button><Link to={"/"}>Back</Link></button></li>
        </ul>
      </div>
      <div className={styles.stateInformationMainModal}>
        <h1>
          {FIPS_TO_STATES_MAP[fipsCode!]}
        </h1>
	<StateMap fipsCode={fipsCode}/>
        <div>
          {/* Testing displays of data charts/tables */}
          <h4>Data Dashboard</h4>
            <BubbleChart data={mockData} width={800} height={350}/>
            <DataTable data={mockData}/>
        </div>
      </div>
    </div>
  );
}

export default StateInformationView;
