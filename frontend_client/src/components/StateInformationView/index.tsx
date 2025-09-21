import { Link, useParams } from 'react-router';
import styles from './StateInformationView.module.css';
import StateMap from '../StateMap';

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
          {fipsCode}
        </h1>
	<StateMap fipsCode={fipsCode}/>
        <p>
	  Place holder layout. Fix me!
        </p>
      </div>
    </div>
  );
}

export default StateInformationView;
