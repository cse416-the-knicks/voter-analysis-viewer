import {
  Box,
  Paper,
  Typography
} from '@mui/material';

import styles from './DisplayVotingMachineSummaryView.module.css';

function DisplayVotingMachineSummaryView() {
  return (
    <Box className={styles.displayInformationPopup}>
      <Paper
	sx={{ mt: 2, ml: 'auto' }}
	elevation={5}>
	  <Typography variant="h3" component="h2">
		Display Voting Machine Summary
	  </Typography>
	  <Typography component="p">
  This is some text, but this should be a table some day!
	  </Typography>
      </Paper>
    </Box>
  );
}

export default DisplayVotingMachineSummaryView;
