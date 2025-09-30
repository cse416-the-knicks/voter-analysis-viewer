import type { GridColDef } from '@mui/x-data-grid';
import type { VotingEquipmentModel } from '../../api/client';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useNavigate } from 'react-router';

import {
  Box,
  Paper,
  AppBar,
  Typography,
  Button,
  Grid
} from '@mui/material';

import styles from './DisplayVotingMachineSummaryView.module.css';
import { getAllVotingEquipment } from '../../api/client';

const columns: GridColDef<(VotingEquipmentModel)[number]>[] = [
  { field: 'manufacturer', headerName: 'Manufacturer', width: 190 },
  {
    field: 'equipmentType',
    headerName: 'Type',
    width: 250,
  },
  {
    field: 'modelName',
    headerName: 'Name',
    width: 150,
  },
  {
    field: 'firstManufactured',
    headerName: 'First Manufactured',
    width: 110,
  },
  {
    field: 'lastManufactured',
    headerName: 'Last Manufactured',
    width: 110,
  },
  {
    field: 'discontinued',
    headerName: 'Discontinued',
    type: 'boolean',
    width: 160,
  },
  {
    field: 'operatingSystem',
    headerName: 'Operating System',
    width: 160,
  },
  {
    field: 'vvpat',
    headerName: 'VVPAT?',
    type: 'boolean',
    width: 100,
  },
];


// 	  <Typography variant="h3" component="h2">
// 		Display Voting Machine Summary
// 	  </Typography>
// 	  <Typography component="p">
// This is some text, but this should be a table some day!
// 	  </Typography>

function DisplayVotingMachineSummaryView() {
  const navigate = useNavigate();
  const [rows, setDataRows] = useState<VotingEquipmentModel[]>([]);

  useEffect(
    function () {
      (async function () {
	const equipmentList = await getAllVotingEquipment();
	setDataRows(equipmentList);
      })();
    },
    []);

  return (
    <Box className={styles.displayInformationPopup}>
      <Paper
	sx={{ mt: 2, ml: 'auto' }}
	elevation={9}>
	<AppBar sx={{position: "static"}} color="secondary">
	    <Grid container justifyContent="space-between">
		<Grid size={3.25}>
		    <Typography variant="h6">Voting Equipment Table Summary</Typography>
		</Grid>
		<Grid>
		    <Button onClick={() => navigate("/")} variant='text' sx={{color: "white"}}>
			<HighlightOffIcon/>
		    </Button>
		</Grid>
	    </Grid>
	</AppBar>
	<DataGrid
	    rows={rows}
	    columns={columns}
	    getRowId={(x) => x.modelName}
	    initialState={{
	    pagination: {
		paginationModel: {
		pageSize: 15,
		},
	    },
	    }}
	    pageSizeOptions={[10]}
	    checkboxSelection
	    disableRowSelectionOnClick
	/>
      </Paper>
    </Box>
  );
}

export default DisplayVotingMachineSummaryView;
